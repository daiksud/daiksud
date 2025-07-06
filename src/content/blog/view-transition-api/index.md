---
title: View Transition APIを導入してみた
description: ブログ一覧ページからブログ記事ページ遷移でヒーローイメージのアニメーションをView Transition APIを使って実装してみた。
pubDate: 2025-07-06T09:00:00+09:00
heroImage: ./assets/view-transition-api.jpg
tags:
  - web
---

[ICS MEDIA](https://ics.media/) みたいに、記事をクリックするとその記事のヒーローイメージがみょーんと動くやつをやってみたかったので実装してみました。

## カギはView Transition API

View Transition APIというものを使えば、なんとCSSだけでページ遷移アニメーションを実装できます。
以前はこの手の凝った演出を実現しようと思ったら、相当複雑なJavaScriptが必要で、それはそれは重たいサイトになったでしょうから、かなり画期的です。

で、そんなView Transition APIは2023年の3月ごろに登場したようです。
ブラウザはChromeが2024年6月に、Safariは2024年12月にサポートしたみたいですね。意外と最近なんですね。

これを使うとどうなるのかの具体的なイメージは [View Transitions API入門 - 連続性のある画面遷移アニメーションを実現するウェブの新技術](https://ics.media/entry/230510/) でより詳しく紹介されているので、そちらを見てみてください。

## 余裕があれば入れても損はない

Web界隈の新機能はたいてい、登場してから実用に耐える状況になるのにかなり時間がかかる傾向があります。
例えばChromeでサポートされたからと言って、SafariやFirefoxでサポートされていなければ、その機能は使うわけにはいきません。
Chromeだと動くけどSafariでは動かないので、全員Chrome使ってください、なんて通るわけがないですよね。

でも、このView Transition APIであればサポートしていないブラウザがあったとしてもガンガン使っていけます。
なぜならサポートしていないブラウザは単純にアニメーションしないだけだからです。
アニメーションしなかったところで、ユーザーになんら不利益はないので、問題ないのです。

逆に言えば無くても困らないので、完全に自己満足でしかないケースがほとんどかもしれませんが。。
でも、iPhoneなんかはこういうぬるぬるアニメーションを採用して気持ちいいUXを提供したからこそ、今の地位があると思います。
なのでこういうUXを向上させるような機能って、絶対に要らないわけでもない気がするんですよね。

## 具体的な実装方法

このWebサイトは [Astro](https://astro.build) で作られていて、Multi Page Application (MPA)です。
なので前述した [ICS MEDIAの記事](https://ics.media/entry/230510/#view-transitions-api%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%EF%BC%88mpa%E7%B7%A8%EF%BC%89) のMPA向けの追記をするだけで簡単に実装できました。

というか、皆さんのサイトももしMPAなら、以下のCSSだけでも全ページに入れておいていいんじゃないかなと思います。
これだけでページ遷移がフェードするようになるので、これだけでも意外と印象が違います。

```css
@view-transition {
  navigation: auto;
}
```

このWebサイトではブログ記事の一覧のヒーローイメージから、ブログ記事ページのヒーローイメージにシームレスに繋げたかったので、 `view-transition-name` を付けました。
この名前はページ内でユニークである必要がありますが、手でつけるのはまぁ無理なので、各ポストのIDを自動的に名前に付与する実装にしました。

- [ブログ一覧ページのソースコード](https://github.com/daiksud/daiksud/blob/7e6075d14a60b6ddce90bfa298e4db8bf712348c/src/pages/blog/index.astro#L30)
- [ブログ記事ページのソースコード](https://github.com/daiksud/daiksud/blob/7e6075d14a60b6ddce90bfa298e4db8bf712348c/src/layouts/BlogPostLayout.astro#L28)

こうやって名前をつけるだけでアニメーションが実現できるので、積極的に導入してもいいんじゃないかなと思います。

## Astroのビュートランジション機能は使わなかった

実は、Astroにも [ビュートランジション](https://docs.astro.build/ja/guides/view-transitions/) 機能があります。

ですが、今回は使いませんでした。
というのも、AstroのビュートランジションはなぜかJavaScriptを使用するためです。

[具体的な実装方法](#具体的な実装方法) でも紹介した通り、MPAの場合はCSSの指定だけで実現でき、JavaScriptは登場しません。（最初にも書きましたがこれが凄いところ）
Astroのやり方だとJavaScriptが使われてしまったので、イマイチだなぁと思ってやめました。

Astroって [ゼロJavaScript](https://docs.astro.build/ja/basics/astro-components/) が売りの一つなので、なるべくJSが増える要素を減らしておきたいんですよね。

## まとめ

View Transition APIを使って、CSSだけでページ遷移のアニメーションを実装しました。
Astroの場合MPAでビルドできるのでJS不要で簡単に実装できました。
皆さんのWebサイトももしMPAなら簡単に導入できると思うので、ぜひチャレンジしてみてください。
