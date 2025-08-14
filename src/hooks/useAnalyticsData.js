import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useAnalyticsData = () => {
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

  const fetchAnalyticsData = async () => {
    if (!supabase) {
      setError('Supabase not configured')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      // 全データを取得
      const { data: allData, error: allError } = await supabase
        .from('analytics')
        .select('*')
        .order('timestamp', { ascending: false })

      if (allError) {
        throw allError
      }

      // データを種類別に分類
      const pageViews = allData.filter(item => item.event_name === 'page_view')
      const linkClicks = allData.filter(item => item.event_name === 'link_click')
      const modalEvents = allData.filter(item => 
        item.event_name === 'modal_open' || 
        item.event_name === 'modal_close' || 
        item.event_name === 'modal_link_click'
      )

      // 今日の日付を取得
      const today = new Date().toISOString().split('T')[0]
      const todayPageViews = pageViews.filter(item => 
        item.timestamp.split('T')[0] === today
      ).length

      // サマリーデータを計算
      const summary = {
        totalPageViews: pageViews.length,
        totalLinkClicks: linkClicks.length,
        totalModalOpens: allData.filter(item => item.event_name === 'modal_open').length,
        todayPageViews
      }

      setData({
        pageViews,
        linkClicks,
        modalEvents,
        summary
      })

    } catch (err) {
      console.error('Analytics data fetch error:', err)
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

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: fetchAnalyticsData,
    getPopularLinks,
    getHourlyStats,
    getDailyStats
  }
}