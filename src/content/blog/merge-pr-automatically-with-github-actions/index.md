---
title: GitHub Actionsで自動的にPull Requestをマージする
description: Pull RequestをGitHub Actionsで自動的にマージさせる
pubDate: 2025-07-12T22:00:00+09:00
heroImage: ./assets/auto-merge.jpg
tags:
  - github
  - github-actions
  - continuous-integration
  - continuous-delivery
  - devops
---

なぜPull Requestを自動的にマージさせたいのかというと、**トランクベース開発をやりたいから** です。

継続的デリバリーをきちんと実践し、1日に何回もデプロイできる状況を実現したい場合、トランクベース開発を実践できた方が良いでしょう。
「トランクベース開発ってmainに直接コミットするやり方じゃないの？」と思ったあなたは鋭いです。
真のトランクベース開発は、mainブランチに直接コミットするスタイルです。

しかし、GitHubにはPull Requestという強力な機能があります。
そしてGitHubには[ルールセット](https://docs.github.com/ja/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets)や[必須ステータスチェック](https://docs.github.com/ja/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-status-checks-to-pass-before-merging)といった継続的インテグレーションにうってつけの機能もあります。
また、サードパーティもPull Requestを前提とした機能が多いため、これを使わないのはもったいないです。

そこで、Pull Requestを使いつつも、トランクベース開発のエッセンスを取り込みます。
Pull Requestを作るけどすぐに自動的にマージさせ、擬似的なトランクベース開発を実現します。

## ルールセットで必須ステータスチェックを有効にする

[ルールセット](https://docs.github.com/ja/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets) を作成すると、Pull Requestがマージできる条件を作れます。

使用できるルールは多岐に渡りますが、[マージ前のPull Requestを必須にする](https://docs.github.com/ja/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-a-pull-request-before-merging) は必須ルールの1つでしょう。1人で開発している人（私とか）でも、有効にしておくべきかなと思います。自然とセルフレビューをするクセがつきますし、Pull Requestの本文をきちんと書いておけば、後々振り返りやすいです。

ルールセットで指定できるルールの1つに、「必須ステータスチェック」があります。
必須ステータスチェックとは、GitHub ActionsのジョブやGitHub Appsのジョブ（Vercelのデプロイとか）を指定し、**それらがパスしていないとマージを許可しない** という機能です。
人間がPull Requestをマージする場合は、自然とジョブが成功するのを待つと思いますが、GitHub Actionsで自動マージさせる場合はこの仕組みを使ってやらないと、テストが終わっていないうちにガンガンマージしてしまいます。なので必須ステータスチェックが _必須_ です。

必須ステータスチェックは **Require status checks to pass** をオンにすると有効になります。
Require status checks to pass を有効にすると、追加設定が出現します。

追加設定では、 **Require branches to be up to date before merging** も有効にし、トピックブランチを切った時からベースブランチが更新されていた場合はマージできないようにしましょう。これで、「先に進んだベースブランチにマージすると実はテストに失敗する状態だった」という状況を回避でき、CI によるテストなどが確実にパスしていることを保証できます。

そして、 **Status checks that are required** にパスすることを必須としたいワークフロー（チェック）を追加します。[このサイトのリポジトリ](https://github.com/daiksud/daiksud) では、AWS Amplifyのビルド・デプロイのジョブを指定し、これらが成功していることをチェックしています。

## Pull Requestを自動的にマージする

必須ステータスチェックを有効にしたら、必須となったステータスチェックをパスし次第マージさせるような仕組みを導入します。
具体的には、GitHub ActionsにPull RequestをApproveさせ、さらにマージもさせます。

そのためには、まず以下のような設定変更が必要です。

- **Allow auto-merge（自動マージを許可する）** をオンにする（[Settings > General > Pull Requests](https://github.com/daiksud/daiksud/settings)）
- **Allow GitHub Actions to create and approve pull requests（GitHub ActionsにPull Requestの作成と承認を許可する）** をオンにする（[Settings > Actions > General > Workflow permissions](https://github.com/daiksud/daiksud/settings/actions)）

これで、GitHub ActionsがPull Requestを承認して、さらに必須ステータスチェックがパスし次第マージするスイッチをオンにできるようになります。

次に、以下のようなワークフローを作成します。

```yaml
# .github/workflows/auto-merge-pr
name: auto-merge-pr

on:
  pull_request:

defaults:
  run:
    shell: bash

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: write
      pull-requests: write
    steps:
      - name: checkout
        uses: actions/checkout@v4
      - name: auto-merge
        run: |
          gh pr review "${GITHUB_HEAD_REF}" --approve
          gh pr merge "${GITHUB_HEAD_REF}" --merge --auto
        env:
          GH_TOKEN: ${{ github.token }}
```

このワークフローでは、GitHub Actionsで [GitHub CLI](https://cli.github.com/) を使って、レビューとマージを行っています。

ちなみに、自動マージワークフローを追加するためのPull Requestを作ると、そのPull Requestで早速このワークフローが動作し、必須ステータスチェックをパスすれば自動的にマージされるはずです。

## まとめ

GitHubでPull Requestにまつわる各種機能を活かしつつ、トランクベースに近い開発スタイルを実現するため、Pull Requestを自動的にマージする方法を紹介しました。しかし、無条件で自動マージすることは危険です（当然ですね）。適切なチェック（ビルドの成功、ユニットテストや自動受け入れテスト、ステージングへのデプロイなど）をパスしたことを証明するための手段として必須ステータスチェックも併用すべきです。

お気付きかもしれませんが、この自動マージを実践する場合には、 **GitHub Actionsによる自動テストなどへの信頼性** を高めておく必要があります。「ビルドはできてるし、（一応書いてある）自動テストも通って、デプロイもできてるけど、本当にバグがないか不安だ」と思っているのであれば、自動マージは時期尚早です。まずは **自動テストが通っていれば本番にデプロイしても問題ない** と自信を持って言えるぐらいにしましょう。
