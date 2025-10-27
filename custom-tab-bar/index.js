// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    color: '#999999',
    selectedColor: '#FF6B9D',
    list: [
      {
        pagePath: '/pages/home/index',
        text: '首页',
        icon: 'home'
      },
      {
        pagePath: '/pages/frequency-match/index',
        text: '相遇',
        icon: 'heart'
      },
      {
        pagePath: '/pages/messages/index',
        text: '私信',
        icon: 'message'
      },
      {
        pagePath: '/pages/publish/index',
        text: '发布',
        icon: 'plus'
      },
      {
        pagePath: '/pages/profile/index',
        text: '我',
        icon: 'user'
      }
    ]
  },
  attached () {
  },
  methods: {
    switchTab (e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})
