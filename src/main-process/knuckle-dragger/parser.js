const globalConfig = require('./global-config');
const menuConstants = require('./menuConstants');
const MENU_ITEMS = menuConstants.menuItems;
const DOCKET_COURSE_FIELDS = menuConstants.courseFields;
const DOCKET_START_FIELDS = menuConstants.docketStartFields;
let DOCKET_TEMPLATE = menuConstants.docketTemplate;
const VARIABLE_CONTENT_KEYS = menuConstants.variableContentKeys;
const fs = require('fs');
const _ = require('lodash');
const npos = require('npos');
const nposParser = npos.parser();
const colors = require('colors');
const dbHandler = require('./dbHandler');

// ------------------------------------------------------------
exports.parseSingleOrderOfBytes = parseSingleOrderOfBytes;
// ------------------------------------------------------------

function parseSingleOrderOfBytes (buffer) {
  nposParser.parse(buffer).then(function(ast) {
    npos.textualize(ast).then(function (results) {
      const data = sanitize(results);
      // data is an array of strings
      orderToObjectLiteral(data);
    }).catch(err => {
      console.log('ERROR PARSER (textualize): '.red, err.message);
    });
  }).catch(err => {
    console.log('ERROR PARSER (parser): '.red, err.message);
  });
}

function sanitize(results) {
  let data = _.slice(results);
  data = _.map(data, line => {
    return line.split('\n');
  });
  data = _.flattenDeep(data);
  data = _.reject(data, val => {
    return val === '';
  });
  data = _.map(data, line => {
    return line.trim();
  });

  // the hotel docket template always contains a line of '-----------------' at the end
  // => it will be prudent of us to remove it now, as later on when it comes to finding
  // a menu item's special instructions aka 'info'we will rely on '-----------' to 
  //
  // delineate separation of multiply present infos and we don't want the last '-----'
  // complicating things.
  // viz: 
  //     4     GARLIC BREAD
  //     1  ex butter
  //     1  ex cheese
  //     --------------
  //     1  no garlic
  //     1  add tomato relish
  //     1  no bread
  //     -------------
  //     1  no air in bread
  //     1  add chilli
  //     1  smile
  //     3    OYSTERS NAT 1
  //     ....
  const lastLineChars = _.uniq(_.last(data));
  // we want lastLineChars to be ['-']
  if ( lastLineChars.length === 1 && lastLineChars[0] === '-' ) {
    // we can be sure that we have a line of '------------' (after any spaces are removed)
    console.log('REMOVING last line of --------');
    return _.initial(data);
  } else {
    return data;
  }
}

