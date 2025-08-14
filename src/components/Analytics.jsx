import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useAnalyticsData } from '../hooks/useAnalyticsData'
import { 
  Eye, 
  MousePointer, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Clock,
  LogOut,
  RefreshCw
} from 'lucide-react'

const Analytics = () => {
  const { logout } = useAuth()
  const { data, isLoading, error, refetch, getPopularLinks, getHourlyStats, getDailyStats } = useAnalyticsData()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-simple-pattern flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-500 border-t-transparent mr-3"></div>
            <span className="text-gray-700">データを読み込み中...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-simple-pattern flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">データ取得エラー</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  const popularLinks = getPopularLinks()
  const hourlyStats = getHourlyStats()
  const dailyStats = getDailyStats()

  return (
    <div className="min-h-screen bg-simple-pattern">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="w-6 h-6 text-pink-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-800">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refetch}
                className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
                title="データを更新"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">総ページビュー</p>
                <p className="text-2xl font-bold text-gray-800">{data.summary.totalPageViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <MousePointer className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">総リンククリック</p>
                <p className="text-2xl font-bold text-gray-800">{data.summary.totalLinkClicks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">モーダル表示</p>
                <p className="text-2xl font-bold text-gray-800">{data.summary.totalModalOpens}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">今日のPV</p>
                <p className="text-2xl font-bold text-gray-800">{data.summary.todayPageViews}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 人気のリンク */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-pink-600" />
              人気のリンク TOP 10
            </h2>
            <div className="space-y-3">
              {popularLinks.length > 0 ? (
                popularLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-800 text-sm">{link.title}</span>
                    </div>
                    <span className="text-pink-600 font-medium">{link.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">データがありません</p>
              )}
            </div>
          </div>

          {/* 時間別アクセス */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-pink-600" />
              時間別アクセス数
            </h2>
            <div className="grid grid-cols-6 gap-2">
              {hourlyStats.map((stat) => (
                <div key={stat.hour} className="text-center">
                  <div 
                    className="bg-pink-100 rounded-sm mb-1 transition-all hover:bg-pink-200"
                    style={{ 
                      height: `${Math.max(4, (stat.views / Math.max(...hourlyStats.map(s => s.views))) * 40)}px` 
                    }}
                    title={`${stat.hour}時: ${stat.views}件`}
                  ></div>
                  <span className="text-xs text-gray-600">{stat.hour}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 日別アクセス（過去7日） */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-pink-600" />
              過去7日間のアクセス
            </h2>
            <div className="space-y-3">
              {dailyStats.map((stat) => (
                <div key={stat.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(stat.date).toLocaleDateString('ja-JP', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="flex items-center">
                    <div 
                      className="bg-pink-200 h-2 rounded-full mr-3"
                      style={{ 
                        width: `${Math.max(8, (stat.views / Math.max(...dailyStats.map(s => s.views))) * 100)}px` 
                      }}
                    ></div>
                    <span className="text-sm font-medium text-gray-800 w-8 text-right">
                      {stat.views}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 最近のアクティビティ */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4">最近のアクティビティ</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {data.pageViews.slice(0, 20).map((event, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">
                      {event.event_name === 'page_view' ? 'ページ閲覧' : 
                       event.event_name === 'link_click' ? 'リンククリック' : 
                       event.event_name.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Analytics