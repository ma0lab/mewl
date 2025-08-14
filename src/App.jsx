import React, { useEffect } from 'react'
import SimpleHeader from './components/SimpleHeader'
import NoticeBar from './components/NoticeBar'
import HeroSection from './components/HeroSection'
import LinkGrid from './components/LinkGrid'
import Footer from './components/Footer'
import { linksData } from './data/links'
import { ModalProvider } from './context/ModalContext'
import { useAnalytics } from './hooks/useAnalytics'

function App() {
  const { trackPageView } = useAnalytics()

  // ページ読み込み時にページビューをトラッキング
  useEffect(() => {
    trackPageView({
      page_type: 'home',
      total_links: linksData.length
    })
  }, [trackPageView])

  return (
    <ModalProvider>
      <div className="min-h-screen bg-simple-pattern">
        <SimpleHeader />
        <NoticeBar />
        <HeroSection />
        <main>
          <LinkGrid links={linksData} />
        </main>
        <Footer />
      </div>
    </ModalProvider>
  )
}

export default App
