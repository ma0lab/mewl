import React from 'react'
import { ExternalLink } from 'lucide-react'

const LinkCard = ({ link }) => {
  const handleClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="link-card min-h-[180px]">
      <div className="p-8 h-full flex flex-col">
        {/* タイトル */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white relative pb-2">
            <span className="relative z-10">{link.title}</span>
            <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"></div>
          </h3>
        </div>


        {/* アクションボタン */}
        <button onClick={handleClick} className="btn-simple w-full">
          <span>アクセス</span>
          <ExternalLink className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default LinkCard
