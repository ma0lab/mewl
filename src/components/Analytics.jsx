import React, { useState } from 'react'
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
  RefreshCw,
  Filter,
  Play,
  Pause
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

// Chart.jsの設定
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const Analytics = () => {
  const { logout } = useAuth()
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const { 
    data, 
    isLoading, 
    error, 
    lastUpdated,
    dateRange,
    refetch, 
    setDateFilter,
    setPresetDateFilter,
    getPopularLinks, 
    getHourlyStats, 
    getDailyStats, 
    getReferrerStats, 
    getModalStats, 
    getDeviceStats, 
    getBrowserStats, 
    getOSStats, 
    getUserBehaviorStats 
  } = useAnalyticsData(autoRefresh, 30000)

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
  const referrerStats = getReferrerStats()
  const modalStats = getModalStats()
  const deviceStats = getDeviceStats()
  const browserStats = getBrowserStats()
  const osStats = getOSStats()
  const behaviorStats = getUserBehaviorStats()

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
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  更新: {lastUpdated.toLocaleTimeString('ja-JP')}
                </span>
              )}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 transition-colors ${autoRefresh ? 'text-green-600 hover:text-green-700' : 'text-gray-600 hover:text-pink-600'}`}
                title={autoRefresh ? 'リアルタイム更新を停止' : 'リアルタイム更新を開始'}
              >
                {autoRefresh ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
                title="フィルターを表示"
              >
                <Filter className="w-5 h-5" />
              </button>
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

      {/* フィルターパネル */}
      {showFilters && (
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-gray-700">期間:</span>
              <button
                onClick={() => setPresetDateFilter('today')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-pink-100 rounded-lg transition-colors"
              >
                今日
              </button>
              <button
                onClick={() => setPresetDateFilter('yesterday')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-pink-100 rounded-lg transition-colors"
              >
                昨日
              </button>
              <button
                onClick={() => setPresetDateFilter('last7days')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-pink-100 rounded-lg transition-colors"
              >
                過去7日
              </button>
              <button
                onClick={() => setPresetDateFilter('last30days')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-pink-100 rounded-lg transition-colors"
              >
                過去30日
              </button>
              <button
                onClick={() => setPresetDateFilter('all')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-pink-100 rounded-lg transition-colors"
              >
                全期間
              </button>
              {dateRange.startDate && (
                <span className="text-xs text-gray-500 ml-4">
                  {new Date(dateRange.startDate).toLocaleDateString('ja-JP')} 
                  {dateRange.endDate && dateRange.startDate !== dateRange.endDate && 
                    ` - ${new Date(dateRange.endDate).toLocaleDateString('ja-JP')}`}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* メインサマリーカード */}
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
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">今日のPV</p>
                <p className="text-2xl font-bold text-gray-800">{data.summary.todayPageViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <MousePointer className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">コンバージョン率</p>
                <p className="text-2xl font-bold text-gray-800">{behaviorStats.conversionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">総セッション数</p>
                <p className="text-2xl font-bold text-gray-800">{behaviorStats.totalSessions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* トレンドグラフ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 日別アクセス推移 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-pink-600" />
              日別アクセス推移
            </h2>
            <div className="h-64">
              <Line
                data={{
                  labels: dailyStats.map(stat => 
                    new Date(stat.date).toLocaleDateString('ja-JP', { 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  ),
                  datasets: [
                    {
                      label: 'アクセス数',
                      data: dailyStats.map(stat => stat.views),
                      borderColor: 'rgba(236, 72, 153, 1)',
                      backgroundColor: 'rgba(236, 72, 153, 0.1)',
                      tension: 0.1,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* 時間別アクセス */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-pink-600" />
              時間別アクセス数
            </h2>
            <div className="h-64">
              <Bar
                data={{
                  labels: hourlyStats.map(stat => `${stat.hour}時`),
                  datasets: [
                    {
                      label: 'アクセス数',
                      data: hourlyStats.map(stat => stat.views),
                      backgroundColor: 'rgba(236, 72, 153, 0.5)',
                      borderColor: 'rgba(236, 72, 153, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* アクティビティヒートマップ */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            24時間アクティビティマップ
          </h2>
          <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 mb-4">
            {Array.from({ length: 24 }, (_, hour) => {
              const hourData = hourlyStats.find(stat => stat.hour === hour)
              const intensity = hourData ? hourData.views : 0
              const maxViews = hourlyStats.length > 0 ? Math.max(...hourlyStats.map(s => s.views), 1) : 1
              const opacity = Math.max(0.1, Math.min(1, intensity / maxViews))
              
              return (
                <div
                  key={hour}
                  className="w-8 h-8 sm:w-6 sm:h-6 rounded border border-gray-200 flex items-center justify-center text-xs font-medium relative group cursor-pointer transition-all hover:scale-110"
                  style={{
                    backgroundColor: `rgba(236, 72, 153, ${opacity})`,
                    color: opacity > 0.5 ? 'white' : 'rgb(75, 85, 99)'
                  }}
                  title={`${hour}時: ${intensity}件`}
                >
                  {hour}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {hour}時: {intensity}件
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>🟦 低い</span>
            <span>アクティビティレベル</span>
            <span>🟪 高い</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            ※ 各セルは1時間のアクセス数を色の濃さで表現します
          </div>
        </div>

        {/* 人気のリンクと行動分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

          {/* リファラー分析 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              参照元分析
            </h2>
            <div className="space-y-3">
              {referrerStats.length > 0 ? (
                referrerStats.map((ref, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-800 text-sm">{ref.source}</span>
                    </div>
                    <span className="text-green-600 font-medium">{ref.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">データがありません</p>
              )}
            </div>
          </div>

          {/* モーダル操作統計 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <MousePointer className="w-5 h-5 mr-2 text-purple-600" />
              モーダル操作
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{modalStats.opens}</div>
                <div className="text-sm text-gray-600">モーダル開く</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{modalStats.linkClicks}</div>
                <div className="text-sm text-gray-600">リンククリック</div>
              </div>
            </div>
          </div>

          {/* ユーザー行動指標 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              ユーザー行動指標
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span className="text-gray-800 text-sm">平均滞在時間</span>
                <span className="text-indigo-600 font-bold">{behaviorStats.avgSessionTime}秒</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-800 text-sm">離脱率</span>
                <span className="text-red-600 font-bold">{behaviorStats.bounceRate}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-800 text-sm">総リンククリック</span>
                <span className="text-green-600 font-bold">{data.summary.totalLinkClicks}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-800 text-sm">モーダル表示</span>
                <span className="text-purple-600 font-bold">{data.summary.totalModalOpens}</span>
              </div>
            </div>
          </div>
        </div>


        {/* 詳細分析セクション */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* デバイス分析 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              デバイス分析
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-blue-600 mr-3">📱</span>
                  <span className="text-gray-800">モバイル</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{deviceStats.mobile.count}</div>
                  <div className="text-sm text-gray-600">{deviceStats.mobile.percentage}%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-3">💻</span>
                  <span className="text-gray-800">デスクトップ</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-600">{deviceStats.desktop.count}</div>
                  <div className="text-sm text-gray-600">{deviceStats.desktop.percentage}%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-purple-600 mr-3">📟</span>
                  <span className="text-gray-800">タブレット</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{deviceStats.tablet.count}</div>
                  <div className="text-sm text-gray-600">{deviceStats.tablet.percentage}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* ブラウザ分析 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
              ブラウザ別統計
            </h2>
            <div className="space-y-3">
              {browserStats.length > 0 ? (
                browserStats.map((browser, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-gray-800 text-sm">{browser.browser}</span>
                    <span className="text-orange-600 font-medium">{browser.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">データがありません</p>
              )}
            </div>
          </div>

          {/* OS分析 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-teal-600" />
              OS別統計
            </h2>
            <div className="space-y-3">
              {osStats.length > 0 ? (
                osStats.map((os, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                    <span className="text-gray-800 text-sm">{os.os}</span>
                    <span className="text-teal-600 font-medium">{os.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">データがありません</p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Analytics