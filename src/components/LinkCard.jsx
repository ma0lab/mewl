import React from 'react'
import { ExternalLink } from 'lucide-react'

const LinkCard = ({ link }) => {
  const handleClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="link-card">
      <div className="p-6 h-full flex flex-col">
        {/* タイトル */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {link.title}
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
