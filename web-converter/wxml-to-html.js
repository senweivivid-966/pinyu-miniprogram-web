/**
 * WXML to HTML Converter
 * 将小程序WXML转换为Web HTML
 */
class WXMLToHTMLConverter {
  constructor () {
    this.tagMapping = {
      // 基础组件
      view: 'div',
      text: 'span',
      image: 'img',
      icon: 'i',
      progress: 'progress',
      'rich-text': 'div',

      // 表单组件
      button: 'button',
      checkbox: 'input',
      'checkbox-group': 'div',
      editor: 'div',
      form: 'form',
      input: 'input',
      label: 'label',
      picker: 'select',
      'picker-view': 'div',
      'picker-view-column': 'div',
      radio: 'input',
      'radio-group': 'div',
      slider: 'input',
      switch: 'input',
      textarea: 'textarea',

      // 导航组件
      'functional-page-navigator': 'a',
      navigator: 'a',

      // 媒体组件
      audio: 'audio',
      camera: 'div',
      video: 'video',
      'live-player': 'div',
      'live-pusher': 'div',

      // 地图组件
      map: 'div',

      // 画布组件
      canvas: 'canvas',

      // 开放能力组件
      'web-view': 'iframe',
      ad: 'div',
      'official-account': 'div',
      'open-data': 'div',

      // 导航栏组件
      'navigation-bar': 'nav',

      // 页面属性配置节点
      'page-meta': 'meta',

      // 滚动组件
      'scroll-view': 'div',
      swiper: 'div',
      'swiper-item': 'div',
      'movable-area': 'div',
      'movable-view': 'div',
      'cover-image': 'img',
      'cover-view': 'div'
    }

    this.attrMapping = {
      // 通用属性
      class: 'class',
      style: 'style',
      hidden: 'hidden',
      'data-*': 'data-*',

      // 事件属性
      bindtap: 'onclick',
      bindinput: 'oninput',
      bindchange: 'onchange',
      bindfocus: 'onfocus',
      bindblur: 'onblur',
      bindsubmit: 'onsubmit',
      bindreset: 'onreset',
      bindload: 'onload',
      binderror: 'onerror',
      bindtouchstart: 'ontouchstart',
      bindtouchmove: 'ontouchmove',
      bindtouchend: 'ontouchend',
      bindtouchcancel: 'ontouchcancel',
      bindlongpress: 'oncontextmenu',
      bindlongtap: 'oncontextmenu',
      bindgetuserinfo: 'onclick',
      bindgetphonenumber: 'onclick',
      bindopensetting: 'onclick',
      bindlaunchapp: 'onclick',

      // 表单属性
      value: 'value',
      placeholder: 'placeholder',
      disabled: 'disabled',
      maxlength: 'maxlength',
      'auto-focus': 'autofocus',
      focus: 'autofocus',

      // 图片属性
      src: 'src',
      mode: 'data-mode',
      'lazy-load': 'loading',

      // 按钮属性
      type: 'type',
      size: 'data-size',
      plain: 'data-plain',
      loading: 'data-loading',
      'form-type': 'type',

      // 导航属性
      url: 'href',
      'open-type': 'target',
      delta: 'data-delta',

      // 滚动视图属性
      'scroll-x': 'data-scroll-x',
      'scroll-y': 'data-scroll-y',
      'scroll-top': 'data-scroll-top',
      'scroll-left': 'data-scroll-left',
      'scroll-into-view': 'data-scroll-into-view',
      'scroll-with-animation': 'data-scroll-with-animation',
      'enable-back-to-top': 'data-enable-back-to-top',

      // 轮播图属性
      'indicator-dots': 'data-indicator-dots',
      'indicator-color': 'data-indicator-color',
      'indicator-active-color': 'data-indicator-active-color',
      autoplay: 'data-autoplay',
      current: 'data-current',
      interval: 'data-interval',
      duration: 'data-duration',
      circular: 'data-circular',
      vertical: 'data-vertical',
      'previous-margin': 'data-previous-margin',
      'next-margin': 'data-next-margin',
      'display-multiple-items': 'data-display-multiple-items'
    }

    this.eventMapping = {
      bindtap: 'handleEvent',
      bindinput: 'handleEvent',
      bindchange: 'handleEvent',
      bindfocus: 'handleEvent',
      bindblur: 'handleEvent',
      bindsubmit: 'handleEvent',
      bindreset: 'handleEvent',
      bindload: 'handleEvent',
      binderror: 'handleEvent',
      bindgetuserinfo: 'handleEvent',
      bindgetphonenumber: 'handleEvent',
      bindopensetting: 'handleEvent',
      bindlaunchapp: 'handleEvent'
    }
  }

