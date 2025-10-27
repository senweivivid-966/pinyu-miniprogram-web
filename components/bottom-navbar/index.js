// components/bottom-navbar/index.js
Component({
  properties: {
    current: {
      type: String,
      value: 'home'
    }
  },

  data: {
    navItems: [
      {
        key: 'home',
        label: '首页',
        icon: 'home',
        url: '/pages/home/index'
      },
      {
        key: 'frequency-match',
        label: '相遇',
        icon: 'heart',
        url: '/pages/frequency-match/index'
      },
      {
        key: 'messages',
        label: '私信',
        icon: 'message',
        url: '/pages/messages/index'
      },
      {
        key: 'publish',
        label: '发布',
        icon: 'plus',
        url: '/pages/publish/index'
      },
      {
        key: 'profile',
        label: '我',
        icon: 'user',
        url: '/pages/profile/index'
      }
    ]
  },

  methods: {
    onNavTap (e) {
      const { key, url } = e.currentTarget.dataset

      if (key === this.properties.current) {
        return // 当前页面不需要跳转
      }

      // 触发导航事件
      this.triggerEvent('navigate', { key, url })

      // 执行页面跳转
      if (key === 'publish') {
        // 发布页面使用 navigateTo
        wx.navigateTo({
          url
        })
      } else {
        // 其他页面使用 switchTab
        wx.switchTab({
          url
        })
      }
    }
  }
})
