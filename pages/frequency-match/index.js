// pages/frequency-match/index.js
const app = getApp()

Page({
  data: {
    currentTab: 'meet',
    members: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad () {
    this.loadMembers()
  },

  onShow () {
    // 更新底部导航状态
    this.setData({
      currentTab: 'meet'
    })
    // 设置自定义tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  onReachBottom () {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMoreMembers()
    }
  },

  onPullDownRefresh () {
    this.refreshMembers()
  },

  // 加载会员数据
  loadMembers () {
    this.setData({ loading: true })

    // 模拟API调用
    setTimeout(() => {
      const mockMembers = this.generateMockMembers(this.data.pageSize)

      this.setData({
        members: mockMembers,
        loading: false,
        page: 1
      })
    }, 500)
  },

  // 加载更多会员
  loadMoreMembers () {
    this.setData({ loading: true })

    setTimeout(() => {
      const newMembers = this.generateMockMembers(this.data.pageSize, this.data.page + 1)

      this.setData({
        members: [...this.data.members, ...newMembers],
        loading: false,
        page: this.data.page + 1,
        hasMore: newMembers.length === this.data.pageSize
      })
    }, 500)
  },

  // 刷新数据
  refreshMembers () {
    this.setData({
      page: 1,
      hasMore: true
    })

    setTimeout(() => {
      const mockMembers = this.generateMockMembers(this.data.pageSize)

      this.setData({
        members: mockMembers,
        loading: false,
        page: 1
      })

      wx.stopPullDownRefresh()
    }, 500)
  },

  // 生成模拟数据
  generateMockMembers (count, page = 1) {
    const members = []
    const names = ['Alice', 'Bob', 'Carol', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack']
    const locations = ['上海', '北京', '深圳', '广州', '杭州', '南京', '成都', '武汉']
    const interests = ['摄影', '旅行', '音乐', '阅读', '运动', '美食', '艺术', '科技']

    for (let i = 0; i < count; i++) {
      const id = (page - 1) * count + i + 1
      members.push({
        id,
        name: names[i % names.length] + id,
        age: 25 + Math.floor(Math.random() * 10),
        location: locations[Math.floor(Math.random() * locations.length)],
        avatarUrl: `/assets/images/avatar${(i % 5) + 1}.jpg`,
        bio: '热爱生活，享受每一个美好时刻',
        interests: interests.slice(0, 3 + Math.floor(Math.random() * 3)),
        matchScore: 70 + Math.floor(Math.random() * 30),
        distance: Math.floor(Math.random() * 50) + 1,
        isOnline: Math.random() > 0.5,
        lastActiveTime: Date.now() - Math.floor(Math.random() * 86400000) // 24小时内随机时间
      })
    }

    return members
  },

  // 查看会员详情
  onMemberTap (e) {
    const memberId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/member-profile/index?id=${memberId}`
    })
  },

  // 喜欢操作
  onLike (e) {
    const memberId = e.currentTarget.dataset.id
    const memberIndex = this.data.members.findIndex(m => m.id === memberId)

    if (memberIndex !== -1) {
      const members = [...this.data.members]
      members[memberIndex].isLiked = !members[memberIndex].isLiked

      this.setData({ members })

      // 显示反馈
      wx.showToast({
        title: members[memberIndex].isLiked ? '已喜欢' : '取消喜欢',
        icon: 'success',
        duration: 1000
      })

      // 如果是喜欢操作，可能触发匹配
      if (members[memberIndex].isLiked && Math.random() > 0.7) {
        setTimeout(() => {
          wx.showModal({
            title: '恭喜！',
            content: '你们互相喜欢，现在可以开始聊天了！',
            confirmText: '开始聊天',
            cancelText: '稍后',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: `/pages/messages/index?memberId=${memberId}`
                })
              }
            }
          })
        }, 1000)
      }
    }
  },

  // 跳过操作
  onSkip (e) {
    const memberId = e.currentTarget.dataset.id
    const members = this.data.members.filter(m => m.id !== memberId)

    this.setData({ members })

    wx.showToast({
      title: '已跳过',
      icon: 'none',
      duration: 1000
    })
  },

  // 底部导航变化
  onNavChange (e) {
    const { key, pagePath } = e.detail
    console.log('导航切换:', key, pagePath)
  },

  // 分享功能
  onShareAppMessage () {
    return {
      title: '发现有趣的人 - PINYU CLUB',
      path: '/pages/frequency-match/index',
      imageUrl: '/assets/images/share-match.jpg'
    }
  }
})
