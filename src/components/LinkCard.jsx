import React from 'react'
import { ExternalLink } from 'lucide-react'
import { useModal } from '../context/ModalContext'
import { useAnalytics } from '../hooks/useAnalytics'

const LinkCard = ({ link }) => {
  const { openModal } = useModal()
  const { trackLinkClick } = useAnalytics()
  
  const handleClick = () => {
    // リンククリックをトラッキング
    trackLinkClick(link.title, link.url, {
      category: link.category,
      link_id: link.id
    })
    // 直接URLにアクセス
    window.open(link.url, '_blank')
  }

  return (
    <>
      <div className="link-card w-full cursor-pointer hover:transform hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl" onClick={handleClick}>
        <div className="h-full flex flex-col rounded-lg overflow-hidden relative">
          {/* バッジ */}
          {link.badge && (
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {link.badge}
              </span>
            </div>
          )}

          {/* サムネイル */}
          <div className="h-48 sm:h-60 bg-gray-100 p-1 flex items-center justify-center">
            {link.thumbnail ? (
              <img 
                src={link.thumbnail} 
                alt={link.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Image</span>
            )}
          </div>

          {/* タイトルとボタン */}
          <div className="flex flex-col flex-1 p-4 bg-white">
            {/* タイトル */}
            <div className="flex-1 flex items-center justify-center text-center mb-4">
              <h3 className="text-sm font-normal text-gray-700 leading-relaxed">
                {link.title}
              </h3>
            </div>

            {/* アクションボタン */}
            <button className="btn-simple w-full py-3">
              <span>詳細を見る</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default LinkCard
