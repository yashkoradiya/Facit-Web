const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const version = require('./package.json').version;

module.exports = {
  entry: {
    app: './app/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      hash: true,
      chunks: ['app'],
      template: './buildTools/templates/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'silent_renew.html',
      inject: true,
      hash: true,
      chunks: ['silentRenew'],
      template: './buildTools/templates/silent_renew.html'
    }),
    new CopyWebpackPlugin({ patterns: [{ from: 'public' }] }),
    new webpack.DefinePlugin({
      'process.env.APP_VERSION': JSON.stringify(version)
    })
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, './app')],
        use: ['babel-loader']
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(svg|png|gif|jpg|jpeg)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'media'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'media'
        }
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./app'), './node_modules'],
    extensions: ['.*', '.js', '.jsx'],
    symlinks: false
  }
};
