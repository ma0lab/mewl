import React from 'react'
import { Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* ブランド情報 */}
          <div>
            <div className="flex justify-center mb-4">
              <img 
                src="/assets/images/mewl_logo.png" 
                alt="Mewl Studio" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              オリジナルキャラクター「七瀬もも」「藤宮菫」を中心とした<br/>
              ゲーム・イラスト創作サークル。<br/>
              「キャラクターと過ごす時間」を大切に、<br/>
              生きているようなリアルさと感情表現にこだわって<br/>
              作品を制作しています。
            </p>
            {/* SNSリンク */}
            <div className="mb-8">
              <h3 className="text-gray-800 font-semibold mb-6">Follow Us</h3>
              <div className="flex justify-center flex-wrap gap-3">
                <a
                  href="https://x.com/mewl_studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-20 h-10 bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-700 rounded-full font-medium transition-all duration-200 border border-gray-200 hover:border-pink-300 shadow-sm hover:shadow-md text-sm"
                  aria-label="X"
                >
                  X
                </a>
                <a
                  href="https://www.pixiv.net/users/114773230"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-20 h-10 bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-700 rounded-full font-medium transition-all duration-200 border border-gray-200 hover:border-pink-300 shadow-sm hover:shadow-md text-sm"
                  aria-label="pixiv"
                >
                  pixiv
                </a>
                <a
                  href="https://note.com/mewl_studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-20 h-10 bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-700 rounded-full font-medium transition-all duration-200 border border-gray-200 hover:border-pink-300 shadow-sm hover:shadow-md text-sm"
                  aria-label="note"
                >
                  note
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ボトムセクション */}
        <div className="border-t border-secondary-200 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center">
          <p className="text-secondary-600 text-sm">
            © {currentYear} Mewl Studio. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
