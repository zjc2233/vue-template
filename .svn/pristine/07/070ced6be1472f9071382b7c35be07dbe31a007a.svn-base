// webpack.dev.js
const webpackBaseConfig = require('./webpack.base');
const webpack = require('webpack');
// const WebpackMerge = require('webpack-merge');
const { merge } = require('webpack-merge');

module.exports = merge(webpackBaseConfig,{
    mode: 'development',
    // devtool: '#cheap-module-eval-source-map',
    devServer: {
        port: 8088,
        open: true,
        hot: true,
        client: {
            overlay: true,
        },
    },
    module: {
        rules: [{
            test: /\.vue$/,
            exclude: /node_modules/,
            use: [
                'vue-loader'
            ]
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                // 'happypack/loader?id=css' // 此处会报错
            ]
        },
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader'
            ]
        }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
})