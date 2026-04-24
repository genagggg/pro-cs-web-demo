const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      publicPath: 'http://localhost:3001/',
      clean: true
    },
    devServer: {
      port: 3001,
      historyApiFallback: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
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
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new Dotenv(),
      new ModuleFederationPlugin({
        name: 'radar',
        filename: 'remoteEntry.js',
        exposes: {
          './RadarApp': './src/RadarApp.tsx',
          './bootstrap': './src/bootstrap.tsx'
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.2.0'
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.2.0'
          }
        }
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html'
      })
    ]
  };
};
