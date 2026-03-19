# us-store-display-bff

|Branch|DeployStatus|Jest FunctionCoverage|API Specification|Detailed Design Document|
|:----:|:----------:|:-------------------:|:---------------:|:----------------------:|
|production|-|-|-|-|
|staging|-|-|-|-|
|develop|-|-|-|-|

## 概要

US 店舗ディスプレイアプリ用BFF

## APIエンドポイント

### Public

- インターネットからアクセス可能

|Branch|URL|
|:----:|:--|
|production|https://xxx|
|staging|https://stg.xxx|
|develop|https://dev.xxx|
|develop(LB)|http://debug.dev.xxx|
|develop(Mock)|http://mock.dev.xxx|

### Private

- 同一VPC内からのみアクセス可能

|Branch|URL|
|:----:|:--|
|production|https://xxx.private|
|staging|https://stg.xxx.private|
|develop|https://dev.xxx.private|

## 環境構築

各自のローカルPC内に統一された開発環境を構築するため, Dockerの利用を推奨する

### Dockerのインストール

環境に合わせてインストールする

- https://docs.docker.jp/toolbox/overview.html

#### Windowsの場合

wsl2を有効化しUbuntuを立ち上げたのち, dockerをインストールする
- https://docs.docker.jp/v1.12/engine/installation/index.html

#### Macの場合

- https://orbstack.dev/

## 実行方法

各種操作は当リポジトリのルートディレクトリからの実行を想定する

※(windowsの場合) コンソール上の作業はWSLにログインした状態で行う
```
> wsl
```

### 開発用コンテナ立ち上げ

#### 【推奨】VSCode Devcontainerを利用する場合

1. VSCodeに`Dev Containers`拡張機能をインストールする

2. `ctrl+shift+p`からコマンドパレットを開き, `Dev Containers: Reopen in Container`を実行する

#### コンソールを利用する場合

1. 下記コマンドを実行し, バックグラウンドでコンテナを立ち上げる

   ```
   > docker compose --profile dev up -d --build
   ```

2. 下記コマンドを実行し, コンテナにログインする

   ```
   > docker compose exec dev /bin/bash
   ```

### 動作確認用サーバー立ち上げ

1. 下記コマンドを実行しバックグラウンドでコンテナを立ち上げる

   ```
   > docker compose --profile debug up -d
   ```

2. curl等でAPIリクエストを投げる

   ```
   > curl localhost:3000/api/status
   ```

3. 停止する場合は, 下記コマンドを実行する

   ```
   > docker compose --profile debug down
   ```

### 静的解析とフォーマッター適用

1. 下記コマンドを実行する

   ```
   > docker compose run lint
   ```

### 型定義ファイル生成

1. `app/openapi/clients`フォルダー以下に対向システムのOpenAPI仕様書(*.yaml)を配置する  

2. 下記コマンドを実行する

   ```
   > docker compose run generate
   ```

   `app/src/interfaces`フォルダー以下に各種型定義ファイル(`*.ts`)が生成される


### ドキュメント生成

1. 下記コマンドを実行する

   ```
   > docker compose run doc
   ```
  
   `docs/openapi/`にOpenAPI仕様書が, `docs/typedoc/`に詳細設計書が生成される

### テスト実行

1. 下記コマンドを実行する

   ```
   > docker compose run test
   ```

   テストが実行され, `docs/jest-report/`にテストレポートが生成される


## 環境変数

- SERVER_PORT
    - サーバーのポート番号を指定する
    - default:3000
- DUMMY_SERVER
    - 対向システムのサーバーのURLを指定する(sample用のダミー)

## ファイル構成

```
app/
├── server.ts                          // アプリケーションのエントリーポイント
├── app.ts                             // APIのエンドポイントと関数の紐づけ定義
├── openapi/
│   ├── root.yaml                     // OpenAPI Spec(ファイル名はroot.yaml固定)
│   └── clients/
│        ├── related_system.yaml      // 対向システムのOpenAPI Spec
│        ....
├── src/
│   ├── clients/
│   │   └── related_system.ts        // 対向システムのAPIインスタンス
│   ├── compornents/
│   │   ├── errorCode.ts             // ErrorCode定義
│   │   └── errors.ts
│   ├── interface/
│   │   ├── root.ts                  // インターフェース定義(自動生成)
│   │   └── clients
│   │         ├── related_system.ts  // 対向システムのインターフェース定義(自動生成)
│   │         ....
│   ├── inversify.config.ts           // DIコンテナ用Configファイル
│   └── presenters/                   // Presentationロジック
│         ├── BasePresenter.ts        // Presenterベースクラス
│         ├── instances.ts            // DIコンテナからPresenterのインスタンスを取得しexportする
│         ├── interfaces.ts           // Presenter用インターフェース
│         ├── PresenterTypes.ts       // Presenterの型定義
│         ├── system/                 // 死活監視などで利用するAPI群
│         │   ├── *Presenter.ts
│         │   ....
│         ├── resource/               // リソースごとにPresenterをフォルダーで分ける
│         │   ├─ ....
│         ....
└── __tests__/                         // Unit Tests
       ├─ ....
       ....
```

## 開発手順

本開発では原則として **スキーマ駆動開発(SDD)** を採用します。  
開発対象はAPIを1単位とし, **想定するリクエスト及び期待するレスポンスを定義した上で** 開発を開始します。

1. **API仕様定義ファイル(app/openapi/root.yaml)** に開発対象のAPI仕様を記載する
2. 型定義ファイル生成を実行し, **インターフェース定義ファイル(app/src/interfaces/*.ts)** を生成する
3. API仕様定義ファイルのoperationIdをキーとして, **Presenterクラス(app/src/presenters/*/)** に開発対象のAPIを実装する
4. **DIコンテナ** に作成したPresenterクラスを登録する
5. `app/app.ts`に, 実装したPresenterの関数名を登録する
6. **テストコード(`app/__tests__/*/`)** に実装した関数に対応する単体テストを作成する

## コーディング規約

- 原則として[TypeScript Deep Diveスタイルガイド](https://typescript-jp.gitbook.io/deep-dive/styleguide)に従う
