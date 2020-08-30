// const path = require('path');
// require('dotenv').config();

const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

const browserConfig = {
  mode: 'development',
  entry: { app: ['./browser/app.jsx'] },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    ie: '11',
                    edge: '15',
                    safari: '10',
                    firefox: '50',
                    chrome: '49',
                  },
                },
              ],
              '@babel/preset-react',
            ],
          },
        },
      },
    ],
  },
  optimization: {
    splitChunks: { name: 'vendor', chunks: 'all' },
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      __UI_API_ENDPOINT__: `'${process.env.UI_API_ENDPOINT}'`,
      __isBrowser__: 'true',
    }),
  ],
};
const serverConfig = {
  mode: 'development',
  entry: { server: ['./server/uiserver.js'] },
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: '10' } }],
              '@babel/preset-react',
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: 'false',
    }),
  ],
  devtool: 'source-map',
};
module.exports = [browserConfig, serverConfig];

// module.exports = {
//   mode: 'development',
//   entry: { app: ['./browser/App.jsx'] },
//   output: {
//     filename: '[name].bundle.js',
//     path: path.resolve(__dirname, 'public'),
//   },
//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/,
//         exclude: /node_modules/,
//         use: 'babel-loader',
//       },
//     ],
//   },
//   optimization: {
//     splitChunks: {
//       name: 'vendor',
//       chunks: 'all',
//     },
//   },
//   devtool: 'source-map',
// plugins: [
//   new webpack.DefinePlugin({
//     __UI_API_ENDPOINT__: `'${process.env.UI_API_ENDPOINT}'`,
//   }),
// ],
// };
