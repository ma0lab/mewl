# 📊 Analytics Setup Guide

このプロジェクトでは、Supabaseを使用した独自のアナリティクストラッキングを実装しています。

## 🚀 セットアップ手順

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセス
2. 「New Project」をクリック
3. プロジェクト名を入力（例: `mewl-analytics`）
4. データベースパスワードを設定
5. 「Create new project」をクリック

### 2. データベーステーブルの作成

Supabaseの「SQL Editor」で以下のクエリを実行：

```sql
-- アナリティクステーブルの作成
CREATE TABLE analytics (
  id BIGSERIAL PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  url TEXT,
  path TEXT,
  referrer TEXT,
  user_agent TEXT,
  screen_resolution VARCHAR(20),
  viewport_size VARCHAR(20),
  language VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックスの作成（クエリパフォーマンス向上）
CREATE INDEX idx_analytics_event_name ON analytics(event_name);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX idx_analytics_path ON analytics(path);

-- Row Level Security (RLS)の有効化
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- 挿入を許可するポリシー
CREATE POLICY "Allow public insert" ON analytics
  FOR INSERT 
  TO public 
  WITH CHECK (true);

-- 匿名ユーザーに読み取り権限を付与（オプション）
CREATE POLICY "Allow public read" ON analytics
  FOR SELECT 
  TO public 
  USING (true);
```

### 3. 環境変数の設定

#### ローカル開発環境

1. `.env.example`を`.env.local`にコピー
2. Supabaseの設定画面から以下の値を取得：
   - Project URL: `Settings` → `API` → `Project URL`
   - Anon key: `Settings` → `API` → `anon` `public`

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 本番環境（GitHub Pages）

GitHub リポジトリの `Settings` → `Secrets and variables` → `Actions` で環境変数を設定：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 4. GitHub Actionsワークフローの更新

`.github/workflows/deploy.yml`に環境変数を追加：

```yaml
- name: Build
  run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

## 📈 トラッキングされるイベント

### 自動トラッキング
- **page_view**: ページ読み込み時
- **link_click**: リンクカードクリック時
- **modal_open**: モーダル表示時
- **modal_close**: モーダル閉じる時
- **modal_link_click**: モーダル内リンククリック時

### 収集データ
- イベント名とカスタムデータ
- タイムスタンプ
- URL・パス
- リファラー
- ユーザーエージェント
- 画面解像度・ビューポートサイズ
- 言語設定

## 🔍 データ分析

### Supabaseダッシュボードでの確認

```sql
-- 今日のページビュー数
SELECT COUNT(*) as page_views 
FROM analytics 
WHERE event_name = 'page_view' 
AND timestamp::date = CURRENT_DATE;

-- 人気のリンク TOP 5
SELECT 
  event_data->>'link_title' as link_title,
  COUNT(*) as clicks
FROM analytics 
WHERE event_name = 'link_click'
GROUP BY event_data->>'link_title'
ORDER BY clicks DESC
LIMIT 5;

-- 時間別アクセス数
SELECT 
  EXTRACT(hour FROM timestamp) as hour,
  COUNT(*) as views
FROM analytics 
WHERE event_name = 'page_view'
AND timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour;
```

## 🛡️ セキュリティ

- **ANON KEY**: 公開しても安全（読み書き制限あり）
- **RLS**: データベースレベルでアクセス制御
- **個人情報なし**: IPアドレスや個人を特定する情報は収集せず

## 🚨 トラブルシューティング

### トラッキングが動作しない場合

1. ブラウザの開発者ツールでエラー確認
2. 環境変数の設定確認
3. Supabaseプロジェクトの設定確認
4. ネットワークタブでAPIリクエスト確認

### 開発環境での確認

```javascript
// コンソールでトラッキング状況を確認
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase configured:', !!supabase)
```

## 📊 カスタムイベントの追加

```javascript
import { useAnalytics } from './hooks/useAnalytics'

const { trackEvent } = useAnalytics()

// カスタムイベントの送信
trackEvent('custom_event', {
  custom_data: 'value',
  number_value: 123
})
```