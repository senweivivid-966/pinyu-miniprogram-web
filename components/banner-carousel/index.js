// components/banner-carousel/index.js
Component({
  properties: {
    banners: {
      type: Array,
      value: []
    },
    autoplay: {
      type: Boolean,
      value: true
    },
    interval: {
      type: Number,
      value: 3000
    },
    circular: {
      type: Boolean,
      value: true
    },
    indicatorDots: {
      type: Boolean,
      value: true
    },
    height: {
      type: String,
      value: '400rpx'
    }
  },

  data: {
    current: 0,
    defaultBanners: [
      {
        id: 1,
        image: '/assets/images/banner1.jpg',
        title: '同频终相逢·共振即永恒',
        subtitle: 'AI驱动的高质量线下活动与专属社交',
        buttonText: '立即加入',
        link: '/pages/home/index'
      },
      {
        id: 2,
        image: '/assets/images/banner2.jpg',
        title: 'PINYU CLUB',
        subtitle: '高端社交俱乐部小程序',
        buttonText: '了解更多',
        link: '/pages/activities/index'
      },
      {
        id: 3,
        image: '/assets/images/banner3.jpg',
        title: '专为25-65岁高净值人群打造的独家社交平台',
        subtitle: '同频终相逢，共振即永恒',
        buttonText: '立即体验',
        link: '/pages/member/index'
      }
    ]
  },

  methods: {
    onSwiperChange (e) {
      this.setData({
        current: e.detail.current
      })
    },

    onBannerTap (e) {
      const { banner } = e.currentTarget.dataset
      this.triggerEvent('bannertap', { banner })
    },

    onButtonTap (e) {
      e.stopPropagation()
      const { banner } = e.currentTarget.dataset
      this.triggerEvent('buttontap', { banner })
    }
  },

  lifetimes: {
    attached () {
      if (this.data.banners.length === 0) {
        this.setData({
          banners: this.data.defaultBanners
        })
      }
    }
  }
})
