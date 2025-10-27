# 微信小程序开发扩展安装指南

## 🚀 快速安装

### 方法一：通过 VS Code 扩展推荐（推荐）

1. 在 VS Code 中打开项目
2. 按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
3. 输入 `Extensions: Show Recommended Extensions`
4. 点击 "Install All" 安装所有推荐扩展

### 方法二：手动安装核心扩展

在 VS Code 扩展市场中搜索并安装以下扩展：

#### 🎯 核心扩展（必装）

1. **minapp-vscode** (`qiu8310.minapp-vscode`)
   - 微信小程序开发工具
   - 提供语法高亮、智能提示、代码格式化等功能

2. **WXML** (`johnsoncodehk.wxml`)
   - WXML 语法高亮和智能提示
   - 支持组件属性自动完成

#### 🛠️ 辅助扩展（推荐）

3. **Chinese (Simplified)** (`ms-ceintl.vscode-language-pack-zh-hans`)
   - 中文语言包

4. **Prettier** (`esbenp.prettier-vscode`)
   - 代码格式化工具

5. **ESLint** (`dbaeumer.vscode-eslint`)
   - JavaScript 代码检查

6. **Auto Rename Tag** (`formulahendry.auto-rename-tag`)
   - 自动重命名配对标签

7. **Path Intellisense** (`christian-kohler.path-intellisense`)
   - 路径智能提示

## 🔧 配置说明

安装扩展后，项目已自动配置以下功能：

### 文件关联
- `.wxml` → WXML 语法高亮
- `.wxss` → CSS 语法高亮  
- `.wxs` → JavaScript 语法高亮

### 智能提示
- 微信小程序 API 自动完成
- 组件属性智能提示
- 路径自动完成

### 代码格式化
- 保存时自动格式化
- ESLint 自动修复
- Prettier 代码美化

### 代码片段
- `wxpage` - 创建页面模板
- `wxcomponent` - 创建组件模板
- `wxview` - 创建视图容器
- `wxfor` - 列表渲染
- `wxif` - 条件渲染

## 🎨 使用技巧

### 1. 语法高亮验证
打开任意 `.wxml` 文件，应该看到：
- 标签名高亮显示
- 属性名和属性值不同颜色
- 微信小程序特有语法（如 `wx:for`）正确高亮

### 2. 智能提示测试
在 `.wxml` 文件中输入：
- `<view` - 应显示 view 组件的属性提示
- `wx:` - 应显示微信小程序指令提示
- `{{` - 应显示数据绑定提示

### 3. 代码片段使用
在 `.js` 文件中输入：
- `wxpage` + Tab - 生成页面模板
- `wxcomponent` + Tab - 生成组件模板

## 🐛 常见问题

### Q: WXML 文件没有语法高亮？
A: 确保已安装 `johnsoncodehk.wxml` 扩展，并重启 VS Code

### Q: 智能提示不工作？
A: 检查是否安装了 `qiu8310.minapp-vscode` 扩展，并确保项目根目录有 `app.json` 文件

### Q: 代码格式化不生效？
A: 确保已安装 `esbenp.prettier-vscode` 扩展，并在设置中启用了 "Format On Save"

## 📚 更多资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [minapp-vscode 扩展文档](https://github.com/qiu8310/minapp)
- [VS Code 官方文档](https://code.visualstudio.com/docs)

---

安装完成后，重启 VS Code 以确保所有扩展正常工作。