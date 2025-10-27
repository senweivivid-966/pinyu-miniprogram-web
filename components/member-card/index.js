// components/member-card/index.js
Component({
  properties: {
    member: {
      type: Object,
      value: {}
    },
    showActions: {
      type: Boolean,
      value: true
    },
    cardType: {
      type: String,
      value: 'default' // default, compact, detailed
    }
  },

  data: {
    defaultMember: {
      id: 1,
      name: '品遇用户',
      avatar: '/assets/images/default-avatar.png',
      age: 25,
      location: '北京',
      tags: ['摄影', '旅行', '美食'],
      bio: '热爱生活，喜欢交朋友',
      online: true
    }
  },

  methods: {
    onCardTap () {
      const member = this.data.member.id ? this.data.member : this.data.defaultMember
      this.triggerEvent('cardtap', { member })
    },

    onLikeTap (e) {
      e.stopPropagation()
      const member = this.data.member.id ? this.data.member : this.data.defaultMember
      this.triggerEvent('like', { member })
    },

    onChatTap (e) {
      e.stopPropagation()
      const member = this.data.member.id ? this.data.member : this.data.defaultMember
      this.triggerEvent('chat', { member })
    }
  },

  lifetimes: {
    attached () {
      if (!this.data.member.id) {
        this.setData({
          member: this.data.defaultMember
        })
      }
    }
  }
})
