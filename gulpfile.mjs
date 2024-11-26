import pkg from 'gulp'
const { src, dest, series, watch } = pkg

import gulpEjs from 'gulp-ejs'
import gulpRename from 'gulp-rename'
import * as sass from 'sass'
import pureGulpSass from 'gulp-sass'
const gulpSass = pureGulpSass(sass)

import gulpAutoprefixer from 'gulp-autoprefixer'
import gulpPlumber from 'gulp-plumber'
import pureGulpFilter from 'gulp-filter'
import gulpImagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'

import fs from 'fs'
import path from 'path'

import browserSync from 'browser-sync'
const reload = browserSync.reload

import webpack from 'webpack'
import pureVinylNamed from 'vinyl-named'
import webpackStream from 'webpack-stream'
import webpackConfig from './webpack.config.mjs'

const srcPath = {
  html: './src/**/*.ejs',
  sass: './src/assets/sass/**/*.scss',
  js: './src/assets/js/**/*.js',
  images: 'src/assets/images/**/*'
}

const destPath = {
  html: './dist',
  sass: './dist/assets/css/',
  js: './dist/assets/js/',
  images: 'dist/assets/images/'
}

const gulpFilter = () => pureGulpFilter(({ path, relative }) => !/\/_/.test(path) && !/^_/.test(relative))

const vinylNamed = () => {
  return pureVinylNamed(({ relative }) => {
    const { dir, sep, name } = path.parse(relative)
    return ((dir) ? dir + sep : '') + name
  })
}

/** ejs */
const compileEjs = () => {
  return src([srcPath.html])
  .pipe(gulpPlumber())
  .pipe(gulpFilter())
  .pipe(gulpEjs())
  .pipe(gulpRename({ extname: '.html' }))
  .pipe(dest(destPath.html))
}

/** sass */
const compileSass = () => {
  return src(srcPath.sass, { sourcemaps: true })
    .pipe(gulpPlumber())
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(gulpAutoprefixer())
    .pipe(dest(destPath.sass, { sourcemaps: '.' }))
}

const buildSass = () => {
  return src(srcPath.sass)
    .pipe(gulpPlumber())
    .pipe(gulpSass({ outputStyle: 'compressed' }))
    .pipe(gulpAutoprefixer())
    .pipe(dest(destPath.sass))
}

/**
 * javascript
 * webpackの処理を途中で挟む
*/
const compireJS = () => {
  return src([srcPath.js])
  .pipe(gulpPlumber())
  .pipe(gulpFilter())
  .pipe(vinylNamed())
  .pipe(webpackStream(webpackConfig, webpack))
  .pipe(dest(destPath.js))
}

/**
 * 画像の圧縮 svg, jpeg, png, gifは圧縮
 * webpはコピーだけ
 */
const minifyImages = ()  => {
  return src(srcPath.images)
    // .pipe(gulpImagemin([
    //   gifsicle({interlaced: true}),
    //   mozjpeg({quality: 80, progressive: true}),
    //   optipng({optimizationLevel: 3}),
    //   svgo({
    //     plugins: [
    //       { name: 'removeViewBox', active: true },
    //       { name: 'cleanupIDs',active: false }
    //     ]
    //   })
    // ]))
    .pipe(dest(destPath.images))
}

/** ローカルサーバー */
const buildServer = (done) => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })
  done()
}

/** ファイル監視 */
const watchFiles = (done) => {
  watch(srcPath.html, { ignoreInitial: false }, compileEjs).on('change', reload)
  watch(srcPath.sass, { ignoreInitial: false }, compileSass).on('change', reload)
  watch(srcPath.js, {ignoreInitial: false }, compireJS).on('change', reload)
  watch(srcPath.images, {ignoreInitial: false }, minifyImages)
  done()
}

/** ファイル削除 */
const deleteFiles = async(done) => {
  await fs.rm('./dist', { recursive: true }, () => console.log('distを削除しました'))
  done()
}

/** gulp start・build */
const start = series(buildServer, watchFiles)
const build = series(deleteFiles, minifyImages, compileEjs, buildSass, compireJS)
export { start, build }
