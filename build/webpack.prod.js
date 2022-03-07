const path = require('path');
const webpack = require('webpack');
const webpackBaseConfig = require('./webpack.base');
// const WebpackMerge = require('webpack-merge');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 此插件主要将css代码分离出来
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 会先清除dist文件夹下所有的内容，进入下一阶段
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 分别是压缩js、css的插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 分别是压缩js、css的插件
// thread-loader也是同样的作用，需要加在被加速的loader的前面
// vue-loader v15已经不支持happypack，因此用thread-loader代替
// happypack thread-loader目前最新版本不支持sass-loader 8.0.1，暂时不使用

// 现在通过npm run build-dll打包第三方库，在出口中的library是打包好的library标识，与dllPlugin里的name相同，并生成manifest.json文件,主要是标明library的模块连接。
// 最后在webpack.prod.js将打包好的第三方库来与其他包进行整合
const libPath = path.resolve(__dirname, '../libs');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = merge(webpackBaseConfig,{
    mode: 'production', // 设置为线上模式
    module: {
        rules: [{
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 'postcss-loader', 'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 'postcss-loader'
                ]
            },
            {
                test: /\.vue$/,
                use: [
                    'thread-loader',
                    'vue-loader'
                ]
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash:8].css",
            chunkFilename: "css/[name].[chunkhash:8].css"
        }),
        new CleanWebpackPlugin(),
        new OptimizeCssAssetsPlugin(),
        new UglifyJsPlugin({
            parallel: true, // 开启多线程压缩
            cache: true, // 使用缓存
            uglifyOptions: {
                warnings: false, // 删除警告
                compress: {
                    drop_console: true, // 去除日志
                    drop_debugger: true // 去除debugger
                },
                output: {
                    comments: false // 去除注释
                }
            },
        }),
        new AddAssetHtmlPlugin({
                filepath: path.resolve(libPath, '*.js'),
                outputPath: 'js'
        }),
    ],
})