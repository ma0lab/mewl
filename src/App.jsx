import React from 'react'
import SimpleHeader from './components/SimpleHeader'
import LinkGrid from './components/LinkGrid'
import Footer from './components/Footer'
import { linksData } from './data/links'

function App() {
  return (
    <div className="min-h-screen bg-cute-pattern dark:from-secondary-900 dark:to-secondary-800">
      <SimpleHeader />
      <main>
        <LinkGrid links={linksData} />
      </main>
      <Footer />
    </div>
  )
}

export default App
