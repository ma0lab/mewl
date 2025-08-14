import { createClient } from '@supabase/supabase-js'

// 環境変数から設定を取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabaseクライアントを作成
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// 開発環境でのデバッグ用
if (import.meta.env.DEV && !supabase) {
  console.log('📊 Supabase not configured - tracking disabled in development')
}