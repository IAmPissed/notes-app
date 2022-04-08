const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        bundle: path.resolve(__dirname, 'src/app.ts')
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'public')
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['sass-loader', 'style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpeg|jpg|svg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name][contenthash].js',
        clean: true,
        assetModuleFilename: '[name][ext]'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Notes App',
            filename: 'index.html',
            template: 'src/template.html'
        })
    ]
}