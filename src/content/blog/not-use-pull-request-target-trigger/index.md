---
title: GitHub Actions の pull_request_target トリガーをちゃんと理解する
description: GitHub Actions には pull_request というトリガーと pull_request_target というトリガーの2つがあります。似ていますが仕様が結構異なり、特に pull_request_target トリガーは脆弱性となりやすいため、注意が必要です。
pubDate: 2025-08-07T22:00:00+09:00
heroImage: ./assets/two-pull-request-triggers.png
tags:
  - github
  - github-actions
  - security
---

## `pull_request_target` トリガーとは

`pull_request_target` トリガーが指定されたワークフローは、Pull Requestに関するイベントが発生した時に起動する。

代表的なイベントアクティビティは `opened`, `synchronize`, `reopened` だ。
`types` キーワードを指定しない場合、この3つがデフォルトである。

要するに、起動する条件はほとんど `pull_request` と同じだ。
ちょっと違いはあるものの、基本的には `pull_request` トリガーの場合と同様、Pull Requestがオープンされたり、Pull Requestのブランチに新しいコミットがプッシュされたりすると、ワークフローがトリガーされる。

## `pull_request` と何が違うのか

一番の違いはセキュリティに関係する以下の2点だ。

1. **ターゲットリポジトリへの書き込み権限を持つ（ `permissions` を指定しない場合のデフォルト）**
2. **シークレットの読み取り権限を持つ**

**フォークされたリポジトリ（信頼できないユーザー）からのPull Requestであっても**、上記の権限を持つ。
`pull_request` の場合は、フォークされたリポジトリ（信頼できないユーザー）からのPull Requestに上記権限は付与されないし、承認しない限り実行しない。

信頼できないユーザーに権限を与えないし、むやみに信頼できないコード（ワークフロー）を実行しないようにするのは、当然のことだ。
しかし `pull_request_target` の場合は、信頼できないユーザーからのPull Requestであっても、そのワークフローは権限を持つし、承認せずとも実行される。

なんとなくヤバそうな雰囲気を感じてもらえただろうか。
「安全に使うための理屈が120%理解できた」という自信がないのなら、 `pull_request_target` トリガーは使わないほうが無難だ。

## コンテキストと権限

`pull_request_target` の場合はマージ先のブランチ（ベースブランチ）のコンテキストで実行される。
つまり、ベースブランチにワークフローが存在している必要がある。

