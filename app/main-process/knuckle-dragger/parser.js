import colors from 'colors'
import stringify from 'json-stringify-pretty-compact'
import _ from 'lodash'
import npos from 'npos'
import log from 'electron-log'
import {
  docketTemplate,
  metaContentKeys,
  menuItems,
  courseFields,
  docketStartFields,
  variableContentKeys
} from './menu-constants'
import { insertSingleOrder } from './db-handler'

const nposParser = npos.parser()
const docketTokens = ['VL', 'MD', 'CN', 'MI', 'II', 'IIS', 'RC']

// ------------------------------------------------------------------------- //
//     TOKENS DEFINITION                                                     //
//     VL = Venue Location                                                   //
//     MD = Meta Data  e.g. table num, booking name, covers, "PRINT A/C..."  //
//     CN = Course Name                                                      //
//     MI = Menu Item                                                        //
//     II = Item Info                                                        //
//     IIS = Item Info Separator  => which is '  -------------'              //
//     RC = Random Content                                                   //
// ------------------------------------------------------------------------- //

const dottedLineEntreeItems = [
  "CHILDS BOLOG",
  "CHILDS BURGER",
  "CHILDS FISH",
  "CHILDS HAMBURGER",
  "CHILDS PARMI",
  "CHILDS RICE",
  "CHILDS ROAST",
  "CHILDS SNIT",
  "CHILDS STEAK",
  "GARLIC BREAD",
]

log.transports.file.level = 'info'

export default (db, buffer) => {
  nposParser.parse(buffer)
    .then(ast => {
      return npos.textualize(ast)
    })
    .then(results => {
      //do somethine with the array of strings
      let data = sanitize(results)
      // console.log('pareser.js default func')
      // console.log(colors.blue(stringify(data)))
      const zippedData = tokenizeData(data)
      // log.info(zippedData)
      const order = buildOrder(zippedData)
      // console.log('pareser.js default func')
      // console.log(colors.blue(stringify(order)))
      insertSingleOrder(db, order)
    })
    .catch(err => {
      log.info('ERROR PARSER (textualize / parser ): '.red, err.message)
    })
}

const sanitize = (results) => {
  let data = _.slice(results)
  data = _.map(data, line => {
    return line.split('\n')
  })
  data = _.flattenDeep(data)
  data = _.reject(data, line => {
    return line === ''
  })
  data = _.map(data, line => {
    return line.trim().toUpperCase()
  })
  // remove last line of dashes if it's present
  data = isLineAllDashes(_.last(data)) ? _.initial(data) : data
  return data
}


// -------------- TOKENIZATION OF ORDER ------------- //

const tokenizeData = (data) => {
  // go thru each line and check through tokens
  const tokenizedData = _.reduce(data, (acc, line, idx) => {
    // console.log(colors.blue(line))

    if (idx == 0 && tokenVL(line)) {
      // at start of docket
      return _.concat(acc, ["VL"])
    } else if (idx > 0 && idx < 4) {
      // every docket is guarenteed to have at least 3 lines of meta data
      // 1. device used to take order
      // 2. staff member who took order
      // 3. time order was taken
      return _.concat(acc, ["MD"])
    } else {
      // everything else is assumed to be variable.
      // that is it may or may not be present on docket
      // (yes, even table number is not present sometimes)

      const tokenFuncs = [
        { f: tokenMD, token: "MD", outcome: false },
        { f: tokenCN, token: "CN", outcome: false },
        { f: tokenMI, token: "MI", outcome: false },
        { f: tokenII, token: "II", outcome: false },
        { f: tokenIIS, token: "IIS", outcome: false }
      ]

      const tokenSearch = _.map(tokenFuncs, val => {
        val.outcome = val.f(line)
        return val
      })

      const truthToken = _.filter(tokenFuncs, val => {
        return val.outcome
      })
      // console.log('tokenSearch: ', tokenSearch)
      // console.log('truthToken: ',truthToken)

      // IMPORTANT: HOW RANDOM CONTENT IS HANDLED 
      //
      // if NO tokens were found for the current line then truthToken will be an empty
      // array. we need to check for this, and if it's empty we arbitrarily assign that
      // line with a Random Content token, "RC".
      // otherwise, the token we want will be the first (& only) element in truthToken
      if (_.isEmpty(truthToken)) {
        return _.concat(acc, ["RC"])
      } else {
        return _.concat(acc, [truthToken[0].token])
      }
    }
  }, [])

  const idxs = _.map(Array(data.length), (val, idx) => { return idx })
  return _.zipWith(data, tokenizedData, idxs, (l, t, i) => {
    return { line: l, token: t, index: i }
  })
}

