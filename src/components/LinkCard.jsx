import React from 'react'
import { ExternalLink } from 'lucide-react'

const LinkCard = ({ link }) => {
  const handleClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="link-card group">
      <div className="p-8 h-full flex flex-col">
        {/* タイトル */}
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {link.title}
        </h3>

        {/* 説明 */}
        <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-6 flex-grow leading-relaxed">
          {link.description}
        </p>

        {/* アクションボタン */}
        <button
          onClick={handleClick}
          className="btn-primary w-full group-hover:scale-105 transition-transform duration-200"
        >
          <span>アクセス</span>
          <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default LinkCard
