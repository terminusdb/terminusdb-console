const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');
var PACKAGE = require('../package.json');
var version = `v${PACKAGE.version}`;

module.exports = (env, argv) => ({
  entry: [
    path.join(__dirname, './index.js'),
  ],
  output: {
    path: path.resolve(__dirname, `public_pages/${version}/dist`),
    filename: "terminusdb-console.min.js",
    publicPath: '/'
  },
  devtool:false,
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new Dotenv({path: path.resolve(__dirname, './.env')}),
    new HtmlWebPackPlugin({
        inject: false,
        template: path.resolve(__dirname, './index.html'),
        bundleFileName:"terminusdb-console.min.js"
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
      // Transform our own .css files with PostCSS and CSS-modules
      test: /\.css$/,
      exclude: /node_modules/,
      use: ['style-loader', 'css-loader'],
    }, {
      // Do not transform vendor's CSS with CSS-modules
      // The point is that they remain in global scope.
      // Since we require these CSS files in our JS or CSS files,
      // they will be a part of our compilation either way.
      // So, no need for ExtractTextPlugin here.
      test: /\.css$/,
      include: /node_modules/,
      use: ['style-loader', 'css-loader'],
    },
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

