import React, { useState, useEffect } from 'react'
import SimpleHeader from './SimpleHeader'
import { useAuth } from '../context/AuthContext'
import dashboardConfig from '../data/dashboardConfig.json'

const Dashboard = () => {
  const { isAuthenticated } = useAuth()
  const [activeSection, setActiveSection] = useState('ai')
  const [sections, setSections] = useState([])
  const [showSectionDialog, setShowSectionDialog] = useState(false)
  const [sectionForm, setSectionForm] = useState({ id: '', name: '' })
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkForm, setLinkForm] = useState({ 
    title: '', 
    url: '', 
    color: 'bg-gray-400 hover:bg-gray-500',
    external: true,
    sectionId: '',
    linkIndex: null
  })
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showUnifiedDialog, setShowUnifiedDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState('add') // 'add' or 'edit'
  const [dialogType, setDialogType] = useState('section') // 'section' or 'link'
  const [editingItem, setEditingItem] = useState(null)
  const [showSectionSelectDialog, setShowSectionSelectDialog] = useState(false)
  const [showLinkSelectDialog, setShowLinkSelectDialog] = useState(false)

  useEffect(() => {
    setSections(dashboardConfig.sections)
    setActiveSection(dashboardConfig.sections[0]?.id || 'ai')
  }, [])

  const openSectionDialog = (section = null) => {
    if (section) {
      setSectionForm({ id: section.id, name: section.name })
    } else {
      setSectionForm({ id: '', name: '' })
    }
    setShowSectionDialog(true)
  }

  const closeSectionDialog = () => {
    setShowSectionDialog(false)
    setSectionForm({ id: '', name: '' })
  }

  const saveSection = () => {
    if (sectionForm.name.trim() === '') return

    let newSections
    if (sectionForm.id) {
      // 編集
      newSections = sections.map(section =>
        section.id === sectionForm.id 
          ? { ...section, name: sectionForm.name }
          : section
      )
    } else {
      // 新規追加
      const newSection = {
        id: `section_${Date.now()}`,
        name: sectionForm.name,
        links: []
      }
      newSections = [...sections, newSection]
    }
    
    setSections(newSections)
    // 実際の実装では、サーバーサイドでJSONファイルを更新する必要があります
    console.log('保存する設定:', { sections: newSections })
    closeSectionDialog()
  }

  const deleteSection = (sectionId) => {
    const newSections = sections.filter(section => section.id !== sectionId)
    setSections(newSections)
    console.log('保存する設定:', { sections: newSections })
  }

  const openLinkDialog = (sectionId, link = null, linkIndex = null) => {
    if (link) {
      setLinkForm({
        title: link.title,
        url: link.url,
        color: link.color,
        external: link.external,
        sectionId: sectionId,
        linkIndex: linkIndex
      })
    } else {
      setLinkForm({
        title: '',
        url: '',
        color: 'bg-gray-400 hover:bg-gray-500',
        external: true,
        sectionId: sectionId,
        linkIndex: null
      })
    }
    setShowLinkDialog(true)
  }

  const closeLinkDialog = () => {
    setShowLinkDialog(false)
    setLinkForm({
      title: '',
      url: '',
      color: 'bg-gray-400 hover:bg-gray-500',
      external: true,
      sectionId: '',
      linkIndex: null
    })
  }

  const saveLink = () => {
    if (linkForm.title.trim() === '' || linkForm.url.trim() === '') return

    const newSections = sections.map(section => {
      if (section.id === linkForm.sectionId) {
        const newLinks = [...section.links]
        if (linkForm.linkIndex !== null) {
          // 編集
          newLinks[linkForm.linkIndex] = {
            title: linkForm.title,
            url: linkForm.url,
            color: linkForm.color,
            external: linkForm.external
          }
        } else {
          // 新規追加
          newLinks.push({
            title: linkForm.title,
            url: linkForm.url,
            color: linkForm.color,
            external: linkForm.external
          })
        }
        return { ...section, links: newLinks }
      }
      return section
    })

    setSections(newSections)
    console.log('保存する設定:', { sections: newSections })
    closeLinkDialog()
  }

  const deleteLink = (sectionId, linkIndex) => {
    const newSections = sections.map(section => {
      if (section.id === sectionId) {
        const newLinks = section.links.filter((_, index) => index !== linkIndex)
        return { ...section, links: newLinks }
      }
      return section
    })
    setSections(newSections)
    console.log('保存する設定:', { sections: newSections })
  }

  const openAddDialog = () => {
    setShowAddDialog(true)
  }

  const closeAddDialog = () => {
    setShowAddDialog(false)
  }

  const handleAddSection = () => {
    closeAddDialog()
    openUnifiedDialog('add', 'section')
  }

  const handleAddLink = () => {
    closeAddDialog()
    openUnifiedDialog('add', 'link')
  }

  const openUnifiedDialog = (mode, type, item = null) => {
    setDialogMode(mode)
    setDialogType(type)
    setEditingItem(item)
    setShowUnifiedDialog(true)
    
    if (mode === 'edit' && item) {
      if (type === 'section') {
        setSectionForm({ id: item.id, name: item.name })
      } else if (type === 'link') {
        setLinkForm({
          title: item.title,
          url: item.url,
          color: item.color,
          external: item.external,
          sectionId: item.sectionId,
          linkIndex: item.linkIndex
        })
      }
    } else {
      // 新規追加の場合
      if (type === 'section') {
        setSectionForm({ id: '', name: '' })
      } else if (type === 'link') {
        const currentSection = sections.find(section => section.id === activeSection)
        setLinkForm({
          title: '',
          url: '',
          color: 'bg-gray-400 hover:bg-gray-500',
          external: true,
          sectionId: currentSection?.id || '',
          linkIndex: null
        })
      }
    }
  }

  const closeUnifiedDialog = () => {
    setShowUnifiedDialog(false)
    setDialogMode('add')
    setDialogType('section')
    setEditingItem(null)
    setSectionForm({ id: '', name: '' })
    setLinkForm({
      title: '',
      url: '',
      color: 'bg-gray-400 hover:bg-gray-500',
      external: true,
      sectionId: '',
      linkIndex: null
    })
  }

  const handleUnifiedSave = () => {
    if (dialogType === 'section') {
      saveSection()
    } else if (dialogType === 'link') {
      saveLink()
    }
    closeUnifiedDialog()
  }

  const openSectionSelectDialog = () => {
    setShowSectionSelectDialog(true)
  }

  const closeSectionSelectDialog = () => {
    setShowSectionSelectDialog(false)
  }

  const handleSectionEdit = (section) => {
    closeSectionSelectDialog()
    openUnifiedDialog('edit', 'section', section)
  }

  const openLinkSelectDialog = () => {
    setShowLinkSelectDialog(true)
  }

  const closeLinkSelectDialog = () => {
    setShowLinkSelectDialog(false)
  }

  const handleLinkEdit = (link, sectionId, linkIndex) => {
    closeLinkSelectDialog()
    openUnifiedDialog('edit', 'link', {
      ...link,
      sectionId: sectionId,
      linkIndex: linkIndex
    })
  }

  return (
    <div className="min-h-screen bg-simple-pattern">
      <SimpleHeader />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* セクション切り替えボタン */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                {sections.map((section) => (
                  <div key={section.id} className="relative group">
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        activeSection === section.id
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {section.name}
                    </button>
                    {isAuthenticated && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openAddDialog()
                        }}
                        className="absolute -top-2 -right-2 bg-gray-600 hover:bg-gray-700 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="編集・追加"
                      >
                        <i className="fas fa-cog"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isAuthenticated && (
                <button
                  onClick={openAddDialog}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-gray-700 w-8 h-8 rounded-full transition-colors duration-200 flex items-center justify-center"
                  title="追加"
                >
                  <i className="fas fa-plus text-sm"></i>
                </button>
              )}
            </div>
          </div>

          {/* セクションコンテンツ */}
          {sections.map((section) => (
            activeSection === section.id && (
              <div key={section.id} className="mb-8 bg-gray-50 rounded-2xl p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">{section.name}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {section.links.map((item, index) => (
                    <div key={index} className="relative group">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden block aspect-[4/3] hover:scale-105"
                      >
                        <div className={`${item.color} p-4 text-white h-full flex items-center justify-center relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                          <h3 className="text-sm font-bold text-center relative z-10 group-hover:text-white/90 transition-colors duration-300">{item.title}</h3>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}

                  {/* 管理者向けセクション */}
                  {isAuthenticated && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a
                          href="/admin"
                          className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                        >
                          <div>
                            <h3 className="font-semibold text-gray-800">アナリティクス</h3>
                          </div>
                        </a>
                        <a
                          href="/"
                          className="flex items-center p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors duration-150"
                        >
                          <div>
                            <h3 className="font-semibold text-gray-800">ホーム</h3>
                          </div>
                        </a>
                      </div>
                    </div>
                  )}

          {/* 統合ダイアログ */}
          {showUnifiedDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 w-[600px] h-[450px] flex flex-col">
                <h3 className="text-xl font-semibold mb-6">
                  {dialogMode === 'edit' 
                    ? (dialogType === 'section' ? 'セクションを編集' : 'ショートカットを編集')
                    : (dialogType === 'section' ? '新しいセクションを追加' : '新しいショートカットを追加')
                  }
                </h3>
                
                <div className="flex-1 overflow-y-auto">
                  {dialogType === 'section' ? (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        セクション名
                      </label>
                      <input
                        type="text"
                        value={sectionForm.name}
                        onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="セクション名を入力"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          タイトル
                        </label>
                        <input
                          type="text"
                          value={linkForm.title}
                          onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="ショートカットのタイトル"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          URL
                        </label>
                        <input
                          type="url"
                          value={linkForm.url}
                          onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          色
                        </label>
                        <select
                          value={linkForm.color}
                          onChange={(e) => setLinkForm({ ...linkForm, color: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="bg-gray-400 hover:bg-gray-500">グレー</option>
                          <option value="bg-blue-400 hover:bg-blue-500">ブルー</option>
                          <option value="bg-green-400 hover:bg-green-500">グリーン</option>
                          <option value="bg-purple-400 hover:bg-purple-500">パープル</option>
                          <option value="bg-red-400 hover:bg-red-500">レッド</option>
                          <option value="bg-yellow-400 hover:bg-yellow-500">イエロー</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="external"
                          checked={linkForm.external}
                          onChange={(e) => setLinkForm({ ...linkForm, external: e.target.checked })}
                          className="mr-3 w-5 h-5"
                        />
                        <label htmlFor="external" className="text-sm font-medium text-gray-700">
                          外部リンク（新しいタブで開く）
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeUnifiedDialog}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleUnifiedSave}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                  >
                    {dialogMode === 'edit' ? '更新' : '追加'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 追加・編集選択ダイアログ */}
          {showAddDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 w-[600px] h-[450px] flex flex-col">
                <h3 className="text-xl font-semibold mb-6">操作を選択</h3>
                <div className="flex-1 flex flex-col space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h4 className="text-lg font-medium text-gray-700 mb-4">追加</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleAddSection}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3"
                      >
                        <i className="fas fa-folder text-xl"></i>
                        <span className="text-lg">セクションを追加</span>
                      </button>
                      <button
                        onClick={handleAddLink}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3"
                      >
                        <i className="fas fa-link text-xl"></i>
                        <span className="text-lg">URLを追加</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-4">編集</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          closeAddDialog()
                          openSectionSelectDialog()
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3"
                      >
                        <i className="fas fa-edit text-xl"></i>
                        <span className="text-lg">セクションを編集</span>
                      </button>
                      <button
                        onClick={() => {
                          closeAddDialog()
                          openLinkSelectDialog()
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3"
                      >
                        <i className="fas fa-link text-xl"></i>
                        <span className="text-lg">ショートカットを編集</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeAddDialog}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* セクション選択ダイアログ */}
          {showSectionSelectDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 w-[600px] h-[450px] flex flex-col">
                <h3 className="text-xl font-semibold mb-6">編集するセクションを選択</h3>
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-3">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => handleSectionEdit(section)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-4 rounded-lg transition-colors duration-200 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <i className="fas fa-folder text-gray-600"></i>
                          <span className="font-medium text-lg">{section.name}</span>
                        </div>
                        <span className="text-gray-500 text-sm">ID: {section.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeSectionSelectDialog}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ショートカット選択ダイアログ */}
          {showLinkSelectDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 w-[600px] h-[450px] flex flex-col">
                <h3 className="text-xl font-semibold mb-6">編集するショートカットを選択</h3>
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    {sections.map((section) => (
                      <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-3 text-lg flex items-center space-x-2">
                          <i className="fas fa-folder text-gray-600"></i>
                          <span>{section.name}</span>
                        </h4>
                        <div className="space-y-2">
                          {section.links.length > 0 ? (
                            section.links.map((link, index) => (
                              <button
                                key={index}
                                onClick={() => handleLinkEdit(link, section.id, index)}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-between text-left"
                              >
                                <div className="flex items-center space-x-3">
                                  <i className="fas fa-link text-gray-600"></i>
                                  <span className="font-medium">{link.title}</span>
                                </div>
                                <span className="text-gray-500 text-sm ml-2 flex-shrink-0 truncate max-w-xs">{link.url}</span>
                              </button>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm italic py-4">ショートカットがありません</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeLinkSelectDialog}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  )
}

export default Dashboard