  convert (wxmlContent) {
    try {
      // 预处理WXML内容
      let processedContent = this.preprocessWXML(wxmlContent)

      // 转换标签
      processedContent = this.convertTags(processedContent)

      // 转换属性
      processedContent = this.convertAttributes(processedContent)

      // 转换事件
      processedContent = this.convertEvents(processedContent)

      // 处理数据绑定
      processedContent = this.convertDataBinding(processedContent)

      // 处理条件渲染
      processedContent = this.convertConditionalRendering(processedContent)

      // 处理列表渲染
      processedContent = this.convertListRendering(processedContent)

      // 处理模板和引用
      processedContent = this.convertTemplates(processedContent)

      // 转换自定义组件
      processedContent = this.convertCustomComponents(processedContent)

      // 后处理
      processedContent = this.postProcess(processedContent)

      return processedContent
    } catch (error) {
      console.error('WXML转换失败:', error)
      return wxmlContent
    }
  }

  preprocessWXML (content) {
    // 移除XML声明和注释
    content = content.replace(/<\?xml[^>]*\?>/g, '')
    content = content.replace(/<!--[\s\S]*?-->/g, '')

    // 处理自闭合标签
    content = content.replace(/<(image|input|progress|icon|canvas|web-view|cover-image)([^>]*?)(?<!\/)>/g, '<$1$2 />')

    // 处理CDATA
    content = content.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')

    return content.trim()
  }

  convertTags (content) {
    // 转换所有已知的小程序标签
    Object.keys(this.tagMapping).forEach(wxTag => {
      const htmlTag = this.tagMapping[wxTag]
      const regex = new RegExp(`<${wxTag}(\\s[^>]*?)?>`, 'g')
      content = content.replace(regex, `<${htmlTag}$1>`)

      const closeRegex = new RegExp(`</${wxTag}>`, 'g')
      content = content.replace(closeRegex, `</${htmlTag}>`)
    })

    return content
  }

  convertAttributes (content) {
    // 转换属性名
    Object.keys(this.attrMapping).forEach(wxAttr => {
      const htmlAttr = this.attrMapping[wxAttr]
      if (wxAttr.includes('*')) {
        // 处理通配符属性
        return
      }

      const regex = new RegExp(`\\s${wxAttr}=`, 'g')
      content = content.replace(regex, ` ${htmlAttr}=`)
    })

    // 处理特殊属性转换
    content = this.convertSpecialAttributes(content)

    return content
  }

