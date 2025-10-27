# VS Code + 微信开发者工具 协作开发工作流

## 🎯 概述

本文档介绍如何使用VS Code配合微信开发者工具进行高效的小程序开发，实现最佳的开发体验。

## 🛠️ 环境配置

### 已安装的VS Code插件

1. **通义灵码** - AI代码助手
2. **小程序开发插件** (qiu8310.minapp-vscode) - 小程序语法支持
3. **Builder插件** - 项目构建工具
4. **Live Server** - 本地服务器
5. **Auto Rename Tag** - 标签自动重命名
6. **Prettier** - 代码格式化
7. **ES6 String HTML** - 模板字符串语法高亮

### VS Code配置特性

- ✅ 小程序文件类型关联 (`.wxml`, `.wxss`, `.wxs`)
- ✅ Emmet支持WXML语法
- ✅ 保存时自动格式化
- ✅ 智能代码补全
- ✅ 语法高亮和错误检测
- ✅ 小程序API智能提示

## 🚀 开发工作流程

### 1. 项目启动

#### 方式一：使用VS Code任务 (推荐)
```bash
# 按 Cmd+Shift+P 打开命令面板
# 输入 "Tasks: Run Task"
# 选择以下任务之一：

- 启动微信开发者工具
- 启动本地预览服务器
- 启动文件同步监听
```

#### 方式二：手动启动
```bash
# 启动微信开发者工具
open -a "微信开发者工具" .

# 启动本地预览服务器
python3 server.py 8081

# 启动文件同步监听
node sync-dev.js watch
```

### 2. 双端开发流程

#### 🔄 标准开发循环

```
VS Code 编写代码 → 保存 → 微信开发者工具自动刷新 → 预览测试 → 继续编写
```

#### 📝 具体步骤

1. **在VS Code中编写代码**
   - 利用智能补全和语法高亮
   - 使用通义灵码AI辅助编程
   - 保存时自动格式化代码

2. **微信开发者工具实时预览**
   - 文件保存后自动编译
   - 实时查看页面效果
   - 调试和测试功能

3. **代码同步**
   - 使用项目内置的同步脚本
   - 支持WXML/WXSS与HTML/CSS双向转换
   - 保持代码一致性

### 3. 功能开发建议

#### 🎨 页面开发
```
1. 在VS Code中创建页面文件
   ├── pages/新页面/index.js
   ├── pages/新页面/index.wxml
   ├── pages/新页面/index.wxss
   └── pages/新页面/index.json

2. 使用代码片段快速生成模板
   - 输入 "wxpage" 生成页面模板
   - 输入 "wxcomponent" 生成组件模板

3. 在微信开发者工具中预览和调试
```

#### 🧩 组件开发
```
1. 在components目录下创建组件
2. 使用VS Code的Auto Rename Tag功能
3. 利用Prettier保持代码格式一致
4. 在微信开发者工具中测试组件功能
```

## 🔧 快捷操作

### VS Code快捷键
- `Cmd+Shift+P`: 打开命令面板
- `Cmd+S`: 保存并自动格式化
- `Cmd+/`: 快速注释
- `Alt+Shift+F`: 手动格式化代码
- `Cmd+D`: 选择相同内容

### 代码片段
- `wxpage`: 小程序页面模板
- `wxcomponent`: 小程序组件模板
- `wxrequest`: 微信API请求
- `wxnav`: 页面导航
- `wxtoast`: 显示提示

### 任务快捷方式
- `Cmd+Shift+P` → `Tasks: Run Task` → 选择任务

## 📋 最佳实践

### 1. 代码组织
```
- 使用VS Code进行代码编写和管理
- 保持文件结构清晰
- 利用文件夹分组相关功能
```

### 2. 版本控制
```
- 在VS Code中使用Git进行版本管理
- 提交前确保代码格式化
- 使用有意义的提交信息
```

### 3. 调试流程
```
- VS Code: 编写和修改代码
- 微信开发者工具: 预览和调试
- 浏览器: 测试H5兼容性 (如需要)
```

### 4. 性能优化
```
- 使用通义灵码进行代码优化建议
- 利用ESLint检查代码质量
- 定期清理无用代码和资源
```

## 🔍 故障排除

### 常见问题

1. **文件不同步**
   ```bash
   # 重启同步服务
   node sync-dev.js watch
   ```

2. **格式化不生效**
   ```bash
   # 检查Prettier配置
   # 确保.prettierrc文件存在
   ```

3. **插件不工作**
   ```bash
   # 重启VS Code
   # 检查插件是否启用
   ```

4. **微信开发者工具不刷新**
   ```bash
   # 检查项目路径是否正确
   # 重新打开项目
   ```

## 📚 扩展资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [VS Code官方文档](https://code.visualstudio.com/docs)
- [小程序开发插件文档](https://github.com/qiu8310/minapp)

---

**提示**: 这个工作流程已经过优化，可以显著提高小程序开发效率。建议团队成员都按照此流程进行开发。