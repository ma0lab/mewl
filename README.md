# Mewl Studio - リンク集

Mewl Studioのリンク集です。シンプルだけど可愛いデザインで、各種プラットフォームへのリンクをまとめています。

## ✨ 特徴

- 🎯 **シンプルなデザイン**: 余計な機能を削除したクリーンなUI
- 🎨 **可愛い雰囲気**: ピンクを基調とした可愛らしいカラーテーマ
- 📱 **レスポンシブデザイン**: モバイル・デスクトップ対応
- 🌙 **ダークモード対応**: 目に優しいダークテーマ
- ⚡ **高速パフォーマンス**: React + Viteによる最適化

## 🚀 セットアップ

### 前提条件

- Node.js 18.0.0以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 🏗️ プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── Hero.jsx        # ヒーローセクション
│   ├── LinkGrid.jsx    # リンクグリッド
│   ├── LinkCard.jsx    # 個別リンクカード
│   └── Footer.jsx      # フッター
├── data/               # データファイル
│   └── links.js        # リンクデータ
├── App.jsx             # メインアプリ
├── main.jsx            # エントリーポイント
└── index.css           # スタイル

public/
└── assets/             # 静的アセット
    └── images/         # 画像ファイル
```

## 🎨 カスタマイズ

### リンクの追加・編集

`src/data/links.js` ファイルを編集してリンクを管理できます：

```javascript
{
  id: 1,
  title: "リンクタイトル",
  description: "リンクの説明",
  url: "https://example.com",
  icon: "🎯"
}
```

### スタイルのカスタマイズ

`tailwind.config.js` でカラーテーマやアニメーションをカスタマイズできます。

## 🌐 デプロイ

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# distフォルダをNetlifyにドラッグ&ドロップ
```

### GitHub Pages

```bash
npm run build
# distフォルダの内容をgh-pagesブランチにプッシュ
```

## 📱 対応ブラウザ

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 📞 サポート

- 📧 Email: support@mewl.com
- 🐦 Twitter: [@mewl_official](https://twitter.com/mewl_official)
- 💬 Discord: [Mewl Community](https://discord.gg/mewl)
- 📚 ドキュメント: [docs.mewl.com](https://docs.mewl.com)

---

Made with ❤️ by the Mewl Studio team