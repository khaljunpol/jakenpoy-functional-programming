const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  target: 'web',
  entry: './src/app.ts',
  devtool: 'source-map',
  mode: 'development',
  stats: 'errors-only',
  devServer: {
    // contentBase: './dist',
    hot: true,
    port: 3333
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all'
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: 'src/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/assets', to: 'assets' }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(m|j|t)s$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },

    ]
  },
  resolve: {
    alias: {
      "rxjs": path.join(__dirname, './node_modules/rxjs'),
      "xstate": path.join(__dirname, './node_modules/xstate')
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  }
};
