Component({
  properties: {
    placeholder: {
      type: String,
      value: '搜索...'
    },
    value: {
      type: String,
      value: ''
    },
    variant: {
      type: String,
      value: 'default' // 'default' | 'hero'
    },
    size: {
      type: String,
      value: 'md' // 'sm' | 'md'
    },
    showFilter: {
      type: Boolean,
      value: true
    }
  },

  data: {
    inputValue: '',
    focused: false
  },

  observers: {
    value: function (newVal) {
      this.setData({
        inputValue: newVal
      })
    }
  },

  methods: {
    onInput (e) {
      const value = e.detail.value
      this.setData({
        inputValue: value
      })
      this.triggerEvent('input', { value })
    },

    onFocus () {
      this.setData({
        focused: true
      })
      this.triggerEvent('focus')
    },

    onBlur () {
      this.setData({
        focused: false
      })
      this.triggerEvent('blur')
    },

    onConfirm () {
      this.triggerEvent('confirm', { value: this.data.inputValue })
    },

    onClear () {
      this.setData({
        inputValue: ''
      })
      this.triggerEvent('input', { value: '' })
      this.triggerEvent('clear')
    },

    onFilter () {
      this.triggerEvent('filter')
    }
  }
})
