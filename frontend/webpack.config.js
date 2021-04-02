const path = require('path');

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
        test: /\.ts?x/,
        use: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  devServer: {
    contentBase: path.relative(__dirname, 'dist'),
    port: 8080,
    historyApiFallback: true,
  },
}