const tokenVL = (line) => {
  // VL:  "Venue Location",
  return _.includes(docketStartFields, line)
}

const tokenMD = (line) => {
  // MD:  "Meta Data",
  return _.some(metaContentKeys, val => {
    return line.includes(val)
  })
}

const tokenCN = (line) => {
  // CN:  "Course Name",
  return _.some(courseFields, val => {
    return val === line
  })
}

const tokenMI = (line) => {
  // MI:  "Menu Item",
  //
  // a standard menu item is like:
  //     "1 NASI"
  // gotta handle the presence of numbers in the line...we're only after the 
  // menu item name, not quantity.
  const splitLine = line.split(/\s+/)
  if (splitLine.length > 0 && isNaN(parseInt(splitLine[0]))) {
    // => first element of splitLine is not able to be parsed to an integer.
    // => that means it's NOT a number.
    // the line could be like "SPECIAL INSTRUCTIONS" (which is a course field)
    // => we should then return false 
    return false
  } else {
    // we have a candidate for a menu item.
    // we need to be careful because item info lines
    // will also have a number as their first element in splitLine.
    // e.g. menu item will look like splitLine = ["2", "SALMON"]
    //      a menu item's info will be like splitLine = ["1", "cooked well done"]
    // now join the item back, disregarding the first element (which is a quantity)
    const rejoinedItem = splitLine.slice(1, splitLine.length).join(' ')

    // now look to see if it's in the menu items.
    // if so, then it's a menu item, token === MI
    // otherwise, it's an item info line, token === II, BUT FOR NOW WE ONLY RETURN
    // true or false in regards to the presence of a menu item.
    // => dont handle both MI and II in this function.
    return _.includes(menuItems, rejoinedItem)
  }
}

const tokenII = (line) => {
  // IMPORTANT
  // if item info line so happens to be equal to an item on the menu
  // then it will be picked up as a menu item!
  // => assume that this is a rare event, and if it does happen then it will just
  // show up as a menu item and can (may) be easilt fixed with human intervention
  //
  // II:  "Item Info",
  // this function is very similar to tokenMI.
  const splitLine = line.split(/\s+/)
  if (splitLine.length > 0 && isNaN(parseInt(splitLine[0]))) {
    return false
  } else {
    const rejoinedItem = splitLine.slice(1, splitLine.length).join(' ')

    // NOTICE THE ! in front of _.includes(...) 
    // => if line starts with a number but is not found in menuItems then assume that
    //    means it's an item info line.
    //    item info lines (from inspection of physical dockets) start with a number '1'
    return !_.includes(menuItems, rejoinedItem)
  }
}

const tokenIIS = (line) => {
  // IIS: "Item Info Separator",
  // a line that looks like "  --------------",
  // which after data is looks like '-------------'
  return isLineAllDashes(line)
}

const isLineAllDashes = (line) => {
  const lineChars = _.uniq(line)
  if (lineChars.length === 1 && lineChars[0] === '-') {
    return true
  } else {
    return false
  }
}


// -------------- BUILDIN OF ORDER ------------- //

const buildOrder = (data) => {
  // make an object with tokens as keys and locations of said token as values
  const idxs = _.reduce(data, (acc, val) => {
    if (acc.hasOwnProperty(val.token)) {
      acc[val.token].push(val.index)
    } else {
      acc[val.token] = [val.index]
    }
    return acc
  }, {})

  // get location, there should be only 1 element in VL array
  const location = _.isEmpty(idxs['VL']) ? "NO LOCATION" : data[idxs['VL'][0]].line
  const metaData = handleMetaData(data, idxs)
  let meals = handleMenuItemsAndItemInfo(data, idxs)
  let order = {}
  order.metaData = metaData
  order.metaData.location = location
  order.meals = meals

  // calc hold mains or not
  const mainsLineType = calculateHoldMains(order)
  const goOnMains = mainsLineType === 'straight' ? false : true 
  order.metaData.goOnMains = goOnMains

  // TODO
  // calc hold dessert if present



  return order
}

