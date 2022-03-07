// 很多第三方库不是我们经常改动的地方，每次打包不用每次都打包这块代码，除非要升级第三方库的版本。使用dllPlugin来预先打包第三方库。
const webpack = require('webpack');
const path = require('path');
const libPath = path.resolve(__dirname, '../libs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		lib: [
			'vue', 
			'vue-router', 
			'vuex', 
			'axios', 
			// 'element-ui',
			// 'lodash'
		]
	},
	output: {
		path: libPath,
		filename: '[name].[hash:8].js',
		library: '[name]_library'
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.DllPlugin({
      		context: __dirname,
      		name: '[name]_library',
      		path: path.resolve(libPath, '[name]-manifest.json')
    	}),
		new UglifyJsPlugin({
			parallel: true,
			cache: true,
			uglifyOptions: {
				warnings: false,          // 删除警告
				compress: {
					drop_console: true,     // 去除日志
					drop_debugger: true     // 去除debugger
				},
				output: {
					comments: false         // 去除注释
				}
			},
		})
	],
}
