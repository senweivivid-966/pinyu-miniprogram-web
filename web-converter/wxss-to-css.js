/**
 * WXSS to CSS Converter
 * 将小程序WXSS样式转换为标准CSS
 */
class WXSSToCSSConverter {
  constructor () {
    // rpx单位转换比例 (以750rpx为基准)
    this.rpxRatio = 750

    // 小程序特有样式属性映射
    this.propertyMapping = {
      // 布局相关
      display: 'display',
      position: 'position',
      top: 'top',
      right: 'right',
      bottom: 'bottom',
      left: 'left',
      'z-index': 'z-index',
      float: 'float',
      clear: 'clear',

      // 盒模型
      width: 'width',
      height: 'height',
      'min-width': 'min-width',
      'min-height': 'min-height',
      'max-width': 'max-width',
      'max-height': 'max-height',
      margin: 'margin',
      'margin-top': 'margin-top',
      'margin-right': 'margin-right',
      'margin-bottom': 'margin-bottom',
      'margin-left': 'margin-left',
      padding: 'padding',
      'padding-top': 'padding-top',
      'padding-right': 'padding-right',
      'padding-bottom': 'padding-bottom',
      'padding-left': 'padding-left',
      border: 'border',
      'border-width': 'border-width',
      'border-style': 'border-style',
      'border-color': 'border-color',
      'border-radius': 'border-radius',
      'box-sizing': 'box-sizing',

      // 背景相关
      background: 'background',
      'background-color': 'background-color',
      'background-image': 'background-image',
      'background-repeat': 'background-repeat',
      'background-position': 'background-position',
      'background-size': 'background-size',
      'background-attachment': 'background-attachment',

      // 文字相关
      color: 'color',
      font: 'font',
      'font-family': 'font-family',
      'font-size': 'font-size',
      'font-weight': 'font-weight',
      'font-style': 'font-style',
      'line-height': 'line-height',
      'text-align': 'text-align',
      'text-decoration': 'text-decoration',
      'text-indent': 'text-indent',
      'text-transform': 'text-transform',
      'letter-spacing': 'letter-spacing',
      'word-spacing': 'word-spacing',
      'white-space': 'white-space',
      'word-wrap': 'word-wrap',
      'word-break': 'word-break',

      // Flex布局
      display: 'display',
      flex: 'flex',
      'flex-direction': 'flex-direction',
      'flex-wrap': 'flex-wrap',
      'flex-flow': 'flex-flow',
      'justify-content': 'justify-content',
      'align-items': 'align-items',
      'align-content': 'align-content',
      'align-self': 'align-self',
      'flex-grow': 'flex-grow',
      'flex-shrink': 'flex-shrink',
      'flex-basis': 'flex-basis',
      order: 'order',

      // 变换和动画
      transform: 'transform',
      'transform-origin': 'transform-origin',
      transition: 'transition',
      'transition-property': 'transition-property',
      'transition-duration': 'transition-duration',
      'transition-timing-function': 'transition-timing-function',
      'transition-delay': 'transition-delay',
      animation: 'animation',
      'animation-name': 'animation-name',
      'animation-duration': 'animation-duration',
      'animation-timing-function': 'animation-timing-function',
      'animation-delay': 'animation-delay',
      'animation-iteration-count': 'animation-iteration-count',
      'animation-direction': 'animation-direction',
      'animation-fill-mode': 'animation-fill-mode',
      'animation-play-state': 'animation-play-state',

      // 其他
      opacity: 'opacity',
      visibility: 'visibility',
      overflow: 'overflow',
      'overflow-x': 'overflow-x',
      'overflow-y': 'overflow-y',
      cursor: 'cursor',
      outline: 'outline',
      'box-shadow': 'box-shadow',
      'text-shadow': 'text-shadow'
    }

    // 小程序特有选择器映射
    this.selectorMapping = {
      // 页面选择器
      page: 'body',
      // 组件选择器保持不变，但需要添加前缀
      '.': '.',
      '#': '#',
      // 伪类选择器
      ':hover': ':hover',
      ':active': ':active',
      ':focus': ':focus',
      ':visited': ':visited',
      ':first-child': ':first-child',
      ':last-child': ':last-child',
      ':nth-child': ':nth-child'
    }

    // 需要添加浏览器前缀的属性
    this.vendorPrefixes = [
      'transform',
      'transition',
      'animation',
      'box-shadow',
      'border-radius',
      'background-size',
      'user-select',
      'appearance',
      'flex',
      'flex-direction',
      'flex-wrap',
      'justify-content',
      'align-items',
      'align-content'
    ]
  }

  convert (wxssContent) {
    try {
      let cssContent = wxssContent

      // 预处理WXSS内容
      cssContent = this.preprocessWXSS(cssContent)

      // 转换rpx单位
      cssContent = this.convertRpxUnits(cssContent)

      // 转换选择器
      cssContent = this.convertSelectors(cssContent)

      // 转换属性
      cssContent = this.convertProperties(cssContent)

      // 添加浏览器前缀
      cssContent = this.addVendorPrefixes(cssContent)

      // 转换小程序特有样式
      cssContent = this.convertMiniprogramStyles(cssContent)

      // 清理和优化CSS
      cssContent = this.cleanupCSS(cssContent)

      return cssContent
    } catch (error) {
      console.error('WXSS转换失败:', error)
      return wxssContent
    }
  }