const calculateHoldMains = (order) => {
  // TODO: before returning the order, determine whether the 'mains'
  // course should be cooked immediately after entrees go out, or
  // whether they should be held back until FOH says to start cooking them.
  //
  // delineation between entrees and mains in the UI:
  // go immediately === dotted line
  // hold === straight line
  //
  // when a hold on mains is called away by the FOH staff, the hold
  // line can either 
  // i) become a dotted line, or
  // ii) disappear completely
  //
  // we usually write the time that the mains are called away. this
  // is to see how long mains have been since call away; helps with
  // scheduling which meals to cook next.

  // DOTTED-VS-STRAIGHT-LINE ALGO
  // look at order.meals and see if there are courses for both entrees and mains
  // 1. if not, then dont need to worry about the line-type; its a single course like
  // ENTREES DINNER, or something like a dessert docket.
  // 2. if so, then look through the entree meals: if there is an item other than:
  //    i) garlic bread
  //    i) kids meals: parmi, schnitzel, steak, bolog, rice etc
  //    then it means we should hold mains
  //
  // nb. sometimes FOH will freetext on the docket to not hold on the mains (even
  //     when the entrees meals would imply to hold mains)
  //     for simplicity, allow the operator to manually change the line-type 
  //     (this functionality needs to exist in client app)
  //
  // the ultimate goal is to set a field in the metaData part of the object.
  // something like:
  // 
  // holdMains: false | true
  //
  // can also do this for dessert courses if they're present:
  // eg. a docket with entrees, mains, and desserts
  // holdDesserts: false | true
  //
  // ... this is good because sometimes we get 'call away' dockets for desserts



  const courseNames = Object.keys(order.meals)
  let lineType

  if (
    _.includes(courseNames, 'ENTREES DINNER') ||
    _.includes(courseNames, 'BAR ENTREE')
  ) {
    // have entrees. check if there's also mains present
    if (
      _.includes(courseNames, 'MAINS DINNER') ||
      _.includes(courseNames, 'BAR MEALS')
    ) {
      // have entrees and mains. go onto to determine line-type

      let allEntrees = []

      if (order.meals['ENTREES DINNER']) {
        allEntrees.push(order.meals['ENTREES DINNER'])
      }
      if (order.meals['BAR ENTREE']) {
        allEntrees.push(order.meals['BAR ENTREE'])
      }

      const allEntreesNames = _.map(_.flatten(allEntrees), item => {
          return item.name
        }
      )

      // scan through all entrees and see if they are matched in 
      // our dotted line candidates. then, if the resulting array of
      // bools are all true then we have a dotted-line, else a straight-line
      const itemInDottedItems = _.map(allEntreesNames, name => {
        if (_.includes(dottedLineEntreeItems, name)) {
          return 1
        } else {
          return 0
        }
      })

      const reducedDottedItems = _.reduce(itemInDottedItems, (acc, val) => {
        return acc + val
      }, 0)


      if (reducedDottedItems === allEntreesNames.length) {
        // all dotted-line entrees
        // console.log('have dotted-line'.green)
        lineType = 'dotted'
      } else {
        // need to hold on mains; straight-line
        // console.log('have straight-line'.red)
        lineType = 'straight'
      }

      console.log(colors.red(allEntrees))
      console.log(allEntreesNames)
      console.log(itemInDottedItems)
      console.log(reducedDottedItems)
      console.log(`lineType: ${lineType}`.red)

    } else {
      // have entrees but no mains. 
      console.log('have entrees but no mains'.red)
      lineType = 'dotted'
      console.log(`lineType: ${lineType}`.red)
    }

  } else {
    // TODO
    // have a docket with no entrees.
    // => could be mains only, or
    //    dessert docket, or
    //    call away docket, or
    //    random docket, or
    //    ....
    console.log('have mains only, or dessert, or call away docket, or ...'.red)
    lineType = 'dotted'
    console.log(`lineType: ${lineType}`.red)
  }

  return lineType
}

