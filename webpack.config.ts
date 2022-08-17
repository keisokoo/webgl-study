import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import webpack from 'webpack'

import 'webpack-dev-server'
interface WebpackDefaultEnv {
  WEBPACK_BUNDLE: boolean
  WEBPACK_BUILD: boolean
  WEBPACK_SERVE: boolean
  WEBPACK_WATCH: boolean
}
type CLIValues = boolean | string
type EnvValues = Record<string, CLIValues | Record<string, Env>>
interface Env extends EnvValues, WebpackDefaultEnv {}
type Argv = Record<string, CLIValues>

const config: (env?: Env, argv?: Argv) => webpack.Configuration = (env) => {
  const isDev = env?.WEBPACK_SERVE
  return {
    mode: isDev ? 'development' : 'production',
    entry: './src/index.ts',
    devtool: isDev ? 'inline-source-map' : false,
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '/',
    },
    devServer: {
      static: './dist',
    },
    optimization: {
      runtimeChunk: 'single',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, 'index.html'),
        inject: 'body',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: {
            loader: 'swc-loader',
          },
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
        {
          test: /\.(sa|sc|c)ss$/i,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                module: {
                  mode: 'icss',
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  }
}

export default config
