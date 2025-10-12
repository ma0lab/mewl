import React, { useState, useMemo } from 'react'
import LinkCard from './LinkCard'

const LinkGrid = ({ links }) => {
  const [selectedBadge, setSelectedBadge] = useState('すべて')
  const [selectedCharacter, setSelectedCharacter] = useState('すべて')
  
  // 利用可能なバッジを取得
  const availableBadges = useMemo(() => {
    const badges = [...new Set(links.filter(link => link.badge).map(link => link.badge))]
    return ['すべて', ...badges]
  }, [links])
  
  // 利用可能なキャラクターを取得
  const availableCharacters = useMemo(() => {
    const characters = new Set()
    links.forEach(link => {
      if (link.characters) {
        link.characters.forEach(char => characters.add(char))
      }
    })
    return ['すべて', ...Array.from(characters)]
  }, [links])
  
  // フィルタされたリンクを取得
  const filteredLinks = useMemo(() => {
    let filtered = links
    
    // バッジフィルタ
    if (selectedBadge !== 'すべて') {
      filtered = filtered.filter(link => link.badge === selectedBadge)
    }
    
    // キャラクターフィルタ
    if (selectedCharacter !== 'すべて') {
      filtered = filtered.filter(link => 
        link.characters && link.characters.includes(selectedCharacter)
      )
    }
    
    return filtered
  }, [links, selectedBadge, selectedCharacter])
  
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

  // カテゴリ別にフィルタされたリンクをグループ化
  const groupedLinks = filteredLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = []
    }
    acc[link.category].push(link)
    return acc
  }, {})

  const categories = ['コンテンツ'] // SNSセクションを削除、フッターに統合

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* フィルタセクション */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {/* バッジフィルタ */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-pink-200 rounded-md blur-sm opacity-50"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-md p-0.5 border border-pink-200/50">
                <div className="flex flex-wrap gap-0.5">
                  {availableBadges.map((badge) => (
                    <button
                      key={`badge-${badge}`}
                      onClick={() => setSelectedBadge(badge)}
                      className={`relative px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded ${
                        selectedBadge === badge
                          ? 'bg-pink-500 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                      }`}
                    >
                      {selectedBadge === badge && (
                        <div className="absolute inset-0 bg-pink-400 rounded animate-pulse opacity-30"></div>
                      )}
                      <span className="relative z-10">{badge}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* キャラクタープルダウン */}
            {availableCharacters.length > 1 && (
              <div className="relative">
                <select
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  className="appearance-none bg-white/90 backdrop-blur-sm border border-purple-200/50 rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent shadow-sm hover:bg-purple-50 transition-all duration-200"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1rem 1rem',
                    paddingRight: '2rem'
                  }}
                >
                  {availableCharacters.map((character) => (
                    <option key={character} value={character}>
                      {character}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-16">
          {categories.map((category) => {
            const categoryLinks = groupedLinks[category]
            if (!categoryLinks || categoryLinks.length === 0) return null

            return (
              <section key={category} id={category} className="scroll-mt-20">
                <div className="category-section">
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center px-2 sm:px-4">
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
    </div>
  )
}

export default LinkGrid
