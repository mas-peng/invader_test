# React Space Invaders

これはReactとTypeScriptで作成したシンプルなスペースインベーダーゲームです。

## ゲームのスクリーンショット

(ここにゲームのスクリーンショットを後で追加します)

## セットアップとローカルでの実行方法

このプロジェクトをローカル環境で実行するには、以下の手順に従ってください。

### 前提条件

*   [Node.js](https://nodejs.org/) (v14以上を推奨)
*   [npm](https://www.npmjs.com/) または [Yarn](https://yarnpkg.com/)

### インストール

1.  まず、このリポジトリをクローンします。
    ```sh
    git clone <リポジトリのURL>
    ```
2.  プロジェクトのディレクトリに移動します。
    ```sh
    cd space-invaders
    ```
3.  必要なパッケージをインストールします。
    ```sh
    npm install
    ```
    または
    ```sh
    yarn install
    ```

### 実行

開発サーバーを起動するには、以下のコマンドを実行します。

```sh
npm start
```
または
```sh
yarn start
```

これにより、ブラウザで `http://localhost:3000` が自動的に開き、ゲームが実行されます。

## 操作方法

*   **← (左矢印キー)**: プレイヤーを左に移動します。
*   **→ (右矢印キー)**: プレイヤーを右に移動します。
*   **スペースキー**: 弾を発射します。

## ゲームのルール

*   画面上部から出現する侵略者の群れをすべて倒すと勝利です。
*   侵略者が画面の最下部まで到達するとゲームオーバーです。
*   侵略者を倒すとスコアが加算されます。

## 技術スタック

*   [React](https://reactjs.org/)
*   [TypeScript](https://www.typescriptlang.org/)
*   Create React App