  convertSpecialAttributes (content) {
    // 转换图片mode属性
    content = content.replace(/data-mode="([^"]*?)"/g, (match, mode) => {
      const styleMap = {
        scaleToFill: 'object-fit: fill',
        aspectFit: 'object-fit: contain',
        aspectFill: 'object-fit: cover',
        widthFix: 'width: 100%; height: auto',
        heightFix: 'height: 100%; width: auto'
      }
      const style = styleMap[mode] || 'object-fit: contain'
      return `style="${style}"`
    })

    // 转换按钮type属性
    content = content.replace(/type="primary"/g, 'class="btn-primary"')
    content = content.replace(/type="default"/g, 'class="btn-default"')
    content = content.replace(/type="warn"/g, 'class="btn-warn"')

    // 转换表单类型
    content = content.replace(/<input([^>]*?)type="text"([^>]*?)>/g, '<input$1type="text"$2>')
    content = content.replace(/<input([^>]*?)type="number"([^>]*?)>/g, '<input$1type="number"$2>')
    content = content.replace(/<input([^>]*?)type="password"([^>]*?)>/g, '<input$1type="password"$2>')

    // 转换checkbox和radio
    content = content.replace(/<input([^>]*?)checkbox([^>]*?)>/g, '<input$1type="checkbox"$2>')
    content = content.replace(/<input([^>]*?)radio([^>]*?)>/g, '<input$1type="radio"$2>')

    return content
  }

  convertEvents (content) {
    // 转换事件处理
    Object.keys(this.eventMapping).forEach(wxEvent => {
      const handlerName = this.eventMapping[wxEvent]
      const regex = new RegExp(`${wxEvent}="([^"]*?)"`, 'g')
      content = content.replace(regex, (match, methodName) => {
        return `onclick="${handlerName}('${methodName}', event)"`
      })
    })

    return content
  }

  convertDataBinding (content) {
    // 处理双大括号数据绑定
    content = content.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      // 清理表达式
      const cleanExpression = expression.trim()

      // 如果是在属性值中，保持原样但添加数据属性
      if (match.includes('=')) {
        return match
      }

      // 如果是在文本内容中，添加数据绑定标记
      return `<span data-expression="${cleanExpression}">${cleanExpression}</span>`
    })

    // 处理属性中的数据绑定
    content = content.replace(/(\w+)="\{\{([^}]+)\}\}"/g, (match, attr, expression) => {
      const cleanExpression = expression.trim()
      return `${attr}="{{${cleanExpression}}}" data-bind-${attr}="${cleanExpression}"`
    })

    return content
  }

  convertConditionalRendering (content) {
    // 转换wx:if
    content = content.replace(/wx:if="\{\{([^}]+)\}\}"/g, (match, condition) => {
      return `data-wx-if="${condition.trim()}" style="display: none;"`
    })

    // 转换wx:elif
    content = content.replace(/wx:elif="\{\{([^}]+)\}\}"/g, (match, condition) => {
      return `data-wx-elif="${condition.trim()}" style="display: none;"`
    })

    // 转换wx:else
    content = content.replace(/wx:else/g, 'data-wx-else style="display: none;"')

    // 转换hidden属性
    content = content.replace(/hidden="\{\{([^}]+)\}\}"/g, (match, condition) => {
      return `data-hidden="${condition.trim()}"`
    })

    return content
  }

  convertListRendering (content) {
    // 转换wx:for
    content = content.replace(/wx:for="\{\{([^}]+)\}\}"/g, (match, listExpression) => {
      return `data-wx-for="${listExpression.trim()}"`
    })

    // 转换wx:for-item
    content = content.replace(/wx:for-item="([^"]+)"/g, (match, itemName) => {
      return `data-wx-for-item="${itemName}"`
    })

    // 转换wx:for-index
    content = content.replace(/wx:for-index="([^"]+)"/g, (match, indexName) => {
      return `data-wx-for-index="${indexName}"`
    })

    // 转换wx:key
    content = content.replace(/wx:key="([^"]+)"/g, (match, keyName) => {
      return `data-wx-key="${keyName}"`
    })

    return content
  }

  convertTemplates (content) {
    // 转换template定义
    content = content.replace(/<template\s+name="([^"]+)"([^>]*)>/g, (match, name, attrs) => {
      return `<div class="template" data-template-name="${name}"${attrs}>`
    })

    content = content.replace(/<\/template>/g, '</div>')

    // 转换template使用
    content = content.replace(/<template\s+is="([^"]+)"([^>]*?)\/>/g, (match, templateName, attrs) => {
      return `<div class="template-instance" data-template-is="${templateName}"${attrs}></div>`
    })

    // 转换import和include
    content = content.replace(/<import\s+src="([^"]+)"([^>]*?)\/>/g, (match, src, attrs) => {
      return `<!-- import: ${src} -->`
    })

    content = content.replace(/<include\s+src="([^"]+)"([^>]*?)\/>/g, (match, src, attrs) => {
      return `<!-- include: ${src} -->`
    })

    return content
  }

  convertCustomComponents (content) {
    // 处理自定义组件（以小写字母开头，包含连字符的标签）
    const customComponentRegex = /<([a-z][a-z0-9]*(?:-[a-z0-9]+)*)((?:\s+[^>]*?)?)>/g

    content = content.replace(customComponentRegex, (match, tagName, attributes) => {
      // 为自定义组件添加特殊类名和数据属性
      const hasClass = attributes.includes('class=')
      let newAttributes = attributes

      if (hasClass) {
        newAttributes = attributes.replace(/class="([^"]*)"/, `class="$1 custom-component ${tagName}"`)
      } else {
        newAttributes = ` class="custom-component ${tagName}"${attributes}`
      }

      return `<div${newAttributes} data-component="${tagName}">`
    })

    // 处理自定义组件的闭合标签
    const customCloseRegex = /<\/([a-z][a-z0-9]*(?:-[a-z0-9]+)*)>/g
    content = content.replace(customCloseRegex, '</div>')

    return content
  }

  postProcess (content) {
    // 清理多余的空白
    content = content.replace(/\s+/g, ' ')
    content = content.replace(/>\s+</g, '><')

    // 确保自闭合标签正确
    content = content.replace(/<(img|input|br|hr|meta|link)([^>]*?)(?<!\/)>/g, '<$1$2 />')

    // 添加必要的HTML结构属性
    content = content.replace(/<div([^>]*?)data-wx-for="([^"]*?)"([^>]*?)>/g, (match, before, forExpr, after) => {
      return `<div${before}data-wx-for="${forExpr}"${after} data-list-container="true">`
    })

    return content
  }

  // 静态方法，方便直接调用
  static convert (wxmlContent) {
    const converter = new WXMLToHTMLConverter()
    return converter.convert(wxmlContent)
  }
}

// 导出转换器
if (typeof window !== 'undefined') {
  window.WXMLToHTMLConverter = WXMLToHTMLConverter
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WXMLToHTMLConverter
}