const handleMenuItemsAndItemInfo = (data, idxs) => {
  // better to check for undefined than to not...
  // sometimes a docket will be void of (say) II 
  // => if so then make it equal to empty array
  const CN_idxs = idxs['CN'] || []
  const MI_idxs = idxs['MI'] || []
  const II_idxs = idxs['II'] || []

  const CNDelimiters = getAllCNDelimiterPairs(data, CN_idxs)
  const MIDelimiters = getAllMIDelimiterPairs(data, MI_idxs)
  const meals = buildMealItems(data, MIDelimiters, II_idxs)
  let order = assignMealsToCourses(data, CNDelimiters, meals)
  // console.log("CNDelimiters: ", CNDelimiters)
  // console.log("MIDelimiters: ", MIDelimiters)
  // console.log('order:')
  // console.log(JSON.stringify(order,null,2))

  // HANDLE RANDOM CONTENT
  // is there Random Content?? token is RC.
  // if so, just add it in
  if (_.includes(Object.keys(idxs), 'RC') && !_.isEmpty(idxs['RC'])) {
    console.log(`ATTENTION: order has Random Content at: ${idxs['RC']}`.red)
    let rc = _.map(idxs['RC'], val => {
      let obj = {}
      // assume RC starts and ends on same like ie. it's a one liner
      obj.startIdx = val
      obj.endIdx = val
      obj.name = data[val].line
      obj.info = []
      obj.quantity = 1
      return obj
    })
    order['RANDOM CONTENT'] = rc
  }
  order = removeAllIndicesInOrder(order)
  order = flattenInfos(order)
  // this is GOOD logging info:
  // console.log('parser // order:')
  // console.log(stringify(order))
  return order
}

const removeAllIndicesInOrder = (order) => {
  let orderClone = _.cloneDeep(order)
  for (let course of Object.keys(orderClone)) {
    let items = orderClone[course]
    for (let item of items) {
      delete item.startIdx
      delete item.endIdx
      if (!_.isEmpty(item.info)) {
        for (let info of item.info) {
          delete info.startIdx
          delete info.endIdx
        }
      }
    }
  }
  return orderClone
}

const flattenInfos = (order) => {
  // do away with the unnecessary 'infoItem' structure:
  // from: item.info = [{itemInfo: [{quantity, info}}, itemInfo: [{quantity, info}]]
  // to: item.info = [[{quantity, info}], [{quantity, info}]]
  // each subarray of item.info now corresponds to one of the meal's free text.
  // free text can contain more than 1 line so that's why we have [{quantity, info}],
  // an array of free text lines.
  const orderClone = _.cloneDeep(order)
  for (let course of _.keys(orderClone)) {
    let items = orderClone[course]
    for (let item of items) {
      if (!_.isEmpty(item.info)) {
        item.info = item.info.map(itemInfo => {
          return itemInfo.itemInfo
        })
      }
    }
  }
  return orderClone
}

const buildMealItems = (data, MIDelimiters, II_idxs) => {
  const nonEmptyItemInfos = getNonEmptyItemInfos(data, II_idxs)
  // console.log('nonEmptyItemInfos')
  // console.log(JSON.stringify(nonEmptyItemInfos, null,2))

  // loop through MIDelimiters to build meals
  let meals = []
  for (let [i, MIDelimiter] of MIDelimiters.entries()) {
    let meal = {}
    const mealStart = MIDelimiter[0]
    const mealEnd = MIDelimiter[1]
    const mealLine = data[mealStart].line
    meal.startIdx = mealStart
    meal.endIdx = mealEnd
    try {
      const mealSplit = mealLine.split(/\s+/)
      meal.quantity =
        (mealSplit.length > 0 && isNaN(parseInt(mealSplit[0]))) ?
        '' : parseInt(mealSplit[0])
      meal.name = mealSplit.slice(1).join(' ')
    }
    catch (e) {
      console.log(`ERROR: tried to split mealLine and extract fields. ${e.message}`.red)
      meal.quantity = 0
      meal.name = "Parse error"
    }
    meal.info = []

    if (mealStart === mealEnd) {
      // => no item info for meal. we're done with constructing this meal.
      // push it onto meals and move onto next MIDelimiter pair
      meals.push(meal)
      continue
    } else {
      // find all the item infos which have a startIdx > mealStart and 
      //
      // endIdx < mealEnd.
      // then assign these to meal.info and push onto meals array
      const itemInfos = _.filter(nonEmptyItemInfos, item => {
        return (item.startIdx > mealStart && item.endIdx < mealEnd)
      })
      meal.info = itemInfos
      meals.push(meal)
    }
  }
  // console.log('meals')
  // console.log(JSON.stringify(meals,null,2))
  return meals
}