function orderToObjectLiteral (order) {
  // order will be an array of strings. but before going further check that the array
  // has minimal expected content. namely: area, orderTakenUsing, clerk, orderSentAt.
  // otherwise throw error, for now.
  if (order.length < 4) {
    throw Error('ERROR: order array is below minimal expected length. parse error...');
  }

  // ****************************************
  // IMPORTANT: DOCKET SPECIFICATIONS
  // ****************************************
  // the following is the result of looking at many physical dockets and inferring the
  // structure. for various edge cases the structure changes slightly, and this 
  // affects how we should handle parsing the lines into relevant fields required
  // by db schema expectations.
  //
  // below, the lines refer to lines where text IS (we neglect the presence of empty
  // lines in the commentary)
  //
  // A) ALWAYS have
  // LINE 1: location e.g. "SPORTS BAR"
  // LINE 2: what device took the order e.g. "Table 4"
  // LINE 3: person who took the order e.g. "Clerk: Marlene"
  // LINE 4: when then order was taken e.g. "17/08/2018 17:24:04"

  // B) VARIABLE content
  // LINE 4: most times has table num/order number. MAY NOT BE PRESENT!(i.e. a staff meal)
  // LINE 5: booking name/walk-in: MAY NOT BE PRESENT
  // LINE 6: Covers number: MAY NOT BE PRESENT
  // LINE 7: extra weird info: "PRINT A/C - SARAH @ 19:11"

  // TODO: sometimes a docket DOESNT have this even (!!)
  //       => need to rethink the whole process, maybe.
  // C) ALWAYS have AT LEAST ONE docket course field.
  // LINE 8: docket course field (underlined field on phys docket) e.g. ENTREES DINNER
  // LINE 9+: meal item(s)

  // TODO: error handling of string/regex extraction methods,

  // START
  // IMPLEMENTATION TACTIC:
  // assume that A) above always exists, so it's valid to extract the first 4 lines:
  // LINE 1
  const location = order[0];
  // LINE 2
  const orderTakenUsing = order[1];
  // LINE 3
  // assume always of form "Clerk: Harry"
  const clerk = (order[2]).slice(order[2].indexOf(':')+2); 
  // LINE 4
  const orderSentAt = order[3];
  
  // NEXT UP
  // due to B) variances we need to scan forward to our dependable docket course field.
  // once we find that, we can safely look at lines:
  //     LINE 4 < *lines* < LINE course field index
  // then the *lines* will contain our variable content which needs to be stepped though
  // carefully during our parsing.

  // be verbose:
  const variableContentStart = 4;

  // trimmedLocations is like [ val, val, ..., val]
  // where val is like ['MAINS DINNER', [12] ]
  // ==> 12 is the index of MAINS DINNER in 'order' variable.
  const trimmedLocations = getAllCourseFieldsLocations(order);

  // we use the firstCourseField as a way to identify any variable content on the
  // docket. see below for details
  var firstCourseField;
  if (trimmedLocations.length > 0) {
    firstCourseField = trimmedLocations[0][1][0];
    fillOutVariableContent(order, variableContentStart, trimmedLocations);
  } else {
    console.log("ALERT: no firstCourseField was found. We have an empty docket!");
    //fill out the mandatory content in the template, insert into db, then return.
    DOCKET_TEMPLATE.area = location;
    DOCKET_TEMPLATE.metaData.orderTakenUsing = orderTakenUsing;
    DOCKET_TEMPLATE.metaData.clerk = clerk;
    DOCKET_TEMPLATE.metaData.orderSentAt = orderSentAt;
    DOCKET_TEMPLATE.metaData.extraContent = "EMPTY ORDER: no first course field present";
    dbHandler.insertSingleOrder(DOCKET_TEMPLATE);
    return;
  }
}

function fillOutVariableContent(order, variableContentStart, trimmedLocations) {
  const variableContent = order.slice(variableContentStart, firstCourseField);
  console.log('variableContent: '.red, variableContent);
   
  // now look at each element of variableContent, searching for existence of substrings
  // 1. "TABLE No *15/0*
  // 2. "ORDER NUMBER 1"
  // 3. "Name: Walk-in"
  // 4. "Covers: 10"
  // 5. other extra weird info: "PRINT A/C - SARAH @ 19:11"

  var extraContent = handleExtraVariableContent(variableContent);

  var tableNumber = "";
  const vTableNumber = _.find(variableContent, line => {
    const lineUpper = line.toUpperCase();
    return (lineUpper.includes("TABLE NO") || lineUpper.includes("ORDER NUMBER"));
  });
  if (vTableNumber) {
    // handle the two different cases similarly.
    // "TABLE No *20/0*" ==> "*20/0*"
    // "ORDER NUMBER 1" ==> "1"
    tableNumber = vTableNumber.split(/\s+/).slice(-1)[0];
  }

  var customerName = "";
  const vCustomerName = _.find(variableContent, line => {
    const nameUpper = line.toUpperCase();
    return nameUpper.includes("NAME:");
  });
  if (vCustomerName) {
    // "Name: Hillary"
    customerName = vCustomerName.slice(vCustomerName.indexOf(':') + 2);
  }

  var covers = "";
  const vCovers = _.find(variableContent, line => {
    const coversUpper = line.toUpperCase();
    return coversUpper.includes("COVERS:");
  });
  if (vCovers) {
    // "Covers: 10"
    covers = vCovers.slice(vCovers.indexOf(':') + 2);
  }

  DOCKET_TEMPLATE.area = location;
  DOCKET_TEMPLATE.metaData.orderTakenUsing = orderTakenUsing;
  DOCKET_TEMPLATE.metaData.clerk = clerk;
  DOCKET_TEMPLATE.metaData.orderSentAt = orderSentAt;
  DOCKET_TEMPLATE.metaData.extraContent = extraContent;
  DOCKET_TEMPLATE.tableNumber = tableNumber;
  DOCKET_TEMPLATE.customerName = customerName;
  DOCKET_TEMPLATE.covers = covers;

  const _menuItemIdxs = menuItemIdxs(order, trimmedLocations);

  // start building out the actual meal contents.
  // go thru trimmedLocations and take slices from 'order' variable, for
  // a given course field
  const meals = buildOutMeals(order, trimmedLocations, _menuItemIdxs);
  DOCKET_TEMPLATE.meals = meals;
  dbHandler.insertSingleOrder(DOCKET_TEMPLATE);
}

