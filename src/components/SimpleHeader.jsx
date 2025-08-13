import React from 'react'

const SimpleHeader = () => {
  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* ロゴ */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src="/assets/images/mewl_logo.png" 
                alt="Mewl Studio" 
                className="h-8 w-auto"
              />
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              <a 
                href="#SNS" 
                className="text-secondary-700 dark:text-secondary-300 hover:text-pink-600 dark:hover:text-pink-400 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-pink-50 dark:hover:bg-pink-900/20 border border-transparent hover:border-pink-200 dark:hover:border-pink-700"
              >
                SNS
              </a>
              <a 
                href="#コンテンツ" 
                className="text-secondary-700 dark:text-secondary-300 hover:text-pink-600 dark:hover:text-pink-400 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-pink-50 dark:hover:bg-pink-900/20 border border-transparent hover:border-pink-200 dark:hover:border-pink-700"
              >
                コンテンツ
              </a>
              <a 
                href="#公式情報" 
                className="text-secondary-700 dark:text-secondary-300 hover:text-pink-600 dark:hover:text-pink-400 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-pink-50 dark:hover:bg-pink-900/20 border border-transparent hover:border-pink-200 dark:hover:border-pink-700"
              >
                公式情報
              </a>
            </div>
          </nav>

          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <button className="p-3 rounded-xl bg-pink-100/50 dark:bg-pink-800/50 hover:bg-pink-200/50 dark:hover:bg-pink-700/50 transition-all duration-200 border border-pink-200/30 dark:border-pink-700/30">
              <span className="text-pink-600 dark:text-pink-300 text-lg">☰</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SimpleHeader
