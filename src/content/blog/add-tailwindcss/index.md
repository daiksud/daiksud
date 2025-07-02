---
title: Tailwind CSSを導入した
description: AstroでTailwind CSSを導入しました。
pubDate: 2025-07-02
heroImage: ./assets/tailwind-css.jpg
---

[Tailwind CSS](https://tailwindcss.com/) を導入してみた。

ここ最近のWeb界隈ではCSSを自前で書くより、Tailwind CSSを使うことがデファクトスタンダードになりつつあるような気がしている。
正直、そんなに使ったこともないので、使ってみることで慣れておく。

## 導入手順

1. AstroのTailwind CSSインテグレーションを追加
2. Tailwind CSS向けにレイアウト・スタイルシートを整備

これらをやっていく。

## AstroのTailwind CSSインテグレーションを追加

まずは [Astroのドキュメント](https://docs.astro.build/en/guides/styling/#tailwind)[^1] の手順通りに進めて、Astroにインテグレーションを追加する。

[^1]: ここではあえて英語のドキュメントのリンクにしている。というのも、英語版の方が明らかに充実していて、日本語版ではよく分からなかった。

以下のコマンドを実行する。

```sh
pnpm astro add tailwind
```

すると以下のことをしてくれる。

- AstroでTailwind CSSを利用するために必要なパッケージのインストール
- `astro.config.mjs` にTailwind CSSを利用するための設定の追記

出力の最後に、自分でやらなきゃいけないことを指示してくれている。

- 共通レイアウトにTailwindスタイルシートを追加する

今は `src/styles/global.css` がそれにあたるので、ここに追加する。

```css
@import 'tailwindcss';
```

最後はレイアウトファイルでこのCSSをインポートすればよい。

```astro
---
import '../styles/global.css'
---
```

でも、Astroのブログテンプレートは全ページの共通レイアウトがなく、[ブログの記事ページ向けのレイアウト](https://github.com/daiksud/daiksud/tree/8fab36b33c4a6a48d834eb80f084b0b52f32d874/src/layouts) しか存在しない。
[`index.astro`](https://github.com/daiksud/daiksud/blob/8fab36b33c4a6a48d834eb80f084b0b52f32d874/src/pages/index.astro) などは `<html>` からすべて書かれている。

ちょっとイマイチな気がするので、全ページ共通のレイアウトを作っていく。

## Tailwind CSS向けにレイアウト・スタイルシートを整備

というわけで、`<RootLayout>` コンポーネントを作る。

```astro
---
// src/layouts/RootLayout.astro
import BaseHead from '../components/BaseHead.astro'
import Footer from '../components/Footer.astro'
import Header from '../components/Header.astro'
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts'
import '../styles/global.css'

const { title, description } = Astro.props
---

<!doctype html>
<html lang="ja">
  <head>
    <BaseHead
      title={title ? `${title} | ${SITE_TITLE}` : SITE_TITLE}
      description={description ?? SITE_DESCRIPTION}
    />
  </head>

  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

ベースは元々の [`index.astro`](https://github.com/daiksud/daiksud/blob/8fab36b33c4a6a48d834eb80f084b0b52f32d874/src/pages/index.astro) で、h1とpがあったところを `<slot />` にして、propsでtitleとdescriptionを受け取れるようにして、global.cssをインポートしている。

あとはすべてのページでこのRootLayoutを使うようにコードを書き換えていけば、完成。

## 実際のPull Request

上記の手順で行った変更の全容は [daiksud/daiksud#4](https://github.com/daiksud/daiksud/pull/4) で確認できる。
