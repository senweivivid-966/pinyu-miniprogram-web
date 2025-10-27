Component({
  properties: {
    // 事件ID
    eventId: {
      type: String,
      value: ''
    },
    // 事件标题
    title: {
      type: String,
      value: ''
    },
    // 事件描述
    meta: {
      type: String,
      value: ''
    },
    // 封面图片URL
    coverUrl: {
      type: String,
      value: ''
    },
    // 地点
    place: {
      type: String,
      value: ''
    },
    // 城市
    city: {
      type: String,
      value: ''
    },
    // 容量
    capacity: {
      type: Number,
      value: 0
    },
    // 已报名人数
    registered: {
      type: Number,
      value: 0
    },
    // 是否已报名
    registeredByMe: {
      type: Boolean,
      value: false
    },
    // 是否在候补队列
    waitlistedByMe: {
      type: Boolean,
      value: false
    },
    // 候补位置
    waitlistPosition: {
      type: Number,
      value: -1
    },
    // 高亮搜索关键词
    highlightQuery: {
      type: String,
      value: ''
    }
  },

  data: {
    imgLoading: false,
    imgError: false,
    showModal: false,
    formData: {
      name: '',
      phone: '',
      remark: ''
    },
    loading: {
      register: false,
      cancelReg: false,
      joinWait: false,
      cancelWait: false
    }
  },

  computed: {
    // 剩余名额
    remaining () {
      return Math.max(0, this.data.capacity - this.data.registered)
    },

    // 显示的地点信息
    locationText () {
      const { place, city } = this.data
      if (!place) return ''
      return `地点：${place}${city ? `（${city}）` : ''}`
    }
  },

  methods: {
    // 图片加载开始
    onImageLoad () {
      this.setData({
        imgLoading: false,
        imgError: false
      })
    },

    // 图片加载失败
    onImageError () {
      this.setData({
        imgLoading: false,
        imgError: true
      })
    },

    // 重试加载图片
    retryImage () {
      this.setData({
        imgLoading: true,
        imgError: false
      })
    },

    // 点击报名按钮
    onRegisterTap () {
      if (this.data.registeredByMe || this.data.remaining <= 0) {
        return
      }
      this.setData({
        showModal: true
      })
    },

    // 查看详情
    onDetailTap () {
      wx.navigateTo({
        url: `/pages/activity-detail/index?id=${this.data.eventId}`
      })
    },

    // 取消报名
    async onCancelRegister () {
      this.setData({
        'loading.cancelReg': true
      })

      try {
        // 这里应该调用实际的API
        await this.mockApiCall()

        this.triggerEvent('cancel-register', {
          eventId: this.data.eventId
        })

        wx.showToast({
          title: '取消成功',
          icon: 'success'
        })
      } catch (error) {
        wx.showToast({
          title: '取消失败',
          icon: 'error'
        })
      } finally {
        this.setData({
          'loading.cancelReg': false
        })
      }
    },

    // 加入候补
    async onJoinWaitlist () {
      this.setData({
        'loading.joinWait': true
      })

      try {
        await this.mockApiCall()

        this.triggerEvent('join-waitlist', {
          eventId: this.data.eventId
        })

        wx.showToast({
          title: '已加入候补',
          icon: 'success'
        })
      } catch (error) {
        wx.showToast({
          title: '加入失败',
          icon: 'error'
        })
      } finally {
        this.setData({
          'loading.joinWait': false
        })
      }
    },

    // 取消候补
    async onCancelWaitlist () {
      this.setData({
        'loading.cancelWait': true
      })

      try {
        await this.mockApiCall()

        this.triggerEvent('cancel-waitlist', {
          eventId: this.data.eventId
        })

        wx.showToast({
          title: '取消候补成功',
          icon: 'success'
        })
      } catch (error) {
        wx.showToast({
          title: '取消失败',
          icon: 'error'
        })
      } finally {
        this.setData({
          'loading.cancelWait': false
        })
      }
    },

    // 关闭弹窗
    onCloseModal () {
      this.setData({
        showModal: false,
        formData: {
          name: '',
          phone: '',
          remark: ''
        }
      })
    },

    // 表单输入
    onFormInput (e) {
      const { field } = e.currentTarget.dataset
      const { value } = e.detail
      this.setData({
        [`formData.${field}`]: value
      })
    },

    // 提交报名
    async onSubmitRegister () {
      const { name, phone } = this.data.formData

      if (!name.trim()) {
        wx.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        return
      }

      if (!phone.trim()) {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return
      }

      this.setData({
        'loading.register': true
      })

      try {
        await this.mockApiCall()

        this.triggerEvent('register', {
          eventId: this.data.eventId,
          formData: this.data.formData
        })

        wx.showToast({
          title: '报名成功',
          icon: 'success'
        })

        this.onCloseModal()
      } catch (error) {
        wx.showToast({
          title: '报名失败',
          icon: 'error'
        })
      } finally {
        this.setData({
          'loading.register': false
        })
      }
    },

    // 模拟API调用
    mockApiCall () {
      return new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
    },

    // 高亮文本处理
    highlightText (text, query) {
      if (!query || !text) return text

      const regex = new RegExp(`(${query})`, 'gi')
      return text.replace(regex, '<span class="highlight">$1</span>')
    }
  },

  lifetimes: {
    attached () {
      if (this.data.coverUrl) {
        this.setData({
          imgLoading: true
        })
      }
    }
  }
})
