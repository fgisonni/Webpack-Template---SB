const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = webpackMerge(webpackConfigBase, {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
        {
            loader: MiniCssExtractPlugin.loader,
          },
          {
              loader: 'css-loader',
              options: {
                  minimize: true
              }
          },
          'postcss-loader',
          {
            loader: 'sass-loader'
          }
        ]
      }
    ],
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new CleanWebpackPlugin(['dist'], {root: path.resolve(__dirname, '../')}),
  ],
});
