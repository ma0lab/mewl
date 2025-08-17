import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useAnalyticsData = (autoRefresh = false, refreshInterval = 30000) => {
  const [data, setData] = useState({
    pageViews: [],
    linkClicks: [],
    modalEvents: [],
    summary: {
      totalPageViews: 0,
      totalLinkClicks: 0,
      totalModalOpens: 0,
      todayPageViews: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  // デフォルトで「今日」を設定
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const [dateRange, setDateRange] = useState({
    startDate: today.toISOString(),
    endDate: new Date().toISOString()
  })

  const fetchAnalyticsData = async () => {
    if (!supabase) {
      setError('Supabase not configured')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      console.log('📊 Fetching analytics data...')
      
      // 期間フィルターを適用してデータを取得
      let query = supabase.from('analytics').select('*')
      
      if (dateRange.startDate) {
        query = query.gte('timestamp', dateRange.startDate)
      }
      
      if (dateRange.endDate) {
        const endDate = new Date(dateRange.endDate)
        endDate.setHours(23, 59, 59, 999)
        query = query.lte('timestamp', endDate.toISOString())
      }
      
      const { data: allData, error: allError } = await query.order('timestamp', { ascending: false })

      if (allError) {
        console.error('❌ Supabase error:', allError)
        throw allError
      }

      console.log('✅ Raw data fetched:', allData?.length, 'records')
      console.log('📋 Sample data:', allData?.[0])

      // 管理者アクセス（/adminパス）とlocalhost（開発環境）を除外
      const filteredData = allData?.filter(item => {
        const path = item.path || item.event_data?.page_path || ''
        const url = item.url || item.event_data?.page_url || ''
        return !path.includes('/admin') && !url.includes('localhost')
      }) || []

      console.log('🔍 Filtered data (excluding admin & localhost):', filteredData.length, 'records')

      if (!filteredData || filteredData.length === 0) {
        console.warn('⚠️ No data found')
        setData({
          pageViews: [],
          linkClicks: [],
          modalEvents: [],
          summary: {
            totalPageViews: 0,
            totalLinkClicks: 0,
            totalModalOpens: 0,
            todayPageViews: 0
          }
        })
        setIsLoading(false)
        return
      }

      // データを種類別に分類（フィルター済みデータを使用）
      const pageViews = filteredData.filter(item => item.event_name === 'page_view')
      const linkClicks = filteredData.filter(item => item.event_name === 'link_click')
      const modalEvents = filteredData.filter(item => 
        item.event_name === 'modal_open' || 
        item.event_name === 'modal_close' || 
        item.event_name === 'modal_link_click'
      )

      console.log('📊 Filtered data:', {
        pageViews: pageViews.length,
        linkClicks: linkClicks.length,
        modalEvents: modalEvents.length
      })

      // 今日の日付を取得
      const today = new Date().toISOString().split('T')[0]
      const todayPageViews = pageViews.filter(item => 
        item.timestamp.split('T')[0] === today
      ).length

      // サマリーデータを計算
      const summary = {
        totalPageViews: pageViews.length,
        totalLinkClicks: linkClicks.length,
        totalModalOpens: modalEvents.filter(item => item.event_name === 'modal_open').length,
        todayPageViews
      }

      console.log('📈 Summary:', summary)

      setData({
        pageViews,
        linkClicks,
        modalEvents,
        summary
      })
      
      setLastUpdated(new Date())

    } catch (err) {
      console.error('❌ Analytics data fetch error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // 人気のリンクを取得
  const getPopularLinks = () => {
    const linkClickCounts = {}
    data.linkClicks.forEach(click => {
      const linkTitle = click.event_data?.link_title || '不明なリンク'
      linkClickCounts[linkTitle] = (linkClickCounts[linkTitle] || 0) + 1
    })

    return Object.entries(linkClickCounts)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // 時間別アクセス数を取得
  const getHourlyStats = () => {
    const hourlyStats = {}
    data.pageViews.forEach(view => {
      const hour = new Date(view.timestamp).getHours()
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1
    })

    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      views: hourlyStats[i] || 0
    }))
  }

  // 日別アクセス数を取得（過去7日）
  const getDailyStats = () => {
    const dailyStats = {}
    data.pageViews.forEach(view => {
      const date = view.timestamp.split('T')[0]
      dailyStats[date] = (dailyStats[date] || 0) + 1
    })

    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      last7Days.push({
        date: dateStr,
        views: dailyStats[dateStr] || 0
      })
    }

    return last7Days
  }

  // リファラー分析を取得
  const getReferrerStats = () => {
    const referrerStats = {}
    data.pageViews.forEach(view => {
      let source = view.referrer || 'ダイレクト'
      if (source && source !== 'ダイレクト') {
        try {
          const url = new URL(source)
          source = url.hostname
        } catch {
          source = source.substring(0, 30) + (source.length > 30 ? '...' : '')
        }
      }
      referrerStats[source] = (referrerStats[source] || 0) + 1
    })

    return Object.entries(referrerStats)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // モーダル統計を取得
  const getModalStats = () => {
    const opens = data.modalEvents.filter(event => event.event_name === 'modal_open').length
    const linkClicks = data.modalEvents.filter(event => event.event_name === 'modal_link_click').length
    
    return { opens, linkClicks }
  }

  // デバイス分析を取得
  const getDeviceStats = () => {
    const deviceStats = { mobile: 0, desktop: 0, tablet: 0 }
    
    data.pageViews.forEach(view => {
      const userAgent = view.user_agent || ''
      const screenWidth = parseInt(view.viewport_size?.split('x')[0]) || 0
      
      if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || screenWidth < 768) {
        if (/iPad/i.test(userAgent) || (screenWidth >= 768 && screenWidth < 1024)) {
          deviceStats.tablet++
        } else {
          deviceStats.mobile++
        }
      } else {
        deviceStats.desktop++
      }
    })

    const total = deviceStats.mobile + deviceStats.desktop + deviceStats.tablet
    return {
      mobile: { count: deviceStats.mobile, percentage: total ? Math.round((deviceStats.mobile / total) * 100) : 0 },
      desktop: { count: deviceStats.desktop, percentage: total ? Math.round((deviceStats.desktop / total) * 100) : 0 },
      tablet: { count: deviceStats.tablet, percentage: total ? Math.round((deviceStats.tablet / total) * 100) : 0 }
    }
  }

  // ブラウザ分析を取得
  const getBrowserStats = () => {
    const browserStats = {}
    
    data.pageViews.forEach(view => {
      const userAgent = view.user_agent || ''
      let browser = 'その他'
      
      if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) browser = 'Chrome'
      else if (userAgent.includes('Firefox')) browser = 'Firefox'
      else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari'
      else if (userAgent.includes('Edge')) browser = 'Edge'
      else if (userAgent.includes('Opera')) browser = 'Opera'
      
      browserStats[browser] = (browserStats[browser] || 0) + 1
    })

    return Object.entries(browserStats)
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count)
  }

  // OS分析を取得
  const getOSStats = () => {
    const osStats = {}
    
    data.pageViews.forEach(view => {
      const userAgent = view.user_agent || ''
      let os = 'その他'
      
      if (userAgent.includes('Windows')) os = 'Windows'
      else if (userAgent.includes('Mac OS')) os = 'macOS'
      else if (userAgent.includes('Linux')) os = 'Linux'
      else if (userAgent.includes('Android')) os = 'Android'
      else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS'
      
      osStats[os] = (osStats[os] || 0) + 1
    })

    return Object.entries(osStats)
      .map(([os, count]) => ({ os, count }))
      .sort((a, b) => b.count - a.count)
  }

  // ユーザー行動分析を取得
  const getUserBehaviorStats = () => {
    // セッション時間の推定（同一ユーザーの最初と最後のアクティビティから計算）
    const sessions = {}
    const allEvents = [...data.pageViews, ...data.linkClicks, ...data.modalEvents]
    
    allEvents.forEach(event => {
      const sessionKey = event.user_agent + event.screen_resolution // 簡易的なセッション識別
      if (!sessions[sessionKey]) {
        sessions[sessionKey] = { start: event.timestamp, end: event.timestamp, events: [] }
      }
      sessions[sessionKey].events.push(event)
      if (event.timestamp < sessions[sessionKey].start) sessions[sessionKey].start = event.timestamp
      if (event.timestamp > sessions[sessionKey].end) sessions[sessionKey].end = event.timestamp
    })

    const sessionTimes = Object.values(sessions).map(session => {
      const duration = new Date(session.end) - new Date(session.start)
      return { duration: Math.max(duration / 1000, 10), eventCount: session.events.length } // 最低10秒とする
    })

    const avgSessionTime = sessionTimes.length > 0 
      ? Math.round(sessionTimes.reduce((sum, session) => sum + session.duration, 0) / sessionTimes.length)
      : 0

    // 離脱率（1つのイベントしかないセッションの割合）
    const bounceRate = sessionTimes.length > 0
      ? Math.round((sessionTimes.filter(session => session.eventCount === 1).length / sessionTimes.length) * 100)
      : 0

    // コンバージョン率（モーダルを開いてリンクをクリックした率）
    const modalOpens = data.modalEvents.filter(event => event.event_name === 'modal_open').length
    const modalLinkClicks = data.modalEvents.filter(event => event.event_name === 'modal_link_click').length
    const conversionRate = modalOpens > 0 ? Math.round((modalLinkClicks / modalOpens) * 100) : 0

    return {
      avgSessionTime: Math.round(avgSessionTime),
      bounceRate,
      conversionRate,
      totalSessions: sessionTimes.length
    }
  }

  // 期間フィルターを設定する関数
  const setDateFilter = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
  }

  // 事前定義された期間フィルター
  const setPresetDateFilter = (preset) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (preset) {
      case 'today':
        setDateRange({ 
          startDate: today.toISOString(), 
          endDate: today.toISOString() 
        })
        break
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        setDateRange({ 
          startDate: yesterday.toISOString(), 
          endDate: yesterday.toISOString() 
        })
        break
      case 'last7days':
        const last7Days = new Date(today)
        last7Days.setDate(last7Days.getDate() - 7)
        setDateRange({ 
          startDate: last7Days.toISOString(), 
          endDate: today.toISOString() 
        })
        break
      case 'last30days':
        const last30Days = new Date(today)
        last30Days.setDate(last30Days.getDate() - 30)
        setDateRange({ 
          startDate: last30Days.toISOString(), 
          endDate: today.toISOString() 
        })
        break
      case 'all':
      default:
        setDateRange({ startDate: null, endDate: null })
        break
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  // リアルタイム更新
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchAnalyticsData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, dateRange])

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    dateRange,
    refetch: fetchAnalyticsData,
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
  }
}