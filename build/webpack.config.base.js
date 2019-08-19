const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getEntries } = require('./utils.js');

const entries = getEntries('./src/pages/', 'js');

const ASSET_PATH = process.env.ASSET_PATH;

// const MinifyPlugin = require("babel-minify-webpack-plugin");

// const CompressionPlugin = require('compression-webpack-plugin');
// const BrotliPlugin = require('brotli-webpack-plugin');


// const express = require("express");
// const expressStaticGzip = require("compression");
// const app = express();
//
//
// app.get('*', expressStaticGzip(path.join(__dirname), {
//  urlContains: 'dist/',
//  fallthrough: false,
//  enableBrotli: true,
// }));

const config = {
  entry: Object.assign(entries, { app: './src/app.js' }),
  output: {
    pathinfo: false,
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].chunk.[chunkhash:8].js',
    publicPath: ASSET_PATH,
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../src'),
      components: path.resolve(__dirname, '../src/components'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.gz$/,
        enforce: 'pre',
        use: 'gzip-loader'
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 1,
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|otf|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'fonts/[name].[md5:hash:hex:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(mp4|ogg|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[md5:hash:hex:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  parallelism: 8,
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          chunks: 'initial',
          name: 'vendors',
          test: /node_modules\//,
          minChunks: 5,
          priority: 10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimize: false
  },
  plugins: [
    // new CompressionPlugin({
    //   filename: '[path].gz[query]',
    //   algorithm: 'gzip',
    //   test: /\.js$|\.css$|\.html$/,
    //   threshold: 10240,
    //   minRatio: 0.7
    // }),
    // new BrotliPlugin({
    //   filename: '[path].br[query]',
    //   test: /\.js$|\.css$|\.html$/,
    //   threshold: 10240,
    //   minRatio: 0.7
    // }),
    // new MinifyPlugin({
    //   infinity:	false,
    //   mangle: false
    // })
  ],
};

const pages = getEntries('./src/pages/', 'html');

for (const pathname in pages) {
  // Configured to generate the html file, define paths, etc.
  const conf = {
    filename: `${pathname}.html`, // html output pathname
    template: path.resolve(__dirname, `.${pages[pathname]}`), // Template path
    inject: true,
    favicon: path.resolve(__dirname, '../src/assets/favicon.ico'),
    chunks: ['commons', 'vendors', 'app', pathname],
    chunksSortMode: 'manual',
    jsExtension: ".gz"
  };
  config.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = config;
