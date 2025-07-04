---
title: ドメインを取得した
description: AWSのRoute 53でドメインを取得して設定した。
pubDate: 2025-07-01T09:00:00+09:00
heroImage: ./img/get-a-domain.jpg
tags:
  - aws
  - aws-amplify
---

[daiksud.com](https://daiksud.com) というドメインを取得して設定してみた。

このWebサイトは [AWS Amplify](https://aws.amazon.com/jp/amplify/) を使ってホスティングしている。
この手のホスティング系サービスでは [Vercel](https://vercel.com) や [Netlify](https://www.netlify.com) などが有名だが、あえてAmplifyを選択してみた。
Amplifyの詳細については別ポストで取り上げようと思う。

## ドメインの設定

Amplifyコンソールから簡単に設定できた。
Hosting > Custom domains > Add domain と進んで、それっぽいボタンをぽちぽちしていくだけ。
途中でRoute 53でドメインを買うための誘導もあり、そこからRoute 53でドメインも購入した。

## Route 53でドメインを購入

今回はRoute 53でドメイン購入もした。
今までお名前.comとかムームードメインとか _ドメインを買う_ ことに割と特化したところで買ったこともあるが、これもあえてRoute 53にした。
AWSですべて完結させたいなという思いがあった。

金額的には正直ムームードメインの方が安かったが、あっちは初年度だけ安くて、2年目以降は高くなるという感じだ。
でもRoute 53の場合はそんなことなくて、毎年同じ金額っぽい感じだった。

## 今後やりたいこと

今回はAWSのコンソールから手動でポチポチして作業した。
でも、DevOpsの観点からすると、この辺りの設定やリソースはすべてコード化したいところ。

Amplifyの場合はリソースを [CDK](https://docs.amplify.aws/react/how-amplify-works/concepts/#connecting-to-aws-beyond-amplify) で拡張していくのが正攻法のようだが、Route 53とかアプリケーションと直接関係があるのかないのか微妙な立ち位置の部分もCDKでやるべきなのか？
その辺りを調べつつよりDevOpsらしいやり方でサイトの機能拡張をしていきたいところ。

とはいえ、それより先にやることもありそうな感じはする。
そのあたりはきちんと [GitHub Issues](https://github.com/daiksud/daiksud/issues) をオープンして管理するとかもやりたい。
