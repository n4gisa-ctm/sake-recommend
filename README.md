# さけAIソムリエ（sake-recommend）

日本酒に興味が出てきた20代後半の男性向けに、AIチャットでおすすめの日本酒をレコメンドするWebアプリ。
背景には実在の銘柄名が滝のように降り続け（[Word Cascade](https://river.tango-gacha.com/) 参考）、チャット画面ではタップするとその銘柄についてAIに聞けます。

ドキュメント:
- [要件定義書](docs/要件定義書.md)
- [デザインガイドライン](docs/デザインガイドライン.md)

## 技術構成

React 18 / TypeScript / Vite / Tailwind CSS。バックエンドは持たず、[Dify](https://dify.ai/) のチャットボットAPIをブラウザから直接呼び出します。

## セットアップ

```bash
npm install
```

### Dify の接続設定（2通り）

**A. 環境変数（推奨・デプロイ向け）**

`.env.example` をコピーして `.env` を作成し、Difyの「APIアクセス」ページの値を設定します。

```bash
cp .env.example .env
```

```
VITE_DIFY_API_URL=https://api.dify.ai/v1
VITE_DIFY_API_KEY=app-xxxxxxxxxxxxxxxxx
```

設定済みの場合、アプリ内の設定画面は表示されず、すぐにチャットを開始できます。

**B. アプリ内で入力（フォールバック）**

環境変数がない場合は初回に設定画面が表示され、入力値はブラウザの localStorage にのみ保存されます。

> ⚠️ フロントエンドから直接APIを呼ぶ構成のため、環境変数方式でもAPIキーはビルド成果物に含まれます。公開運用時はDify側のレート制限設定や、サーバレス関数によるプロキシ化を検討してください。

## 開発・ビルド

```bash
npm run dev        # 開発サーバー
npm run typecheck  # 型チェック
npm run build      # 本番ビルド（dist/）
```
