const path = require('path');

module.exports = [{
    mode : 'development',
    entry: './src/localDev/cornellBox/index.js',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool : 'source-map',
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    output: {
        publicPath: '',
        library: 'babylonApp',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    }
}];