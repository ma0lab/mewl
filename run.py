#!/usr/bin/env python3
"""
Mewl Studio Links - 簡単起動スクリプト
開発サーバーを起動して自動でブラウザを開きます
"""

import subprocess
import webbrowser
import time
import os
import sys
import threading
import signal

def print_banner():
    """起動時のバナーを表示"""
    print("""
    ╭─────────────────────────────────────╮
    │           🎨 Mewl Studio            │
    │         Links Application           │
    │                                     │
    │      Starting development server    │
    │         Please wait...              │
    ╰─────────────────────────────────────╯
    """)

def check_node_modules():
    """node_modulesが存在するかチェック"""
    if not os.path.exists('node_modules'):
        print("📦 node_modulesが見つかりません。依存関係をインストールします...")
        try:
            subprocess.run(['npm', 'install'], check=True)
            print("✅ 依存関係のインストールが完了しました！")
        except subprocess.CalledProcessError:
            print("❌ npm installに失敗しました。Nodeが正しくインストールされているか確認してください。")
            sys.exit(1)

def open_browser_delayed():
    """少し待ってからブラウザを開く"""
    time.sleep(4)  # サーバーが完全に起動するまで待機
    url = "http://localhost:3000"
    print(f"🌐 ブラウザで {url} を開いています...")
    webbrowser.open(url)

def signal_handler(sig, frame):
    """Ctrl+Cでの終了処理"""
    _ = sig, frame  # 未使用引数を明示
    print("\n\n👋 開発サーバーを停止しています...")
    sys.exit(0)

def main():
    """メイン実行関数"""
    # Ctrl+Cのハンドラを設定
    signal.signal(signal.SIGINT, signal_handler)
    
    print_banner()
    
    # 現在のディレクトリがプロジェクトルートかチェック
    if not os.path.exists('package.json'):
        print("❌ package.jsonが見つかりません。")
        print("   プロジェクトのルートディレクトリでこのスクリプトを実行してください。")
        sys.exit(1)
    
    # node_modulesの存在チェック
    check_node_modules()
    
    # サーバー起動後にブラウザを開くフラグ
    browser_opened = False
    
    print("🚀 開発サーバーを起動中...")
    print("📝 ログ:")
    print("-" * 50)
    
    try:
        # npm run devを実行
        process = subprocess.Popen(
            ['npm', 'run', 'dev'],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        
        # リアルタイムでログを表示
        for line in process.stdout:
            print(line.rstrip())
            # サーバーが起動したことを検知してブラウザを開く
            if not browser_opened and ("ready in" in line.lower() or "local:" in line.lower()):
                print("\n✅ サーバーが起動しました！")
                print("🔗 URL: http://localhost:3000")
                print("🛑 終了するには Ctrl+C を押してください")
                print("-" * 50)
                
                # ブラウザを遅延して開く
                browser_thread = threading.Thread(target=open_browser_delayed)
                browser_thread.daemon = True
                browser_thread.start()
                browser_opened = True
        
        process.wait()
        
    except subprocess.CalledProcessError as e:
        print(f"❌ 開発サーバーの起動に失敗しました: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print("❌ npmコマンドが見つかりません。Node.jsが正しくインストールされているか確認してください。")
        print("   Node.js: https://nodejs.org/")
        sys.exit(1)

if __name__ == "__main__":
    main()