module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main-process/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/electron-log/index.js":
/*!********************************************!*\
  !*** ./node_modules/electron-log/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (process.type === 'renderer') {
  module.exports = __webpack_require__(/*! ./renderer */ "./node_modules/electron-log/renderer.js");
} else {
  module.exports = __webpack_require__(/*! ./main */ "./node_modules/electron-log/main.js");
}

/***/ }),

/***/ "./node_modules/electron-log/lib/format.js":
/*!*************************************************!*\
  !*** ./node_modules/electron-log/lib/format.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(/*! util */ "util");

var EOL = __webpack_require__(/*! os */ "os").EOL;

module.exports = {
  format: format,
  formatTimeZone: formatTimeZone,
  pad: pad,
  stringifyArray: stringifyArray
};

function format(msg, formatter) {
  if (typeof formatter === 'function') {
    return formatter(msg);
  }

  var date = msg.date;
  return formatter.replace('{level}', msg.level).replace('{text}', stringifyArray(msg.data)).replace('{y}', date.getFullYear()).replace('{m}', pad(date.getMonth() + 1)).replace('{d}', pad(date.getDate())).replace('{h}', pad(date.getHours())).replace('{i}', pad(date.getMinutes())).replace('{s}', pad(date.getSeconds())).replace('{ms}', pad(date.getMilliseconds(), 3)).replace('{z}', formatTimeZone(date.getTimezoneOffset()));
}

function stringifyArray(data) {
  data = data.map(function formatErrors(arg) {
    return arg instanceof Error ? arg.stack + EOL : arg;
  });
  return util.format.apply(util, data);
}

function pad(number, zeros) {
  zeros = zeros || 2;
  return (new Array(zeros + 1).join('0') + number).substr(-zeros, zeros);
}

function formatTimeZone(minutesOffset) {
  var m = Math.abs(minutesOffset);
  return (minutesOffset >= 0 ? '-' : '+') + pad(Math.floor(m / 60)) + ':' + pad(m % 60);
}

/***/ }),

/***/ "./node_modules/electron-log/lib/log.js":
/*!**********************************************!*\
  !*** ./node_modules/electron-log/lib/log.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// jshint -W040


var LEVELS = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
module.exports = log;

function log(transports, level, text) {
  var data = Array.prototype.slice.call(arguments, 2);
  var msg = {
    data: data,
    date: new Date(),
    level: level
  };

  for (var i in transports) {
    // jshint -W089
    if (!transports.hasOwnProperty(i) || typeof transports[i] !== 'function') {
      continue;
    }

    var transport = transports[i];

    if (transport === false || !compareLevels(transport.level, level)) {
      continue;
    }

    if (transport.level === false) continue;
    transport.call(null, msg);
  }
}

function compareLevels(passLevel, checkLevel) {
  var pass = LEVELS.indexOf(passLevel);
  var check = LEVELS.indexOf(checkLevel);

  if (check === -1 || pass === -1) {
    return true;
  }

  return check <= pass;
}

/***/ }),

/***/ "./node_modules/electron-log/lib/original-console.js":
/*!***********************************************************!*\
  !*** ./node_modules/electron-log/lib/original-console.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Save console methods for using when originals are overridden
 */

module.exports = {
  context: console,
  error: console.error,
  warn: console.warn,
  info: console.info,
  verbose: console.verbose,
  debug: console.debug,
  silly: console.silly,
  log: console.log
};

/***/ }),

/***/ "./node_modules/electron-log/lib/transports/console.js":
/*!*************************************************************!*\
  !*** ./node_modules/electron-log/lib/transports/console.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var format = __webpack_require__(/*! ../format */ "./node_modules/electron-log/lib/format.js");

var originalConsole = __webpack_require__(/*! ../original-console */ "./node_modules/electron-log/lib/original-console.js");

transport.level = 'silly';
transport.format = '[{h}:{i}:{s}.{ms}] [{level}] {text}';
module.exports = transport;

function transport(msg) {
  var text = format.format(msg, transport.format);

  if (originalConsole[msg.level]) {
    originalConsole[msg.level](text);
  } else {
    originalConsole.log(text);
  }
}

/***/ }),

/***/ "./node_modules/electron-log/lib/transports/file/find-log-path.js":
/*!************************************************************************!*\
  !*** ./node_modules/electron-log/lib/transports/file/find-log-path.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fs = __webpack_require__(/*! fs */ "fs");

var path = __webpack_require__(/*! path */ "path");

var os = __webpack_require__(/*! os */ "os");

var getAppName = __webpack_require__(/*! ./get-app-name */ "./node_modules/electron-log/lib/transports/file/get-app-name.js");

module.exports = findLogPath;
/**
 * Try to determine a platform-specific path where can write logs
 * @param {string} [appName] Used to determine the last part of a log path
 * @return {string|boolean}
 */

function findLogPath(appName) {
  appName = appName || getAppName();

  if (!appName) {
    return false;
  }

  var homeDir = os.homedir ? os.homedir() : process.env['HOME'];
  var dir;

  switch (process.platform) {
    case 'linux':
      {
        dir = prepareDir(process.env['XDG_CONFIG_HOME'], appName).or(homeDir, '.config', appName).or(process.env['XDG_DATA_HOME'], appName).or(homeDir, '.local', 'share', appName).result;
        break;
      }

    case 'darwin':
      {
        dir = prepareDir(homeDir, 'Library', 'Logs', appName).or(homeDir, 'Library', 'Application Support', appName).result;
        break;
      }

    case 'win32':
      {
        dir = prepareDir(process.env['APPDATA'], appName).or(homeDir, 'AppData', 'Roaming', appName).result;
        break;
      }
  }

  if (dir) {
    return path.join(dir, 'log.log');
  } else {
    return false;
  }
}

function prepareDir(dirPath) {
  // jshint -W040
  if (!this || this.or !== prepareDir || !this.result) {
    if (!dirPath) {
      return {
        or: prepareDir
      };
    } //noinspection JSCheckFunctionSignatures


    dirPath = path.join.apply(path, arguments);
    mkDir(dirPath);

    try {
      fs.accessSync(dirPath, fs.W_OK);
    } catch (e) {
      return {
        or: prepareDir
      };
    }
  }

  return {
    or: prepareDir,
    result: (this ? this.result : false) || dirPath
  };
}

function mkDir(dirPath, root) {
  var dirs = dirPath.split(path.sep);
  var dir = dirs.shift();
  root = (root || '') + dir + path.sep;

  try {
    fs.mkdirSync(root);
  } catch (e) {
    if (!fs.statSync(root).isDirectory()) {
      throw new Error(e);
    }
  }

  return !dirs.length || mkDir(dirs.join(path.sep), root);
}

/***/ }),

/***/ "./node_modules/electron-log/lib/transports/file/get-app-name.js":
/*!***********************************************************************!*\
  !*** ./node_modules/electron-log/lib/transports/file/get-app-name.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// jshint -W074

/** @name process.resourcesPath */

var fs = __webpack_require__(/*! fs */ "fs");

var path = __webpack_require__(/*! path */ "path");

var consoleTransport = __webpack_require__(/*! ../console */ "./node_modules/electron-log/lib/transports/console.js");

module.exports = getAppName;

function getAppName() {
  try {
    var name = loadPackageName();

    if (name) {
      return name;
    }

    return warn('electron-log: unable to load the app name from package.json');
  } catch (e) {
    return warn('electron-log: ' + e.message);
  }
}
/**
 * Try to load main app package
 * @throws {Error}
 * @return {Object|null}
 */


function loadPackageName() {
  var packageFile;

  try {
    if (__webpack_require__.c[__webpack_require__.s].filename) {
      packageFile = find(path.dirname(__webpack_require__.c[__webpack_require__.s].filename));
    }
  } catch (e) {}

  if (!packageFile && process.resourcesPath) {
    packageFile = find(path.join(process.resourcesPath, 'app.asar'));
    var electronModule = path.join('node_modules', 'electron', 'package.json');

    if (packageFile && packageFile.indexOf(electronModule) !== -1) {
      packageFile = null;
    }
  }

  if (!packageFile) {
    packageFile = find(process.cwd());
  }

  if (!packageFile) {
    return null;
  }

  var content = fs.readFileSync(packageFile, 'utf-8');
  var packageData = JSON.parse(content); //noinspection JSUnresolvedVariable

  return packageData ? packageData.productName || packageData.name : false;
}

function find(root) {
  var file;

  while (!file) {
    var parent;
    file = path.join(root, 'package.json');

    try {
      fs.statSync(file);
    } catch (e) {
      parent = path.resolve(root, '..');
      file = null;
    }

    if (root === parent) {
      break;
    }

    root = parent;
  }

  return file;
}

function warn(message) {
  consoleTransport({
    data: [message],
    date: new Date(),
    level: 'warn'
  });
}

/***/ }),

/***/ "./node_modules/electron-log/lib/transports/file/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/electron-log/lib/transports/file/index.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fs = __webpack_require__(/*! fs */ "fs");

var EOL = __webpack_require__(/*! os */ "os").EOL;

var format = __webpack_require__(/*! ../../format */ "./node_modules/electron-log/lib/format.js");

