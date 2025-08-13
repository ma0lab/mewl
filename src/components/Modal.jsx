import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, link }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      // 少し遅延してからアニメーション開始
      setTimeout(() => setIsVisible(true), 10)
      // 背景のスクロールを無効化
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      // スクロールを復活
      document.body.style.overflow = 'unset'
    }
    
    // クリーンアップ
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  if (!isOpen || !link) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return ReactDOM.createPortal(
    <div 
      className={`fixed inset-0 bg-black z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-opacity-75' : 'bg-opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 transform ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        {/* ヘッダー */}
        <div className="flex justify-between items-center p-8 border-b border-gray-200">
          <h3 className="text-3xl font-bold text-gray-800">
            {link.title}
          </h3>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-8">
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            {link.description || link.modalDescription}
          </p>

          {/* 複数リンクがある場合 */}
          {link.links ? (
            <div className="flex gap-4">
              {link.links.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 text-lg shadow-lg hover:shadow-xl"
                >
                  {item.name}
                </a>
              ))}
            </div>
          ) : (
            // 単一リンクの場合
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 text-lg shadow-lg hover:shadow-xl"
            >
              アクセス
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal