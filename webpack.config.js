var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var packageJson = require('./package.json');
var version = packageJson.version;

module.exports = {
    entry: {
        'angular-popups': './src/popups.js',
        'angular-popups-nocss': './src/popups-nocss.js'
    },
    output: {
        path: 'dist',
        filename: '[name].js'
    },
    devtool: 'source-map',
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.BannerPlugin(packageJson.name + '@' + packageJson.version + ' | ' + packageJson.homepage)
    ],
    externals: {
        angular: 'angular'
    },
    module: {
        preLoaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'jshint-loader'
        }],
        loaders: [
            //{test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')}, // 把 CSS 抽离成独立的文件
            {
                test: /\.css$/,
                loader: 'style!css?sourceMap&minimize'
            }
        ]
    },

    jshint: {
        camelcase: true,
        emitErrors: false,
        failOnHint: false,
        reporter: function(errors) {}
    }
};