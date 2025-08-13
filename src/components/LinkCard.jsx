import React from 'react'
import { ExternalLink } from 'lucide-react'
import { useModal } from '../context/ModalContext'

const LinkCard = ({ link }) => {
  const { openModal } = useModal()
  
  const handleClick = () => {
    openModal(link)
  }

  return (
    <>
      <div className="link-card min-h-[180px] cursor-pointer hover:transform hover:scale-105 transition-transform duration-200" onClick={handleClick}>
        <div className="p-8 h-full flex flex-col">
          {/* タイトル */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white card-title">
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
    </div>
  )
}

export default LinkCard
