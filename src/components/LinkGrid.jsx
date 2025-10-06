import React from 'react'
import LinkCard from './LinkCard'

const LinkGrid = ({ links }) => {
  if (links.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-pink-200/40">
            <h3 className="text-2xl font-semibold text-secondary-900 mb-2">
              リンクが見つかりません
            </h3>
          </div>
        </div>
      </section>
    )
  }

  // カテゴリ別にリンクをグループ化
  const groupedLinks = links.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = []
    }
    acc[link.category].push(link)
    return acc
  }, {})

  const categories = ['コンテンツ', 'SNS'] // '公式情報' をコメントアウト

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {categories.map((category) => {
          const categoryLinks = groupedLinks[category]
          if (!categoryLinks || categoryLinks.length === 0) return null

          return (
            <section key={category} id={category} className="scroll-mt-20">
              <div className="category-section">
                <div className="text-center mb-24 -mt-16">
                  <h2 className="text-xl sm:text-2xl mb-8 sm:mb-12 heading-6">
                    <span>{category}</span>
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {category === 'SNS' && '七瀬もも・藤宮菫の日常とキービジュアルをお届けします。'}
                    {category === 'コンテンツ' && 'オリジナルゲーム「ぬぎジャン！脱衣学園」やポスターなどのグッズ販売。'}
                    {category === '公式情報' && 'Mewl Studio公式のプレスリリース・重要なお知らせ。'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center px-8">
                  {categoryLinks.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default LinkGrid