const assignMealsToCourses = (data, CNDelimiters, meals) => {
  // assign each meal to a course
  let order = {}
  for (let [j, CNDelimiter] of CNDelimiters.entries()) {
    const courseStart = CNDelimiter[0]
    const courseEnd = CNDelimiter[1]
    const courseName = data[courseStart].line
    order[courseName] = []
    for (let [k, meal] of meals.entries()) {
      if (_.isEmpty(meal.info)) {
        if (meal.startIdx > courseStart && meal.endIdx <= courseEnd) {
          order[courseName].push(meal)
        } else {
          continue
        }
      } else {
        // IMPORTANT
        // our meal has a non empty item info array. this means we need to first
        // update our meal start and end indices to include info
        const orderedInfos = _.sortBy(meal.info, val => {
          return val.startIdx
        })
        // console.log('orderedInfos')
        // console.log(orderedInfos)

        meal.startIdx = _.head(orderedInfos).startIdx
        meal.endIdx = _.last(orderedInfos).endIdx

        if (meal.startIdx > courseStart && meal.endIdx < courseEnd) {
          order[courseName].push(meal)
        } else {
          continue
        }
      }
    }
  }
  return order
}

const getNonEmptyItemInfos = (data, II_idxs) => {
  // TRICKY
  let infos = []
  for (let [i, II_idx] of II_idxs.entries()) {
    const aLine = data[II_idx].line
    let quantity
    let infoLine
    try {
      const splitLine = aLine.split(/\s+/)
      quantity =
        (splitLine.length > 0 && isNaN(parseInt(splitLine[0]))) ?
        '' : parseInt(splitLine[0])
      infoLine = splitLine.slice(1).join(' ')
    } catch (e) {
      console.log(`ERROR: tried to split info line and extract fields. ${e.message}`.red)
      quantity = 0
      infoLine = "Parse error"
    }
    let obj = {}
    if (i === 0) {
      // start things off with creating an array containing first line of an info.
      // plus, if we're at the first element of II_idxs then we cant do what to do in 
      // the following 'else' block; that is look at the previous element...there is NO
      // preceding element when we're at the first element.
      obj.itemInfo = [{ quantity: quantity, info: infoLine }]
      obj.startIdx = II_idx
      infos.push(obj)
    } else {
      if ((II_idx - 1) === II_idxs[i - 1]) {
        // still part of a previous item info
        // => append to last element of infos
        _.last(infos).itemInfo.push({ quantity: quantity, info: infoLine })
      } else {
        // new item info
        // => push a new array onto infos
        obj.itemInfo = [{ quantity: quantity, info: infoLine }]
        obj.startIdx = II_idx
        // update the endIdx of the last item info, before pushing new info 
        // onto infos array
        infos[infos.length - 1].endIdx = II_idxs[i - 1]
        infos.push(obj)
      }
    }
    if (i === II_idxs.length - 1) {
      // at last element of II_idxs => last line of last item info
      infos[infos.length - 1].endIdx = II_idxs[i]
    }
  }
  return infos
}

const getAllMIDelimiterPairs = (data, idxs) => {
  let delimiters = []
  for (let [j, idx] of idxs.entries()) {
    if (idx === _.last(idxs)) {
      delimiters.push([idx, data.length - 1])
    } else {
      if (_.includes(courseFields, data[idxs[j + 1] - 1].line)) {
        // CARFUL OF COURSE NAMES APPEARING BETWEEN TWO CONSECUTIVE MENU ITEMS
        // have a course name between this menu item and the next
        // => need to move back *2* steps from  the next menu item location
        delimiters.push([idx, idxs[j + 1] - 2])
      } else {
        // no course name between this menu item and next one 
        delimiters.push([idx, idxs[j + 1] - 1])
      }
    }
  }
  return delimiters
}

