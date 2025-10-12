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
      <div className="link-card min-h-[340px] cursor-pointer hover:transform hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl" onClick={handleClick}>
        <div className="h-full flex flex-col rounded-lg overflow-hidden">
          {/* サムネイル */}
          {link.thumbnail ? (
            <div className="h-52">
              <img 
                src={link.thumbnail} 
                alt={link.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-52 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}

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
