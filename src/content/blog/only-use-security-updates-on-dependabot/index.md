---
title: Dependabotでバージョンアップデートを使わずにセキュリティアップデートの挙動を変える
description: Dependabotでは dependabot.yml で挙動を制御できるが、 dependabot.yml を作ると勝手にバージョンアップデートが動き始めてしまう。バージョンアップデートを無効にしつつ、セキュリティアップデートを有効にする方法を説明する。
pubDate: 2025-07-10T22:00:00+09:00
heroImage: ./assets/open-pull-requests-limit-0.jpg
tags:
  - github
  - dependabot
---

## TL;DR

[`open-pull-requests-limit`](https://docs.github.com/ja/code-security/dependabot/working-with-dependabot/dependabot-options-reference#open-pull-requests-limit-) を `0` にするとバージョンアップデートのPull Requestが作られず、セキュリティアップデートのPull Requestだけになります。

## 概要

Dependabotには [バージョンアップデート](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates) と [セキュリティアップデート](https://docs.github.com/ja/code-security/dependabot/dependabot-security-updates) の2種類があります。
これらは似ているようで、微妙に挙動が異なります。

今回はハマりやすいポイントをちょっと解説します。

## `dependabot.yml`は基本バージョンアップデート用の設定

Dependabotセキュリティアップデートは、リポジトリのSettings > Advanced Securityの中に「Dependabot security updates」という項目でEnableすると有効になります。
これだけで、Dependabotはセキュリティリスクのあるパッケージなどを見つけると、それを問題のないバージョンまでアップデートするPull Requestを作り始めます。

一方で、バージョンアップデートは同じページに「Dependabot version updates」という項目があります。
しかし、こちらはEnable/Disableではなく「Configure」というボタンになっており、押すと `.github/dependabot.yml` の編集画面が開かれます。

ここから分かる通り `dependabot.yml` は _基本的に_ バージョンアップデートのためのファイルなのです。

## ところがどっこい

`dependabot.yml` は **セキュリティアップデートにも** 作用します。

つまり、セキュリティアップデートのPull Requestの作らせ方を制御するには `dependabot.yml` を作って設定するしかありません。
これが非常に厄介な仕様です。

「バージョンアップデートをしたいわけではない」のに、 `dependabot.yml` を作る必要があるので、勝手にバージョンアップデートが動き始めてしまうのです。

## 解決策

最初に書いた通り [`open-pull-requests-limit`](https://docs.github.com/ja/code-security/dependabot/working-with-dependabot/dependabot-options-reference#open-pull-requests-limit-) を `0` にすることで解決できます。

非常にわかりにくい。。

## 悪い仕様のお手本のような仕様

この `open-pull-requests-limit` を `0` にするとバージョンアップデートのPull Requestが作られず、セキュリティアップデートのPull Requestのみが作られるようになる、という仕様。

最悪です。

明らかに直感的ではないですよね。
Pull Request数をゼロに制限しているという「ように見える」のに、セキュリティアップデートはこれを無視して作るのですから。

これが、「`dependabot.yml` は _基本的に_ バージョンアップデートのためのファイル」と説明した理由です。
セキュリティアップデートは、一部の設定は考慮するけど、一部の設定は無視するのです。

皆さんはこんなクソ仕様のシステムを作らないように気をつけましょう。
