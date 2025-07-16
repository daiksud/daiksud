---
title: GitHub Codespacesを使おう！
description: GitHub Codespaces、めちゃ便利です。使わないなんてもったいないです。
pubDate: 2025-07-16T23:30:00+09:00
heroImage: ./assets/cs.jpg
tags:
  - github
  - codespaces
  - development-container
  - everything-as-code
  - gitops
---

みなさん、[GitHub Codespaces](https://github.co.jp/features/codespaces) は使っていますか？

えっ？まだローカルPCに `git clone` なんかしてるんですか？

`Infrastructure as Code` なんて古いです。「インフラしか」コード化してないなんて。

今や `Everything as Code` の時代です。GitOpsです。
すべてをコード化しましょう。

もちろん **「開発環境も」** コード化しましょう。

## 🚀 GitHub Codespacesのメリデメまとめ

### 👍 いいところ

- 開発環境のコード化（DevEnv as Code）
- 開発環境のセットアップが要らなくなる
- 全員に同じ環境を簡単に展開できる
- リポジトリごとに環境を用意できる
- どこでもどんなデバイスでも開発できる

### 👎 わるいところ

- たまにモタつくことがある
- たまに落ちることがある
- 複数リポジトリ間（Codespaces間）のファイルコピーが面倒くさい

## 📓 開発環境のコード化（DevEnv as Code）

**あなたの開発環境、すぐに再現できますか？**

おそらく難しいんじゃないかなと思います。
エンジニアならまぁ `dotfiles` ぐらいはGitHubに置いてるよという人も多いんじゃないかなと思います。
でも `dotfiles` リポジトリで再現できるのは、所詮 `dotfiles` だけです。

新しいMacBookを買ってきました。`dotfiles` を `git clone` しました。
それで以前のMacBookの開発環境を再現できてますか？

恐らくできてないですよね。だって、それから [Homebrew](https://brew.sh/) 入れますよね。
しかも、`dotfiles` はスタンダードな書き方がないため、エンジニアの数だけ `dotfiles` のスタイルが存在します。
秘伝オブ秘伝のタレです。ポータビリティがありません。

一方Codespacesは、[Development Container (Dev Container)](https://containers.dev/) というスタンダードがあります。
他人が書いたDev Containerの設定でも、全員同じ書き方なので理解しやすいですし、マネできます。

どんなツールが入っているかなどは、 [devcontainer.json](https://containers.dev/implementors/spec/) と `Dockerfile` ですべてコード化されます。

ぜひみなさんも **Development Environment as Code** しましょう。

## 🏃 開発環境のセットアップが要らなくなる

**DevEnv as Codeのおかげです。**

買ってきたばかりの新しいMacBookでも、[Visual Studio Code](https://code.visualstudio.com/) [^1] をインストールして、[github.com](https://github.com) にアクセスして、Codespacesを起動すれば、すぐ開発できます！

[^1]: [Neovim](https://neovim.io/) じゃなきゃやだ？そんなあなたに朗報です。[Dev Container](https://docs.github.com/ja/codespaces/setting-up-your-project-for-codespaces/configuring-dev-containers/adding-features-to-a-devcontainer-file?tool=webui)で[Neovim](https://github.com/devcontainers-extra/features/tree/main/src/neovim-apt-get)がインストールされた[プレビルドを構成](https://docs.github.com/ja/codespaces/prebuilding-your-codespaces/configuring-prebuilds)して、[`gh cs create`](https://cli.github.com/manual/gh_codespace_create) して [`gh cs ssh`](https://cli.github.com/manual/gh_codespace_ssh) して `nvim` してください！

ジョインした新しいメンバーも、Codespacesを起動するだけですぐ開発を始められます。

「ようこそ。あなたを歓迎します。じゃあまずこれが開発環境のセットアップマニュアルなので、セットアップお願いします。初日はこれで終わると思います」

あーもったいないもったいない。

## 👥 全員に同じ環境を簡単に展開できる

「全体連絡です！[Prettier](https://prettier.io/) じゃなくて [Biome](https://biomejs.dev/) に移行したので、インストールお願いします！」

**こんな連絡もう必要ありません。**

Codespacesなら、Pull Requestを出して、レビューしてもらってメンバーの合意を取り（Approveしてもらい）、マージするだけです。

Pull Requestの中で「なぜPrettierをやめたのか？」「なぜBiomeにしたのか？」の議論や意思決定の記録も残ります。

## 📦 リポジトリごとに環境を用意できる

プロジェクトによってバージョンが違うから、 `venv` でバージョン切り替えできるようにする？

**もう要りません。**

だって、その環境はそのプロジェクトでしか使わないです。

じゃあ、直接そのプロジェクトで使うバージョンをシステムワイド（コンテナワイド？）に入れちゃえばいいんです。

## 🌍 どこでもどんなデバイスでも開発できる

「うーん次の予定までちょっとだけあるな。でもiPadしか持ってないから開発できないな…」

CodespacesならブラウザでVS Codeが動かせるので、iPadでも開発できます！[^2]

[^2]: バリバリ効率よく開発できるとは言いません。。前にやったことありますが、数行変えるのもかなり大変でした。。。

開発中毒なあなたにぜひおすすめです。

## ⚠️ たまにモタつく・落ちる

これはまぁリモートのVMにネットワーク経由で繋いでいる状態なので、ある程度仕方ないかなと思います。

このデメリットより、明らかにメリットが上回っています。

そう感じます。

## 🔄 複数リポジトリ間（Codespaces間）のファイルコピーが面倒くさい

素直にやろうとすると、まずローカルにダウンロードして、それをアップロードし直す、というのが必要なんですよね。

同じPC内に両方のリポジトリがあれば、`cp` だけで済むので、これは地味に面倒でした。

ただ、これは不思議なもので、この制約がある状況でずっと作業しているうちに、自然とそういうことが必要な作業のやり方をしなくなりました。
なので今はあまりデメリットに感じていないです。

数か月に1回ぐらい必要なケースが出てきますが、その時は片方のCodespacesにもう片方のリポジトリをクローンして、`cp` すればおしまいです。

## 📝 まとめ

GitHub Codespacesを使うべき理由を紹介しました。

みなさんもぜひ `Development Environment as Code` しませんか？

**「すべて」をコード化しましょう。**
