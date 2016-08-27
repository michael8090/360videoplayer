module.exports = {
    entry: "./src/main.js",
    output: {
        path: __dirname,
        filename: "dist/main.js",
        library: 'setupPlayer',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    }
};
