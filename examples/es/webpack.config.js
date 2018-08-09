const path = require('path');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src/main.js'),
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    target: "web",
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};
