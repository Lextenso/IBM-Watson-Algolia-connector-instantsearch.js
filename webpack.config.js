const path = require('path');
const VersionFile = require('webpack-version-file');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src/index.js'),
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
    },
    plugins: [
        new VersionFile({
          output: path.resolve(__dirname, 'src/version.js'),
          templateString: 'export default "<%= version %>";',
          package: path.resolve(__dirname, 'package.json')
        })
    ]
};
