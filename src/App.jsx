import React from 'react'
import SimpleHeader from './components/SimpleHeader'
import NoticeBar from './components/NoticeBar'
import HeroSection from './components/HeroSection'
import LinkGrid from './components/LinkGrid'
import Footer from './components/Footer'
import { linksData } from './data/links'
import { ModalProvider } from './context/ModalContext'

function App() {
  return (
    <ModalProvider>
      <div className="min-h-screen bg-simple-pattern dark:bg-gray-900">
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
