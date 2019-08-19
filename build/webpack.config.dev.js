const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const portfinder = require('portfinder');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const webpackConfigDev = webpackMerge(webpackConfigBase, {
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
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    port: 8080,
    watchOptions: {
      poll: 1000,
    },
    stats: {
      children: false,
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    })
  ],
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = 8080;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      webpackConfigDev.devServer.port = port;
      resolve(webpackConfigDev);
    }
  });
});
