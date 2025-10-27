// pages/messages/index.js
const app = getApp()

Page({
  data: {
    currentTab: 'message',
    conversations: [],
    loading: false,
    searchQuery: '',
    showSearch: false
  },

  onLoad () {
    this.loadConversations()
  },

  onShow () {
    this.setData({
      currentTab: 'message'
    })
    // 刷新会话列表
    this.loadConversations()
    // 设置自定义tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },

  onPullDownRefresh () {
    this.loadConversations()
    wx.stopPullDownRefresh()
  },

  // 加载会话列表
  loadConversations () {
    this.setData({ loading: true })

    // 模拟API调用
    setTimeout(() => {
      const mockConversations = [
        {
          id: 'conv_1',
          userId: 'user_1',
          userName: 'Alice',
          userAvatar: '/assets/images/avatar1.jpg',
          lastMessage: '你好，很高兴认识你！',
          lastMessageTime: '刚刚',
          unreadCount: 2,
          isOnline: true,
          messageType: 'text'
        },
        {
          id: 'conv_2',
          userId: 'user_2',
          userName: 'Bob',
          userAvatar: '/assets/images/avatar2.jpg',
          lastMessage: '周末有空一起喝咖啡吗？',
          lastMessageTime: '5分钟前',
          unreadCount: 0,
          isOnline: false,
          messageType: 'text'
        },
        {
          id: 'conv_3',
          userId: 'user_3',
          userName: 'Carol',
          userAvatar: '/assets/images/avatar3.jpg',
          lastMessage: '[图片]',
          lastMessageTime: '1小时前',
          unreadCount: 1,
          isOnline: true,
          messageType: 'image'
        },
        {
          id: 'conv_4',
          userId: 'user_4',
          userName: 'David',
          userAvatar: '/assets/images/avatar4.jpg',
          lastMessage: '谢谢你的推荐，那家餐厅真的很不错！',
          lastMessageTime: '昨天',
          unreadCount: 0,
          isOnline: false,
          messageType: 'text'
        },
        {
          id: 'conv_5',
          userId: 'user_5',
          userName: 'Emma',
          userAvatar: '/assets/images/avatar5.jpg',
          lastMessage: '活动报名成功了吗？',
          lastMessageTime: '2天前',
          unreadCount: 0,
          isOnline: true,
          messageType: 'text'
        }
      ]

      this.setData({
        conversations: mockConversations,
        loading: false
      })
    }, 500)
  },

  // 搜索输入
  onSearchInput (e) {
    const query = e.detail.value
    this.setData({
      searchQuery: query
    })

    // 实时搜索
    this.filterConversations(query)
  },

  // 过滤会话
  filterConversations (query) {
    if (!query.trim()) {
      this.loadConversations()
      return
    }

    const filtered = this.data.conversations.filter(conv =>
      conv.userName.toLowerCase().includes(query.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(query.toLowerCase())
    )

    this.setData({
      conversations: filtered
    })
  },

  // 显示/隐藏搜索
  toggleSearch () {
    this.setData({
      showSearch: !this.data.showSearch,
      searchQuery: ''
    })

    if (!this.data.showSearch) {
      this.loadConversations()
    }
  },

  // 点击会话
  onConversationTap (e) {
    const { id, userId, userName } = e.currentTarget.dataset

    // 清除未读数
    const conversations = this.data.conversations.map(conv => {
      if (conv.id === id) {
        return { ...conv, unreadCount: 0 }
      }
      return conv
    })

    this.setData({ conversations })

    // 跳转到聊天页面
    wx.navigateTo({
      url: `/pages/chat/index?userId=${userId}&userName=${userName}`
    })
  },

  // 删除会话
  onDeleteConversation (e) {
    const { id } = e.currentTarget.dataset

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个会话吗？',
      success: (res) => {
        if (res.confirm) {
          const conversations = this.data.conversations.filter(conv => conv.id !== id)
          this.setData({ conversations })

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 底部导航切换
  onNavChange (e) {
    const { tab } = e.detail
    console.log('导航切换:', tab)
  },

  // 分享
  onShareAppMessage () {
    return {
      title: 'PINYU CLUB - 私信',
      path: '/pages/messages/index'
    }
  }
})
