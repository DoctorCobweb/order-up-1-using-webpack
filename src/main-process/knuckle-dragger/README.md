# KNUCKLE DRAGGER

listen for data coming (node listen.js) in and parse it manually (node parser.js).


## INSTALLATION

**Linux**

to 'npm install' on Linux i had to downgrade node versions (from 10.6.0 to 10.1). otherwise, compiling serialport fails whilst installing subdependency module 'usb'. 
1. make sure Linux has build-essentials and libudev-dev packages installed:

   `sudo apt-get build-essential libudev-dev`
2. use a downgraded version of node:

   `nvm install v10.1i`
3. finally, install node modules:

   `npm install`

**MacOS**

works fine with node 10.6.0.
1. `npm install`

## GOTTCHAS 

1. your need to comment out the console.log('[textualize] text') etc stuff from npos textualize.js file  

2.  in rules.js of npos package, you need to change 'r': 0 to 'r': 1 in the ESC rules array.  failing to do this will crash the parser when using a docket with two colours,  black and red.  

## RUN

1. make sure rethinkdb is installed on computer and running

  `$> rethinkdb`  
2. in root folder run  

  `$> node main.js`  



## DOCKET HEADINGS FOR EACH AREA  

**RESTAURANT BAR**  
ENTREES DINNER  
MAINS DINNER  
CHILDS MENUS - has desserts there. i think there's never entrees or mains for childs here  
CHILDS DESSERT TOPS - things like straw topping  
DESSERT - adult desserts  
ADD MODIFIERS - adult dessert modifiers  
SPECIAL INSTRUCTIONS - call away: kids desserts/mains/etc  


**TAB BAR**  
ENTREES DINNER  
BAR MEALS  
CHILDS MENUS - has desserts there. i think there's never entrees or mains for childs here  
CHILDS DESSERT TOPS - things like straw topping  


**JUKE BAR**  
BAR MEALS  
??? OTHERS  


**GAMING BAR**  
???  


**BOTTLESHOP**  
???  


**OTHER AREAS ???**  



## IMPLEMENTATION THOUGHTS & CONCERNS  

1. what happens if app is start during an order happens to be being sent? will receive the cut operator but the previous bytes wont parse to a correct order. need to notify user that an order was sent in but not converted ==> send it again.  

