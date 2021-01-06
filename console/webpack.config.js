const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebPackPlugin= require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
require("./check_env_variables")

module.exports = (env, argv) => ({
  entry: [
    path.join(__dirname, './index.js'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "terminusdb-console.min.js",
    publicPath: './'
  },
  devtool:argv.mode === 'production' ? false : '#inline-source-map',
  plugins: [
   // new Dotenv({path: path.resolve(__dirname, '.env')}),
    new HtmlWebPackPlugin({
        inject: true,
        template: path.resolve(__dirname, './index.html'),
        bundleFileName:"terminusdb-console.min.js"
      }),
     new MiniCssExtractPlugin({
      filename: 'terminusdb-console-main.css',
     }),
   


  //{ chunks:["contact", "vendor"], template: "src/pages/contact.html",  filename: "contact.html"}
   /*new HtmlWebPackPlugin({
      chunks:["bundle"],
      template: path.join(__dirname, '..' , 'console/index.html'),
      filename: 'index.html'
    }),*/
  ],
  resolve: {
      alias:{"@terminusdb/terminusdb-console": path.join(__dirname, '..', 'src/index.js')},
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
      {
        test: /\.(svg|jpg|gif|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[ext]',
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
                return `assets/fonts/${path.basename(resourcePath)}`;
              }
            }
          }
        ]
      }]
    },
    /*optimization: {
      minimize: argv.mode === 'production' ? true : false,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: "initial",
            name: "vendor",
            enforce: true
          }
        }
      }
    }*/
});