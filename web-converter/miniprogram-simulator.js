/**
 * 小程序模拟器
 * 在Web环境中模拟小程序的运行环境和API
 */
class MiniprogramSimulator {
  constructor () {
    this.pages = new Map()
    this.currentPage = null
    this.globalData = {}
    this.components = new Map()
    this.systemInfo = {
      brand: 'simulator',
      model: 'web',
      pixelRatio: window.devicePixelRatio || 1,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      statusBarHeight: 20,
      language: navigator.language || 'zh_CN',
      version: '8.0.5',
      system: navigator.userAgent,
      platform: 'web',
      fontSizeSetting: 16,
      SDKVersion: '2.19.4',
      benchmarkLevel: 1,
      albumAuthorized: true,
      cameraAuthorized: true,
      locationAuthorized: true,
      microphoneAuthorized: true,
      notificationAuthorized: true,
      bluetoothEnabled: false,
      locationEnabled: true,
      wifiEnabled: true,
      safeArea: {
        left: 0,
        right: window.innerWidth,
        top: 20,
        bottom: window.innerHeight,
        width: window.innerWidth,
        height: window.innerHeight - 20
      }
    }

    this.initWxAPI()
    this.initPageSystem()
    this.initComponentSystem()
    this.initDataBinding()
  }

  initWxAPI () {
    // 创建全局wx对象
    window.wx = {
      // 基础API
      canIUse: (api) => {
        const supportedAPIs = [
          'getSystemInfo', 'showToast', 'showModal', 'showLoading', 'hideLoading',
          'navigateTo', 'redirectTo', 'switchTab', 'navigateBack', 'reLaunch',
          'setStorageSync', 'getStorageSync', 'removeStorageSync', 'clearStorageSync',
          'request', 'uploadFile', 'downloadFile', 'connectSocket',
          'chooseImage', 'previewImage', 'getImageInfo', 'saveImageToPhotosAlbum',
          'startRecord', 'stopRecord', 'playVoice', 'pauseVoice', 'stopVoice',
          'getBackgroundAudioPlayerState', 'playBackgroundAudio', 'pauseBackgroundAudio',
          'seekBackgroundAudio', 'stopBackgroundAudio', 'onBackgroundAudioPlay',
          'onBackgroundAudioPause', 'onBackgroundAudioStop', 'createVideoContext',
          'createCameraContext', 'createLivePlayerContext', 'createLivePusherContext',
          'saveVideoToPhotosAlbum', 'createMapContext', 'getLocation', 'chooseLocation',
          'openLocation', 'createCanvasContext', 'canvasToTempFilePath', 'canvasPutImageData',
          'canvasGetImageData', 'setClipboardData', 'getClipboardData', 'makePhoneCall',
          'scanCode', 'setScreenBrightness', 'getScreenBrightness', 'setKeepScreenOn',
          'vibrateLong', 'vibrateShort', 'addPhoneContact', 'getHCEState', 'startHCE',
          'stopHCE', 'onHCEMessage', 'sendHCEMessage', 'startWifi', 'stopWifi',
          'connectWifi', 'getWifiList', 'onGetWifiList', 'setWifiList', 'onWifiConnected',
          'onWifiConnectedWithPartialInfo', 'getConnectedWifi', 'startBeaconDiscovery',
          'stopBeaconDiscovery', 'getBeacons', 'onBeaconUpdate', 'onBeaconServiceChange',
          'openBluetoothAdapter', 'closeBluetoothAdapter', 'getBluetoothAdapterState',
          'onBluetoothAdapterStateChange', 'startBluetoothDevicesDiscovery',
          'stopBluetoothDevicesDiscovery', 'getBluetoothDevices', 'getConnectedBluetoothDevices',
          'onBluetoothDeviceFound', 'createBLEConnection', 'closeBLEConnection',
          'getBLEDeviceServices', 'getBLEDeviceCharacteristics', 'readBLECharacteristicValue',
          'writeBLECharacteristicValue', 'notifyBLECharacteristicValueChange',
          'onBLEConnectionStateChange', 'onBLECharacteristicValueChange'
        ]
        return supportedAPIs.includes(api)
      },

      // 系统信息
      getSystemInfo: (options = {}) => {
        const result = { ...this.systemInfo }
        if (options.success) options.success(result)
        if (options.complete) options.complete(result)
        return Promise.resolve(result)
      },

      getSystemInfoSync: () => {
        return { ...this.systemInfo }
      },

      // 界面交互
      showToast: (options = {}) => {
        this.showToast(options.title || '提示', options.icon || 'success', options.duration || 1500)
        if (options.success) options.success()
        if (options.complete) options.complete()
      },

      showModal: (options = {}) => {
        const result = {
          confirm: window.confirm(options.content || ''),
          cancel: false
        }
        result.cancel = !result.confirm
        if (result.confirm && options.success) options.success(result)
        if (result.cancel && options.fail) options.fail(result)
        if (options.complete) options.complete(result)
        return Promise.resolve(result)
      },

      showLoading: (options = {}) => {
        this.showLoading(options.title || '加载中')
        if (options.success) options.success()
        if (options.complete) options.complete()
      },

      hideLoading: (options = {}) => {
        this.hideLoading()
        if (options.success) options.success()
        if (options.complete) options.complete()
      },

      showActionSheet: (options = {}) => {
        const itemList = options.itemList || []
        const result = window.prompt('请选择:\n' + itemList.map((item, index) => `${index}: ${item}`).join('\n'))
        const tapIndex = parseInt(result)
        if (!isNaN(tapIndex) && tapIndex >= 0 && tapIndex < itemList.length) {
          if (options.success) options.success({ tapIndex })
        } else {
          if (options.fail) options.fail({ errMsg: 'showActionSheet:fail cancel' })
        }
        if (options.complete) options.complete()
      },

      // 导航
      navigateTo: (options = {}) => {
        this.navigateTo(options.url)
        if (options.success) options.success()
        if (options.complete) options.complete()
      },

      redirectTo: (options = {}) => {
        this.redirectTo(options.url)
        if (options.success) options.success()
        if (options.complete) options.complete()
      },

      switchTab: (options = {}) => {
        this.switchTab(options.url)
        if (options.success) options.success()
        if (options.complete) options.complete()
      },

      navigateBack: (options = {}) => {
        this.navigateBack(options.delta || 1)
        if (options.success) options.success()
        if (options.complete) options.complete()
      },

      reLaunch: (options = {}) => {
        this.reLaunch(options.url)
        if (options.success) options.success()
        if (options.complete) options.complete()
      },

      // 数据存储
      setStorageSync: (key, data) => {
        try {
          localStorage.setItem(`wx_${key}`, JSON.stringify(data))
          return true
        } catch (e) {
          console.error('setStorageSync error:', e)
          return false
        }
      },

      getStorageSync: (key) => {
        try {
          const data = localStorage.getItem(`wx_${key}`)
          return data ? JSON.parse(data) : ''
        } catch (e) {
          console.error('getStorageSync error:', e)
          return ''
        }
      },

      removeStorageSync: (key) => {
        try {
          localStorage.removeItem(`wx_${key}`)
          return true
        } catch (e) {
          console.error('removeStorageSync error:', e)
          return false
        }
      },

      clearStorageSync: () => {
        try {
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('wx_')) {
              localStorage.removeItem(key)
            }
          })
          return true
        } catch (e) {
          console.error('clearStorageSync error:', e)
          return false
        }
      },

      setStorage: (options = {}) => {
        try {
          localStorage.setItem(`wx_${options.key}`, JSON.stringify(options.data))
          if (options.success) options.success()
        } catch (e) {
          if (options.fail) options.fail(e)
        }
        if (options.complete) options.complete()
      },

      getStorage: (options = {}) => {
        try {
          const data = localStorage.getItem(`wx_${options.key}`)
          const result = { data: data ? JSON.parse(data) : null }
          if (options.success) options.success(result)
        } catch (e) {
          if (options.fail) options.fail(e)
        }
        if (options.complete) options.complete()
      },

      // 网络请求
      request: (options = {}) => {
        const {
          url,
          data = {},
          method = 'GET',
          header = {},
          dataType = 'json',
          responseType = 'text',
          success,
          fail,
          complete
        } = options

        fetch(url, {
          method: method.toUpperCase(),
          headers: {
            'Content-Type': 'application/json',
            ...header
          },
          body: method.toUpperCase() === 'GET' ? undefined : JSON.stringify(data)
        })
          .then(response => {
            const result = {
              data: null,
              statusCode: response.status,
              header: {}
            }

            // 转换headers
            response.headers.forEach((value, key) => {
              result.header[key] = value
            })

            if (dataType === 'json') {
              return response.json().then(json => {
                result.data = json
                return result
              })
            } else {
              return response.text().then(text => {
                result.data = text
                return result
              })
            }
          })
          .then(result => {
            if (success) success(result)
            if (complete) complete(result)
          })
          .catch(error => {
            const result = { errMsg: error.message }
            if (fail) fail(result)
            if (complete) complete(result)
          })
      },

      // 媒体API
      chooseImage: (options = {}) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.multiple = (options.count || 1) > 1

        input.onchange = (e) => {
          const files = Array.from(e.target.files)
          const tempFilePaths = files.map(file => URL.createObjectURL(file))
          const tempFiles = files.map((file, index) => ({
            path: tempFilePaths[index],
            size: file.size,
            type: file.type
          }))

          const result = { tempFilePaths, tempFiles }
          if (options.success) options.success(result)
          if (options.complete) options.complete(result)
        }

        input.click()
      },

      previewImage: (options = {}) => {
        const { urls = [], current = 0 } = options
        const currentUrl = typeof current === 'number' ? urls[current] : current
        window.open(currentUrl, '_blank')
        if (options.success) options.success()
        if (options.complete) options.complete()
      },

      // 设备API
      getLocation: (options = {}) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const result = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                speed: position.coords.speed || 0,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude || 0,
                verticalAccuracy: position.coords.altitudeAccuracy || 0,
                horizontalAccuracy: position.coords.accuracy
              }
              if (options.success) options.success(result)
              if (options.complete) options.complete(result)
            },
            (error) => {
              const result = { errMsg: `getLocation:fail ${error.message}` }
              if (options.fail) options.fail(result)
              if (options.complete) options.complete(result)
            }
          )
        } else {
          const result = { errMsg: 'getLocation:fail geolocation not supported' }
          if (options.fail) options.fail(result)
          if (options.complete) options.complete(result)
        }
      },

      makePhoneCall: (options = {}) => {
        window.location.href = `tel:${options.phoneNumber}`
        if (options.success) options.success()
        if (options.complete) options.complete()
      },

      // 剪贴板
      setClipboardData: (options = {}) => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(options.data).then(() => {
            if (options.success) options.success()
          }).catch(() => {
            if (options.fail) options.fail()
          }).finally(() => {
            if (options.complete) options.complete()
          })
        } else {
          // 降级方案
          const textArea = document.createElement('textarea')
          textArea.value = options.data
          document.body.appendChild(textArea)
          textArea.select()
          try {
            document.execCommand('copy')
            if (options.success) options.success()
          } catch (e) {
            if (options.fail) options.fail()
          }
          document.body.removeChild(textArea)
          if (options.complete) options.complete()
        }
      },

      getClipboardData: (options = {}) => {
        if (navigator.clipboard) {
          navigator.clipboard.readText().then(data => {
            if (options.success) options.success({ data })
          }).catch(() => {
            if (options.fail) options.fail()
          }).finally(() => {
            if (options.complete) options.complete()
          })
        } else {
          // Web环境下无法直接读取剪贴板
          if (options.fail) options.fail({ errMsg: 'getClipboardData:fail not supported' })
          if (options.complete) options.complete()
        }
      },

      // 页面和组件生命周期
      onPageShow: (callback) => {
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            callback()
          }
        })
      },

      onPageHide: (callback) => {
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            callback()
          }
        })
      },

      // 其他常用API的模拟实现
      createSelectorQuery: () => {
        return {
          select: (selector) => {
            return {
              boundingClientRect: (callback) => {
                const element = document.querySelector(selector)
                if (element) {
                  const rect = element.getBoundingClientRect()
                  callback(rect)
                } else {
                  callback(null)
                }
              }
            }
          },
          selectAll: (selector) => {
            return {
              boundingClientRect: (callback) => {
                const elements = document.querySelectorAll(selector)
                const rects = Array.from(elements).map(el => el.getBoundingClientRect())
                callback(rects)
              }
            }
          },
          exec: (callback) => {
            if (callback) callback()
          }
        }
      },

      createIntersectionObserver: (component, options = {}) => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (options.observeAll) {
              options.observeAll(entry)
            }
          })
        }, {
          root: options.root || null,
          rootMargin: options.rootMargin || '0px',
          threshold: options.thresholds || [0]
        })

        return {
          observe: (selector, callback) => {
            const element = document.querySelector(selector)
            if (element) {
              observer.observe(element)
            }
          },
          disconnect: () => {
            observer.disconnect()
          }
        }
      }
    }
  }

  initPageSystem () {
    // 页面系统初始化
    window.Page = (pageConfig) => {
      const pagePath = this.getCurrentPagePath()

      // 创建页面实例
      const pageInstance = {
        data: pageConfig.data || {},
        ...pageConfig,
        setData: (data, callback) => {
          this.setData(data, callback)
        },
        route: pagePath,
        options: this.getPageOptions()
      }

      // 注册页面
      this.pages.set(pagePath, pageInstance)
      this.currentPage = pageInstance

      // 执行页面生命周期
      if (pageInstance.onLoad) {
        pageInstance.onLoad(pageInstance.options)
      }

      setTimeout(() => {
        if (pageInstance.onShow) {
          pageInstance.onShow()
        }
        if (pageInstance.onReady) {
          pageInstance.onReady()
        }
      }, 0)

      return pageInstance
    }

    // App系统初始化
    window.App = (appConfig) => {
      this.app = {
        globalData: appConfig.globalData || {},
        ...appConfig
      }

      if (appConfig.onLaunch) {
        appConfig.onLaunch()
      }

      if (appConfig.onShow) {
        appConfig.onShow()
      }

      return this.app
    }

    // 获取App实例
    window.getApp = () => {
      return this.app || {}
    }

    // 获取当前页面实例
    window.getCurrentPages = () => {
      return Array.from(this.pages.values())
    }
  }

  initComponentSystem () {
    // 组件系统初始化
    window.Component = (componentConfig) => {
      const componentName = this.getCurrentComponentName()

      const componentInstance = {
        data: componentConfig.data || {},
        properties: componentConfig.properties || {},
        methods: componentConfig.methods || {},
        ...componentConfig,
        setData: (data, callback) => {
          Object.assign(componentInstance.data, data)
          this.updateComponentView(componentName, componentInstance.data)
          if (callback) callback()
        },
        triggerEvent: (eventName, detail = {}, options = {}) => {
          const event = new CustomEvent(eventName, {
            detail,
            bubbles: options.bubbles !== false,
            composed: options.composed !== false
          })

          const elements = document.querySelectorAll(`[data-component="${componentName}"]`)
          elements.forEach(element => {
            element.dispatchEvent(event)
          })
        }
      }

      // 注册组件
      this.components.set(componentName, componentInstance)

      // 执行组件生命周期
      if (componentInstance.created) {
        componentInstance.created()
      }

      setTimeout(() => {
        if (componentInstance.attached) {
          componentInstance.attached()
        }
        if (componentInstance.ready) {
          componentInstance.ready()
        }
      }, 0)

      return componentInstance
    }
  }

  initDataBinding () {
    // 数据绑定系统初始化
    this.observeDataChanges()
    this.bindEventHandlers()

    // 定期更新视图
    setInterval(() => {
      this.updateView()
    }, 100)
  }

  observeDataChanges () {
    // 监听数据变化并更新视图
    if (this.currentPage && this.currentPage.data) {
      const originalSetData = this.currentPage.setData
      this.currentPage.setData = (data, callback) => {
        // 更新数据
        Object.assign(this.currentPage.data, data)

        // 更新视图
        this.updatePageView(this.currentPage.data)

        // 执行回调
        if (callback) callback()
      }
    }
  }

  updatePageView (data) {
    // 更新页面视图
    Object.keys(data).forEach(key => {
      const value = data[key]

      // 更新文本内容
      const textElements = document.querySelectorAll(`[data-expression*="${key}"]`)
      textElements.forEach(element => {
        const expression = element.getAttribute('data-expression')
        try {
          const result = this.evaluateExpression(expression, data)
          element.textContent = result
        } catch (e) {
          console.warn('Expression evaluation failed:', expression, e)
        }
      })

      // 更新属性绑定
      const attrElements = document.querySelectorAll('[data-bind-*]')
      attrElements.forEach(element => {
        Array.from(element.attributes).forEach(attr => {
          if (attr.name.startsWith('data-bind-')) {
            const attrName = attr.name.replace('data-bind-', '')
            const expression = attr.value
            if (expression.includes(key)) {
              try {
                const result = this.evaluateExpression(expression, data)
                element.setAttribute(attrName, result)
              } catch (e) {
                console.warn('Attribute binding failed:', expression, e)
              }
            }
          }
        })
      })
    })

    // 处理条件渲染
    this.handleConditionalRendering(data)

    // 处理列表渲染
    this.handleListRendering(data)
  }

  updateComponentView (componentName, data) {
    // 更新组件视图
    const elements = document.querySelectorAll(`[data-component="${componentName}"]`)
    elements.forEach(element => {
      // 更新组件内部的数据绑定
      this.updateElementData(element, data)
    })
  }

  updateElementData (element, data) {
    // 更新元素的数据绑定
    const textNodes = element.querySelectorAll('[data-expression]')
    textNodes.forEach(node => {
      const expression = node.getAttribute('data-expression')
      try {
        const result = this.evaluateExpression(expression, data)
        node.textContent = result
      } catch (e) {
        console.warn('Expression evaluation failed:', expression, e)
      }
    })
  }

  handleConditionalRendering (data) {
    // 处理wx:if条件渲染
    const conditionalElements = document.querySelectorAll('[data-wx-if], [data-wx-elif], [data-wx-else]')

    conditionalElements.forEach(element => {
      let shouldShow = false

      if (element.hasAttribute('data-wx-if')) {
        const condition = element.getAttribute('data-wx-if')
        shouldShow = this.evaluateExpression(condition, data)
      } else if (element.hasAttribute('data-wx-elif')) {
        const condition = element.getAttribute('data-wx-elif')
        // 检查前面的if/elif是否已经为true
        let prevElement = element.previousElementSibling
        let prevConditionMet = false

        while (prevElement) {
          if (prevElement.hasAttribute('data-wx-if') || prevElement.hasAttribute('data-wx-elif')) {
            const prevCondition = prevElement.getAttribute('data-wx-if') || prevElement.getAttribute('data-wx-elif')
            if (this.evaluateExpression(prevCondition, data)) {
              prevConditionMet = true
              break
            }
          }
          prevElement = prevElement.previousElementSibling
        }

        shouldShow = !prevConditionMet && this.evaluateExpression(condition, data)
      } else if (element.hasAttribute('data-wx-else')) {
        // 检查前面的if/elif是否都为false
        let prevElement = element.previousElementSibling
        let prevConditionMet = false

        while (prevElement) {
          if (prevElement.hasAttribute('data-wx-if') || prevElement.hasAttribute('data-wx-elif')) {
            const prevCondition = prevElement.getAttribute('data-wx-if') || prevElement.getAttribute('data-wx-elif')
            if (this.evaluateExpression(prevCondition, data)) {
              prevConditionMet = true
              break
            }
          }
          prevElement = prevElement.previousElementSibling
        }

        shouldShow = !prevConditionMet
      }

      // 处理hidden属性
      if (element.hasAttribute('data-hidden')) {
        const hiddenCondition = element.getAttribute('data-hidden')
        const isHidden = this.evaluateExpression(hiddenCondition, data)
        shouldShow = shouldShow && !isHidden
      }

      element.style.display = shouldShow ? '' : 'none'
    })
  }

  handleListRendering (data) {
    // 处理wx:for列表渲染
    const listElements = document.querySelectorAll('[data-wx-for]')

    listElements.forEach(element => {
      const forExpression = element.getAttribute('data-wx-for')
      const itemName = element.getAttribute('data-wx-for-item') || 'item'
      const indexName = element.getAttribute('data-wx-for-index') || 'index'
      const keyName = element.getAttribute('data-wx-key')

      try {
        const listData = this.evaluateExpression(forExpression, data)
        if (Array.isArray(listData)) {
          this.renderList(element, listData, itemName, indexName, keyName)
        }
      } catch (e) {
        console.warn('List rendering failed:', forExpression, e)
      }
    })
  }

  renderList (container, listData, itemName, indexName, keyName) {
    // 清空容器
    container.innerHTML = ''

    // 获取模板
    const template = container.getAttribute('data-template') || container.outerHTML

    // 渲染列表项
    listData.forEach((item, index) => {
      const itemElement = document.createElement('div')
      itemElement.innerHTML = template

      // 替换模板中的变量
      const itemData = {
        [itemName]: item,
        [indexName]: index
      }

      this.updateElementData(itemElement, itemData)
      container.appendChild(itemElement)
    })
  }

  bindEventHandlers () {
    // 绑定事件处理器
    document.addEventListener('click', (event) => {
      const target = event.target
      const handler = target.getAttribute('onclick')

      if (handler && handler.includes('handleEvent')) {
        const match = handler.match(/handleEvent\('([^']+)',\s*event\)/)
        if (match) {
          const methodName = match[1]
          this.callPageMethod(methodName, event)
        }
      }
    })

    // 绑定其他事件类型
    const eventTypes = ['input', 'change', 'focus', 'blur', 'submit', 'reset']
    eventTypes.forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        const target = event.target
        const handler = target.getAttribute(`on${eventType}`)

        if (handler && handler.includes('handleEvent')) {
          const match = handler.match(/handleEvent\('([^']+)',\s*event\)/)
          if (match) {
            const methodName = match[1]
            this.callPageMethod(methodName, event)
          }
        }
      })
    })
  }

  callPageMethod (methodName, event) {
    // 调用页面方法
    if (this.currentPage && typeof this.currentPage[methodName] === 'function') {
      try {
        this.currentPage[methodName].call(this.currentPage, event)
      } catch (e) {
        console.error(`Error calling page method ${methodName}:`, e)
      }
    } else {
      console.warn(`Page method ${methodName} not found`)
    }
  }

  evaluateExpression (expression, data) {
    // 安全地计算表达式
    try {
      // 创建一个安全的执行环境
      const context = { ...data }

      // 简单的表达式计算
      if (expression.includes('.')) {
        const parts = expression.split('.')
        let result = context
        for (const part of parts) {
          if (result && typeof result === 'object') {
            result = result[part]
          } else {
            return undefined
          }
        }
        return result
      } else {
        return context[expression]
      }
    } catch (e) {
      console.warn('Expression evaluation error:', expression, e)
      return undefined
    }
  }

  // 界面交互方法
  showToast (title, icon = 'success', duration = 1500) {
    const toast = document.createElement('div')
    toast.className = 'wx-toast'
    toast.innerHTML = `
      <div class="wx-toast-content">
        <div class="wx-toast-icon wx-toast-${icon}"></div>
        <div class="wx-toast-text">${title}</div>
      </div>
    `

    // 添加样式
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 10000;
      text-align: center;
      min-width: 120px;
    `

    document.body.appendChild(toast)

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, duration)
  }

  showLoading (title = '加载中') {
    this.hideLoading() // 先隐藏之前的loading

    const loading = document.createElement('div')
    loading.id = 'wx-loading'
    loading.className = 'wx-loading'
    loading.innerHTML = `
      <div class="wx-loading-content">
        <div class="wx-loading-spinner"></div>
        <div class="wx-loading-text">${title}</div>
      </div>
    `

    // 添加样式
    loading.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10001;
    `

    document.body.appendChild(loading)
  }

  hideLoading () {
    const loading = document.getElementById('wx-loading')
    if (loading) {
      loading.parentNode.removeChild(loading)
    }
  }

  // 导航方法
  navigateTo (url) {
    console.log('Navigate to:', url)
    // 在实际应用中，这里应该实现页面跳转逻辑
  }

  redirectTo (url) {
    console.log('Redirect to:', url)
    // 在实际应用中，这里应该实现页面重定向逻辑
  }

  switchTab (url) {
    console.log('Switch tab to:', url)
    // 在实际应用中，这里应该实现标签页切换逻辑
  }

  navigateBack (delta = 1) {
    console.log('Navigate back:', delta)
    // 在实际应用中，这里应该实现页面返回逻辑
    if (window.history.length > delta) {
      window.history.go(-delta)
    }
  }

  reLaunch (url) {
    console.log('Relaunch to:', url)
    // 在实际应用中，这里应该实现应用重启逻辑
  }

  // 工具方法
  getCurrentPagePath () {
    // 获取当前页面路径
    const path = window.location.pathname
    return path.replace(/^\//, '').replace(/\.html$/, '') || 'index'
  }

  getCurrentComponentName () {
    // 获取当前组件名称（简化实现）
    return 'component-' + Date.now()
  }

  getPageOptions () {
    // 获取页面参数
    const params = new URLSearchParams(window.location.search)
    const options = {}
    for (const [key, value] of params) {
      options[key] = value
    }
    return options
  }

  setData (data, callback) {
    // 设置页面数据
    if (this.currentPage) {
      Object.assign(this.currentPage.data, data)
      this.updatePageView(this.currentPage.data)
    }
    if (callback) callback()
  }

  getData () {
    // 获取页面数据
    return this.currentPage ? this.currentPage.data : {}
  }

  updateView () {
    // 更新视图（定期调用）
    if (this.currentPage && this.currentPage.data) {
      this.updatePageView(this.currentPage.data)
    }
  }

  // 静态初始化方法
  static init () {
    const simulator = new MiniprogramSimulator()

    // 添加基础样式
    const style = document.createElement('style')
    style.textContent = `
      .wx-toast {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
      }
      
      .wx-loading-content {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        min-width: 120px;
      }
      
      .wx-loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #ffffff;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: wx-spin 1s linear infinite;
        margin: 0 auto 10px;
      }
      
      @keyframes wx-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .wx-loading-text {
        font-size: 14px;
      }
    `
    document.head.appendChild(style)

    return simulator
  }
}

// 导出模拟器
if (typeof window !== 'undefined') {
  window.MiniprogramSimulator = MiniprogramSimulator
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MiniprogramSimulator
}