const getAllCNDelimiterPairs = (data, idxs) => {
  let delimiters = []
  for (let [j, idx] of idxs.entries()) {
    if (idx === _.last(idxs)) {
      delimiters.push([idx, data.length - 1])
    } else {
      delimiters.push([idx, idxs[j + 1] - 1])
    }
  }
  return delimiters
}

const makeCourseDelimiters = (data, CN_idxs) => {
  let CNDelimiters = []
  for (let [n, CN_idx] of CN_idxs.entries()) {
    if (CN_idx === _.last(CN_idxs)) {
      CNDelimiters.push([CN_idx, data.length - 1])
    } else {
      CNDelimiters.push([CN_idx, CN_idxs[n + 1] - 1])
    }
  }
  return CNDelimiters
}

const handleMetaData = (data, idxs) => {
  // get meta data
  const metaData = _.reduce(idxs['MD'], (acc, MDIdx, i) => {
    // first meta data line assumed to be 'device which took the order'
    if (i === 0) {
      acc.orderTakenUsing = data[MDIdx].line
      return acc
    }
    // second meta data line assumed to be the 'clerk' 
    if (i === 1) {
      const clerkLine = data[MDIdx].line
      const colon = clerkLine.indexOf(':')
      acc.clerk = clerkLine.slice(colon + 2)
      return acc
    }
    // third meta data line assumed to be the order sent time
    if (i === 2) {
      acc.orderSentAt = data[MDIdx].line
      return acc
    }
    // after the 3rd meta data element we start to get variable content which may or may
    // not appear on the docket. this includes table number, even.
    if (i >= 3) {
      if (acc.hasOwnProperty("variableContent")) {
        acc.variableContent.push(data[MDIdx].line)
        return acc
      } else {
        acc.variableContent = [data[MDIdx].line]
        return acc
      }
    }
  }, {})

  // make a deep copy of variable content; we will be mutating it when deleting
  // elements once a variable like 'covers' etc is found.
  let variableContent = _.cloneDeep(metaData.variableContent)
  let extraction = extractFromVariableContent(variableContent)
  metaData.variableContent = extraction.variableContent

  for (let key in extraction.extractedVariables) {
    metaData[key] = extraction.extractedVariables[key]
  }
  return metaData
}

const extractFromVariableContent = (variableContent) => {
  let extractedVariables = {}
  let tableNumber = _.reduce(variableContent, (acc, line, index) => {
    if (line.includes('TABLE NO') || line.includes('ORDER NUMBER')) {
      acc.line = line
      acc.index = index
      return acc
    } else {
      return acc
    }
  }, {})

  if (!_.isEmpty(tableNumber)) {
    const splitTableNumber = tableNumber.line.split(/\s+/)
    if (splitTableNumber.length > 0 ) {
      extractedVariables.tableNumber = (splitTableNumber.slice(-1)[0]).split('*').join('')
      variableContent.splice(tableNumber.index, 1)
    }
  } else {
    extractedVariables.tableNumber = "NONE"
  }

  // find customer name if present
  let customerName = _.reduce(variableContent, (acc, line, index) => {
    if (line.includes("NAME:")) {
      acc.line = line
      acc.index = index
      return acc
    } else {
      return acc
    }
  }, {})

  if (!_.isEmpty(customerName)) {
    const colon = customerName.line.indexOf(':')
    extractedVariables.customerName = customerName.line.slice(colon + 2)
    variableContent.splice(customerName.index, 1)
  } else {
    extractedVariables.customerName = ""
  }

  // find covers if present
  let covers = _.reduce(variableContent, (acc, line, index) => {
    if (line.includes("COVERS:")) {
      acc.line = line
      acc.index = index
      return acc
    } else {
      return acc
    }
  }, {})

  if (!_.isEmpty(covers)) {
    const colon = covers.line.indexOf(':')
    extractedVariables.covers = covers.line.slice(colon + 2)
    variableContent.splice(customerName.index, 1)
  } else {
    extractedVariables.covers = ""
  }
  // variableContent may be undefined if all its elements have been extracted. if so,
  // make it an empty array
  variableContent = variableContent || []

  // using ES6 shorthand notation for object with same key name as variable vals
  return { extractedVariables, variableContent }
}
