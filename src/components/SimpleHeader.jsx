import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SimpleHeader = () => {
  const [clickCount, setClickCount] = useState(0)
  const [isAnalyticsExcluded, setIsAnalyticsExcluded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const timeoutRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // アナリティクス除外設定をチェック
    const checkExclusion = () => {
      const excluded = localStorage.getItem('excludeAnalytics') === 'true' || 
                      document.cookie.includes('mewl_admin=true')
      setIsAnalyticsExcluded(excluded)
    }
    
    checkExclusion()
    // localStorageの変更を監視
    window.addEventListener('storage', checkExclusion)
    
    return () => {
      window.removeEventListener('storage', checkExclusion)
    }
  }, [])

  const handleLogoClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    // 前のタイムアウトをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 10回クリックで管理画面にリダイレクト
    if (newCount >= 10) {
      setClickCount(0)
      navigate('/admin')
      return
    }

    // 2秒後にカウントをリセット
    timeoutRef.current = setTimeout(() => {
      setClickCount(0)
    }, 2000)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 header-simple">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src="/assets/images/mewl_logo.png" 
                alt="Mewl Studio" 
                className="h-10 sm:h-12 w-auto cursor-pointer transition-transform duration-150 hover:scale-105"
                onClick={handleLogoClick}
                title={clickCount > 0 && clickCount < 10 ? `${clickCount}/10` : 'Mewl Studio'}
              />
            </div>
            {isAnalyticsExcluded && (
              <span className="debug-mode hidden sm:inline">
                Debug Mode
              </span>
            )}
          </div>

          {/* ナビゲーション */}
          <nav className="hidden md:block">
            <div className="flex items-center space-x-6">
              <a href="#コンテンツ" className="nav-link">コンテンツ</a>
              <a href="#SNS" className="nav-link">SNS</a>
              <a href="#公式情報" className="nav-link">公式情報</a>
            </div>
          </nav>

          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-150"
              aria-label="メニューを開く"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top-2 duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
              <a 
                href="#コンテンツ" 
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors duration-150"
                onClick={closeMobileMenu}
              >
                コンテンツ
              </a>
              <a 
                href="#SNS" 
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors duration-150"
                onClick={closeMobileMenu}
              >
                SNS
              </a>
              <a 
                href="#公式情報" 
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors duration-150"
                onClick={closeMobileMenu}
              >
                公式情報
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default SimpleHeader
