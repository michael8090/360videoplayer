module.exports = {
    entry: "./src/player.js",
    output: {
        path: __dirname,
        filename: "dist/bundle.js"
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    }
};
