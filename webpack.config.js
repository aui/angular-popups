var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var version = require('./package.json').version;

module.exports = {
    entry: {
        'angular-popups': './src/index.js'
    },
    output: {
        path: 'dist',
        filename: '[name].js'
    },
    devtool: 'source-map',
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.BannerPlugin('angular-popups@' + version + ' | https://github.com/aui/angular-popups')
    ],
    externals: {
        angular: 'angular'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'jshint-loader'
            }
        ],
        loaders: [
            //{test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')}, // 把 CSS 抽离成独立的文件
            {test: /\.css$/, loader: 'style!css?minimize'}
        ]
    },

    // more options in the optional jshint object
    jshint: {
        // any jshint option http://www.jshint.com/docs/options/
        // i. e.
        camelcase: true,

        // jshint errors are displayed by default as warnings
        // set emitErrors to true to display them as errors
        emitErrors: false,

        // jshint to not interrupt the compilation
        // if you want any file with jshint errors to fail
        // set failOnHint to true
        failOnHint: false,

        // custom reporter function
        reporter: function(errors) { }
    }
};