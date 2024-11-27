# coding-template-frontend
Gulp,Webpackで作ったフロントエンドの開発環境です。
使用言語はejs,sass,javascriptを想定。

## 使い方
### セットアップ
ローカルにプルしてターミナルを開き

``` $ yarn install ``` or ```$ npm install```

終わり！

### start と build
package.jsonの"scripts"に定義されているコマンドは２つだけです。

#### start
```
yarn start
or
npm run start
```
ローカルサーバーを立ち上げます。
ejs,sass,jsファイルを保存するとコンパイルされ/distにhtm,css,jsファイルが吐き出されます。
画像はjpeg,png,gif,svgは圧縮、webpはそのままで/distへコピーされます。

#### build
```
yarn build
or
npm run build
```
プロダクションビルド。本番環境にアップする前にやってください。
/distを削除した後、startと同じようにそれぞれのファイルがコンパイルorコピーされます。
また、圧縮や開発時のみ必要なコードの削除がされファイルが軽量化されます。

本番アップするファイルに合わせるため、
index.html・index_head.htmlの中身が書き換わっています。
またルートURLの指定はindex.ejsのserverURL変数で行ってください

要するに、サーバーアップ時はdistの中身をそのまま投げれば大丈夫です。

:::note alert
注意！！
/dist以下に置いてあるファイルはbuild時に削除されます。
またgitにも反映されないため保存が効きません。基本的にこの中は触らないようにしてください。
:::


### /src内ファイルの説明
 - ejs
  htmlをテンプレート的に使えます。
  ファイルを保存すると/distにファイル名.htmlの形式でコンパイルされます。
  モジュール化したい時はフォルダ・ファイル名の頭に"＿"をつけると、ページとしてはコンパイルされません。

- /assets
  - images
    画像などの置き場。画像はjpeg,png,gif,svgは圧縮、webpはそのままで/distへコピーされます。
    webp以外にもファイルを入れると/dist/assets/imagesにコピーされます。
  - sass
    cssを分割できる。こちらもフォルダ・ファイル名の頭に"＿"をつけるとページとしてはコンパイルされません。
  - js
    webpackを導入したのでこちらもファイル分割が可能です。
    "_"つけるとやはりモジュール扱いです。

### Swiperを利用する際の手順

```
## プロジェクトのルートに移動
$npm install swiper
```

index.jsファイルでswiper読み込み

```
import Swiper from 'swiper/bundle';
```

```src/sass/_modules/```配下に、```_swiper.scss``` を作成
```node_modules/swiper/swiper-bundle.min.css``` の中身を丸っとコピーして、作成した```_swiper.scss```ファイルにペースト

src/sass/style.scssでswiperファイルの読み込み

```
@use './_modules/_swiper';
```


======================================================================
↓↓↓↓↓↓↓↓使うだけならここからは読まなくて大丈夫です↓↓↓↓↓↓↓↓
======================================================================


### 開発環境の各ファイルの説明
#### .gitignore
  gitで無視したいファイルを設定します。
  デフォルトは/dist, /node_modules, .DS_Store, .vscodeを無視。

#### gulpfile.mjs
  gulpの設定ファイル。gulp5で記述されています。
  ES Modules（import・export）を使うためmjsファイルになってます。
  やっていることはざっくりまとめると下記になります。
  - ejs,sassのコンパイル
  - 画像の圧縮
  - webpackの実行（webpack-streamを使用することでwebpackの実行もこちらで制御してます）
  - ローカルサーバーの立ち上げ
  - start時のファイル監視
  - build時の/distファイルの削除

#### webpack.config.mjs
  webpackの設定ファイル。webpack5で記述されています。
  こちらもmjsファイルになってます。webpackはjavascriptのバンドルをしています。
  css・画像など入れたりできますが、今回は純粋にjavascriptだけです。
  やっていることはざっくりまとめると下記になります。
  - start, build時に何をするかここで決めています。
  - babel（jsのマイナーチェンジ）
