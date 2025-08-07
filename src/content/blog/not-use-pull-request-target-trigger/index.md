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

## `pull_request` トリガーを使うべきである

まずこれは言っておくべきだろう。

GitHub Actionsで `pull_request_target` トリガーは基本的に使うべきでなく、 `pull_request` トリガーを使うべきである。
なぜなら、 `pull_request` トリガーの方がセキュアだからだ。

しかも、ほぼすべてのケースで `pull_request` トリガーで十分だ。
「`pull_request_target` トリガーは絶対に使うべきでない」
という認識でも良いぐらいだ。

## `pull_request_target` トリガーとは

トリガーされる条件はほとんど `pull_request` と同じだ。
条件にちょっと違いはあるものの、基本的にはPull Requestがオープンされたり、Pull Requestのブランチに新しいコミットがプッシュされたりすると、ワークフローがトリガーされる。

## `pull_request` と何が違うのか

一番の違いはセキュリティに関係する以下の2点だ。

1. **ターゲットリポジトリへの書き込み権限を持つ**
2. **シークレットの読み取り権限を持つ**

**フォークされたリポジトリ（信頼できないユーザー）からのPull Requestであっても**、上記の権限を持つ。
`pull_request` の場合は、フォークされたリポジトリ（信頼できないユーザー）からのPull Requestに上記権限は付与されない。

信頼できないユーザーに権限を与えないのは、当然のこと。
しかし `pull_request_target` の場合は、信頼できないユーザーからのPull Requestであっても、そのワークフローは権限を持つ。
なんとなくヤバそうな雰囲気を感じてもらえただろうか。

120%理解できた、という自信がないのなら、使わないほうが無難だ。

## コンテキストの違い

`pull_request` の場合はPull Requestのブランチのワークフローが実行される。
しかし、 `pull_request_target` の場合はマージ先のブランチ（ベースブランチ）にあるワークフローが実行される。
つまり、ベースブランチにワークフローが存在している必要がある。

[GitHubドキュメント](https://docs.github.com/ja/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target) によると以下のように書いてある。

> このイベントは、 `pull_request` イベントのようにマージ コミットのコンテキストではなく、pull request のベースのコンテキストで実行されます。
> これで、リポジトリを変更したり、ワークフローで使うシークレットを盗んだりする可能性がある、pull request の head から安全ではないコードが実行されるのが避けられます。
> このイベントを使うと、ワークフローでは、pull request に対するラベルやコメントなどの作業をフォークから行うことができます。
> pull request からコードをビルドまたは実行する必要がある場合は、このイベントを使わないでください。

1つ目の文が先に説明したものだ。

## 安全ではないコードが実行されるのを避けられる

次に目に付くのは2つ目の文だ。

> リポジトリを変更したり、ワークフローで使うシークレットを盗んだりする可能性がある、pull request の head から安全ではないコードが実行されるのが避けられます。

これはどういうことかというと、 `pull_request_target` トリガーではさっきも書いた通り、 **ベースブランチのコンテキスト** でワークフローが実行される。
つまり、Pull Requestを出してきたユーザーの **信頼できないコードやワークフロー** が実行されないということである。

説明では「コード」と書いてあるが、これには **ワークフロー自身も含まれる** ところがポイントだろう。
攻撃者が `pull_request_target` トリガーのワークフローを改変してPull Requestで出してきたとしても、それが実行されるわけではない。
ベースブランチに存在しているワークフローが実行される。
よって、 `pull_request_target` トリガーのワークフローはリポジトリの書き込み権限やシークレットのアクセス権限を持っていても、それが悪用されることはないのだ。

## pull request からコードをビルドまたは実行する場合は使ってはならない

4つ目の文。これが非常に重要だ。

> pull request からコードをビルドまたは実行する必要がある場合は、このイベントを使わないでください。

この文のポイントは **pull request から** の部分だ。
これはどういうことかというと、「Pull Requestで変更されたもの」という意味である。
つまり、 **「Pull Requestによって提出された、外部ユーザーによって作られたコードをビルドまたは実行する場合」** は `pull_request_target` を使ってはならない、ということだ。

なぜか？

もちろん、 `pull_request_target` トリガーで起動したワークフローが、リポジトリへの書き込み権限や、シークレットへのアクセス権限を持つからだ。
そのような権限を持つ状態で、どこの誰とも分からないPull Request作成者の任意のプログラムコードが実行されることの危険性は、すぐに理解できるだろう。

## GitHubドキュメントの警告

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

> `pull_request_target` イベントによってトリガーされるワークフローは、 `permissions` キーを明示的に指定しない場合、リポジトリの読み取り/書き込みアクセス許可とシークレットアクセス許可が `GITHUB_TOKEN` に付与されます。これはフォークからトリガーされた時も同様です。

「`permissions` キーを明示的に指定しない場合」というのはここで `false` を指定すれば不許可にできる、という意味だろう。

さて、2文目は以下だ。

> ワークフローはPull Requestのベースのコンテキストで実行されますが、このイベントでPull Requestから信頼できないコードをチェックアウトしたり、ビルドしたり、実行したりしないようにしなければなりません。

これも分かりにくいが、「ベースのコンテキストで実行されるけど、信頼できないコードをチェックアウト・ビルド・実行しないようにもする必要がある」と言っているのだと思う。

この2文は要するに、 **`pull_request_target` トリガーのワークフローはデフォルトでリポジトリの書き込み権限とシークレットにアクセスできるよ。だから信頼できないPull Request（＝フォークからのPull Request）のコードをチェックアウトしてビルド・実行しちゃダメだよ** と言っているのだ。

## `pull_request_target` の使い所

## `pull_request` トリガーとは

基本的には `pull_request` トリガーを使うべきだ。

`pull_request` トリガーのワークフローはPull Requestのヘッドブランチのコンテキストで実行される。
既存のワークフローを変更するPull Requestをオープンすれば、変更されたワークフローが実行される。
また、存在してなかったワークフローを新しく追加するPull Requestでも、その **新しいワークフローは実行される**。

つまり、マージする前にワークフローの動作確認が可能だ。

でも、上記だけを聞くと心配になることがあるだろう。

- 改変したワークフローが実行されるのなら、フォークから悪意のある変更をされるのでは？
- 新規追加でも実行されるのなら、フォークから悪意のあるワークフローを追加されるのでは？

その心配は無用だ。ちゃんと対策されている。

- フォークからのワークフローはシークレットなどの機密データにアクセスできない
- デフォルトでは、すべての初めてのコントリビューターは、ワークフローを実行するのに承認が必要

参考: [パブリック リポジトリでのフォークからワークフローへの変更を制御する](https://docs.github.com/ja/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#controlling-changes-from-forks-to-workflows-in-public-repositories)

一方で、同じリポジトリのブランチからのPull Requestの場合は、 `pull_request` トリガーで書き込み権限やシークレットへのアクセス権限を持つ。
これは、そのPull Requestを作ったユーザーが「同じリポジトリのブランチを作れている」ということである。
つまり、すでに書き込み権限を持っているということであり、そのユーザーは「信頼できるユーザー」なのだ。
信頼しているユーザーなのだから、シークレットにもアクセスできる、というわけである。
