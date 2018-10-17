# ORDER UP
electron app using react and webpack  `
- native deps go in ./app/package.json as dependencies . 
- all other dependencies (dev also) go in ./package.json . 
  
## KNUCKLE DRAGGER (in main-process/)

listens for incoming orders from escpos FOH serial machine, then parses it to a suitable POJO to then save in rethinkdb. uses `serialport` and `npos` for interfacing and parsing of orders data, respectively. both need to be installed to ./app/package.json because `serialport` is an native module, and `npos` has an native dependency, `tessoc`.


## INSTALLATION (TODO: elaborate)

**Linux**

to 'npm install' on Linux i had to downgrade node versions (from 10.6.0 to 10.1). otherwise, compiling serialport fails whilst installing subdependency module 'usb'. 
1. make sure Linux has build-essentials and libudev-dev packages installed:

   `sudo apt-get build-essential libudev-dev`
2. use a downgraded version of node:

   `nvm install v10.1i`
3. finally, install node modules:

  `yarn` in root of project
4. comment out console.log stuff in `npos` package: `textualize.js` and change `r:0` to `r:1` in `rules.js` (found at app/node_modules/npos)

**MacOS**

works fine with node 10.6.0.
1. in ./app/ run `yarn`, then in ./ run `yarn` 

## RUN

### DEV with a printer attached
electron (main)process is spun up before webpack-dev-server. see webpack.config.dev.renderer.js
#### in one tab only:
  1.  `yarn dev:printer`
#### renderer and main processes in separate console tabs:
  run each in separate terminal windows:
  1. `yarn run dev:main:printer` => build the electron app/file dev.main.js
  2. `yarn run dev:renderer` => compile renderer files, then webpack-dev-server (but start electron up before wds)

### DEV and no printer => use mock orders using SerialPorts MockBinding feature 
#### in one tab only:
  1.  `yarn dev:mock`
#### renderer and main processes in separate console tabs:
run in this order, each in separate terminal windows:
  1. `yarn run dev:main:mock`
  2. `yarn run dev:renderer`

### PROD 
  `yarn build`
executables will be outputted to the release/ folder

## GOTTCHAS 

0. make sure `rethinkdb` is installed and running on computer. OrderUp will connect to it.  

  `$> rethinkdb`

1. your need to comment out the `console.log('[textualize] text')` etc stuff from npos `textualize.js` file  and in `rules.js` of npos package, you need to change `'r': 0` to `'r': 1` in the ESC rules array.  failing to do this will crash the parser when using a docket with two colours,  black and red. **if you dont do this then the orders will not parse correctly...venue location will be NO LOCATION and the actual location will appear in the randomContent array as (say) '\u0001JUKE BAR' with the Start of Header byte \u0001 appearing!!**  

3. `electron-redux`: if you DONT adhere to the following, then whilst you will still be able to add/remove/etc an item from the store, it *WILL NOT* be shared across main & renderer processes:  Actions MUST be FSA compliant. *Meaning, the action has a `type` and `payload` property.*

4. `electron-redux`: by nature of the library using IPC to communicate over main and renderer processes, actions are now all *asynchronous*. if that's a problem then you will have to remove it, install `redux-electron-store` because that keeps actions *synchronous*

5. everytime you add a native dependency and rebuild, npos library tweeks (see 1. above) need to be redone!!!

6. you have to 'force compare' process.env.VARIABLE. correct way `if (process.env.MOCK_ORDERS === true) {...}`. incorrect way `if (process.env.MOCK_ORDERS) {...}`=> this will give weird unexpected results. (??)
7. when building electron using electron-builder. get error: 
    Error: Application entry file "index.js" in the "/Users/dre/projects/grovedale/order_up/apps/order-up-1-using-webpack/release/mac/OrderUp.app/Contents/Resources/app.asar" does not exist. Seems like a wrong configuration.

    => it's because in ./package.json there is no "main":"index.js" entry which tells builder where to start.
    FIX: put this in the "build" entry of ./package.json:
    "build": {
      ...
      "extraMetadata": {
      "main": "./build/main.js"
      },
      ...
    }
8. ...?


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

0. a new connection is made to rethinkdb *everytime* a new order comes in. should there be only one?
1. **what happens if app is start during an order happens to be being sent?** will receive the cut operator but the previous bytes wont parse to a correct order. need to notify user that an order was sent in but not converted ==> send it again.  
2. currently sending the `store` all the way down from main-process `main.js` to `dbHandler.js` (where every new order gets inserted to db). maybe refactor code to avoid unecessarily passing `store` though modules.
3. `express` server is working in dev but not production mode. not even 100% sure that it should be bundled with the app? (it's purpose is to listen for incoming requests from ipads to change the rethinkdb table. then via changefeeds, OrderUp receives this info and updates its redux store, then react updates its UI)
4. done away with writing to the fs in docker-mocker's listen.js file. just have a buffer in memory, with no max limit size, which resets back to zero-size everytime a 'cut-op' is found aka after each order comes through successfully. has issues with writing to fs in production and ASAR format (electron-builder issue...couldn't find file! there was a work around in github issues but it was hacky, and this way seems to kill 2 birds with one stone)
5. if an order is being sent, gets cut off half way, then gets resent you want to also reset the buff. to implement this, business-logic is if the buffer contains consecutive 'initialize' ops without a cut op in between. **TODO**. otherwise, you can just put up with a single weird docket and ask the person to send the last **two** dockets again, i) the docket that was cut short, and ii) the docket that followed it.