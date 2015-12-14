var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        popups: './src/index.js'
    },
    output: {
        path: 'dist',
        filename: '[name].js'
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.BannerPlugin('https://github.com/aui/angular-popups')
    ],
    externals: {
        jquery: 'jQuery',
        angular: 'angular'
    },
    module: {
        loaders: [
            //{test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')}, // 把 CSS 抽离成独立的文件
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.md$/, loader: 'html!markdown'}
        ]
    }
};