[GitHubドキュメント](https://docs.github.com/ja/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target) によると以下のように書いてある。

> このイベントは、 `pull_request` イベントのようにマージ コミットのコンテキストではなく、pull request のベースのコンテキストで実行されます。

`pull_request` イベントの場合、新規にワークフローを作るようなPull Requestの場合でも、そのPull Request自身で追加したいワークフローが実行される。
だから、フォークされたリポジトリ（信頼できないユーザー）からのPull Requestに書き込み権限やシークレット読み取り権限は付与しないし、承認しない限り実行しないのだ。

`pull_request_target` の場合は先述した通り、ベースブランチのワークフローが実行される。
そのワークフローを変えるPull Requestを出しても、実行されるのはベースブランチの元のワークフローである。

ベースブランチにあるワークフローということは、そのリポジトリの書き込み権を持つ誰かがレビュー済みのはずである。
だからそのワークフローは安全であると信用できるので、書き込み権限やシークレットの読み取り権限を持たせられる。

## 安全ではないコードが実行されるのを避けられる

[GitHubドキュメント](https://docs.github.com/ja/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target) に以下の文もある。

> リポジトリを変更したり、ワークフローで使うシークレットを盗んだりする可能性がある、pull request の head から安全ではないコードが実行されるのが避けられます。

これはどういうことかというと、 `pull_request_target` トリガーではさっきも書いた通り、 **ベースブランチのコンテキスト** でワークフローが実行される。
つまり、Pull Requestを出してきたユーザーの **信頼できないコードやワークフロー** が実行されないということである。

説明では「コード」と書いてあるが、これには **ワークフロー自身も含まれる** ところがポイントだろう。
攻撃者が `pull_request_target` トリガーのワークフローを改変してPull Requestで出してきたとしても、それが実行されるわけではない。
ベースブランチに存在しているワークフローが実行される。
よって、 `pull_request_target` トリガーのワークフローはリポジトリの書き込み権限やシークレットのアクセス権限を持っていても、それが悪用されることはない。

## pull request からコードをビルドまたは実行する場合は使ってはならない

[GitHubドキュメント](https://docs.github.com/ja/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target) に以下の文がある。

> pull request からコードをビルドまたは実行する必要がある場合は、このイベントを使わないでください。

この文のポイントは **pull request から** の部分だ。
これはどういうことかというと、「Pull Requestで変更されたもの」という意味である。
つまり、 **「Pull Requestによって提出された、外部ユーザーによって作られたコードをビルドまたは実行する場合」** は `pull_request_target` を使ってはならない、ということだ。

なぜか？

もちろん、 `pull_request_target` トリガーで起動したワークフローが、リポジトリへの書き込み権限や、シークレットへのアクセス権限を持つからだ。
そのような権限を持つ状態で、どこの誰とも分からないPull Request作成者の任意のプログラムコードが実行することは、当然やってはいけない。

## GitHubドキュメントの警告文

[pull_request_target](https://docs.github.com/ja/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target) の説明に以下のような警告がある。

> [!WARNING]
> `pull_request_target` イベントによってトリガーされるワークフローでは、フォークからトリガーされているのであっても、 `permissions` キーが指定されてワークフローがシークレットにアクセスできるのでない限り、読み取り/書き込みのリポジトリ アクセス許可が `GITHUB_TOKEN` に付与されます。
> ワークフローはPull Requestのベースのコンテキストで実行されますが、このイベントでPull Requestから信頼できないコードをチェックアウトしたり、ビルドしたり、実行したりしないようにしなければなりません。
> さらに、キャッシュではベース ブランチと同じスコープを共有します。キャッシュ ポイズニングを防ぐために、キャッシュの内容が変更された可能性がある場合は、キャッシュを保存しないでください。
> 詳細については、GitHub Security Lab の Web サイトの [GitHub Actions およびワークフローのセキュリティ保護の維持: pwn 要求の阻止](https://securitylab.github.com/research/github-actions-preventing-pwn-requests) に関する記事を参照してください。

なるほど。分からん。

1文目が意味不明すぎて理解する気が削がれるが、 [英語](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target) だと以下のように書いてある。

> For workflows that are triggered by the `pull_request_target` event, the `GITHUB_TOKEN` is granted read/write repository permission unless the `permissions` key is specified and the workflow can access secrets, even when it is triggered from a fork.

英語は得意じゃないので自信はないが、多分以下が正しい解釈だろう。

> `pull_request_target` イベントによってトリガーされるワークフローは、　`GITHUB_TOKEN` に、 リポジトリの読み取り/書き込みアクセス許可が（`permissions` キーを指定してない場合）付与され、シークレットのアクセス許可も付与されます。これはフォークからトリガーされた時も同様です。

リポジトリの書き込み権限などは `permissions` で制御できるが、シークレットは恐らく権限をコントロールできない。
なので、やはり注意すべきだ。

さて、2文目は以下だ。

> ワークフローはPull Requestのベースのコンテキストで実行されますが、このイベントでPull Requestから信頼できないコードをチェックアウトしたり、ビルドしたり、実行したりしないようにしなければなりません。

これも分かりにくいが、「ベースのコンテキストで実行されるけど、信頼できないコードをチェックアウト・ビルド・実行しないように、気を付ける必要がある」と言っているのだと思う。

この2文は要するに、 **`pull_request_target` トリガーのワークフローはデフォルトでリポジトリの書き込み権限とシークレットにアクセスできるよ。だから信頼できないPull Request（＝フォークからのPull Request）のコードをチェックアウトしてビルド・実行しちゃダメだよ** と言っているのだ。

## 参考

- [Jaroslav Lobačevski. (2021). Keeping your GitHub Actions and workflows secure Part 1: Preventing pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)
- [Alvaro Munoz. (2025). Keeping your GitHub Actions and workflows secure Part 4: New vulnerability patterns and mitigation strategies](https://securitylab.github.com/resources/github-actions-new-patterns-and-mitigations/)
