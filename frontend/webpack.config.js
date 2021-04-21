const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@api': path.resolve(__dirname, './src/api/index.ts')
    }
  },
  devServer: {
    contentBase: path.relative(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'TOKEN',
      'BACKEND_URL',
      'TEST_USER_ID',
      'TEST_USER_PASSWORD',
    ]),
  ],
}
