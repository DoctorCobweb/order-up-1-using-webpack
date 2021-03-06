// we can use ES6 import syntax here because
// 1. this file gets called from the root package.json via 'yarn dev:main'
// 2. that command gets translated to a 'node -r @babel/register ./node_modules/webpack/bin/webpack.js --config ./webpack.config.dev.main.js"
// 3. => the @babel/register module gets loaded before calling webpack and its (webpack's) config file, meaning:
// 4. all ES6 imports get translated to 'require stuff' on the fly.
// 5. cool

import path from 'path'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import webpack from 'webpack'
import dotenv from 'dotenv'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

// all native deps get installed to the './app' dir => ./app/package.json 
// => externalDeps are the native deps which we to put as 'externals' for webpack
// i.e. webpack will NOT put these into its bundles. it will assume that they already
// exist in the ./app/node_modules folder, and just reference them.
// NOTE: for this to work, the libraryTarget: 'commonjs2' entry in 'output' was necessary. see below
import { dependencies as externalDeps } from './app/package'

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.prod'})
}

module.exports = {
  mode: 'production',
  target: 'electron-main',
  externals: [
    ...Object.keys(externalDeps || {}),
    'express' // dont include express in webpack: get critical dependency warning
  ],
  entry: {
    main: './app/main-process/main.js'
  },
  output: {
    filename: 'main.prod.js',
    path: path.join(__dirname, 'app'),
    libraryTarget: 'commonjs2' // otherwise get referrence error for native modules require'd
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      }
    ]
  },
  devtool: 'source-map',

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  },
  // optimization: {
  //   minimizer: [
  //     new UglifyJSPlugin({
  //       parallel: true,
  //       sourceMap: true,
  //       cache: true
  //     })
  //   ] 
  // },
  plugins: [
    new CleanWebpackPlugin(
      [
        'release'
      ],
      {
        exclude: [
          'package.json',
          'yarn.lock',
          'node_modules'
        ]
      }
    ),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.MOCK_ORDERS': JSON.stringify(process.env.MOCK_ORDERS)
    })
  ]
  // ?? uncomment later when writing ./app related code and failure to load modules ??
  // Tell webpack what directories should be searched when resolving modules.
  // Absolute and relative paths can both be used, but be aware that they will behave a bit differently.
  // https://webpack.js.org/configuration/resolve/
  // resolve: {
  //   modules: [path.join(__dirname, 'app'), 'node_modules']
  // }
}