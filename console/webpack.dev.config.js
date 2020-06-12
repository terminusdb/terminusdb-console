const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');
var PACKAGE = require('../package.json');
var version = `v${PACKAGE.version}`;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = (env, argv) => ({
  entry: [
    path.join(__dirname, './index.js'),
  ],
  output: {
    path: path.resolve(__dirname, `public_pages/${version}/dist`),
    filename: "terminusdb-console.min.js",
    publicPath: '/'
  },
  devtool:'#inline-source-map',
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new Dotenv({path: path.resolve(__dirname, './.env')}),
    new HtmlWebPackPlugin({
        inject: true,
        template: path.resolve(__dirname, './index.html'),
        bundleFileName:"terminusdb-console.min.js"
      }),
     new MiniCssExtractPlugin({
        filename: "terminusdb-console-main.css",
     })
  ],
  resolve: {
      alias:{"@terminusdb/terminusdb-console": path.join(__dirname, '..', 'src/index.js'),
           "@terminusdb/terminusdb-client": path.resolve('../terminusdb-client/index.js'),
           "@terminusdb/terminusdb-react-table": path.resolve('../terminusdb-react-table/src/index.js'),
           "@terminusdb/terminusdb-react-graph": path.resolve('../terminusdb-react-graph/src/index.js'),       
           react: path.resolve('./node_modules/react')},
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader:"babel-loader",
          options:{
            presets: [
              ["@babel/preset-env"],
              "@babel/preset-react"
            ],
          }
        },
      },
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
           'css-loader', 'less-loader'
        ],
      },
      /*{
        test: /\.(css|less)$/,
        loader: ['css-loader', 'less-loader'], // compiles Less to CSS
      },*/
    
   /* {
      // Transform our own .css files with PostCSS and CSS-modules
      test: /\.css$/,
      exclude: /node_modules/,
      use: ['css-loader'],
    },
    {
      // Transform our own .css files with PostCSS and CSS-modules
      test: /\.css$/,
      include: /node_modules/,
      use: ['css-loader'],
    },*/ /*{
      // Do not transform vendor's CSS with CSS-modules
      // The point is that they remain in global scope.
      // Since we require these CSS files in our JS or CSS files,
      // they will be a part of our compilation either way.
      // So, no need for ExtractTextPlugin here.
      test: /\.(css)$/,
      include: /node_modules/,
      use: ['style-loader', 'css-loader'],
    },*/
      {
        test: /\.(svg|jpg|gif|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              //outputPath: "images",
              //publicPath: "images"
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: (url, resourcePath, context) => {
                //if(argv.mode === 'development') {
                  const relativePath = path.relative(context, resourcePath);
                  return `/${relativePath}`;
                //}
                //return `/assets/fonts/${path.basename(resourcePath)}`;
              }
            }
          }
        ]
      }]
    },
});

