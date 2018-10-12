'use strict';

const docketTemplate = {
  area: "",
  metaData: {},
  tableNumber: "",
  customerName: "",
  covers: "",
  meals: {
    "ENTREES DINNER": [],
    "MAINS DINNER": [],
    "BAR MEALS": [],
    "CHILDS MENUS": [],
    "CHILDS DESSERT TOPS": [],
    "DESSERT": [],
    "ADD MODIFIERS": [],
    "SPECIAL INSTRUCTIONS": [],
    "COFFEE TYPES": [],
    "SIDES": []
  }
};

// only used in parserV2.js
const metaContentKeys = [
  "NAME:",
  "TABLE NO",
  "ORDER NUMBER",
  "COVERS:",
  "PRINT A/C -", 
];

const variableContentKeys = [
  "NAME:",
  "TABLE NO",
  "ORDER NUMBER",
  "COVERS:",
];

const docketStartFields = [
  "RESTAURANT BAR",
  "TAB BAR",
  "JUKE BAR",
  "GAMING BAR",
  "SPORTS BAR",
];

const courseFields = [
  "ENTREES DINNER",
  "MAINS DINNER",
  "MAINS LUNCH",
  "BAR MEALS",
  "CHILDS MENUS",
  "CHILD DESSERT TOPS",
  "DESSERT",
  "ADD MODIFIERS",
  "SPECIAL INSTRUCTIONS",
  "COFFEE TYPES",
  "SIDES"
];

// not exported at this stage.
const anonymousContent = [
   // ANOMALOUS CONTENT ==> this is a worry.
  "for the band",
  "add gravy",
  "EXTRA PEPP SAUCE"
];


const menuItems = [
  //normal items
  "AFFOGATO",
  "ARANCINI",
  "BARRAMUNDI",
  "BEEF BURGER",
  "BEEF SLIDERS",
  "BIRYANI CURRY",
  "BREAD ROLL",
  "BRISKET SAND",
  "BRUSCHETTA",
  "BRUSCHETTA TOMAT",
  "CAKE DISPLAY",
  "CALAMARI",
  "CALL AWAY",
  "CARAMEL TOPPING",
  "CAULIFLOWER ALM",
  "CHICK RIBS",
  "CHICKEN BURGER",
  "CHEESE CAKE",
  "CHILDS BOLOG",
  "CHILDS BURGER",
  "CHILDS FISH",
  "CHILDS FROG POND",
  "CHILDS HAMBURGER",
  "CHILDS ICE CREAM",
  "CHILDS MOUSSE",
  "CHILDS PARMI",
  "CHILDS RICE",
  "CHILDS ROAST",
  "CHILDS SNIT",
  "CHILDS STEAK",
  "CHILLI CALAMARI",
  "CHOCO TOPPING",
  "CHURROS",
  "CIGAR",
  "CREME CARAMEL",
  "CRISPY CHIPS",
  "CRUMBED PRAWNS",
  "CUMIN CARROTS",
  "DUCK",
  "DUMPLINGS",
  "DESSERT SPEC",
  "EXTRA ICECREAM",
  "EYE FILLET 250GM",
  "FALAFEL SMALL",
  "FALAFEL LARGE",
  "FONDANT",
  "FREEKAH FALAFEL",
  "FRIES",
  "GARLIC CHATS",
  "GARDEN SALAD",
  "GARLIC BREAD",
  "GNOCCHI",
  "HAKE",
  "HANGER 200",
  "HANGER 400",
  "KIDS EXTRA DESS",
  "LOADED FRIES",
  "MAIN SPECIALS",
  "MARINATED CHIC",
  "NACHOS",
  "NASI",
  "NO TOPPING",
  "OPEN FOOD",
  "OYSTERS KIL 1",
  "OYSTERS NAT 1",
  "PAPPADELLE LAMB",
  "PAPPARDELL LAMB",
  "PARMA",
  "PARMIGIANA",
  "POPCORN CHICK",
  "PORK BELLY",
  "PORK CUTLET",
  "PORK SLIDERS",
  "PORK TERRINE",
  "PORTER",
  "PORTERHOUSE 300",
  "POTATO GRATIN",
  "PRAWN RISOTTO",
  "QUINOA SALAD",
  "ROAST",
  "ROAST VEG",
  "SALMON",
  "SALMON SALAD",
  "SCOTCH FILLET",
  "SCHNITZEL",
  "SEN GARL BREAD",
  "SENIOR FISH CHIP",
  "SENIOR MOUSSE",
  "SENIOR PUDDING",
  "SENIOR ROAST",
  "SENIOR SNIT",
  "SENIOR SOUP",
  "SENIOR SORBETS",
  "SHARE JUKE ONE",
  "SHARE MEMBER TWO",
  "SOUP OF THE DAY",
  "SOUP",
  "SPINKLES ONLY",
  "STICKY DATE PUDD",
  "STRAWB TOPPING",
  "SWEET POT FRIES",
  "TASTING PLATE",
  "TACOS",
  "TEXAN",
  "WAGU RUMP",
  "WEDGES",
  "WHITING",
  "WINTER GREENS",
  "WRAP"
];

// ----------------------------------------
exports.docketTemplate = docketTemplate;
exports.metaContentKeys = metaContentKeys;
exports.menuItems = menuItems;
exports.courseFields = courseFields;
exports.docketStartFields = docketStartFields;
exports.variableContentKeys = variableContentKeys;
// ----------------------------------------