function handleExtraVariableContent(variableContent) {
  //----------------------------------------
  // REALLY CRAPPY CODE => it's working, but need to refactor it. later
  //----------------------------------------
  // this is used to check for super weird extra variable content 
  // like (copied from above):
  // 5. other extra weird info: "PRINT A/C - SARAH @ 19:11"

  var standardContentIndices = _.map(VARIABLE_CONTENT_KEYS, (key) => {
    var _index;
    const res = _.find(variableContent, (val, index) => {
      _index = index;
      return val.toUpperCase().includes(key);
    });
    if (res) {
      return _index;
    }
  });

  console.log('standardContentIndices: ', standardContentIndices);
  //remove any undefined elements
  standardContentIndices = _.reject(standardContentIndices, val => {
    return val === undefined;
  });
  console.log('standardContentIndices: ', standardContentIndices);

  var variableContentCopy = variableContent.slice();

  _.forEach(standardContentIndices, val => {
    delete variableContentCopy[val];
  });
  var extraContent = _.reject(variableContentCopy, val => {
    return val === undefined;
  });

  if (_.isEmpty(extraContent)) {
    extraContent = "";
    console.log('no extraContent');
  } else {
    extraContent = extraContent.join(' ');
    console.log('we have extra content: ', extraContent);
  }
  return extraContent;
}

function menuItemIdxs(order, trimmedLocations) {
  const firstCourseIdx = trimmedLocations[0][1][0];

  // copy and use only the part of the order we're interested in here.
  // that's from first course name to end of order.
  let orderCopy = order.slice(firstCourseIdx, order.length);

  orderCopy = _.map(orderCopy, line => {
      const splitItem = line.split(/\s+/);
      if (isNaN(parseInt(splitItem[0]))) {
        // item is like "add gravy" or "--------------"
        // sometimes you dont get a number at start of string
        // this affects how we also extract itemName
        //console.log(colors.red(item));
        //itemName = splitItem.slice(0,splitItem.length).join(' ');
        return splitItem.join(' ');
      } else {
        // item is like "3 porterhouse 200"
        // quantity number is first item
        // quantity name is from element 1 till end
        return splitItem.slice(1,splitItem.length).join(' ');
      }
  });

  // TODO: WARNING: IF A MENU ITEM IS PRINTED ON A DOCKET THAT IS *NOT* IN
  //       THE MENU_ITEMS *SET* THEN IT GETS COMPLETELY DROPPED OFF THE DIGITAL 'DOCKET'
  //       e.g. docket printed GNOCCHI but it didnt show up in db because it GNOCCHI
  //       wasn't in the menuConstants.js file
  //       !!! FIX !!!
  // use MENU_ITEMS in the form a set (fast extistence operator) to find where menu items
  // are located.
  const menuItemsSet = new Set(MENU_ITEMS);
  const menuItemIdxs = _.reduce(orderCopy, (acc, line, index, coll) => {
    // see if line is a menu item by checking if it's in MENU_ITEMS 
    // if it is, then put (index + firstCourseIndex) into acc
    // else, just return acc
    if (menuItemsSet.has(line)) {
      return _.concat(acc, [index + firstCourseIdx]);
    } else {
      return acc;
    }
  }, []);
  return menuItemIdxs;
}

