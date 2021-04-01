module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: [
          /\.tsx?$/,
          /\.ts?$/,
        ],
        use: 'ts-loader',
        exclude: [
          /node_modules/,
          /\.jsx?$/,
          /\.js?$/,
        ],
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
}