var consoleTransport = __webpack_require__(/*! ../console */ "./node_modules/electron-log/lib/transports/console.js");

var findLogPath = __webpack_require__(/*! ./find-log-path */ "./node_modules/electron-log/lib/transports/file/find-log-path.js");

transport.findLogPath = findLogPath;
transport.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
transport.level = 'warn';
transport.maxSize = 1024 * 1024;
transport.streamConfig = undefined;
module.exports = transport;

function transport(msg) {
  var text = format.format(msg, transport.format) + EOL;

  if (transport.stream === undefined) {
    initSteamConfig();
    openStream();
  }

  if (transport.level === false) {
    return;
  }

  var needLogRotation = transport.maxSize > 0 && getStreamSize(transport.stream) > transport.maxSize;

  if (needLogRotation) {
    archiveLog(transport.stream);
    openStream();
  }

  transport.stream.write(text);
}

function initSteamConfig() {
  transport.file = transport.file || findLogPath(transport.appName);

  if (!transport.file) {
    transport.level = false;
    logConsole('Could not set a log file');
  }
}

function openStream() {
  if (transport.level === false) {
    return;
  }

  transport.stream = fs.createWriteStream(transport.file, transport.streamConfig || {
    flags: 'a'
  });
}

function getStreamSize(stream) {
  if (!stream) {
    return 0;
  }

  if (stream.logSizeAtStart === undefined) {
    try {
      stream.logSizeAtStart = fs.statSync(stream.path).size;
    } catch (e) {
      stream.logSizeAtStart = 0;
    }
  }

  return stream.logSizeAtStart + stream.bytesWritten;
}

function archiveLog(stream) {
  if (stream.end) {
    stream.end();
  }

  try {
    fs.renameSync(stream.path, stream.path.replace(/log$/, 'old.log'));
  } catch (e) {
    logConsole('Could not rotate log', e);
  }
}

function logConsole(message, error) {
  var data = ['electron-log.transports.file: ' + message];

  if (error) {
    data.push(error);
  }

  consoleTransport({
    data: data,
    date: new Date(),
    level: 'warn'
  });
}

/***/ }),

/***/ "./node_modules/electron-log/lib/transports/log-s.js":
/*!***********************************************************!*\
  !*** ./node_modules/electron-log/lib/transports/log-s.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// jshint -W074, -W089


var http = __webpack_require__(/*! http */ "http");

var https = __webpack_require__(/*! https */ "https");

var url = __webpack_require__(/*! url */ "url");

transport.client = {
  name: 'electron-application'
};
transport.depth = 6;
transport.level = false;
transport.url = null;
module.exports = transport;

function transport(msg) {
  if (!transport.url) return;
  var data = jsonDepth({
    client: transport.client,
    data: msg.data,
    date: msg.date.getTime(),
    level: msg.level
  }, transport.depth + 1);
  post(transport.url, data);
}

function post(serverUrl, data) {
  var urlObject = url.parse(serverUrl);
  var transport = urlObject.protocol === 'https:' ? https : http;
  var body = JSON.stringify(data);
  var options = {
    hostname: urlObject.hostname,
    port: urlObject.port,
    path: urlObject.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length
    }
  };
  var request = transport.request(options);
  request.write(body);
  request.end();
}

function jsonDepth(json, depth) {
  if (depth < 1) {
    if (Array.isArray(json)) return '[array]';
    if (typeof json === 'object') return '[object]';
    return json;
  }

  if (Array.isArray(json)) {
    return json.map(function (child) {
      return jsonDepth(child, depth - 1);
    });
  }

  if (json && typeof json.getMonth === 'function') {
    return json;
  }

  if (json === null) {
    return null;
  }

  if (typeof json === 'object') {
    if (typeof json.toJSON === 'function') {
      json = json.toJSON();
    }

    var newJson = {};

    for (var i in json) {
      //noinspection JSUnfilteredForInLoop
      newJson[i] = jsonDepth(json[i], depth - 1);
    }

    return newJson;
  }

  return json;
}

/***/ }),

/***/ "./node_modules/electron-log/lib/transports/renderer-console.js":
/*!**********************************************************************!*\
  !*** ./node_modules/electron-log/lib/transports/renderer-console.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BrowserWindow;

try {
  BrowserWindow = __webpack_require__(/*! electron */ "electron").BrowserWindow;
} catch (e) {
  BrowserWindow = null;
}

var format = __webpack_require__(/*! ../format */ "./node_modules/electron-log/lib/format.js");

transport.level = BrowserWindow ? 'silly' : false;
transport.format = '[{h}:{i}:{s}.{ms}] {text}';
module.exports = transport;

function transport(msg) {
  if (!BrowserWindow) return;
  var text = format.format(msg, transport.format);
  BrowserWindow.getAllWindows().forEach(function (wnd) {
    wnd.webContents.send('__ELECTRON_LOG_RENDERER__', msg.level, text);
  });
}

/***/ }),

/***/ "./node_modules/electron-log/main.js":
/*!*******************************************!*\
  !*** ./node_modules/electron-log/main.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var electron;

try {
  electron = __webpack_require__(/*! electron */ "electron");
} catch (e) {
  electron = null;
}

var log = __webpack_require__(/*! ./lib/log */ "./node_modules/electron-log/lib/log.js");

var transportConsole = __webpack_require__(/*! ./lib/transports/console */ "./node_modules/electron-log/lib/transports/console.js");

var transportFile = __webpack_require__(/*! ./lib/transports/file */ "./node_modules/electron-log/lib/transports/file/index.js");

var transportLogS = __webpack_require__(/*! ./lib/transports/log-s */ "./node_modules/electron-log/lib/transports/log-s.js");

var transportRendererConsole = __webpack_require__(/*! ./lib/transports/renderer-console */ "./node_modules/electron-log/lib/transports/renderer-console.js");

var transports = {
  console: transportConsole,
  file: transportFile,
  logS: transportLogS,
  rendererConsole: transportRendererConsole
};
module.exports = {
  transports: transports,
  error: log.bind(null, transports, 'error'),
  warn: log.bind(null, transports, 'warn'),
  info: log.bind(null, transports, 'info'),
  verbose: log.bind(null, transports, 'verbose'),
  debug: log.bind(null, transports, 'debug'),
  silly: log.bind(null, transports, 'silly'),
  log: log.bind(null, transports, 'info')
};
module.exports.default = module.exports;

if (electron && electron.ipcMain) {
  electron.ipcMain.on('__ELECTRON_LOG__', onRendererLog);
  var appName = electron.app.getName();

  if (appName !== 'Electron') {
    transportFile.appName = appName;
  }
}

function onRendererLog(event, data) {
  if (Array.isArray(data)) {
    data.unshift(transports);
    log.apply(null, data);
  }
}

/***/ }),

/***/ "./node_modules/electron-log/renderer.js":
/*!***********************************************!*\
  !*** ./node_modules/electron-log/renderer.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = null;
var ipcRenderer;

try {
  ipcRenderer = __webpack_require__(/*! electron */ "electron").ipcRenderer;
} catch (e) {
  ipcRenderer = null;
}

var originalConsole = __webpack_require__(/*! ./lib/original-console */ "./node_modules/electron-log/lib/original-console.js");

if (ipcRenderer) {
  module.exports = {
    error: log.bind(null, 'error'),
    warn: log.bind(null, 'warn'),
    info: log.bind(null, 'info'),
    verbose: log.bind(null, 'verbose'),
    debug: log.bind(null, 'debug'),
    silly: log.bind(null, 'silly'),
    log: log.bind(null, 'info')
  };
  module.exports.default = module.exports;
  ipcRenderer.on('__ELECTRON_LOG_RENDERER__', function (event, level, data) {
    if (level === 'verbose') {
      level = 'log';
    } else if (level === 'silly') {
      level = 'debug';
    }

    originalConsole[level].apply(originalConsole.context, typeof data === 'string' ? [data] : data);
  });
}

function log() {
  var data = Array.prototype.slice.call(arguments);
  data = data.map(function (obj) {
    if (obj instanceof Error) {
      obj = obj.stack || obj;
    }

    return obj;
  });
  ipcRenderer.send('__ELECTRON_LOG__', data);
}

/***/ }),

/***/ "./src/main-process/main.js":
/*!**********************************!*\
  !*** ./src/main-process/main.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// import { app, BrowserWindow } from 'electron'
// import path from 'path'
// import url from 'url'
// import log from 'electron-log'
const {
  app,
  BrowserWindow
} = __webpack_require__(/*! electron */ "electron");

const path = __webpack_require__(/*! path */ "path");

const url = __webpack_require__(/*! url */ "url");

const log = __webpack_require__(/*! electron-log */ "./node_modules/electron-log/index.js");

const sqlite3 = __webpack_require__(/*! sqlite3 */ "sqlite3");

log.transports.file.level = 'info';
console.log(__dirname); // import electronReload from 'electron-reload'
// electronReload(__dirname)
// Let electron reload by itself when webpack watches changes in
// if (process.env.ELECTRON_START_URL_APP_MAIN || process.env.ELECTRON_START_URL_APP_1) {
//   require('electron-reload')(__dirname)
// }
// checking to see if native dep. serialport is working
// const SerialPort = require('serialport')
// SerialPort.list()
// .then(ports => {
//   console.log('PORTS AVAILABLE: ', ports);
// })
// .catch(err => {
//   if (err) throw err;
// });
// To avoid being garbage collected

