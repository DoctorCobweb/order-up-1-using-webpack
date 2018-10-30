// we can use ES6 import syntax here because
// 1. this file gets called from the root package.json via 'yarn dev:main'
// 2. that command gets translated to a 'node -r @babel/register ./node_modules/webpack/bin/webpack.js --config ./webpack.config.dev.main.js"
// 3. => the @babel/register module gets loaded before calling webpack and its (webpack's) config file, meaning:
// 4. all ES6 imports get translated to 'require stuff' on the fly.
// 5. cool

import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'

// all native deps get installed to the './app' dir => ./app/package.json 
// => externalDeps are the native deps which we to put as 'externals' for webpack
// i.e. webpack will NOT put these into its bundles. it will assume that they already
// exist in the ./app/node_modules folder, and just reference them.
// NOTE: for this to work, the libraryTarget: 'commonjs2' entry in 'output' was necessary. see below
import { dependencies as externalDeps } from './app/package'

const APP_MAIN = 'appMain'
const APP_ONE = 'appOne'
let entries = {
  appMain: [
    './app/renderer-process/appMain/index.js' // the acutal app's entry point
  ],
  appOne: [
    './app/renderer-process/appOne/index.js' // the acutal app's entry point

  ]
}

module.exports = {
  mode: 'production',
  target: 'electron-renderer',
  externals: [
    ...Object.keys(externalDeps || {})
  ],
  entry: entries,
  output: {
    filename: '[name].prod.bundle.js',
    path: path.join(__dirname, 'app', 'dist'),
    publicPath: './dist/', // CHCK WHAT THIS DOES
    libraryTarget: 'commonjs2' // otherwise get referrence error for native modules require'd
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },{
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '../' // the svg files get moved to './app'
            }
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin([
        // TODO: add more folders here once more react apps are made
        // 'app/appMain',
        // 'app/appOne',
        'release'
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    })
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  }
  // ?? uncomment later when writing ./app related code and failure to load modules ??
  // Tell webpack what directories should be searched when resolving modules.
  // Absolute and relative paths can both be used, but be aware that they will behave a bit differently.
  // https://webpack.js.org/configuration/resolve/
  // resolve: {
  //   modules: [path.join(__dirname, 'app'), 'node_modules']
  // }
}