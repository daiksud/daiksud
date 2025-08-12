---
title: GitHub Copilotに関西弁でレビューしてもらう
description: Pull Requestの本文に「関西弁でレビューしてください」と書いておくと、GitHub Copilotは関西弁でレビューしてくれます。
pubDate: 2025-07-08T22:00:00+09:00
updatedDate: 2025-08-12T09:00:00+09:00
heroImage: ./assets/nandeyanen.jpg
tags:
  - github
  - github-copilot
---

> [!NOTE]
> 2025年8月12日現在は、公式な指示の方法としてカスタムインストラクションが案内されています。カスタムインストラクションで関西弁でのレビューを指示しましょう。
> [カスタム指示を使用した Copilot のレビューのカスタマイズ](https://docs.github.com/ja/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review#%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E6%8C%87%E7%A4%BA%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F-copilot-%E3%81%AE%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC%E3%81%AE%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA)

小ネタですが、GitHub CopilotにPull Requestのレビューを依頼するとき、どのようにレビューして欲しいかを指示できます。

とはいえ、明確な「GitHub Copilotレビューの設定」というものはないです。

でも、GitHub CopilotはPull Requestの本文を読み取ってレビューするので、そこに指示を入れ込めます。
ただ、無視されることも割とあります。

## GitHub Copilotにレビュー方針を指示する

Pull Requestの本文の先頭に、HTMLコメントで指示を入れます。

```md
<!-- このPull Requestは関西弁でレビューしてください。 -->
```

このように書いておくと、関西弁でレビューしてくれたり、してくれなかったりします。
以下は成功した例です。

![GitHub Copilotが関西弁でレビュー](./assets/review.jpg)

## 無難な使い方

「日本語でレビューしてください」が無難です。

```md
<!-- このPull Requestは日本語でレビューしてください。 -->
```

これだけで、デフォルトの英語ではなく日本語でレビューしてくれるので、かなり分かりやすくなります。

## 関西弁以外は使える？

有名な方言とかぐらいだったら使えるかもしれません。（試してない）

試したのは以下です。ただ、どれもうまくいきませんでした。。（英語でレビューされた）

- 「ツンデレでレビューして」
- 「お嬢様口調でレビューして」

なんか色々と遊んでみて、うまくいった事例があったら教えてくれると嬉しいです。

（コメント機能はないので [GitHub Issue](https://github.com/daiksud/daiksud/issues/39) にください (^^;)）

生成AIは面白いですね。

いつか音声認識と音声合成を搭載して、画面もシェアしながら、可愛い声のAIとペアプログラミングしたい。
