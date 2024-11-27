import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'

const ENV = process.env.NODE_ENV

export default {
  mode: ENV,
  devtool: ENV === 'development' ? 'source-map' : undefined,
  output: {
    filename: '[name].js', // [name] gulpで設定
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        resolve: {
          fullySpecified: false
        },
        use: {
          loader: 'babel-loader',
          options: {
            'presets':[
              ["@babel/preset-env"]
            ],
            compact: false
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: ENV === 'production' || false,
          }
        },
      })
    ]
  }
}
