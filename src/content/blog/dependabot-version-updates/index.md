---
title: Dependabotバージョンアップデートをセットアップする
description: Dependabotバージョンアップデートをセットアップして、依存関係の自動アップデートのPull Requestが作られるようにしました。
pubDate: 2025-07-07T18:00:00+09:00
heroImage: ./assets/dependabot-version-updates.jpg
tags:
  - github
  - dependabot
  - continuous-integration
  - continuous-delivery
---

[Dependabotバージョンアップデート](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates) を有効にしたので、その手順を説明します。

## Dependabotとは

Dependabotは依存関係のアップデートをチェックし、もし新バージョンがあればそれに更新するPull Requestを作ってくれるボットです。

詳しくは知らないのですが、どこかが作っていたDependabotをGitHubが買収したか何かで、GitHubの一部として組み込まれたようです。

## Dependabotの機能

「依存関係を更新する」というのは当然なのですが、依存関係のタイプが大きく分けて2つあります。

- セキュリティアップデート
- **バージョンアップデート**

実はこの2つが同じようで違う感じになっていて、地味にややこしい仕組みになっています。
が、それはひとまず置いておいて、今回は後者の「Dependabotバージョンアップデート」を有効にするまでのやり方を説明します。

## Dependabotバージョンアップデートを有効にする

とは言っても、何も別に難しいことはありません。
リポジトリに `/.github/dependabot.yml` というファイルを作り、アップデート対象にしたいパッケージエコシステムを指定するだけです。

```yaml
# https://docs.github.com/code-security/dependabot/
version: 2
updates:
  - package-ecosystem: npm # アップデート対象のパッケージエコシステム
    directory: / # パッケージエコシステムのファイルが存在するディレクトリ
    schedule:
      interval: daily # 更新チェックを行う間隔
```

このファイルを作るだけで、リポジトリルートの `package.json` に書かれているnpmパッケージのバージョンアップをやってくれます。

## Dependabotバージョンアップデートの設定

色々と設定項目があります。
[Dependabot オプション リファレンス](https://docs.github.com/ja/code-security/dependabot/working-with-dependabot/dependabot-options-reference) を見ればすべて載っています。

また、やりたくなりそうなことはガイドもいくつかあります。

- [より細かいスケジュール設定（毎週日曜日の午前3時にするなど）](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates/optimizing-pr-creation-version-updates#controlling-the-frequency-and-timings-of-dependency-updates)
- [Pull Requestのグループ化](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates/optimizing-pr-creation-version-updates#prioritizing-meaningful-updates)
- [レビュアーとアサインを自動的に設定する](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates/customizing-dependabot-prs#automatically-adding-reviewers)
- [Pull Requestに付けるラベルの設定](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates/customizing-dependabot-prs#automatically-adding-reviewers-and-assignees)
- [コミットメッセージにプレフィックスを付ける](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates/customizing-dependabot-prs#labeling-pull-requests-with-custom-labels)
- [マイルストーンを紐づける](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates/customizing-dependabot-prs#adding-a-prefix-to-commit-messages)
- [ブランチのプレフィックスを変える](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates/customizing-dependabot-prs#associating-pull-requests-with-a-milestone)
- [デフォルトブランチ以外をターゲットにする](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates/customizing-dependabot-prs#changing-the-separator-in-the-pull-request-branch-name)

ほとんどのやりたいことは上記でカバーできていると思います。

## Dependabotの注意点

[Dependabotの機能](#Dependabotの機能) でも触れましたが、Dependabotは以下の2つに分けられます。

1. Dependabotセキュリティアップデート
2. Dependabotバージョンアップデート

で、これらの機能によって作られるPull Requestをあれこれとカスタマイズしたくなるでしょう。
なので当然 [Dependabot オプション リファレンス](https://docs.github.com/ja/code-security/dependabot/working-with-dependabot/dependabot-options-reference) を見るわけですが、ここで注意点があります。

> [!WARNING]
> セキュリティアップデートで使える設定、バージョンアップデートで使える設定、それぞれが微妙に異なります。

これがめちゃめちゃハマりやすいです。

どう違うのかは別記事で詳しく説明したいと思いますが、1つだけ紹介します。
それは、[デフォルトブランチ以外をターゲットにする設定](https://docs.github.com/ja/code-security/dependabot/dependabot-version-updates/customizing-dependabot-prs#changing-the-separator-in-the-pull-request-branch-name) が使えるのはバージョンアップデートだけ、というものです。

注意書きもあります。

> Dependabot により、**既定のブランチのみ**に対してセキュリティ更新プログラム用の pull request が生成されます。
> `target-branch` を使うと、結果として、そのパッケージ マネージャーのすべての構成設定は、セキュリティ更新プログラムではなくバージョン更新プログラムに "のみ" 適用されます。

言い回しが分かりにくいですね。おそらく以下の意味です。

「Dependabot が作成する「セキュリティアップデート」の Pull Request は、**規定のブランチにのみ**生成されます。
`target-branch` を設定すると、この設定を含む一連の設定は「バージョンアップデート」に**のみ**適用されるようになり、セキュリティアップデートでは無視されます。

こんな感じでわっかりにくい設定などが結構あるので、後日紹介します。

## まとめ

このサイトのリポジトリでDependabotバージョンアップデートを有効にしてみました。
Dependabotバージョンアップデートは `/.github/dependabot.yml` を作るだけで簡単に有効化できます。

バージョンアップのチェックが可能なパッケージエコシステムは意外と多く、**Docker**や**Dev Containers**や**GitHub Actions**なんかもチェックできます。
参考: [サポートされているエコシステムとリポジトリ](https://docs.github.com/ja/code-security/dependabot/ecosystems-supported-by-dependabot/supported-ecosystems-and-repositories#supported-ecosystems-and-repositories)

バージョンアップをサボると、後々苦労します。
Dependabotバージョンアップデートを活用して、小さな変更で済むうちに、こまめにアップデートするのが吉です。
