// components/quick-actions/index.js
Component({
  properties: {
    actions: {
      type: Array,
      value: []
    },
    columns: {
      type: Number,
      value: 4
    }
  },

  data: {
    defaultActions: [
      {
        id: 'activity',
        name: '活动',
        icon: 'activity',
        color: '#FF6B6B'
      },
      {
        id: 'match',
        name: '匹配',
        icon: 'match',
        color: '#4ECDC4'
      },
      {
        id: 'chat',
        name: '聊天',
        icon: 'chat',
        color: '#45B7D1'
      },
      {
        id: 'profile',
        name: '资料',
        icon: 'profile',
        color: '#96CEB4'
      }
    ]
  },

  methods: {
    onActionTap (e) {
      const { action } = e.currentTarget.dataset
      this.triggerEvent('actiontap', { action })
    }
  },

  lifetimes: {
    attached () {
      if (this.data.actions.length === 0) {
        this.setData({
          actions: this.data.defaultActions
        })
      }
    }
  }
})