  preprocessWXSS (content) {
    // 移除注释
    content = content.replace(/\/\*[\s\S]*?\*\//g, '')

    // 移除多余的空白字符
    content = content.replace(/\s+/g, ' ')

    // 移除空行
    content = content.replace(/\n\s*\n/g, '\n')

    return content.trim()
  }

  convertRpxUnits (content) {
    // 转换rpx为vw单位 (750rpx = 100vw)
    return content.replace(/(\d+(?:\.\d+)?)rpx/g, (match, value) => {
      const vwValue = (parseFloat(value) / this.rpxRatio * 100).toFixed(4)
      return `${vwValue}vw`
    })
  }

  convertSelectors (content) {
    // 转换page选择器
    content = content.replace(/\bpage\b/g, 'body')

    // 转换小程序组件选择器为对应的HTML标签或类
    const componentSelectors = {
      view: 'div',
      text: 'span',
      image: 'img',
      button: 'button',
      input: 'input',
      textarea: 'textarea',
      'scroll-view': '.scroll-view',
      swiper: '.swiper',
      'swiper-item': '.swiper-item',
      navigator: 'a',
      icon: '.icon',
      progress: '.progress',
      slider: '.slider',
      switch: '.switch',
      picker: '.picker',
      'picker-view': '.picker-view',
      radio: '.radio',
      checkbox: '.checkbox',
      form: 'form',
      label: 'label'
    }

    Object.keys(componentSelectors).forEach(wxComponent => {
      const htmlSelector = componentSelectors[wxComponent]
      const regex = new RegExp(`\\b${wxComponent}\\b`, 'g')
      content = content.replace(regex, htmlSelector)
    })

    return content
  }

  convertProperties (content) {
    // 转换CSS属性（大部分WXSS属性与CSS相同，这里主要处理特殊情况）

    // 处理小程序特有的样式值
    content = this.convertSpecialValues(content)

    return content
  }

  convertSpecialValues (content) {
    // 转换小程序特有的display值
    content = content.replace(/display:\s*flex/g, 'display: -webkit-flex; display: flex')

    // 转换小程序特有的position值
    content = content.replace(/position:\s*sticky/g, 'position: -webkit-sticky; position: sticky')

    // 转换小程序特有的overflow值
    content = content.replace(/overflow:\s*scroll/g, 'overflow: auto; -webkit-overflow-scrolling: touch')

    return content
  }

  addVendorPrefixes (content) {
    // 为需要的CSS属性添加浏览器前缀
    this.vendorPrefixes.forEach(property => {
      const regex = new RegExp(`(^|\\s|\\{)${property}\\s*:`, 'gm')
      content = content.replace(regex, (match, prefix) => {
        const value = match.split(':')[1]
        if (value) {
          return `${prefix}-webkit-${property}:${value}${prefix}-moz-${property}:${value}${prefix}${property}:`
        }
        return match
      })
    })

    return content
  }

  convertMiniprogramStyles (content) {
    // 添加小程序特有的样式类
    const miniprogramStyles = `
/* 小程序基础样式 */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 小程序组件基础样式 */
.scroll-view {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.swiper {
  position: relative;
  overflow: hidden;
}

.swiper-item {
  display: block;
  width: 100%;
  height: 100%;
}

/* 按钮样式 */
.btn-primary {
  background-color: #07c160;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
}

.btn-default {
  background-color: #f7f7f7;
  color: #333;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px 16px;
}

.btn-warn {
  background-color: #fa5151;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
}

/* 表单组件样式 */
.picker, .slider, .switch, .radio, .checkbox {
  display: inline-block;
  vertical-align: middle;
}

/* 自定义组件样式 */
.custom-component {
  display: block;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  body {
    font-size: 14px;
  }
}

@media screen and (min-width: 769px) {
  body {
    font-size: 16px;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* 工具类 */
.wx-flex {
  display: -webkit-flex;
  display: flex;
}

.wx-flex-column {
  -webkit-flex-direction: column;
  flex-direction: column;
}

.wx-flex-row {
  -webkit-flex-direction: row;
  flex-direction: row;
}

.wx-justify-center {
  -webkit-justify-content: center;
  justify-content: center;
}

.wx-align-center {
  -webkit-align-items: center;
  align-items: center;
}

.wx-flex-1 {
  -webkit-flex: 1;
  flex: 1;
}

.wx-text-center {
  text-align: center;
}

.wx-text-left {
  text-align: left;
}

.wx-text-right {
  text-align: right;
}

.wx-hidden {
  display: none !important;
}

.wx-visible {
  display: block !important;
}
`

    return miniprogramStyles + '\n\n' + content
  }

  cleanupCSS (content) {
    // 移除重复的样式规则
    content = content.replace(/([^{}]+)\{([^{}]*)\}\s*\1\{([^{}]*)\}/g, '$1{$2$3}')

    // 移除空的样式规则
    content = content.replace(/[^{}]+\{\s*\}/g, '')

    // 格式化CSS
    content = content.replace(/\s*{\s*/g, ' {\n  ')
    content = content.replace(/;\s*/g, ';\n  ')
    content = content.replace(/\s*}\s*/g, '\n}\n\n')

    // 移除多余的空行
    content = content.replace(/\n{3,}/g, '\n\n')

    return content.trim()
  }

  // 静态方法，方便直接调用
  static convert (wxssContent) {
    const converter = new WXSSToCSSConverter()
    return converter.convert(wxssContent)
  }
}

// 导出转换器
if (typeof window !== 'undefined') {
  window.WXSSToCSSConverter = WXSSToCSSConverter
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WXSSToCSSConverter
}