function buildOutMeals (order, courseLocations, menuItemIdxs) {
  console.log(colors.blue(courseLocations));
  console.log(colors.blue(menuItemIdxs));
  console.log(colors.yellow(order));

  // TODO: implement the extraction of menu item info
  // - use menuItemIdxs for slice info-array
  // - then, within each info-array make sure to check for multiple 'infos' 
  //   delineated with a line of dashes '---------'.
  //   viz:
  //      3 CHILDS RICE
  //      1 ex chilli   | an 'info'
  //      1 ex chicken  |
  //      -----------
  //      1 no egg      | another 'info'
  //      1 add soy     |
  //      -----------
  //      5 NASI
  //      ....
  
  let infoSlices = _.reduce(menuItemIdxs, (acc, val, idx, coll) => {
    // val is the index of a menu item in orders array
    
    if (idx === coll.length - 1) {
      // at end of menuItemIdxs
      const start = val+1;
      const end = order.length;
      const info = order.slice(start, end);
      return _.concat(acc, [info]);
    } else {
      // not at last element of menuItemIdxs
      const start = val+1;
      const end = menuItemIdxs[idx + 1];
      const info = order.slice(start, end); 
      return _.concat(acc, [info]);
    }
  }, []);
  // console.log(colors.red(infoSlices));

  // sometimes the course name gets swepped up in a menu's info item.
  // e.g. infoSlices is like:
  // [ ['1   MED RARE',
  //    '1   MUSH'],
  //   ['1   MED RARE',
  //    '1   MUSH',
  //     'MAINS DINNER'], <= see this. it shouldnt be in the array. delete element. 
  //   ...
  //   ['DESSRT'], <= see this. it shouldn't be in the array. delete element => []
  //   ['1   EXTRA ICE CREAM',
  //    '1   EXTRA COLD'],
  //   ...
  // ]
  // we could carefully step thru menuItemIdxs whilst looking to see if we cross into
  // a new course,
  // OR
  // we can simply just accept that this happens and delete any course names from any 
  // of the menu info array.
  // let's adopt the latter...

  infoSlices = _.map(infoSlices, anInfoArray => {
    if (_.isEmpty(_.intersection(anInfoArray, DOCKET_COURSE_FIELDS))) {
      // anInfoArray doesn't contain any course names. dont need to remove anything.
      return anInfoArray;
    } else {
      // there is a course name in our anInfoArray. remove it.
      const coursesSet = new Set(DOCKET_COURSE_FIELDS);

      // first find all locations of course names.
      // DONT ASSUME THAT THERE'S ONLY ONE COURSE NAME PRESENT. THERE COULD BE >1.
      return _.reduce(anInfoArray, (acc, val, idx, coll) => {
        if (coursesSet.has(val)) {
          // val is a course name...
          // need to drop this from anInfoArray.
          // this amounts to just returning acc 
          return acc;
        } else {
          // val is needed to be kept. it is not a course name
          // add it to acc
          return _.concat(acc,[val]);
        }
      }, []);
    }
  }); 
  // console.log(colors.green(infoSlices));

  const fixedSlices = _.map(infoSlices, aSlice => {
    if (_.isEmpty(aSlice)) {
      return aSlice;
    } else {
      let infos = [];
      let singleInfo = [];
      for (let i of aSlice) {
        const lineChars = _.uniq(i);
        if (lineChars.length ===1 && lineChars[0] === '-') {
          infos.push(singleInfo);
          singleInfo = [];
        } else {
          singleInfo.push(i);
        }
      }
      return infos;
    }
  });
  // console.log(colors.green(fixedSlices));

  // fixedSlices and menuItemIdxs should be the same length and correspond 1-for-1,
  // in order to meals in order
  let meals = _.map(menuItemIdxs, (itemIdx, idx) => {
    let meal = {};
    let mealLine = order[itemIdx];
    let itemQuantity;
    let itemName;

    var splitItem = mealLine.split(/\s+/);
    if (isNaN(parseInt(splitItem[0]))) {
      // item is like "add gravy"
      // sometimes you dont get a number at start of string
      // this affects how we also extract itemName
      console.log('WARNING: we have an item with no quantity number at start:'.red);
      console.log(colors.red(mealLine));
      itemQuantity = "";
      itemName = splitItem.join(' ');
    } else {
      // item is like "3 porterhouse 200"
      // quantity number is first item
      // quantity name is from element 1 till end
      itemQuantity = splitItem[0];
      itemName = splitItem.slice(1,splitItem.length).join(' ');
    }

    meal.itemName = itemName;
    meal.itemQuantity = itemQuantity;
    meal.infos = fixedSlices[idx];
    meal.idx = itemIdx;

    return meal;
  });
  console.log(JSON.stringify(meals,null,2));

  // now assign meals to courses using course indices and meals indices

  //function buildOutMeals (order, courseLocations, menuItemIdxs) {
  // where courseLocations is like:
  // [ ['ENTREES DINNER', [9] ],
  //   ['MAINS DINNER', [12] ],
  //   ['DESSERTS', [15] ],
  // ]
  const ourOrder = _.map(courseLocations, (val, idx) => {
    const courseName = val[0];
    const courseIdx = val[1][0];

    if (idx === courseLocations.length - 1) {
      // last course
      const coursePartition =  _.partition(meals, meal => {
        return meal.idx > courseIdx;
      });
      // first value is the array of meals for which the predicate is true
      return {items: coursePartition[0], course: courseName};
    } else {
      // start or middle course
      const coursePartition = _.partition(meals, meal => {
        const end = courseLocations[idx + 1][1][0];
        // console.log(courseIdx);
        // console.log(end);
        return (courseIdx < meal.idx && meal.idx < end);
      });
      // console.log(colors.red(coursePartition));
      return {items: coursePartition[0], course: courseName};
    }
  });
  console.log(JSON.stringify(ourOrder, null, 2));
  return ourOrder;
}

function getAllCourseFieldsLocations (order) {
  const courseFieldsLocations = [];
  _.forEach(DOCKET_COURSE_FIELDS, course => {
    const locations = _.reduce(order, (acc, val, index, coll) => {
      if (course === val) {
        return _.concat(acc, [index]);
      } else {
        return acc;
      }
    }, []);

    //TODO:
    // ASSUMPTION: each course appears only once on the docket.
    // => need to look at many printed dockets to see whether assumption is valid.
    // *** MAYBE EACH COURSE APPEARS MORE THAN ONCE ON THE DOCKET
    // => locations = [12,56]; (say)
    courseFieldsLocations.push([course, locations]);
  });

  // only works is each course only appears ONCE on the docket
  // val is like ['MAINS DINNER', [12] ]
  const trimmedLocations = _.reject(
    _.sortBy(courseFieldsLocations, val => {return val[1][0]})
    , val => {return _.isEmpty(val[1])}
  );

  // console.log(order);
  // console.log('courseFieldsLocations: ', courseFieldsLocations );
  // console.log('trimmedLocations: ', trimmedLocations);

  return trimmedLocations;
}
