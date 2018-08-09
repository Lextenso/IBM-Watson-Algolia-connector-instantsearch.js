const path = require('path');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src/IBMWatsonAlgoliaConnector.js'),
    output: {
        library: 'IBMWatsonAlgoliaConnector',
        libraryTarget: 'umd',
        filename: 'IBMWatsonAlgoliaConnector.js',
        path: path.resolve(__dirname, 'dist'),
    },
    target: "web",
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};
