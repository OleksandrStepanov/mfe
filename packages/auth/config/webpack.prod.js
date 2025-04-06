const { merge } = require('webpack-merge');
const path = require('path');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const prodConfig = {
  mode: 'production',
  entry: {
    main: './src/bootstrap.js',
    webcomponent: './src/AppWrapper.js', // <- your wrapper entry
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/auth/latest/',
    clean: true,
    library: {
      type: 'umd',
      name: '[name]',
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: {
        './AuthApp': './src/bootstrap',
      },
      shared: {
        ...packageJson.dependencies,
        react: {
          singleton: true,
          requiredVersion: packageJson.dependencies.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: packageJson.dependencies['react-dom'],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      chunks: ['webcomponent'], // Optional test page for web component
      filename: 'web-component-test.html',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

module.exports = merge(commonConfig, prodConfig);
