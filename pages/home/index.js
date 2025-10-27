// pages/home/index.js
Page({
  data: {
    // 导航菜单数据
    navItems: [
      { id: 'home', name: '首页', active: true },
      { id: 'profile', name: '我的主页', active: false },
      { id: 'match', name: '同频相遇', active: false },
      { id: 'test', name: '测测', active: false },
      { id: 'activity', name: '活动', active: false },
      { id: 'community', name: '社区', active: false },
      { id: 'member', name: '会员中心', active: false }
    ],
    // 消息数量
    messageCount: 117
  },

  onLoad: function (options) {
    console.log('首页加载完成')
  },

  onShow: function () {
    // 页面显示时刷新消息数量
    this.refreshMessageCount()
  },

  // 导航菜单点击事件
  onNavItemTap: function (e) {
    const itemId = e.currentTarget.dataset.id
    const navItems = this.data.navItems.map(item => ({
      ...item,
      active: item.id === itemId
    }))

    this.setData({
      navItems: navItems
    })

    // 根据导航项执行相应操作
    this.handleNavigation(itemId)
  },

  // 处理导航逻辑
  handleNavigation: function (itemId) {
    switch (itemId) {
      case 'home':
        // 当前页面，无需跳转
        break
      case 'profile':
        wx.navigateTo({
          url: '/pages/profile/index'
        })
        break
      case 'match':
        wx.navigateTo({
          url: '/pages/frequency-match/index'
        })
        break
      case 'test':
        wx.navigateTo({
          url: '/pages/test/index'
        })
        break
      case 'activity':
        wx.navigateTo({
          url: '/pages/activity/index'
        })
        break
      case 'community':
        wx.navigateTo({
          url: '/pages/community/index'
        })
        break
      case 'member':
        wx.navigateTo({
          url: '/pages/member/index'
        })
        break
      default:
        console.log('未知的导航项:', itemId)
    }
  },

  // 消息图标点击事件
  onMessageTap: function () {
    wx.navigateTo({
      url: '/pages/message/index'
    })
  },

  // 刷新消息数量
  refreshMessageCount: function () {
    // 这里可以调用API获取最新的消息数量
    // 暂时使用模拟数据
    const count = Math.floor(Math.random() * 200) + 50
    this.setData({
      messageCount: count
    })
  },

  onReady: function () {
    // 页面初次渲染完成
  },

  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面卸载
  },

  onPullDownRefresh: function () {
    // 下拉刷新
    this.refreshMessageCount()
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
    // 上拉触底
  },

  onShareAppMessage: function () {
    return {
      title: 'PINYU CLUB - 品遇俱乐部',
      path: '/pages/home/index'
    }
  }
})
