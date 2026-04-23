const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const Dotenv = require('dotenv-webpack');

/**
 * Webpack configuration template for Module Federation
 * Customize for each module (host, remote-radar, remote-offers)
 * 
 * Required customizations:
 * 1. Update 'name' in ModuleFederationPlugin
 * 2. Update 'remotes' or 'exposes' as needed
 * 3. Update 'publicPath' in output
 * 4. Update port in devServer
 * 5. Update entry point if different
 */

module.exports = (env, argv, customConfig = {}) => {
  const isProduction = argv.mode === 'production';
  
  const defaultConfig = {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      publicPath: 'auto', // Should be customized per module
      clean: true
    },
    devServer: {
      port: 3000, // Should be customized per module
      historyApiFallback: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, '../tsconfig.json')
            }
          }
        }
      ]
    },
    plugins: [
      new Dotenv(),
      new ModuleFederationPlugin({
        name: 'module-name', // Should be customized
        filename: 'remoteEntry.js',
        // For host: use 'remotes'
        // For remotes: use 'exposes'
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.2.0'
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.2.0'
          },
          'react-redux': {
            singleton: true,
            requiredVersion: '^9.0.4'
          },
          '@reduxjs/toolkit': {
            singleton: true,
            requiredVersion: '^2.0.1'
          }
        }
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html'
      })
    ]
  };
  
  return { ...defaultConfig, ...customConfig };
};