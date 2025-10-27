// pages/profile/index.js
Page({
  data: {
    currentTab: 'profile',
    userInfo: {
      id: 1,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      name: '张小美',
      age: 25,
      city: '上海',
      occupation: '产品经理',
      company: '互联网公司',
      bio: '热爱生活，喜欢旅行和美食，希望遇到有趣的灵魂',
      verified: true,
      vipLevel: 'premium',
      joinDate: '2023-06-15',
      profileCompletion: 85
    },
    stats: {
      events: 12,
      matches: 8,
      likes: 24,
      views: 156
    },
    menuItems: [
      {
        id: 'edit-profile',
        icon: '👤',
        title: '编辑资料',
        subtitle: '完善个人信息',
        arrow: true
      },
      {
        id: 'my-events',
        icon: '📅',
        title: '我的活动',
        subtitle: '查看参与的活动',
        arrow: true,
        badge: '3'
      },
      {
        id: 'matches',
        icon: '💕',
        title: '我的匹配',
        subtitle: '查看匹配记录',
        arrow: true
      },
      {
        id: 'privacy',
        icon: '🔒',
        title: '隐私设置',
        subtitle: '管理隐私偏好',
        arrow: true
      },
      {
        id: 'notifications',
        icon: '🔔',
        title: '通知设置',
        subtitle: '管理推送通知',
        arrow: true
      },
      {
        id: 'help',
        icon: '❓',
        title: '帮助中心',
        subtitle: '常见问题解答',
        arrow: true
      },
      {
        id: 'about',
        icon: 'ℹ️',
        title: '关于我们',
        subtitle: '了解品遇',
        arrow: true
      }
    ],
    loading: false
  },

  onLoad (options) {
    console.log('Profile page loaded')
    this.loadUserProfile()
  },

  onShow () {
    this.setData({
      currentTab: 'profile'
    })
    // 设置自定义tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }
  },

  onPullDownRefresh () {
    this.loadUserProfile().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 加载用户资料
  loadUserProfile () {
    this.setData({ loading: true })

    return new Promise((resolve) => {
      // 模拟API调用
      setTimeout(() => {
        // 这里应该调用实际的API获取用户信息
        this.setData({ loading: false })
        resolve()
      }, 1000)
    })
  },

  // 编辑头像
  onAvatarTap () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.uploadAvatar(tempFilePath)
      }
    })
  },

  // 上传头像
  uploadAvatar (filePath) {
    wx.showLoading({ title: '上传中...' })

    // 模拟上传
    setTimeout(() => {
      this.setData({
        'userInfo.avatar': filePath
      })
      wx.hideLoading()
      wx.showToast({
        title: '头像更新成功',
        icon: 'success'
      })
    }, 2000)
  },

  // 菜单项点击
  onMenuItemTap (e) {
    const { id } = e.currentTarget.dataset

    switch (id) {
      case 'edit-profile':
        wx.navigateTo({
          url: '/pages/edit-profile/index'
        })
        break
      case 'my-events':
        wx.navigateTo({
          url: '/pages/activities/index?tab=my'
        })
        break
      case 'matches':
        wx.navigateTo({
          url: '/pages/frequency-match/index'
        })
        break
      case 'privacy':
        this.showPrivacySettings()
        break
      case 'notifications':
        this.showNotificationSettings()
        break
      case 'help':
        wx.navigateTo({
          url: '/pages/help/index'
        })
        break
      case 'about':
        wx.navigateTo({
          url: '/pages/about/index'
        })
        break
      default:
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        })
    }
  },

  // 显示隐私设置
  showPrivacySettings () {
    wx.showActionSheet({
      itemList: ['公开资料', '仅好友可见', '完全隐私'],
      success: (res) => {
        const options = ['公开资料', '仅好友可见', '完全隐私']
        wx.showToast({
          title: `已设置为${options[res.tapIndex]}`,
          icon: 'success'
        })
      }
    })
  },

  // 显示通知设置
  showNotificationSettings () {
    wx.showModal({
      title: '通知设置',
      content: '是否开启推送通知？',
      confirmText: '开启',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '通知已开启',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '通知已关闭',
            icon: 'success'
          })
        }
      }
    })
  },

  // 底部导航切换
  onNavChange (e) {
    const { tab } = e.detail

    switch (tab) {
      case 'home':
        wx.switchTab({
          url: '/pages/home/index'
        })
        break
      case 'meet':
        wx.switchTab({
          url: '/pages/frequency-match/index'
        })
        break
      case 'messages':
        wx.switchTab({
          url: '/pages/messages/index'
        })
        break
      case 'profile':
        // 当前页面，不需要跳转
        break
    }
  },

  // 分享
  onShareAppMessage () {
    return {
      title: '品遇 - 发现有趣的人',
      path: '/pages/home/index',
      imageUrl: '/images/share-cover.jpg'
    }
  }
})
