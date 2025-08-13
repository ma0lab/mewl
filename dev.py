#!/usr/bin/env python3
"""
Mewl Studio Links - 高機能開発ツール
開発サーバーの起動、ビルド、その他の開発タスクを実行できます
"""

import subprocess
import webbrowser
import time
import os
import sys
import threading
import signal
import argparse
from pathlib import Path

class MewlDevTool:
    def __init__(self):
        self.server_url = "http://localhost:3000"
        self.process = None
        
    def print_banner(self):
        """起動時のバナーを表示"""
        print("""
    ╭─────────────────────────────────────────╮
    │             🎨 Mewl Studio              │
    │           Development Tool              │
    │                                         │
    │  💻 dev    - 開発サーバー起動           │
    │  🏗️  build  - プロダクションビルド     │
    │  🔍 lint   - コードの静的解析           │
    │  🧹 clean  - node_modules を削除       │
    │  📦 install- 依存関係を再インストール  │
    ╰─────────────────────────────────────────╯
        """)

    def check_project_root(self):
        """プロジェクトのルートディレクトリかチェック"""
        if not os.path.exists('package.json'):
            print("❌ package.jsonが見つかりません。")
            print("   プロジェクトのルートディレクトリでこのスクリプトを実行してください。")
            sys.exit(1)

    def check_and_install_deps(self):
        """依存関係をチェックしてインストール"""
        if not os.path.exists('node_modules'):
            print("📦 node_modulesが見つかりません。依存関係をインストールします...")
            self.run_npm_command(['install'])

    def run_npm_command(self, command, show_output=True):
        """NPMコマンドを実行"""
        try:
            cmd = ['npm'] + command
            if show_output:
                result = subprocess.run(cmd, check=True)
            else:
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            return result
        except subprocess.CalledProcessError as e:
            print(f"❌ コマンドの実行に失敗しました: npm {' '.join(command)}")
            print(f"   エラー: {e}")
            sys.exit(1)
        except FileNotFoundError:
            print("❌ npmコマンドが見つかりません。Node.jsがインストールされているか確認してください。")
            print("   Node.js: https://nodejs.org/")
            sys.exit(1)

    def open_browser_delayed(self, delay=3):
        """指定秒数後にブラウザを開く"""
        time.sleep(delay)
        print(f"🌐 ブラウザで {self.server_url} を開いています...")
        webbrowser.open(self.server_url)

    def signal_handler(self, sig, frame):
        """Ctrl+Cでの終了処理"""
        _ = sig, frame  # 未使用引数を明示
        print("\n\n👋 開発サーバーを停止しています...")
        if self.process:
            self.process.terminate()
        sys.exit(0)

    def start_dev_server(self, open_browser=True):
        """開発サーバーを起動"""
        signal.signal(signal.SIGINT, self.signal_handler)
        
        print("🚀 開発サーバーを起動中...")
        self.check_and_install_deps()
        
        browser_opened = False
        
        print("📝 サーバーログ:")
        print("-" * 50)
        
        try:
            self.process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            
            for line in self.process.stdout:
                print(line.rstrip())
                if not browser_opened and ("ready in" in line.lower() or "local:" in line.lower()):
                    print("\n✅ サーバーが起動しました！")
                    print(f"🔗 URL: {self.server_url}")
                    print("🛑 終了するには Ctrl+C を押してください")
                    print("-" * 50)
                    
                    # ブラウザを開く必要がある場合のみ開く
                    if open_browser:
                        browser_thread = threading.Thread(target=self.open_browser_delayed)
                        browser_thread.daemon = True
                        browser_thread.start()
                    
                    browser_opened = True
            
            self.process.wait()
            
        except Exception as e:
            print(f"❌ 開発サーバーの起動に失敗しました: {e}")
            sys.exit(1)

    def build_project(self):
        """プロジェクトをビルド"""
        print("🏗️ プロダクションビルドを開始...")
        self.check_and_install_deps()
        self.run_npm_command(['run', 'build'])
        print("✅ ビルドが完了しました！")
        print("📁 出力ディレクトリ: ./dist")

    def lint_project(self):
        """コードの静的解析を実行"""
        print("🔍 コードの静的解析を実行中...")
        self.check_and_install_deps()
        self.run_npm_command(['run', 'lint'])
        print("✅ 静的解析が完了しました！")

    def clean_project(self):
        """node_modulesを削除"""
        print("🧹 プロジェクトをクリーンアップ中...")
        
        if os.path.exists('node_modules'):
            import shutil
            shutil.rmtree('node_modules')
            print("✅ node_modules を削除しました")
        
        if os.path.exists('dist'):
            import shutil
            shutil.rmtree('dist')
            print("✅ dist ディレクトリを削除しました")
            
        # package-lock.jsonも削除
        lock_file = Path('package-lock.json')
        if lock_file.exists():
            lock_file.unlink()
            print("✅ package-lock.json を削除しました")
            
        print("🎉 クリーンアップ完了！")

    def install_deps(self):
        """依存関係を再インストール"""
        print("📦 依存関係を再インストール中...")
        self.run_npm_command(['install'])
        print("✅ インストール完了！")

def main():
    """メイン実行関数"""
    tool = MewlDevTool()
    
    parser = argparse.ArgumentParser(
        description='Mewl Studio Links Development Tool',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument(
        'command',
        nargs='?',
        default='dev',
        choices=['dev', 'build', 'lint', 'clean', 'install', 'help'],
        help='実行するコマンド (デフォルト: dev)'
    )
    
    parser.add_argument(
        '--no-browser',
        action='store_true',
        help='ブラウザを自動で開かない (devコマンドのみ)'
    )
    
    args = parser.parse_args()
    
    tool.check_project_root()
    
    if args.command == 'help':
        tool.print_banner()
        parser.print_help()
    elif args.command == 'dev':
        tool.start_dev_server(open_browser=not args.no_browser)
    elif args.command == 'build':
        tool.build_project()
    elif args.command == 'lint':
        tool.lint_project()
    elif args.command == 'clean':
        tool.clean_project()
    elif args.command == 'install':
        tool.install_deps()

if __name__ == "__main__":
    main()