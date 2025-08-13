import React from 'react'

const SimpleHeader = () => {
  return (
    <header className="sticky top-0 z-50 header-simple">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-pink-600 dark:text-pink-400">
              🐈 Mewl Studio
            </h1>
          </div>

          {/* ナビゲーション */}
          <nav className="hidden md:block">
            <div className="flex items-center space-x-6">
              <a href="#SNS" className="nav-link">SNS</a>
              <a href="#コンテンツ" className="nav-link">コンテンツ</a>
              <a href="#公式情報" className="nav-link">公式情報</a>
            </div>
          </nav>

          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400">
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SimpleHeader
