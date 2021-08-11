const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
// Entry nos permite decir el punto de entrada de nuestra aplicación
        entry: "./src/index.js",
// Output nos permite decir hacia dónde va enviar lo que va a preparar webpacks
        output: {
// path es donde estará la carpeta donde se guardarán los archivos
// Con path.resolve podemos decir dónde va estar la carpeta y la ubicación del mismo
                path: path.resolve(__dirname, "dist"),
// filename le pone el nombre al archivo final
                filename: "[main].[contenthash].js",
// Para que las imagenes en base 64 se organicen y no queden dentro de dist sueltas
                assetModuleFilename: "assets/[hash][ext][query]",
        },
        mode: 'production',
        resolve: {
// Aqui ponemos las extensiones que tendremos en nuestro proyecto para webpack los lea y los alias de las url internas
                extensions: [".js"],
                alias: {
                        '@utils': path.resolve(__dirname, 'src/utils/'),
                        '@templates': path.resolve(__dirname, 'src/templates/'),
                        '@styles': path.resolve(__dirname, 'src/styles/'),
                        '@images': path.resolve(__dirname, 'src/assets/images/'),
                }
        },
        // SECCION DE MODULE/RULES
        module: {
                rules: [
                        {
// Test declara que extensión de archivos aplicara el loader
                        test: /\.m?js$/,
// Exclude permite omitir archivos o carpetas especificas
                        exclude: /node_modules/,
// Use es un arreglo u objeto donde dices que loader aplicaras
                        use: {
                                loader: "babel-loader",
                                options: {
                                        presets: ['@babel/preset-env']
                                        }
                                }
                        },
// Regla para trabajar con CSS en webpack, configuranndo ademas el preprocesador stylus que voy a usar
                        {
                        test: /\.css|.styl$/i,
                        use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"]
                        },
// Para poder usar imagenes como variables y que estas se agreguen al dist al compilar webpack
                        {
                        test: /\.(png|svg|jpg|jpeg|gif)$/i,
                        type: 'asset/resource'
                        },
                        {
                        test: /\.(woff|woff2)$/,
                        use: {
                                loader: "url-loader",
                                options: {
                                        // limit => limite de tamaño
                                        limit: 10000,
                                        // Mimetype => tipo de dato
                                        mimetype: "application/font-woff",
                                        // name => nombre de salida
                                        name: "[name].[contenthash].[ext]",
                                        // outputPath => donde se va a guardar en la carpeta final
                                        outputPath: "./assets/fonts/",
                                        publicPath: "../assets/fonts/",
                                        esModule: false,
                                }
                        }
                        },
                ]
        },
        // SECCION DE PLUGINS
        plugins: [
                new HtmlWebpackPlugin({ // CONFIGURACIÓN DEL PLUGIN
                    inject: 'body', // INYECTA EL BUNDLE AL TEMPLATE HTML
                    template: './public/index.html', // LA RUTA AL TEMPLATE HTML
                    filename: './index.html' // NOMBRE FINAL DEL ARCHIVO
                }),
// Agregando el pugin para trabajar con CSS en webpack
                new MiniCssExtractPlugin({
                        filename: '[name].[contenthash].css'
                }),
// Agregando el plugin para poder copiar archivos o carpetas al directorio dist al compilar webpack
                new CopyPlugin({
                        patterns: [
                                {
                                from: path.resolve(__dirname, "src", "assets/images"),
                                to: "assets/images"
                                }
                        ]
                }),
                new Dotenv({
                        path: './.env', // Path to .env file (this is the default)
                        safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
                }),
                new CleanWebpackPlugin(),
        ],
        optimization: {
                minimize: true,
                minimizer: [
                        new CssMinimizerPlugin(),
                ]
        }
}