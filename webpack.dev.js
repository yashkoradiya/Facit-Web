const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [new ReactRefreshWebpackPlugin(), new ESLintPlugin()],

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    port: 3003,
    historyApiFallback: true,
    hot: true,
    devMiddleware: {
      stats: 'minimal'
    }
  }
});
