import { useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useAnalytics = () => {
  // 自分のアクセスを除外する判定
  const isOwnAccess = () => {
    // ローカルストレージでの除外設定
    if (localStorage.getItem('excludeAnalytics') === 'true') {
      return true
    }
    
    // URLパラメータでの除外（?exclude=true）
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('exclude') === 'true') {
      localStorage.setItem('excludeAnalytics', 'true')
      return true
    }
    
    // 特定のクッキーで除外
    if (document.cookie.includes('mewl_admin=true')) {
      return true
    }
    
    // 特定のIPアドレスやUser-Agentでの除外も可能（必要に応じて）
    // const userAgent = navigator.userAgent
    // if (userAgent.includes('特定の識別子')) {
    //   return true
    // }
    
    return false
  }

  // イベントトラッキング関数
  const trackEvent = useCallback(async (eventName, eventData = {}) => {
    // 自分のアクセスの場合は除外
    if (isOwnAccess()) {
      console.log('📊 [Excluded] Track:', eventName, eventData)
      return
    }

    // Supabaseが設定されていない場合は何もしない
    if (!supabase) {
      if (import.meta.env.DEV) {
        console.log('📊 Track:', eventName, eventData)
      }
      return
    }

    try {
      const data = {
        event_name: eventName,
        event_data: eventData,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
      }

      const { error } = await supabase
        .from('analytics')
        .insert([data])

      if (error) {
        console.error('Analytics error:', error)
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }, [])

  // ページビュートラッキング
  const trackPageView = useCallback((additionalData = {}) => {
    trackEvent('page_view', {
      title: document.title,
      page_path: window.location.pathname + window.location.hash,
      page_url: window.location.href,
      ...additionalData
    })
  }, [trackEvent])

  // クリックトラッキング
  const trackClick = useCallback((element, additionalData = {}) => {
    trackEvent('click', {
      element_type: element.tagName?.toLowerCase(),
      element_text: element.textContent?.substring(0, 100),
      element_id: element.id || null,
      element_class: element.className || null,
      page_path: window.location.pathname + window.location.hash,
      ...additionalData
    })
  }, [trackEvent])

  // リンククリックトラッキング
  const trackLinkClick = useCallback((linkTitle, linkUrl, additionalData = {}) => {
    trackEvent('link_click', {
      link_title: linkTitle,
      link_url: linkUrl,
      page_path: window.location.pathname + window.location.hash,
      clicked_at: new Date().toISOString(),
      ...additionalData
    })
  }, [trackEvent])

  // モーダル開閉トラッキング
  const trackModal = useCallback((action, modalData = {}) => {
    trackEvent('modal_' + action, {
      modal_title: modalData.title,
      modal_type: modalData.type,
      ...modalData
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackLinkClick,
    trackModal
  }
}