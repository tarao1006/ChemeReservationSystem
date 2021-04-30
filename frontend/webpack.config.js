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
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@api': path.resolve(__dirname, './src/api/index.ts'),
      '@components': path.resolve(__dirname, './src/components/index.ts'),
      '@config': path.resolve(__dirname, './src/config/index.ts'),
      '@contexts': path.resolve(__dirname, './src/contexts/index.ts'),
    },
  },
  devServer: {
    contentBase: path.relative(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 1234,
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
