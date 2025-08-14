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
    openModal(link)
  }

  return (
    <>
      <div className="link-card min-h-[180px] cursor-pointer hover:transform hover:scale-105 transition-transform duration-200" onClick={handleClick}>
        <div className="p-8 h-full flex flex-col justify-center items-center">
          {/* タイトル */}
          <div className="mb-4 text-center">
            <h3 className="text-lg font-bold text-gray-800">
              {link.title}
            </h3>
          </div>


          {/* アクションボタン */}
          <button className="btn-simple w-full">
            <span>詳細を見る</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )
}

export default LinkCard
