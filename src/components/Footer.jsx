import React from 'react'
import { Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ブランド情報 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gradient mb-4">
              Mewl Studio
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md">
              Mewl Studioは、シンプルだけど可愛いデザインで、すべてのリンクを一箇所に集約したリンク集です。
              ユーザーの皆様に最適な体験を提供します。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://x.com/mewl_studio"
                className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                aria-label="X"
              >
                <i className="fab fa-x-twitter text-xl"></i>
              </a>
              <a
                href="mailto:contact@mewl.com"
                className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                aria-label="メール"
              >
                <i className="fas fa-envelope text-xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* ボトムセクション */}
        <div className="border-t border-secondary-200 dark:border-secondary-700 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center">
          <p className="text-secondary-600 dark:text-secondary-400 text-sm">
            © {currentYear} Mewl Studio. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
