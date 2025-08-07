---
title: GitHub Actions の pull_request_target トリガーをちゃんと理解する
description: GitHub Actions には pull_request というトリガーと pull_request_target というトリガーの2つがあります。似ていますが仕様が結構異なり、特に pull_request_target トリガーは脆弱性となりやすいため、注意が必要です。
pubDate: 2025-08-11T20:00:00+09:00
heroImage: ./assets/two-pull-request-triggers.png
tags:
  - github
  - github-actions
  - security
---

## CodeQL を有効にしよう

[GitHub Security Labの記事](https://securitylab.github.com/resources/github-actions-new-patterns-and-mitigations/) でも紹介されていますが、現在はCodeQLがGitHub Actionsをサポートしているようです。これから紹介する `pull_request_target` トリガーを使用する場合の注意点なども、カバーしているようです。

ただ、過信は禁物です。理解してなくても指摘してくれるから、脆弱性は発生し得ないというわけでもないので、きちんと理解しておいた方が良いでしょう。

## `pull_request_target` トリガーとは

`pull_request_target` トリガーは、Pull Requestに関するイベントが発生した時にワークフローを起動するためのトリガーです。

代表的なイベントアクティビティは `opened`, `synchronize`, `reopened` です。
`types` キーワードを指定しない場合、この3つがデフォルトとなります。

つまり、 `pull_request_target` トリガーを指定したワークフローが起動する条件は、ほとんど `pull_request` と同じです。
基本的には `pull_request` と同様、Pull Requestがオープンされたり、Pull Requestに新しいコミットがプッシュされたりすると、ワークフローがトリガーされます。

## `pull_request` と最も違う部分はセキュリティ

`pull_request_target` と `pull_request` の一番の違いは、セキュリティに関係する以下の2点です。

1. **ターゲットリポジトリへの書き込み権限を持つ（ `permissions` を指定しない場合のデフォルト）**
2. **シークレットの読み取り権限を持つ**

これらは **フォークされたリポジトリ（信頼できないユーザー）からのPull Requestであっても**、権限が付与されます。

`pull_request` の場合は、フォークされたリポジトリ（信頼できないユーザー）からのPull Requestに上記権限は付与されません。
また、承認しない限り実行されない、というセキュリティ機構も持ちます。

信頼できないユーザーに権限を与えず、むやみに信頼できないコード（ワークフロー）を実行しないようにするのは、当然と言えば当然です。
しかし `pull_request_target` の場合は、信頼できないユーザーからのPull Requestであっても、そのワークフローは書き込み権限を持ち、承認せずとも実行されます。

なんとなく危険そうな雰囲気を感じていただけたでしょうか。

`pull_request_target` トリガーは上記のような特徴を持つため、「安全に使うための理屈が120%理解できた」という自信がない場合は使わないほうが無難です。

## コンテキストの違い

[GitHubドキュメント](https://docs.github.com/ja/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target) によると、以下のように書かれています。

> このイベントは、 `pull_request` イベントのようにマージ コミットのコンテキストではなく、pull request のベースのコンテキストで実行されます。

`pull_request_target` の場合、マージ先のブランチ（ベースブランチ）のコンテキストで実行されます。
つまり、ベースブランチにワークフローが存在している必要があります。

`pull_request` イベントの場合、新規にワークフローを作るようなPull Requestの場合でも、そのPull Request自身で追加するワークフローが実行されます。
つまり、まだ存在していないワークフローを自由に作って実行できる、ということです。

そのため、フォークされたリポジトリ（信頼できないユーザー）からのPull Requestの場合は、セキュリティを強化する必要があります。
その強化策として、書き込み権限やシークレット読み取り権限を付与せず、所有者が承認しない限り実行させない、となっているのです。

## 安全ではないコードが実行されるのを避けられる

[GitHubドキュメント](https://docs.github.com/ja/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target) には以下の文もあります。

> リポジトリを変更したり、ワークフローで使うシークレットを盗んだりする可能性がある、pull request の head から安全ではないコードが実行されるのを避けることができます。

これはどういうことかというと、 `pull_request_target` トリガーでは [コンテキストの違い](#コンテキストの違い) でも書いた通り、 **ベースブランチのコンテキスト** でワークフローが実行されます。
つまり、Pull Requestを出してきたユーザーの **信頼できないコードやワークフロー** は実行されないということです。

説明では「コード」と書いてありますが、これには **ワークフロー自身も含まれる** ところがポイントです。
攻撃者が `pull_request_target` トリガーのワークフローを改変してPull Requestで出してきたとしても、それが実行されるわけではありません。
あくまでもベースブランチに存在しているワークフローが実行されます。

ベースブランチにあるワークフローということは、そのリポジトリの所有者がレビュー済みのはずです。
レビュー済み、つまり信頼できるワークフローなのだから、リポジトリの書き込み権限やシークレットのアクセス権限を持っていても問題ないのです。

よって、 `pull_request_target` トリガーのワークフローは、リポジトリの書き込み権限やシークレットのアクセス権限を持っていても、（信頼できないコードを実行しない限り）それが悪用されることはありません。

## pull request からコードをビルドまたは実行する場合は使ってはならない

続いて、 [GitHubドキュメント](https://docs.github.com/ja/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target) に以下の文があります。

> pull request からコードをビルドまたは実行する必要がある場合は、このイベントを使わないでください。

この文のポイントは **pull request から** の部分です。
これはどういうことかというと、「Pull Requestで変更されたもの」という意味です。
つまり、 **「Pull Requestによって提出された、外部ユーザーによって作られたコードをビルドまたは実行する場合」** は `pull_request_target` を使ってはならない、ということです。

なぜでしょうか。

もちろん、 `pull_request_target` トリガーで起動したワークフローが、リポジトリへの書き込み権限や、シークレットへのアクセス権限を持つからです。
そのような権限を持つ状態で、どこの誰とも分からないPull Request作成者の信頼できない任意のプログラムコードを実行することは、当然やってはいけません。

「権限」と「信頼できないコード」の2つを出会わせてはいけないです。

## GitHubドキュメントの警告文

[pull_request_target](https://docs.github.com/ja/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target) の説明に以下のような警告があります。

> [!WARNING]
> `pull_request_target` イベントによってトリガーされるワークフローでは、フォークからトリガーされているのであっても、 `permissions` キーが指定されてワークフローがシークレットにアクセスできるのでない限り、読み取り/書き込みのリポジトリ アクセス許可が `GITHUB_TOKEN` に付与されます。
> ワークフローはPull Requestのベースのコンテキストで実行されますが、このイベントでPull Requestから信頼できないコードをチェックアウトしたり、ビルドしたり、実行したりしないようにしなければなりません。
> さらに、キャッシュではベース ブランチと同じスコープを共有します。キャッシュ ポイズニングを防ぐために、キャッシュの内容が変更された可能性がある場合は、キャッシュを保存しないでください。
> 詳細については、GitHub Security Lab の Web サイトの [GitHub Actions およびワークフローのセキュリティ保護の維持: pwn 要求の阻止](https://securitylab.github.com/research/github-actions-preventing-pwn-requests) に関する記事を参照してください。

なるほど。分からん。

分からんのですが、ちょっと読み解いてみましょう。

で、早速1文目がよく分かりませんね。
[英語](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target) だと以下のように書いてあります。

> For workflows that are triggered by the `pull_request_target` event, the `GITHUB_TOKEN` is granted read/write repository permission unless the `permissions` key is specified and the workflow can access secrets, even when it is triggered from a fork.

英語は得意じゃないので自信はありませんが、ここから推測すると恐らく以下が正しい解釈です。

> `pull_request_target` イベントによってトリガーされるワークフローは、　`GITHUB_TOKEN` に、 リポジトリの読み取り/書き込みアクセス許可が（`permissions` キーを指定してない場合）付与され、シークレットのアクセス許可も付与されます。これはフォークからトリガーされた時も同様です。

要するにフォークからのPull Requestでも、デフォルトで書き込み権限を持つし、シークレットアクセス権も持つよ、ということですね。

リポジトリの書き込み権限は `permissions` で制御できますが、シークレット読み取り権限はコントロールできません。
なので、やはり注意すべきです。

さて、2文目は以下です。

> ワークフローはPull Requestのベースのコンテキストで実行されますが、このイベントでPull Requestから信頼できないコードをチェックアウトしたり、ビルドしたり、実行したりしないようにしなければなりません。

これも分かりにくいですね。
最初の「ワークフローはPull Requestのベースのコンテキストで実行されますが」は恐らく要りません。文全体をややこしくしているだけです。

重要なのはその後で、「このイベント（`pull_request_target`）で、信頼できないコードをチェックアウト[^2]・ビルド・実行してはいけない」と言っています。

[^2]: 厳密にはチェックアウトだけでは必ずしも脆弱性になるわけではないですが、チェックアウトする時点で相当危険なことは事実です。何のためにチェックアウトするのか、入念に考える必要があります。一歩先は脆弱性です。

最初2文をまとめると、以下のように言っています。

**`pull_request_target` トリガーのワークフローは、デフォルトでリポジトリの書き込み権限を持ち、シークレットにもアクセスできます。**
**だから信頼できないPull Request（＝フォークからのPull Request）のコードをチェックアウトしてビルド・実行してはいけません。**

では、3文目にいきましょう。

> さらに、キャッシュではベース ブランチと同じスコープを共有します。キャッシュ ポイズニングを防ぐために、キャッシュの内容が変更された可能性がある場合は、キャッシュを保存しないでください。

この文は「変更された」ではなく「変更される」にすると分かりやすいです。
キャッシュを書き換えられる可能性のあるワークフローなら、キャッシュを保存しないようにしようねということです。

「さらに」と最初に書いてあるので、直前の文章に付け加えています。
つまり、「（Pull Requestからの信頼できないコードによって）キャッシュを書き換えられる可能性がある場合」ということです。

ちなみに、英語版は以下です。

> Additionally, any caches share the same scope as the base branch. To help prevent cache poisoning, you should not save the cache if there is a possibility that the cache contents were altered.

英語では最後の the cache contents were altered が過去分詞になので「変更された」に訳されちゃっていると思われます。
しかし、if が付いているので、恐らくこれは仮定法です。
でも仮定法未来なら were to alter になるはず[^1]ですが、「別にネイティブはこれでも通じる」とかそういうケースかなぁと予想しています。

[^1]: 実際 were to alter にしてみるとGoogle翻訳でも日本語的におかしくない訳を出してくれる

## まとめ

`pull_request_target` トリガーについて、ドキュメントやGitHubの公式ブログを参考に仕様や注意点を説明してきました。

- フォークからの信頼できないPull Requestであっても、リポジトリ書き込み権限とシークレットアクセス権限を持つ
- Pull Requestのマージ先であるベースブランチにあるワークフローが実行される
- Pull Requestの信頼できないコードをビルド・実行してはならない（シークレットアクセス権を持つから）
- Pull Requestの信頼できないコードでキャッシュが書き換えられる場合はキャッシュを保存しない（キャッシュ汚染を防ぐため）
- CodeQLで脆弱な書き方はある程度検知してくれる

Googleで `pull_request_target` を検索しても、日本語でちゃんと紐解いている記事が見当たらなかったので、少しでも役に立てれば幸いです。

## 参考

- [GitHub Docs](https://docs.github.com/ja/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target)
- [Jaroslav Lobačevski. (2021). Keeping your GitHub Actions and workflows secure Part 1: Preventing pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/)
- [Alvaro Munoz. (2025). Keeping your GitHub Actions and workflows secure Part 4: New vulnerability patterns and mitigation strategies](https://securitylab.github.com/resources/github-actions-new-patterns-and-mitigations/)
