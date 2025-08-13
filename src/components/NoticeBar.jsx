import React from 'react'

const NoticeBar = () => {
  const notice = {
    text: "リリース記念セール開催中！『ぬぎジャン！- 七瀬もも編 -』最大45%OFF（8/17まで）",
    link: "https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=d_647835/",
    type: "sale"
  }

  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="py-4">
          <div className="text-center mb-2">
            <h3 className="text-lg font-bold">お知らせ</h3>
          </div>
          <div className="flex items-center justify-center">
            <a
              href={notice.link}
              className="text-sm font-medium text-white hover:text-yellow-200 transition-colors duration-200 border border-white/30 rounded-full px-4 py-2 hover:bg-white/10"
              target={notice.link.startsWith('http') ? '_blank' : '_self'}
              rel={notice.link.startsWith('http') ? 'noopener noreferrer' : ''}
            >
              <span className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-2 animate-pulse bg-red-300"></span>
                {notice.text}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoticeBar