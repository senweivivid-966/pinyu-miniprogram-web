// pages/edit-profile/index.js
Page({
  data: {
    userInfo: {
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      name: '张小美',
      age: 25,
      gender: 'female',
      city: '上海',
      occupation: '产品经理',
      company: '互联网公司',
      bio: '热爱生活，喜欢旅行和美食，希望遇到有趣的灵魂',
      height: 165,
      education: 'bachelor',
      income: 'middle',
      smoking: 'never',
      drinking: 'social'
    },
    genderOptions: [
      { value: 'female', label: '女' },
      { value: 'male', label: '男' },
      { value: 'other', label: '其他' }
    ],
    educationOptions: [
      { value: 'high_school', label: '高中' },
      { value: 'college', label: '大专' },
      { value: 'bachelor', label: '本科' },
      { value: 'master', label: '硕士' },
      { value: 'phd', label: '博士' }
    ],
    incomeOptions: [
      { value: 'low', label: '5K以下' },
      { value: 'middle_low', label: '5K-10K' },
      { value: 'middle', label: '10K-20K' },
      { value: 'middle_high', label: '20K-30K' },
      { value: 'high', label: '30K以上' }
    ],
    smokingOptions: [
      { value: 'never', label: '从不' },
      { value: 'occasionally', label: '偶尔' },
      { value: 'regularly', label: '经常' }
    ],
    drinkingOptions: [
      { value: 'never', label: '从不' },
      { value: 'social', label: '社交场合' },
      { value: 'regularly', label: '经常' }
    ],
    cityList: ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉', '西安', '重庆'],
    loading: false,
    saving: false,
    // 添加计算属性用于 WXML 绑定
    genderSelectedIndex: 0,
    genderSelectedLabel: '女'
  },

  onLoad (options) {
    console.log('Edit profile page loaded')
    this.loadUserProfile()
    this.updateGenderSelection()
  },

  // 加载用户资料
  loadUserProfile () {
    this.setData({ loading: true })

    // 模拟API调用
    setTimeout(() => {
      this.setData({ loading: false })
      this.updateGenderSelection()
    }, 500)
  },

  // 更新性别选择状态
  updateGenderSelection () {
    const { genderOptions, userInfo } = this.data
    const selectedIndex = genderOptions.findIndex(item => item.value === userInfo.gender)
    const selectedLabel = genderOptions.find(item => item.value === userInfo.gender)?.label || '女'

    this.setData({
      genderSelectedIndex: selectedIndex >= 0 ? selectedIndex : 0,
      genderSelectedLabel: selectedLabel
    })
  },

  // 头像点击
  onAvatarTap () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.setData({
          'userInfo.avatar': tempFilePath
        })
      }
    })
  },

  // 输入框变化
  onInputChange (e) {
    const { field } = e.currentTarget.dataset
    const { value } = e.detail

    this.setData({
      [`userInfo.${field}`]: value
    })
  },

  // 年龄选择
  onAgeChange (e) {
    const age = parseInt(e.detail.value) + 18 // 最小18岁
    this.setData({
      'userInfo.age': age
    })
  },

  // 身高选择
  onHeightChange (e) {
    const height = parseInt(e.detail.value) + 150 // 最小150cm
    this.setData({
      'userInfo.height': height
    })
  },

  // 性别选择
  onGenderChange (e) {
    const index = e.detail.value
    const gender = this.data.genderOptions[index].value
    const label = this.data.genderOptions[index].label

    this.setData({
      'userInfo.gender': gender,
      genderSelectedIndex: index,
      genderSelectedLabel: label
    })
  },

  // 城市选择
  onCityChange (e) {
    const index = e.detail.value
    const city = this.data.cityList[index]
    this.setData({
      'userInfo.city': city
    })
  },

  // 学历选择
  onEducationChange (e) {
    const index = e.detail.value
    const education = this.data.educationOptions[index].value
    this.setData({
      'userInfo.education': education
    })
  },

  // 收入选择
  onIncomeChange (e) {
    const index = e.detail.value
    const income = this.data.incomeOptions[index].value
    this.setData({
      'userInfo.income': income
    })
  },

  // 吸烟选择
  onSmokingChange (e) {
    const index = e.detail.value
    const smoking = this.data.smokingOptions[index].value
    this.setData({
      'userInfo.smoking': smoking
    })
  },

  // 饮酒选择
  onDrinkingChange (e) {
    const index = e.detail.value
    const drinking = this.data.drinkingOptions[index].value
    this.setData({
      'userInfo.drinking': drinking
    })
  },

  // 获取选项显示文本
  getOptionLabel (options, value) {
    const option = options.find(opt => opt.value === value)
    return option ? option.label : ''
  },

  // 保存资料
  onSave () {
    // 验证必填字段
    if (!this.data.userInfo.name.trim()) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }

    if (!this.data.userInfo.bio.trim()) {
      wx.showToast({
        title: '请输入个人简介',
        icon: 'none'
      })
      return
    }

    this.setData({ saving: true })

    // 模拟保存API调用
    setTimeout(() => {
      this.setData({ saving: false })

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }, 2000)
  },

  // 返回
  onBack () {
    wx.navigateBack()
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
