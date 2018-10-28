// we can use ES6 import syntax here because
// 1. this file gets called from the root package.json via 'yarn dev:main'
// 2. that command gets translated to a 'node -r @babel/register ./node_modules/webpack/bin/webpack.js --config ./webpack.config.dev.main.js"
// 3. => the @babel/register module gets loaded before calling webpack and its (webpack's) config file, meaning:
// 4. all ES6 imports get translated to 'require stuff' on the fly.
// 5. cool

import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import webpack from 'webpack'
import { spawn } from 'child_process'

// all native deps get installed to the './app' dir => ./app/package.json 
// => externalDeps are the native deps which we to put as 'externals' for webpack
// i.e. webpack will NOT put these into its bundles. it will assume that they already
// exist in the ./app/node_modules folder, and just reference them.
// NOTE: for this to work, the libraryTarget: 'commonjs2' entry in 'output' was necessary. see below
import { dependencies as externalDeps } from './app/package'

console.log('externalDeps')
console.log(externalDeps)
console.log(...Object.keys(externalDeps))
console.log('webpack renderer __dirname')
console.log(__dirname)

const APP_MAIN = 'appMain'
const APP_ONE = 'appOne'
const APP_MAIN_TEST = 'appMainTest'
let entries = {
  appMain: [
    // 'react-hot-loader/patch',
    // 'webpack-dev-server/client?http://localhost:8181/',
    // 'webpack/hot/only-dev-server', // "only" prevent reload on syntax errors
    require.resolve('./src/renderer-process/appMain/index.js') // the acutal app's entry point
  ],
  appOne: [
    // 'react-hot-loader/patch',
    // 'webpack-dev-server/client?http://localhost:8181/',
    // 'webpack/hot/only-dev-server', // "only" prevent reload on syntax errors
    require.resolve('./src/renderer-process/appOne/index.js')
  ],
  appMainTest: [
    require.resolve('./app/appMainTest/index.js')
  ]
}

module.exports = {
  mode: 'development',
  target: 'electron-renderer',
  externals: [
    ...Object.keys(externalDeps || {})
  ],
  entry: entries,
  output: {
    filename: '[name]/bundle.js',
    // filename: '[name]/dev.index.js',
    path: path.join(__dirname, 'app'), 
    // publicPath: 'http://localhost:8181/app/', // for HMR 
    // https://github.com/webpack/webpack/issues/1114
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
        test: /\.s?css$/, // the s? means 's' or 'no s'
        use: [
          {
            loader: 'style-loader'
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
      },
      {
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
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'app'),
    // publicPath: 'blah',
    // publicPath: 'http://localhost:8181/app/',
    port: 8181,
    // hot: true,
    before() {
      if (process.env.START_HOT === 'yes') {
        console.log('starting Main Process...')
        spawn('npm', ['run', 'dev:electron'], {
          shell: true,
          env: process.env,
          stdio: 'inherit'
        })
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError))
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin([
        'app/appMain',
        'app/appOne',
    ]),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: [APP_MAIN],
      title: 'OrderUp appMain',
      filename: `${APP_MAIN}/index.html`,
      template: './indexTemplate.ejs'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: [APP_ONE],
      title: 'OrderUp appOne',
      filename: `${APP_ONE}/index.html`,
      template: './indexTemplate.ejs'
    })
    // new HtmlWebpackPlugin({
    //   inject: true,
    //   chunks: [APP_MAIN_TEST],
    //   title: 'OrderUp appOne',
    //   filename: `${APP_MAIN_TEST}.index.html`,
    //   template: './indexTemplate.ejs'
    // })
    // new webpack.HotModuleReplacementPlugin()
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  },
  // ?? uncomment later when writing ./app related code and failure to load modules ??
  // Tell webpack what directories should be searched when resolving modules.
  // Absolute and relative paths can both be used, but be aware that they will behave a bit differently.
  // https://webpack.js.org/configuration/resolve/
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.join(__dirname, 'app'), 'node_modules']
    // alias: {
    //   mongodb: path.resolve(__dirname, 'app/node_modules/mongodb'),
    //   mongoose: path.resolve(__dirname, 'app/node_modules/mongoose')
    // }
  }
}