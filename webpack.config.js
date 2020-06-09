const ExtractTextPlugin = require('extract-text-webpack-plugin')
const configVars = require('./config')
const webpack = require('webpack')
const path = require('path')

const alias = {
  components: path.resolve('./src/components'),
  constants: path.resolve('./src/constants'),
  services: path.resolve('./src/services'),
  helpers: path.resolve('./src/helpers'),
  store: path.resolve('./src/store'),
  root: path.resolve('../'),
  'react-dom': '@hot-loader/react-dom',
}

module.exports = () => ({
  entry: ['@babel/polyfill', './src/app.jsx'],
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'dist/bundle.js',
  },
  devtool: process.env.STAGE === 'prod' ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx?)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.styl$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'stylus-loader'],
        })),
      },
      {
        test: /\.css/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        })),
      },
      {
        test: /\.(img|png|svg)$/,
        use: 'url-loader',
      },
    ],
  },
  devServer: {
    port: process.env.PORT || 3000,
    historyApiFallback: true,
    stats: {
      entrypoints: false,
      children: false,
      builtAt: false,
      version: false,
      modules: false,
      assets: false,
      hash: false,
    },
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'dist/bundle.css', allChunks: true }),
    new webpack.DefinePlugin({ 'process.env': configVars }),
    new webpack.NamedModulesPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: alias,
  },
})