let winMain;
let win1;
app.on('ready', () => {
  let winMain = new BrowserWindow({
    width: 800,
    height: 600
  }); // let win1 = new BrowserWindow({
  //     width: 700,
  //     height: 500
  // })

  const startUrlAppMain = process.env.ELECTRON_START_URL_APP_MAIN || url.format({
    pathname: path.join(__dirname, 'appMain/index.html'),
    protocol: 'file:',
    slashes: true
  });
  const startUrlApp1 = process.env.ELECTRON_START_URL_APP_1 || url.format({
    pathname: path.join(__dirname, 'app1/index.1.html'),
    protocol: 'file:',
    slashes: true
  }); // log.info('__dirname: ',__dirname)
  // log.info('process.env.ELECTRON_START_URL_APP_MAIN', process.env.ELECTRON_START_URL_APP_MAIN)
  // log.info('process.env.ELECTRON_START_URL_APP_1', process.env.ELECTRON_START_URL_APP_1)

  winMain.loadURL(startUrlAppMain); // win1.loadURL(startUrlApp1)

  const blahUrl = url.format({
    pathname: path.join(__dirname, 'index.main.html'),
    protocol: 'file',
    slashes: true
  });
  winMain.webContents.openDevTools(); // win1.webContents.openDevTools()

  winMain.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    winMain = null;
  });
}); // Quit when all windows are closed.

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (winMain === null) {
    createWindow();
  }
});

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "sqlite3":
/*!**************************!*\
  !*** external "sqlite3" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sqlite3");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL2xpYi9mb3JtYXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9saWIvbG9nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvbGliL29yaWdpbmFsLWNvbnNvbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9saWIvdHJhbnNwb3J0cy9jb25zb2xlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvbGliL3RyYW5zcG9ydHMvZmlsZS9maW5kLWxvZy1wYXRoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvbGliL3RyYW5zcG9ydHMvZmlsZS9nZXQtYXBwLW5hbWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9saWIvdHJhbnNwb3J0cy9maWxlL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvbGliL3RyYW5zcG9ydHMvbG9nLXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9saWIvdHJhbnNwb3J0cy9yZW5kZXJlci1jb25zb2xlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL3JlbmRlcmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluLXByb2Nlc3MvbWFpbi5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwib3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3FsaXRlM1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInVybFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInV0aWxcIiJdLCJuYW1lcyI6WyJwcm9jZXNzIiwidHlwZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1aXJlIiwidXRpbCIsIkVPTCIsImZvcm1hdCIsImZvcm1hdFRpbWVab25lIiwicGFkIiwic3RyaW5naWZ5QXJyYXkiLCJtc2ciLCJmb3JtYXR0ZXIiLCJkYXRlIiwicmVwbGFjZSIsImxldmVsIiwiZGF0YSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsImdldE1pbGxpc2Vjb25kcyIsImdldFRpbWV6b25lT2Zmc2V0IiwibWFwIiwiZm9ybWF0RXJyb3JzIiwiYXJnIiwiRXJyb3IiLCJzdGFjayIsImFwcGx5IiwibnVtYmVyIiwiemVyb3MiLCJBcnJheSIsImpvaW4iLCJzdWJzdHIiLCJtaW51dGVzT2Zmc2V0IiwibSIsIk1hdGgiLCJhYnMiLCJmbG9vciIsIkxFVkVMUyIsImxvZyIsInRyYW5zcG9ydHMiLCJ0ZXh0IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwiRGF0ZSIsImkiLCJoYXNPd25Qcm9wZXJ0eSIsInRyYW5zcG9ydCIsImNvbXBhcmVMZXZlbHMiLCJwYXNzTGV2ZWwiLCJjaGVja0xldmVsIiwicGFzcyIsImluZGV4T2YiLCJjaGVjayIsImNvbnRleHQiLCJjb25zb2xlIiwiZXJyb3IiLCJ3YXJuIiwiaW5mbyIsInZlcmJvc2UiLCJkZWJ1ZyIsInNpbGx5Iiwib3JpZ2luYWxDb25zb2xlIiwiZnMiLCJwYXRoIiwib3MiLCJnZXRBcHBOYW1lIiwiZmluZExvZ1BhdGgiLCJhcHBOYW1lIiwiaG9tZURpciIsImhvbWVkaXIiLCJlbnYiLCJkaXIiLCJwbGF0Zm9ybSIsInByZXBhcmVEaXIiLCJvciIsInJlc3VsdCIsImRpclBhdGgiLCJta0RpciIsImFjY2Vzc1N5bmMiLCJXX09LIiwiZSIsInJvb3QiLCJkaXJzIiwic3BsaXQiLCJzZXAiLCJzaGlmdCIsIm1rZGlyU3luYyIsInN0YXRTeW5jIiwiaXNEaXJlY3RvcnkiLCJsZW5ndGgiLCJjb25zb2xlVHJhbnNwb3J0IiwibmFtZSIsImxvYWRQYWNrYWdlTmFtZSIsIm1lc3NhZ2UiLCJwYWNrYWdlRmlsZSIsImZpbGVuYW1lIiwiZmluZCIsImRpcm5hbWUiLCJyZXNvdXJjZXNQYXRoIiwiZWxlY3Ryb25Nb2R1bGUiLCJjd2QiLCJjb250ZW50IiwicmVhZEZpbGVTeW5jIiwicGFja2FnZURhdGEiLCJKU09OIiwicGFyc2UiLCJwcm9kdWN0TmFtZSIsImZpbGUiLCJwYXJlbnQiLCJyZXNvbHZlIiwibWF4U2l6ZSIsInN0cmVhbUNvbmZpZyIsInVuZGVmaW5lZCIsInN0cmVhbSIsImluaXRTdGVhbUNvbmZpZyIsIm9wZW5TdHJlYW0iLCJuZWVkTG9nUm90YXRpb24iLCJnZXRTdHJlYW1TaXplIiwiYXJjaGl2ZUxvZyIsIndyaXRlIiwibG9nQ29uc29sZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiZmxhZ3MiLCJsb2dTaXplQXRTdGFydCIsInNpemUiLCJieXRlc1dyaXR0ZW4iLCJlbmQiLCJyZW5hbWVTeW5jIiwicHVzaCIsImh0dHAiLCJodHRwcyIsInVybCIsImNsaWVudCIsImRlcHRoIiwianNvbkRlcHRoIiwiZ2V0VGltZSIsInBvc3QiLCJzZXJ2ZXJVcmwiLCJ1cmxPYmplY3QiLCJwcm90b2NvbCIsImJvZHkiLCJzdHJpbmdpZnkiLCJvcHRpb25zIiwiaG9zdG5hbWUiLCJwb3J0IiwibWV0aG9kIiwiaGVhZGVycyIsInJlcXVlc3QiLCJqc29uIiwiaXNBcnJheSIsImNoaWxkIiwidG9KU09OIiwibmV3SnNvbiIsIkJyb3dzZXJXaW5kb3ciLCJnZXRBbGxXaW5kb3dzIiwiZm9yRWFjaCIsInduZCIsIndlYkNvbnRlbnRzIiwic2VuZCIsImVsZWN0cm9uIiwidHJhbnNwb3J0Q29uc29sZSIsInRyYW5zcG9ydEZpbGUiLCJ0cmFuc3BvcnRMb2dTIiwidHJhbnNwb3J0UmVuZGVyZXJDb25zb2xlIiwibG9nUyIsInJlbmRlcmVyQ29uc29sZSIsImJpbmQiLCJkZWZhdWx0IiwiaXBjTWFpbiIsIm9uIiwib25SZW5kZXJlckxvZyIsImFwcCIsImdldE5hbWUiLCJldmVudCIsInVuc2hpZnQiLCJpcGNSZW5kZXJlciIsIm9iaiIsInNxbGl0ZTMiLCJfX2Rpcm5hbWUiLCJ3aW5NYWluIiwid2luMSIsIndpZHRoIiwiaGVpZ2h0Iiwic3RhcnRVcmxBcHBNYWluIiwiRUxFQ1RST05fU1RBUlRfVVJMX0FQUF9NQUlOIiwicGF0aG5hbWUiLCJzbGFzaGVzIiwic3RhcnRVcmxBcHAxIiwiRUxFQ1RST05fU1RBUlRfVVJMX0FQUF8xIiwibG9hZFVSTCIsImJsYWhVcmwiLCJvcGVuRGV2VG9vbHMiLCJxdWl0IiwiY3JlYXRlV2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFB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QUNVLE9BQVIsQ0FBZ0JOLGVBQWhCLEVBekJrQixDQTBCbEI7O0FBRUEsUUFBTU8sT0FBTyxHQUFHM0QsR0FBRyxDQUFDbEksTUFBSixDQUFXO0FBQ3pCd0wsWUFBUSxFQUFFMUgsSUFBSSxDQUFDbkMsSUFBTCxDQUFVc0osU0FBVixFQUFxQixpQkFBckIsQ0FEZTtBQUV6QnZDLFlBQVEsRUFBRSxNQUZlO0FBR3pCK0MsV0FBTyxFQUFFO0FBSGdCLEdBQVgsQ0FBaEI7QUFNQVAsU0FBTyxDQUFDdEIsV0FBUixDQUFvQmtDLFlBQXBCLEdBbENrQixDQW1DbEI7O0FBRUFaLFNBQU8sQ0FBQ1YsRUFBUixDQUFXLFFBQVgsRUFBcUIsTUFBTTtBQUN2QjtBQUNBO0FBQ0E7QUFDQVUsV0FBTyxHQUFHLElBQVY7QUFDSCxHQUxEO0FBTUgsQ0EzQ0QsRSxDQTZDQTs7QUFDQVIsR0FBRyxDQUFDRixFQUFKLENBQU8sbUJBQVAsRUFBNEIsTUFBTTtBQUM5QjtBQUNBO0FBQ0EsTUFBSS9LLE9BQU8sQ0FBQzhFLFFBQVIsS0FBcUIsUUFBekIsRUFBbUM7QUFDL0JtRyxPQUFHLENBQUNxQixJQUFKO0FBQ0g7QUFDSixDQU5EO0FBUUFyQixHQUFHLENBQUNGLEVBQUosQ0FBTyxVQUFQLEVBQW1CLE1BQU07QUFDckI7QUFDQTtBQUNBLE1BQUlVLE9BQU8sS0FBSyxJQUFoQixFQUFzQjtBQUNsQmMsZ0JBQVk7QUFDZjtBQUNKLENBTkQsRTs7Ozs7Ozs7Ozs7QUN6RkEscUM7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsZ0M7Ozs7Ozs7Ozs7O0FDQUEsaUMiLCJmaWxlIjoiZGV2Lm1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYWluLXByb2Nlc3MvbWFpbi5qc1wiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vcmVuZGVyZXInKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9tYWluJyk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBFT0wgID0gcmVxdWlyZSgnb3MnKS5FT0w7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBmb3JtYXQ6IGZvcm1hdCxcbiAgZm9ybWF0VGltZVpvbmU6IGZvcm1hdFRpbWVab25lLFxuICBwYWQ6IHBhZCxcbiAgc3RyaW5naWZ5QXJyYXk6IHN0cmluZ2lmeUFycmF5XG59O1xuXG5mdW5jdGlvbiBmb3JtYXQobXNnLCBmb3JtYXR0ZXIpIHtcbiAgaWYgKHR5cGVvZiBmb3JtYXR0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZm9ybWF0dGVyKG1zZyk7XG4gIH1cblxuICB2YXIgZGF0ZSA9IG1zZy5kYXRlO1xuXG4gIHJldHVybiBmb3JtYXR0ZXJcbiAgICAucmVwbGFjZSgne2xldmVsfScsIG1zZy5sZXZlbClcbiAgICAucmVwbGFjZSgne3RleHR9Jywgc3RyaW5naWZ5QXJyYXkobXNnLmRhdGEpKVxuICAgIC5yZXBsYWNlKCd7eX0nLCBkYXRlLmdldEZ1bGxZZWFyKCkpXG4gICAgLnJlcGxhY2UoJ3ttfScsIHBhZChkYXRlLmdldE1vbnRoKCkgKyAxKSlcbiAgICAucmVwbGFjZSgne2R9JywgcGFkKGRhdGUuZ2V0RGF0ZSgpKSlcbiAgICAucmVwbGFjZSgne2h9JywgcGFkKGRhdGUuZ2V0SG91cnMoKSkpXG4gICAgLnJlcGxhY2UoJ3tpfScsIHBhZChkYXRlLmdldE1pbnV0ZXMoKSkpXG4gICAgLnJlcGxhY2UoJ3tzfScsIHBhZChkYXRlLmdldFNlY29uZHMoKSkpXG4gICAgLnJlcGxhY2UoJ3ttc30nLCBwYWQoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSwgMykpXG4gICAgLnJlcGxhY2UoJ3t6fScsIGZvcm1hdFRpbWVab25lKGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSkpO1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnlBcnJheShkYXRhKSB7XG4gIGRhdGEgPSBkYXRhLm1hcChmdW5jdGlvbiBmb3JtYXRFcnJvcnMoYXJnKSB7XG4gICAgcmV0dXJuIGFyZyBpbnN0YW5jZW9mIEVycm9yID8gYXJnLnN0YWNrICsgRU9MIDogYXJnO1xuICB9KTtcbiAgcmV0dXJuIHV0aWwuZm9ybWF0LmFwcGx5KHV0aWwsIGRhdGEpO1xufVxuXG5mdW5jdGlvbiBwYWQobnVtYmVyLCB6ZXJvcykge1xuICB6ZXJvcyA9IHplcm9zIHx8IDI7XG4gIHJldHVybiAobmV3IEFycmF5KHplcm9zICsgMSkuam9pbignMCcpICsgbnVtYmVyKS5zdWJzdHIoLXplcm9zLCB6ZXJvcyk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFRpbWVab25lKG1pbnV0ZXNPZmZzZXQpIHtcbiAgdmFyIG0gPSBNYXRoLmFicyhtaW51dGVzT2Zmc2V0KTtcbiAgcmV0dXJuIChtaW51dGVzT2Zmc2V0ID49IDAgPyAnLScgOiAnKycpICtcbiAgICBwYWQoTWF0aC5mbG9vcihtIC8gNjApKSArICc6JyArXG4gICAgcGFkKG0gJSA2MCk7XG59XG4iLCIvLyBqc2hpbnQgLVcwNDBcbid1c2Ugc3RyaWN0JztcblxudmFyIExFVkVMUyA9IFsnZXJyb3InLCAnd2FybicsICdpbmZvJywgJ3ZlcmJvc2UnLCAnZGVidWcnLCAnc2lsbHknXTtcblxubW9kdWxlLmV4cG9ydHMgPSBsb2c7XG5cbmZ1bmN0aW9uIGxvZyh0cmFuc3BvcnRzLCBsZXZlbCwgdGV4dCkge1xuICB2YXIgZGF0YSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG5cbiAgdmFyIG1zZyA9IHtcbiAgICBkYXRhOiBkYXRhLFxuICAgIGRhdGU6IG5ldyBEYXRlKCksXG4gICAgbGV2ZWw6IGxldmVsXG4gIH07XG5cbiAgZm9yICh2YXIgaSBpbiB0cmFuc3BvcnRzKSB7XG4gICAgLy8ganNoaW50IC1XMDg5XG4gICAgaWYgKCF0cmFuc3BvcnRzLmhhc093blByb3BlcnR5KGkpIHx8IHR5cGVvZiB0cmFuc3BvcnRzW2ldICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgdHJhbnNwb3J0ID0gdHJhbnNwb3J0c1tpXTtcblxuICAgIGlmICh0cmFuc3BvcnQgPT09IGZhbHNlIHx8ICFjb21wYXJlTGV2ZWxzKHRyYW5zcG9ydC5sZXZlbCwgbGV2ZWwpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodHJhbnNwb3J0LmxldmVsID09PSBmYWxzZSkgY29udGludWU7XG5cbiAgICB0cmFuc3BvcnQuY2FsbChudWxsLCBtc2cpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVMZXZlbHMocGFzc0xldmVsLCBjaGVja0xldmVsKSB7XG4gIHZhciBwYXNzID0gTEVWRUxTLmluZGV4T2YocGFzc0xldmVsKTtcbiAgdmFyIGNoZWNrID0gTEVWRUxTLmluZGV4T2YoY2hlY2tMZXZlbCk7XG4gIGlmIChjaGVjayA9PT0gLTEgfHwgcGFzcyA9PT0gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gY2hlY2sgPD0gcGFzcztcbn0iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU2F2ZSBjb25zb2xlIG1ldGhvZHMgZm9yIHVzaW5nIHdoZW4gb3JpZ2luYWxzIGFyZSBvdmVycmlkZGVuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb250ZXh0OiBjb25zb2xlLFxuICBlcnJvcjogICBjb25zb2xlLmVycm9yLFxuICB3YXJuOiAgICBjb25zb2xlLndhcm4sXG4gIGluZm86ICAgIGNvbnNvbGUuaW5mbyxcbiAgdmVyYm9zZTogY29uc29sZS52ZXJib3NlLFxuICBkZWJ1ZzogICBjb25zb2xlLmRlYnVnLFxuICBzaWxseTogICBjb25zb2xlLnNpbGx5LFxuICBsb2c6ICAgICBjb25zb2xlLmxvZ1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZvcm1hdCAgICAgICAgICA9IHJlcXVpcmUoJy4uL2Zvcm1hdCcpO1xudmFyIG9yaWdpbmFsQ29uc29sZSA9IHJlcXVpcmUoJy4uL29yaWdpbmFsLWNvbnNvbGUnKTtcblxudHJhbnNwb3J0LmxldmVsICA9ICdzaWxseSc7XG50cmFuc3BvcnQuZm9ybWF0ID0gJ1t7aH06e2l9OntzfS57bXN9XSBbe2xldmVsfV0ge3RleHR9JztcblxubW9kdWxlLmV4cG9ydHMgPSB0cmFuc3BvcnQ7XG5cbmZ1bmN0aW9uIHRyYW5zcG9ydChtc2cpIHtcbiAgdmFyIHRleHQgPSBmb3JtYXQuZm9ybWF0KG1zZywgdHJhbnNwb3J0LmZvcm1hdCk7XG4gIGlmIChvcmlnaW5hbENvbnNvbGVbbXNnLmxldmVsXSkge1xuICAgIG9yaWdpbmFsQ29uc29sZVttc2cubGV2ZWxdKHRleHQpO1xuICB9IGVsc2Uge1xuICAgIG9yaWdpbmFsQ29uc29sZS5sb2codGV4dCk7XG4gIH1cbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZnMgICA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBvcyAgID0gcmVxdWlyZSgnb3MnKTtcbnZhciBnZXRBcHBOYW1lID0gcmVxdWlyZSgnLi9nZXQtYXBwLW5hbWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kTG9nUGF0aDtcblxuLyoqXG4gKiBUcnkgdG8gZGV0ZXJtaW5lIGEgcGxhdGZvcm0tc3BlY2lmaWMgcGF0aCB3aGVyZSBjYW4gd3JpdGUgbG9nc1xuICogQHBhcmFtIHtzdHJpbmd9IFthcHBOYW1lXSBVc2VkIHRvIGRldGVybWluZSB0aGUgbGFzdCBwYXJ0IG9mIGEgbG9nIHBhdGhcbiAqIEByZXR1cm4ge3N0cmluZ3xib29sZWFufVxuICovXG5mdW5jdGlvbiBmaW5kTG9nUGF0aChhcHBOYW1lKSB7XG4gIGFwcE5hbWUgPSBhcHBOYW1lIHx8IGdldEFwcE5hbWUoKTtcbiAgaWYgKCFhcHBOYW1lKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGhvbWVEaXIgPSBvcy5ob21lZGlyID8gb3MuaG9tZWRpcigpIDogcHJvY2Vzcy5lbnZbJ0hPTUUnXTtcbiAgXG4gIHZhciBkaXI7XG4gIHN3aXRjaCAocHJvY2Vzcy5wbGF0Zm9ybSkge1xuICAgIGNhc2UgJ2xpbnV4Jzoge1xuICAgICAgZGlyID0gcHJlcGFyZURpcihwcm9jZXNzLmVudlsnWERHX0NPTkZJR19IT01FJ10sIGFwcE5hbWUpXG4gICAgICAgIC5vcihob21lRGlyLCAnLmNvbmZpZycsIGFwcE5hbWUpXG4gICAgICAgIC5vcihwcm9jZXNzLmVudlsnWERHX0RBVEFfSE9NRSddLCBhcHBOYW1lKVxuICAgICAgICAub3IoaG9tZURpciwgJy5sb2NhbCcsICdzaGFyZScsIGFwcE5hbWUpXG4gICAgICAgIC5yZXN1bHQ7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjYXNlICdkYXJ3aW4nOiB7XG4gICAgICBkaXIgPSBwcmVwYXJlRGlyKGhvbWVEaXIsICdMaWJyYXJ5JywgJ0xvZ3MnLCBhcHBOYW1lKVxuICAgICAgICAub3IoaG9tZURpciwgJ0xpYnJhcnknLCAnQXBwbGljYXRpb24gU3VwcG9ydCcsIGFwcE5hbWUpXG4gICAgICAgIC5yZXN1bHQ7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjYXNlICd3aW4zMic6IHtcbiAgICAgIGRpciA9IHByZXBhcmVEaXIocHJvY2Vzcy5lbnZbJ0FQUERBVEEnXSwgYXBwTmFtZSlcbiAgICAgICAgLm9yKGhvbWVEaXIsICdBcHBEYXRhJywgJ1JvYW1pbmcnLCBhcHBOYW1lKVxuICAgICAgICAucmVzdWx0O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIHJldHVybiBwYXRoLmpvaW4oZGlyLCAnbG9nLmxvZycpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5cblxuZnVuY3Rpb24gcHJlcGFyZURpcihkaXJQYXRoKSB7XG4gIC8vIGpzaGludCAtVzA0MFxuICBpZiAoIXRoaXMgfHwgdGhpcy5vciAhPT0gcHJlcGFyZURpciB8fCAhdGhpcy5yZXN1bHQpIHtcbiAgICBpZiAoIWRpclBhdGgpIHtcbiAgICAgIHJldHVybiB7IG9yOiBwcmVwYXJlRGlyIH07XG4gICAgfVxuXG4gICAgLy9ub2luc3BlY3Rpb24gSlNDaGVja0Z1bmN0aW9uU2lnbmF0dXJlc1xuICAgIGRpclBhdGggPSBwYXRoLmpvaW4uYXBwbHkocGF0aCwgYXJndW1lbnRzKTtcbiAgICBta0RpcihkaXJQYXRoKTtcblxuICAgIHRyeSB7XG4gICAgICBmcy5hY2Nlc3NTeW5jKGRpclBhdGgsIGZzLldfT0spO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB7IG9yOiBwcmVwYXJlRGlyIH07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBvcjogcHJlcGFyZURpcixcbiAgICByZXN1bHQ6ICh0aGlzID8gdGhpcy5yZXN1bHQgOiBmYWxzZSkgfHwgZGlyUGF0aFxuICB9O1xufVxuXG5mdW5jdGlvbiBta0RpcihkaXJQYXRoLCByb290KSB7XG4gIHZhciBkaXJzID0gZGlyUGF0aC5zcGxpdChwYXRoLnNlcCk7XG4gIHZhciBkaXIgPSBkaXJzLnNoaWZ0KCk7XG4gIHJvb3QgPSAocm9vdCB8fCAnJykgKyBkaXIgKyBwYXRoLnNlcDtcblxuICB0cnkge1xuICAgIGZzLm1rZGlyU3luYyhyb290KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmICghZnMuc3RhdFN5bmMocm9vdCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAhZGlycy5sZW5ndGggfHwgbWtEaXIoZGlycy5qb2luKHBhdGguc2VwKSwgcm9vdCk7XG59XG4iLCIvLyBqc2hpbnQgLVcwNzRcbid1c2Ugc3RyaWN0JztcblxuLyoqIEBuYW1lIHByb2Nlc3MucmVzb3VyY2VzUGF0aCAqL1xuXG52YXIgZnMgICA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBjb25zb2xlVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi4vY29uc29sZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEFwcE5hbWU7XG5cbmZ1bmN0aW9uIGdldEFwcE5hbWUoKSB7XG4gIHRyeSB7XG4gICAgdmFyIG5hbWUgPSBsb2FkUGFja2FnZU5hbWUoKTtcbiAgICBpZiAobmFtZSkge1xuICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuICAgIHJldHVybiB3YXJuKCdlbGVjdHJvbi1sb2c6IHVuYWJsZSB0byBsb2FkIHRoZSBhcHAgbmFtZSBmcm9tIHBhY2thZ2UuanNvbicpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHdhcm4oJ2VsZWN0cm9uLWxvZzogJyArIGUubWVzc2FnZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBUcnkgdG8gbG9hZCBtYWluIGFwcCBwYWNrYWdlXG4gKiBAdGhyb3dzIHtFcnJvcn1cbiAqIEByZXR1cm4ge09iamVjdHxudWxsfVxuICovXG5mdW5jdGlvbiBsb2FkUGFja2FnZU5hbWUoKSB7XG4gIHZhciBwYWNrYWdlRmlsZTtcblxuICB0cnkge1xuICAgIGlmIChyZXF1aXJlLm1haW4uZmlsZW5hbWUpIHtcbiAgICAgIHBhY2thZ2VGaWxlID0gZmluZChwYXRoLmRpcm5hbWUocmVxdWlyZS5tYWluLmZpbGVuYW1lKSk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7fVxuXG4gIGlmICghcGFja2FnZUZpbGUgJiYgcHJvY2Vzcy5yZXNvdXJjZXNQYXRoKSB7XG4gICAgcGFja2FnZUZpbGUgPSBmaW5kKHBhdGguam9pbihwcm9jZXNzLnJlc291cmNlc1BhdGgsICdhcHAuYXNhcicpKTtcbiAgICB2YXIgZWxlY3Ryb25Nb2R1bGUgPSBwYXRoLmpvaW4oJ25vZGVfbW9kdWxlcycsICdlbGVjdHJvbicsICdwYWNrYWdlLmpzb24nKTtcbiAgICBpZiAocGFja2FnZUZpbGUgJiYgcGFja2FnZUZpbGUuaW5kZXhPZihlbGVjdHJvbk1vZHVsZSkgIT09IC0xKSB7XG4gICAgICBwYWNrYWdlRmlsZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFwYWNrYWdlRmlsZSkge1xuICAgIHBhY2thZ2VGaWxlID0gZmluZChwcm9jZXNzLmN3ZCgpKTtcbiAgfVxuXG4gIGlmICghcGFja2FnZUZpbGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHBhY2thZ2VGaWxlLCAndXRmLTgnKTtcbiAgdmFyIHBhY2thZ2VEYXRhID0gSlNPTi5wYXJzZShjb250ZW50KTtcblxuICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICByZXR1cm4gcGFja2FnZURhdGEgPyBwYWNrYWdlRGF0YS5wcm9kdWN0TmFtZSB8fCBwYWNrYWdlRGF0YS5uYW1lIDogZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGZpbmQocm9vdCkge1xuICB2YXIgZmlsZTtcblxuICB3aGlsZSAoIWZpbGUpIHtcbiAgICB2YXIgcGFyZW50O1xuICAgIGZpbGUgPSBwYXRoLmpvaW4ocm9vdCwgJ3BhY2thZ2UuanNvbicpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZzLnN0YXRTeW5jKGZpbGUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHBhcmVudCA9IHBhdGgucmVzb2x2ZShyb290LCAnLi4nKTtcbiAgICAgIGZpbGUgPSBudWxsO1xuICAgIH1cblxuICAgIGlmIChyb290ID09PSBwYXJlbnQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJvb3QgPSBwYXJlbnQ7XG4gIH1cblxuICByZXR1cm4gZmlsZTtcbn1cblxuZnVuY3Rpb24gd2FybihtZXNzYWdlKSB7XG4gIGNvbnNvbGVUcmFuc3BvcnQoe1xuICAgIGRhdGE6IFttZXNzYWdlXSxcbiAgICBkYXRlOiBuZXcgRGF0ZSgpLFxuICAgIGxldmVsOiAnd2FybidcbiAgfSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZnMgICAgICAgICAgICAgICA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgRU9MICAgICAgICAgICAgICA9IHJlcXVpcmUoJ29zJykuRU9MO1xudmFyIGZvcm1hdCAgICAgICAgICAgPSByZXF1aXJlKCcuLi8uLi9mb3JtYXQnKTtcbnZhciBjb25zb2xlVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi4vY29uc29sZScpO1xudmFyIGZpbmRMb2dQYXRoICAgICAgPSByZXF1aXJlKCcuL2ZpbmQtbG9nLXBhdGgnKTtcblxudHJhbnNwb3J0LmZpbmRMb2dQYXRoICA9IGZpbmRMb2dQYXRoO1xudHJhbnNwb3J0LmZvcm1hdCAgICAgICA9ICdbe3l9LXttfS17ZH0ge2h9OntpfTp7c30ue21zfV0gW3tsZXZlbH1dIHt0ZXh0fSc7XG50cmFuc3BvcnQubGV2ZWwgICAgICAgID0gJ3dhcm4nO1xudHJhbnNwb3J0Lm1heFNpemUgICAgICA9IDEwMjQgKiAxMDI0O1xudHJhbnNwb3J0LnN0cmVhbUNvbmZpZyA9IHVuZGVmaW5lZDtcblxubW9kdWxlLmV4cG9ydHMgPSB0cmFuc3BvcnQ7XG5cbmZ1bmN0aW9uIHRyYW5zcG9ydChtc2cpIHtcbiAgdmFyIHRleHQgPSBmb3JtYXQuZm9ybWF0KG1zZywgdHJhbnNwb3J0LmZvcm1hdCkgKyBFT0w7XG5cbiAgaWYgKHRyYW5zcG9ydC5zdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgIGluaXRTdGVhbUNvbmZpZygpO1xuICAgIG9wZW5TdHJlYW0oKTtcbiAgfVxuXG4gIGlmICh0cmFuc3BvcnQubGV2ZWwgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG5lZWRMb2dSb3RhdGlvbiA9IHRyYW5zcG9ydC5tYXhTaXplID4gMCAmJlxuICAgIGdldFN0cmVhbVNpemUodHJhbnNwb3J0LnN0cmVhbSkgPiB0cmFuc3BvcnQubWF4U2l6ZTtcblxuICBpZiAobmVlZExvZ1JvdGF0aW9uKSB7XG4gICAgYXJjaGl2ZUxvZyh0cmFuc3BvcnQuc3RyZWFtKTtcbiAgICBvcGVuU3RyZWFtKCk7XG4gIH1cblxuICB0cmFuc3BvcnQuc3RyZWFtLndyaXRlKHRleHQpO1xufVxuXG5mdW5jdGlvbiBpbml0U3RlYW1Db25maWcoKSB7XG4gIHRyYW5zcG9ydC5maWxlID0gdHJhbnNwb3J0LmZpbGUgfHwgZmluZExvZ1BhdGgodHJhbnNwb3J0LmFwcE5hbWUpO1xuXG4gIGlmICghdHJhbnNwb3J0LmZpbGUpIHtcbiAgICB0cmFuc3BvcnQubGV2ZWwgPSBmYWxzZTtcbiAgICBsb2dDb25zb2xlKCdDb3VsZCBub3Qgc2V0IGEgbG9nIGZpbGUnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvcGVuU3RyZWFtKCkge1xuICBpZiAodHJhbnNwb3J0LmxldmVsID09PSBmYWxzZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRyYW5zcG9ydC5zdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShcbiAgICB0cmFuc3BvcnQuZmlsZSxcbiAgICB0cmFuc3BvcnQuc3RyZWFtQ29uZmlnIHx8IHsgZmxhZ3M6ICdhJyB9XG4gICk7XG59XG5cbmZ1bmN0aW9uIGdldFN0cmVhbVNpemUoc3RyZWFtKSB7XG4gIGlmICghc3RyZWFtKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoc3RyZWFtLmxvZ1NpemVBdFN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0cnkge1xuICAgICAgc3RyZWFtLmxvZ1NpemVBdFN0YXJ0ID0gZnMuc3RhdFN5bmMoc3RyZWFtLnBhdGgpLnNpemU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc3RyZWFtLmxvZ1NpemVBdFN0YXJ0ID0gMDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RyZWFtLmxvZ1NpemVBdFN0YXJ0ICsgc3RyZWFtLmJ5dGVzV3JpdHRlbjtcbn1cblxuZnVuY3Rpb24gYXJjaGl2ZUxvZyhzdHJlYW0pIHtcbiAgaWYgKHN0cmVhbS5lbmQpIHtcbiAgICBzdHJlYW0uZW5kKCk7XG4gIH1cblxuICB0cnkge1xuICAgIGZzLnJlbmFtZVN5bmMoc3RyZWFtLnBhdGgsIHN0cmVhbS5wYXRoLnJlcGxhY2UoL2xvZyQvLCAnb2xkLmxvZycpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGxvZ0NvbnNvbGUoJ0NvdWxkIG5vdCByb3RhdGUgbG9nJywgZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbG9nQ29uc29sZShtZXNzYWdlLCBlcnJvcikge1xuICB2YXIgZGF0YSA9IFsnZWxlY3Ryb24tbG9nLnRyYW5zcG9ydHMuZmlsZTogJyArIG1lc3NhZ2VdO1xuXG4gIGlmIChlcnJvcikge1xuICAgIGRhdGEucHVzaChlcnJvcik7XG4gIH1cblxuICBjb25zb2xlVHJhbnNwb3J0KHsgZGF0YTogZGF0YSwgZGF0ZTogbmV3IERhdGUoKSwgbGV2ZWw6ICd3YXJuJyB9KTtcbn1cbiIsIi8vIGpzaGludCAtVzA3NCwgLVcwODlcbid1c2Ugc3RyaWN0JztcblxudmFyIGh0dHAgID0gcmVxdWlyZSgnaHR0cCcpO1xudmFyIGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbnZhciB1cmwgICA9IHJlcXVpcmUoJ3VybCcpO1xuXG50cmFuc3BvcnQuY2xpZW50ID0geyBuYW1lOiAnZWxlY3Ryb24tYXBwbGljYXRpb24nIH07XG50cmFuc3BvcnQuZGVwdGggID0gNjtcbnRyYW5zcG9ydC5sZXZlbCAgPSBmYWxzZTtcbnRyYW5zcG9ydC51cmwgICAgPSBudWxsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRyYW5zcG9ydDtcblxuZnVuY3Rpb24gdHJhbnNwb3J0KG1zZykge1xuICBpZiAoIXRyYW5zcG9ydC51cmwpIHJldHVybjtcblxuICB2YXIgZGF0YSA9IGpzb25EZXB0aCh7XG4gICAgY2xpZW50OiB0cmFuc3BvcnQuY2xpZW50LFxuICAgIGRhdGE6IG1zZy5kYXRhLFxuICAgIGRhdGU6IG1zZy5kYXRlLmdldFRpbWUoKSxcbiAgICBsZXZlbDogbXNnLmxldmVsXG4gIH0sIHRyYW5zcG9ydC5kZXB0aCArIDEpO1xuXG4gIHBvc3QodHJhbnNwb3J0LnVybCwgZGF0YSk7XG59XG5cbmZ1bmN0aW9uIHBvc3Qoc2VydmVyVXJsLCBkYXRhKSB7XG4gIHZhciB1cmxPYmplY3QgPSB1cmwucGFyc2Uoc2VydmVyVXJsKTtcbiAgdmFyIHRyYW5zcG9ydCA9IHVybE9iamVjdC5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyBodHRwcyA6IGh0dHA7XG5cbiAgdmFyIGJvZHkgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcblxuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBob3N0bmFtZTogdXJsT2JqZWN0Lmhvc3RuYW1lLFxuICAgIHBvcnQ6ICAgICB1cmxPYmplY3QucG9ydCxcbiAgICBwYXRoOiAgICAgdXJsT2JqZWN0LnBhdGgsXG4gICAgbWV0aG9kOiAgICdQT1NUJyxcbiAgICBoZWFkZXJzOiAge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAnQ29udGVudC1MZW5ndGgnOiBib2R5Lmxlbmd0aFxuICAgIH1cbiAgfTtcblxuICB2YXIgcmVxdWVzdCA9IHRyYW5zcG9ydC5yZXF1ZXN0KG9wdGlvbnMpO1xuICByZXF1ZXN0LndyaXRlKGJvZHkpO1xuICByZXF1ZXN0LmVuZCgpO1xufVxuXG5mdW5jdGlvbiBqc29uRGVwdGgoanNvbiwgZGVwdGgpIHtcbiAgaWYgKGRlcHRoIDwgMSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGpzb24pKSAgcmV0dXJuICdbYXJyYXldJztcbiAgICBpZiAodHlwZW9mIGpzb24gPT09ICdvYmplY3QnKSAgcmV0dXJuICdbb2JqZWN0XSc7XG4gICAgcmV0dXJuIGpzb247XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShqc29uKSkge1xuICAgIHJldHVybiBqc29uLm1hcChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgcmV0dXJuIGpzb25EZXB0aChjaGlsZCwgZGVwdGggLSAxKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChqc29uICYmIHR5cGVvZiBqc29uLmdldE1vbnRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGpzb247XG4gIH1cblxuICBpZiAoanNvbiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBqc29uID09PSAnb2JqZWN0Jykge1xuICAgIGlmICh0eXBlb2YganNvbi50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGpzb24gPSBqc29uLnRvSlNPTigpO1xuICAgIH1cblxuICAgIHZhciBuZXdKc29uID0ge307XG4gICAgZm9yICh2YXIgaSBpbiBqc29uKSB7XG4gICAgICAvL25vaW5zcGVjdGlvbiBKU1VuZmlsdGVyZWRGb3JJbkxvb3BcbiAgICAgIG5ld0pzb25baV0gPSBqc29uRGVwdGgoanNvbltpXSwgZGVwdGggLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3SnNvbjtcbiAgfVxuXG4gIHJldHVybiBqc29uO1xufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIEJyb3dzZXJXaW5kb3c7XG50cnkge1xuICBCcm93c2VyV2luZG93ID0gcmVxdWlyZSgnZWxlY3Ryb24nKS5Ccm93c2VyV2luZG93O1xufSBjYXRjaCAoZSkge1xuICBCcm93c2VyV2luZG93ID0gbnVsbDtcbn1cblxudmFyIGZvcm1hdCA9IHJlcXVpcmUoJy4uL2Zvcm1hdCcpO1xuXG50cmFuc3BvcnQubGV2ZWwgID0gQnJvd3NlcldpbmRvdyA/ICdzaWxseScgOiBmYWxzZTtcbnRyYW5zcG9ydC5mb3JtYXQgPSAnW3tofTp7aX06e3N9Lnttc31dIHt0ZXh0fSc7XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhbnNwb3J0O1xuXG5mdW5jdGlvbiB0cmFuc3BvcnQobXNnKSB7XG4gIGlmICghQnJvd3NlcldpbmRvdykgcmV0dXJuO1xuXG4gIHZhciB0ZXh0ID0gZm9ybWF0LmZvcm1hdChtc2csIHRyYW5zcG9ydC5mb3JtYXQpO1xuICBCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5mb3JFYWNoKGZ1bmN0aW9uKHduZCkge1xuICAgIHduZC53ZWJDb250ZW50cy5zZW5kKCdfX0VMRUNUUk9OX0xPR19SRU5ERVJFUl9fJywgbXNnLmxldmVsLCB0ZXh0KTtcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlbGVjdHJvbjtcbnRyeSB7XG4gIGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKTtcbn0gY2F0Y2ggKGUpIHtcbiAgZWxlY3Ryb24gPSBudWxsO1xufVxuXG52YXIgbG9nICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9saWIvbG9nJyk7XG52YXIgdHJhbnNwb3J0Q29uc29sZSAgICAgICAgID0gcmVxdWlyZSgnLi9saWIvdHJhbnNwb3J0cy9jb25zb2xlJyk7XG52YXIgdHJhbnNwb3J0RmlsZSAgICAgICAgICAgID0gcmVxdWlyZSgnLi9saWIvdHJhbnNwb3J0cy9maWxlJyk7XG52YXIgdHJhbnNwb3J0TG9nUyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9saWIvdHJhbnNwb3J0cy9sb2ctcycpO1xudmFyIHRyYW5zcG9ydFJlbmRlcmVyQ29uc29sZSA9IHJlcXVpcmUoJy4vbGliL3RyYW5zcG9ydHMvcmVuZGVyZXItY29uc29sZScpO1xuXG52YXIgdHJhbnNwb3J0cyA9IHtcbiAgY29uc29sZTogdHJhbnNwb3J0Q29uc29sZSxcbiAgZmlsZTogdHJhbnNwb3J0RmlsZSxcbiAgbG9nUzogdHJhbnNwb3J0TG9nUyxcbiAgcmVuZGVyZXJDb25zb2xlOiB0cmFuc3BvcnRSZW5kZXJlckNvbnNvbGVcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB0cmFuc3BvcnRzOiB0cmFuc3BvcnRzLFxuXG4gIGVycm9yOiAgIGxvZy5iaW5kKG51bGwsIHRyYW5zcG9ydHMsICdlcnJvcicpLFxuICB3YXJuOiAgICBsb2cuYmluZChudWxsLCB0cmFuc3BvcnRzLCAnd2FybicpLFxuICBpbmZvOiAgICBsb2cuYmluZChudWxsLCB0cmFuc3BvcnRzLCAnaW5mbycpLFxuICB2ZXJib3NlOiBsb2cuYmluZChudWxsLCB0cmFuc3BvcnRzLCAndmVyYm9zZScpLFxuICBkZWJ1ZzogICBsb2cuYmluZChudWxsLCB0cmFuc3BvcnRzLCAnZGVidWcnKSxcbiAgc2lsbHk6ICAgbG9nLmJpbmQobnVsbCwgdHJhbnNwb3J0cywgJ3NpbGx5JyksXG4gIGxvZzogICAgIGxvZy5iaW5kKG51bGwsIHRyYW5zcG9ydHMsICdpbmZvJylcbn07XG5cbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBtb2R1bGUuZXhwb3J0cztcblxuaWYgKGVsZWN0cm9uICYmIGVsZWN0cm9uLmlwY01haW4pIHtcbiAgZWxlY3Ryb24uaXBjTWFpbi5vbignX19FTEVDVFJPTl9MT0dfXycsIG9uUmVuZGVyZXJMb2cpO1xuICB2YXIgYXBwTmFtZSA9IGVsZWN0cm9uLmFwcC5nZXROYW1lKCk7XG4gIGlmIChhcHBOYW1lICE9PSAnRWxlY3Ryb24nKSB7XG4gICAgdHJhbnNwb3J0RmlsZS5hcHBOYW1lID0gYXBwTmFtZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvblJlbmRlcmVyTG9nKGV2ZW50LCBkYXRhKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgZGF0YS51bnNoaWZ0KHRyYW5zcG9ydHMpO1xuICAgIGxvZy5hcHBseShudWxsLCBkYXRhKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG51bGw7XG5cbnZhciBpcGNSZW5kZXJlcjtcbnRyeSB7XG4gIGlwY1JlbmRlcmVyID0gcmVxdWlyZSgnZWxlY3Ryb24nKS5pcGNSZW5kZXJlcjtcbn0gY2F0Y2ggKGUpIHtcbiAgaXBjUmVuZGVyZXIgPSBudWxsO1xufVxuXG52YXIgb3JpZ2luYWxDb25zb2xlID0gcmVxdWlyZSgnLi9saWIvb3JpZ2luYWwtY29uc29sZScpO1xuXG5pZiAoaXBjUmVuZGVyZXIpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZXJyb3I6ICAgbG9nLmJpbmQobnVsbCwgJ2Vycm9yJyksXG4gICAgd2FybjogICAgbG9nLmJpbmQobnVsbCwgJ3dhcm4nKSxcbiAgICBpbmZvOiAgICBsb2cuYmluZChudWxsLCAnaW5mbycpLFxuICAgIHZlcmJvc2U6IGxvZy5iaW5kKG51bGwsICd2ZXJib3NlJyksXG4gICAgZGVidWc6ICAgbG9nLmJpbmQobnVsbCwgJ2RlYnVnJyksXG4gICAgc2lsbHk6ICAgbG9nLmJpbmQobnVsbCwgJ3NpbGx5JyksXG4gICAgbG9nOiAgICAgbG9nLmJpbmQobnVsbCwgJ2luZm8nKVxuICB9O1xuXG4gIG1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBtb2R1bGUuZXhwb3J0cztcblxuICBpcGNSZW5kZXJlci5vbignX19FTEVDVFJPTl9MT0dfUkVOREVSRVJfXycsIGZ1bmN0aW9uKGV2ZW50LCBsZXZlbCwgZGF0YSkge1xuICAgIGlmIChsZXZlbCA9PT0gJ3ZlcmJvc2UnKSB7XG4gICAgICBsZXZlbCA9ICdsb2cnO1xuICAgIH0gZWxzZSBpZiAobGV2ZWwgPT09ICdzaWxseScpIHtcbiAgICAgIGxldmVsID0gJ2RlYnVnJztcbiAgICB9XG5cbiAgICBvcmlnaW5hbENvbnNvbGVbbGV2ZWxdLmFwcGx5KFxuICAgICAgb3JpZ2luYWxDb25zb2xlLmNvbnRleHQsXG4gICAgICB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgPyBbZGF0YV0gOiBkYXRhXG4gICAgKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgdmFyIGRhdGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gIGRhdGEgPSBkYXRhLm1hcChmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIG9iaiA9IG9iai5zdGFjayB8fCBvYmo7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfSk7XG5cbiAgaXBjUmVuZGVyZXIuc2VuZCgnX19FTEVDVFJPTl9MT0dfXycsIGRhdGEpO1xufVxuIiwiLy8gaW1wb3J0IHsgYXBwLCBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nXG4vLyBpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuLy8gaW1wb3J0IHVybCBmcm9tICd1cmwnXG4vLyBpbXBvcnQgbG9nIGZyb20gJ2VsZWN0cm9uLWxvZydcblxuY29uc3QgeyBhcHAsIEJyb3dzZXJXaW5kb3cgfSA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IHVybCA9IHJlcXVpcmUoJ3VybCcpXG5jb25zdCBsb2cgPSByZXF1aXJlKCdlbGVjdHJvbi1sb2cnKVxuY29uc3Qgc3FsaXRlMyA9IHJlcXVpcmUoJ3NxbGl0ZTMnKVxubG9nLnRyYW5zcG9ydHMuZmlsZS5sZXZlbCA9ICdpbmZvJ1xuXG5jb25zb2xlLmxvZyhfX2Rpcm5hbWUpXG5cbi8vIGltcG9ydCBlbGVjdHJvblJlbG9hZCBmcm9tICdlbGVjdHJvbi1yZWxvYWQnXG4vLyBlbGVjdHJvblJlbG9hZChfX2Rpcm5hbWUpXG4vLyBMZXQgZWxlY3Ryb24gcmVsb2FkIGJ5IGl0c2VsZiB3aGVuIHdlYnBhY2sgd2F0Y2hlcyBjaGFuZ2VzIGluXG4vLyBpZiAocHJvY2Vzcy5lbnYuRUxFQ1RST05fU1RBUlRfVVJMX0FQUF9NQUlOIHx8IHByb2Nlc3MuZW52LkVMRUNUUk9OX1NUQVJUX1VSTF9BUFBfMSkge1xuLy8gICByZXF1aXJlKCdlbGVjdHJvbi1yZWxvYWQnKShfX2Rpcm5hbWUpXG4vLyB9XG5cbi8vIGNoZWNraW5nIHRvIHNlZSBpZiBuYXRpdmUgZGVwLiBzZXJpYWxwb3J0IGlzIHdvcmtpbmdcbi8vIGNvbnN0IFNlcmlhbFBvcnQgPSByZXF1aXJlKCdzZXJpYWxwb3J0Jylcbi8vIFNlcmlhbFBvcnQubGlzdCgpXG4vLyAudGhlbihwb3J0cyA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKCdQT1JUUyBBVkFJTEFCTEU6ICcsIHBvcnRzKTtcbi8vIH0pXG4vLyAuY2F0Y2goZXJyID0+IHtcbi8vICAgaWYgKGVycikgdGhyb3cgZXJyO1xuLy8gfSk7XG5cbi8vIFRvIGF2b2lkIGJlaW5nIGdhcmJhZ2UgY29sbGVjdGVkXG5sZXQgd2luTWFpblxubGV0IHdpbjFcblxuYXBwLm9uKCdyZWFkeScsICgpID0+IHtcblxuICAgIGxldCB3aW5NYWluID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgICAgICB3aWR0aDogODAwLFxuICAgICAgICBoZWlnaHQ6IDYwMFxuICAgIH0pXG4gICAgLy8gbGV0IHdpbjEgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgLy8gICAgIHdpZHRoOiA3MDAsXG4gICAgLy8gICAgIGhlaWdodDogNTAwXG4gICAgLy8gfSlcblxuICAgIGNvbnN0IHN0YXJ0VXJsQXBwTWFpbiA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX1NUQVJUX1VSTF9BUFBfTUFJTiB8fCB1cmwuZm9ybWF0KHtcbiAgICAgICAgICBwYXRobmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2FwcE1haW4vaW5kZXguaHRtbCcpLFxuICAgICAgICAgIHByb3RvY29sOiAnZmlsZTonLFxuICAgICAgICAgIHNsYXNoZXM6IHRydWVcbiAgICB9KTtcbiAgICBjb25zdCBzdGFydFVybEFwcDEgPSBwcm9jZXNzLmVudi5FTEVDVFJPTl9TVEFSVF9VUkxfQVBQXzEgfHwgdXJsLmZvcm1hdCh7XG4gICAgICAgICAgcGF0aG5hbWU6IHBhdGguam9pbihfX2Rpcm5hbWUsICdhcHAxL2luZGV4LjEuaHRtbCcpLFxuICAgICAgICAgIHByb3RvY29sOiAnZmlsZTonLFxuICAgICAgICAgIHNsYXNoZXM6IHRydWVcbiAgICB9KTtcbiAgICAvLyBsb2cuaW5mbygnX19kaXJuYW1lOiAnLF9fZGlybmFtZSlcbiAgICAvLyBsb2cuaW5mbygncHJvY2Vzcy5lbnYuRUxFQ1RST05fU1RBUlRfVVJMX0FQUF9NQUlOJywgcHJvY2Vzcy5lbnYuRUxFQ1RST05fU1RBUlRfVVJMX0FQUF9NQUlOKVxuICAgIC8vIGxvZy5pbmZvKCdwcm9jZXNzLmVudi5FTEVDVFJPTl9TVEFSVF9VUkxfQVBQXzEnLCBwcm9jZXNzLmVudi5FTEVDVFJPTl9TVEFSVF9VUkxfQVBQXzEpXG5cbiAgICB3aW5NYWluLmxvYWRVUkwoc3RhcnRVcmxBcHBNYWluKVxuICAgIC8vIHdpbjEubG9hZFVSTChzdGFydFVybEFwcDEpXG5cbiAgICBjb25zdCBibGFoVXJsID0gdXJsLmZvcm1hdCh7XG4gICAgICBwYXRobmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2luZGV4Lm1haW4uaHRtbCcpLFxuICAgICAgcHJvdG9jb2w6ICdmaWxlJyxcbiAgICAgIHNsYXNoZXM6IHRydWVcbiAgICB9KVxuXG4gICAgd2luTWFpbi53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKVxuICAgIC8vIHdpbjEud2ViQ29udGVudHMub3BlbkRldlRvb2xzKClcblxuICAgIHdpbk1haW4ub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAgICAgLy8gRGVyZWZlcmVuY2UgdGhlIHdpbmRvdyBvYmplY3QsIHVzdWFsbHkgeW91IHdvdWxkIHN0b3JlIHdpbmRvd3NcbiAgICAgICAgLy8gaW4gYW4gYXJyYXkgaWYgeW91ciBhcHAgc3VwcG9ydHMgbXVsdGkgd2luZG93cywgdGhpcyBpcyB0aGUgdGltZVxuICAgICAgICAvLyB3aGVuIHlvdSBzaG91bGQgZGVsZXRlIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnQuXG4gICAgICAgIHdpbk1haW4gPSBudWxsXG4gICAgfSlcbn0pXG5cbi8vIFF1aXQgd2hlbiBhbGwgd2luZG93cyBhcmUgY2xvc2VkLlxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgICAvLyBPbiBPUyBYIGl0IGlzIGNvbW1vbiBmb3IgYXBwbGljYXRpb25zIGFuZCB0aGVpciBtZW51IGJhclxuICAgIC8vIHRvIHN0YXkgYWN0aXZlIHVudGlsIHRoZSB1c2VyIHF1aXRzIGV4cGxpY2l0bHkgd2l0aCBDbWQgKyBRXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgICAgIGFwcC5xdWl0KClcbiAgICB9XG59KTtcblxuYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcbiAgICAvLyBPbiBPUyBYIGl0J3MgY29tbW9uIHRvIHJlLWNyZWF0ZSBhIHdpbmRvdyBpbiB0aGUgYXBwIHdoZW4gdGhlXG4gICAgLy8gZG9jayBpY29uIGlzIGNsaWNrZWQgYW5kIHRoZXJlIGFyZSBubyBvdGhlciB3aW5kb3dzIG9wZW4uXG4gICAgaWYgKHdpbk1haW4gPT09IG51bGwpIHtcbiAgICAgICAgY3JlYXRlV2luZG93KClcbiAgICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzcWxpdGUzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=