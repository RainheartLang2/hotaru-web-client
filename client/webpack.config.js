const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
    const dev = argv.mode === 'development'

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'webpack.bundle.js',
            publicPath: '/',
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'webpack.bundle.css',
            }),
            new HtmlWebpackPlugin({
                title: 'Web client',
                template: path.resolve(__dirname, 'src/index.html'),
            }),
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /(.ts|.tsx)$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: dev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[name]__[local]__[hash:hex:4]',
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jp(e*)g|svg|gif)$/,
                    use: {
                        loader: 'url-loader',
                    },
                },
            ],
        },
    }
}
