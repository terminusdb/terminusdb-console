const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                use:{
                    loader: "babel-loader",
                },
            },
            {
            // Transform our own .css files with PostCSS and CSS-modules
            test: /\.css$/,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader'],
          }, 
          {
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
              outputPath: (url, resourcePath, context) => {
                console.log("___MODE__",argv.mode)
                if(argv.mode === 'development') {
                  const relativePath = path.relative(context, resourcePath);

                   console.log("___CONTEXT__",context,resourcePath,relativePath)

                  return `/${relativePath}`;
                }
                return `/assets/${path.basename(resourcePath)}`;
              }
            }
          }
        ]
      }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'terminus-console-lib.min.js',
        sourceMapFilename: 'terminus-console-lib.min.js.map',
        libraryTarget: 'umd',
        library: 'TerminusChart',
    },
    externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs2: 'prop-types',
      commonjs: 'prop-types',
      amd: 'prop-types',
    }
  },
};
