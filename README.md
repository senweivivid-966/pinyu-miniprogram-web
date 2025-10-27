# 品语小程序转换器

一个将微信小程序代码转换为Web页面的工具，支持WXML转HTML、WXSS转CSS以及小程序API模拟。

## 🚀 快速预览

**完整功能预览链接：** [http://localhost:8000/social-discovery-page.html](http://localhost:8000/social-discovery-page.html)

这是小程序的核心功能页面，展示了完整的用户交互和主要特性。

**Web预览导航：** [http://localhost:8000/web-preview.html](http://localhost:8000/web-preview.html)

包含所有页面的导航入口，方便开发和测试。

## 项目结构

```
pinyu-miniprogram-native/
├── src/                          # 转换器源码
│   ├── wxml-to-html.js          # WXML转HTML转换器
│   ├── wxss-to-css.js           # WXSS转CSS转换器
│   └── miniprogram-simulator.js  # 小程序模拟器
├── miniprogram/                  # 标准小程序项目结构
│   ├── app.js                   # 小程序入口文件
│   ├── app.json                 # 全局配置
│   ├── app.wxss                 # 全局样式
│   ├── sitemap.json             # 站点地图配置
│   ├── project.config.json      # 项目配置
│   └── pages/                   # 页面目录
│       ├── index/               # 首页
│       │   ├── index.wxml
│       │   ├── index.wxss
│       │   ├── index.js
│       │   └── index.json
│       └── demo/                # 演示页面
│           ├── demo.wxml
│           ├── demo.wxss
│           ├── demo.js
│           └── demo.json
├── index.html                   # Web预览页面
├── package.json                 # 项目依赖
└── README.md                    # 项目说明
```

## 功能特性

### 1. WXML转HTML转换器
- 支持所有小程序基础组件转换
- 处理数据绑定语法 `{{}}`
- 支持条件渲染 `wx:if`、`wx:else`
- 支持列表渲染 `wx:for`
- 处理事件绑定 `bind*`、`catch*`
- 支持自定义组件转换

### 2. WXSS转CSS转换器
- rpx单位自动转换为rem
- 支持所有CSS属性
- 处理小程序特有选择器
- 添加浏览器兼容性前缀
- 优化CSS输出格式

### 3. 小程序API模拟器
- 模拟wx全局对象
- 支持常用API：showToast、showModal、navigateTo等
- 实现页面生命周期
- 支持数据绑定和视图更新
- 提供存储API模拟

## 使用方法

### 在Web环境中使用

1. 启动开发服务器：
```bash
npm run dev
```

2. 在浏览器中访问：`http://localhost:8081`

3. 使用转换器API：
```javascript
// WXML转HTML
const htmlConverter = new WXMLToHTML();
const html = htmlConverter.convert(wxmlContent);

// WXSS转CSS
const cssConverter = new WXSSToCSS();
const css = cssConverter.convert(wxssContent);

// 初始化小程序模拟器
MiniprogramSimulator.init();
```

### 导入到微信开发者工具

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择项目目录中的 `miniprogram` 文件夹
4. 填写项目信息：
   - 项目名称：品语小程序转换器
   - AppID：使用测试号或自己的AppID
5. 点击"导入"完成项目导入

### 导入到Cursor编辑器

1. 打开Cursor软件
2. 选择"File" > "Open Folder"
3. 选择整个项目根目录 `pinyu-miniprogram-native`
4. 项目将在Cursor中打开，可以继续编辑和调试

## 开发规范

项目严格遵循微信小程序开发规范：

### 文件结构规范
- 页面文件必须包含：`.wxml`、`.wxss`、`.js`、`.json`
- 全局文件：`app.js`、`app.json`、`app.wxss`
- 配置文件：`project.config.json`、`sitemap.json`

### 代码规范
- WXML：使用小程序标准组件和语法
- WXSS：使用rpx单位，支持小程序样式特性
- JavaScript：遵循小程序API规范
- 配置：符合小程序配置文件格式

## API支持

### 已支持的wx API
- **界面交互**：showToast、showModal、showLoading、hideLoading
- **导航跳转**：navigateTo、redirectTo、switchTab、navigateBack、reLaunch
- **数据存储**：setStorage、getStorage、removeStorage、clearStorage
- **系统信息**：getSystemInfo、getSystemInfoSync
- **网络请求**：request（基础模拟）
- **设备API**：getLocation、chooseImage等（基础模拟）

### 生命周期支持
- **应用生命周期**：onLaunch、onShow、onHide、onError
- **页面生命周期**：onLoad、onShow、onReady、onHide、onUnload
- **组件生命周期**：created、attached、ready、detached

## 注意事项

1. **兼容性**：转换后的代码在Web环境中运行，部分小程序特有功能需要额外处理
2. **样式适配**：rpx单位按1rpx=0.5px的比例转换，可能需要根据实际情况调整
3. **API限制**：部分小程序API在Web环境中无法完全模拟，提供基础功能
4. **测试建议**：建议在多个浏览器中测试转换效果

## 开发计划

- [ ] 支持更多小程序组件
- [ ] 完善API模拟功能
- [ ] 添加自动化测试
- [ ] 优化转换性能
- [ ] 支持TypeScript

## 技术支持

如有问题或建议，请联系品语科技技术团队。

---

© 2024 品语科技 - 专业的小程序开发解决方案