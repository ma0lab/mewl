import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SimpleHeader = () => {
  const [clickCount, setClickCount] = useState(0)
  const [isAnalyticsExcluded, setIsAnalyticsExcluded] = useState(false)
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

    // 10回クリックでダッシュボードにリダイレクト
    if (newCount >= 10) {
      setClickCount(0)
      navigate('/dashboard')
      return
    }

    // 2秒後にカウントをリセット
    timeoutRef.current = setTimeout(() => {
      setClickCount(0)
    }, 2000)
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
                className="h-10 sm:h-12 w-auto"
                onClick={handleLogoClick}
                title="Mewl Studio"
              />
            </div>
            {isAnalyticsExcluded && (
              <span className="debug-mode hidden sm:inline">
                Debug Mode
              </span>
            )}
          </div>

        </div>

      </div>
    </header>
  )
}

export default SimpleHeader
