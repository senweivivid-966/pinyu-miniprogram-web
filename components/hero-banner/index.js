// components/hero-banner/index.js
Component({
  properties: {
    title: {
      type: String,
      value: '品遇'
    },
    subtitle: {
      type: String,
      value: '遇见更好的自己'
    },
    backgroundImage: {
      type: String,
      value: ''
    },
    height: {
      type: String,
      value: '400rpx'
    }
  },

  data: {

  },

  methods: {
    onBannerTap () {
      this.triggerEvent('tap')
    }
  }
})
