/**
 * Created by gaoju on 2017/10/26.
 */
var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        front:[
            'babel-polyfill',
            './src/enter/front.js'
        ],
        teacher:[
            'babel-polyfill',
            './src/enter/teacher.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'assets/build'),//打包输出文件地址
        publicPath:'/build/',
        filename: '[name].bundle.js'//打包输出文件名
    },
    module: {
        //使用webpack2+以上版本都需要加 -loader
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            {
                test: /\.js|jsx$/,
                loaders: 'babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=react',
                include: path.join(__dirname, 'src')
            },
            {test: /\.(gif|jpg|png)$/, loader: 'url-loader?limit=8192&name=images/[name].[hash].[ext]' }
        ]
    },
    plugins: [
        //生产环境下打开
        new webpack.optimize.UglifyJsPlugin(),
        //windows下使用DefinePlugin时，需要安装cross-env来兼容这只环境变量使其可以有效
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        })
    ]
}