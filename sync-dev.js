#!/usr/bin/env node

/**
 * 小程序开发同步脚本
 * 自动同步小程序代码到HTML预览文件
 */

const fs = require('fs');
const path = require('path');
const WXMLToHTMLConverter = require('./web-converter/wxml-to-html.js');
const WXSSToCSSConverter = require('./web-converter/wxss-to-css.js');

class MiniProgramSyncTool {
  constructor () {
    this.projectRoot = __dirname;
    this.pagesDir = path.join(this.projectRoot, 'pages');
    this.componentsDir = path.join(this.projectRoot, 'components');
    this.outputDir = this.projectRoot;

    // 配置文件
    this.config = {
      // 需要同步的页面
      syncPages: ['home', 'frequency-match', 'profile', 'messages'],
      // HTML预览文件模板
      htmlTemplate: 'social-discovery-page.html',
      // 资源映射
      resourceMapping: {
        // 本地图片 -> 网络图片
        localImages: {},
        // API映射
        apiMapping: {}
      }
    };
  }

  /**
   * 执行完整同步
   */
  async syncAll () {
    console.log('🚀 开始同步小程序代码到HTML预览...');

    try {
      // 1. 同步页面
      await this.syncPages();

      // 2. 同步组件
      await this.syncComponents();

      // 3. 同步全局样式
      await this.syncGlobalStyles();

      // 4. 更新HTML预览文件
      await this.updateHTMLPreview();

      console.log('✅ 同步完成！');
      console.log('📱 微信开发者工具: 请在开发者工具中预览');
      console.log('🌐 浏览器预览: http://localhost:8081');
    } catch (error) {
      console.error('❌ 同步失败:', error.message);
      process.exit(1);
    }
  }

  /**
   * 同步指定页面
   */
  async syncPage (pageName) {
    console.log(`📄 同步页面: ${pageName}`);

    const pagePath = path.join(this.pagesDir, pageName);
    if (!fs.existsSync(pagePath)) {
      throw new Error(`页面不存在: ${pageName}`);
    }

    const files = {
      wxml: path.join(pagePath, 'index.wxml'),
      wxss: path.join(pagePath, 'index.wxss'),
      js: path.join(pagePath, 'index.js'),
      json: path.join(pagePath, 'index.json')
    };

    // 检查文件存在性
    for (const [type, filePath] of Object.entries(files)) {
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  文件不存在: ${filePath}`);
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf8');

      if (type === 'wxml') {
        // 转换WXML到HTML
        const htmlContent = WXMLToHTMLConverter.convert(content);
        const outputPath = path.join(this.outputDir, `${pageName}.html`);

        // 应用资源映射
        const mappedContent = this.applyResourceMapping(htmlContent);

        // 生成完整HTML文件
        const fullHTML = this.generateFullHTML(mappedContent, pageName);
        fs.writeFileSync(outputPath, fullHTML, 'utf8');

        console.log(`  ✓ WXML -> HTML: ${outputPath}`);
      }

      if (type === 'wxss') {
        // 转换WXSS到CSS
        const cssContent = WXSSToCSSConverter.convert(content);
        const outputPath = path.join(this.outputDir, `${pageName}.css`);
        fs.writeFileSync(outputPath, cssContent, 'utf8');

        console.log(`  ✓ WXSS -> CSS: ${outputPath}`);
      }
    }
  }

  /**
   * 同步所有配置的页面
   */
  async syncPages () {
    for (const pageName of this.config.syncPages) {
      await this.syncPage(pageName);
    }
  }

  /**
   * 同步组件
   */
  async syncComponents () {
    console.log('🧩 同步组件...');

    const componentDirs = fs.readdirSync(this.componentsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const componentName of componentDirs) {
      const componentPath = path.join(this.componentsDir, componentName);
      const wxmlFile = path.join(componentPath, 'index.wxml');
      const wxssFile = path.join(componentPath, 'index.wxss');

      if (fs.existsSync(wxmlFile)) {
        const wxmlContent = fs.readFileSync(wxmlFile, 'utf8');
        const htmlContent = WXMLToHTMLConverter.convert(wxmlContent);

        // 保存组件HTML片段
        const outputPath = path.join(this.outputDir, 'components', `${componentName}.html`);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, htmlContent, 'utf8');

        console.log(`  ✓ 组件 ${componentName}: WXML -> HTML`);
      }

      if (fs.existsSync(wxssFile)) {
        const wxssContent = fs.readFileSync(wxssFile, 'utf8');
        const cssContent = WXSSToCSSConverter.convert(wxssContent);

        // 保存组件CSS
        const outputPath = path.join(this.outputDir, 'components', `${componentName}.css`);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, cssContent, 'utf8');

        console.log(`  ✓ 组件 ${componentName}: WXSS -> CSS`);
      }
    }
  }

  /**
   * 同步全局样式
   */
  async syncGlobalStyles () {
    console.log('🎨 同步全局样式...');

    const appWxssPath = path.join(this.projectRoot, 'app.wxss');
    if (fs.existsSync(appWxssPath)) {
      const wxssContent = fs.readFileSync(appWxssPath, 'utf8');
      const cssContent = WXSSToCSSConverter.convert(wxssContent);

      const outputPath = path.join(this.outputDir, 'app.css');
      fs.writeFileSync(outputPath, cssContent, 'utf8');

      console.log('  ✓ app.wxss -> app.css');
    }
  }

  /**
   * 应用资源映射
   */
  applyResourceMapping (content) {
    let mappedContent = content;

    // 替换本地图片为网络图片
    for (const [localPath, networkUrl] of Object.entries(this.config.resourceMapping.localImages)) {
      const regex = new RegExp(localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      mappedContent = mappedContent.replace(regex, networkUrl);
    }

    return mappedContent;
  }

  /**
   * 生成完整HTML文件
   */
  generateFullHTML (bodyContent, pageName) {
    const template = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageName} - 品遇小程序预览</title>
    <link rel="stylesheet" href="app.css">
    <link rel="stylesheet" href="${pageName}.css">
    <style>
        /* 移动端适配 */
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            background-color: #f5f5f5;
        }
        
        /* 容器样式 */
        .page-container {
            max-width: 375px;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
            position: relative;
        }
        
        /* 调试信息 */
        .debug-info {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
        }
    </style>
</head>
<body>
    <div class="debug-info">
        📱 ${pageName} 页面预览 | 🔄 同步时间: ${new Date().toLocaleString()}
    </div>
    
    <div class="page-container">
        ${bodyContent}
    </div>

    <script>
        // API桥接层
        const wx = {
            navigateTo: (options) => {
                console.log('wx.navigateTo:', options);
                alert('导航到: ' + options.url);
            },
            showToast: (options) => {
                console.log('wx.showToast:', options);
                alert(options.title);
            },
            request: (options) => {
                console.log('wx.request:', options);
                // 模拟网络请求
                setTimeout(() => {
                    if (options.success) {
                        options.success({ data: { message: '模拟数据' } });
                    }
                }, 1000);
            }
        };
        
        // 页面数据模拟
        const pageData = {
            ${pageName}: {
                // 这里可以添加页面特定的模拟数据
            }
        };
        
        console.log('🚀 页面加载完成:', '${pageName}');
        console.log('📊 页面数据:', pageData);
    </script>
</body>
</html>`;

    return template;
  }

  /**
   * 更新主HTML预览文件
   */
  async updateHTMLPreview () {
    console.log('🔄 更新主预览文件...');

    // 这里可以更新 social-discovery-page.html 或 home.html
    // 集成所有页面的导航链接
    const navigationHTML = this.generateNavigationHTML();

    // 更新现有的预览文件
    const previewFile = path.join(this.outputDir, 'social-discovery-page.html');
    if (fs.existsSync(previewFile)) {
      let content = fs.readFileSync(previewFile, 'utf8');

      // 在适当位置插入导航
      if (content.includes('<!-- SYNC_NAVIGATION -->')) {
        content = content.replace('<!-- SYNC_NAVIGATION -->', navigationHTML);
        fs.writeFileSync(previewFile, content, 'utf8');
        console.log('  ✓ 更新导航链接');
      }
    }
  }

  /**
   * 生成导航HTML
   */
  generateNavigationHTML () {
    const links = this.config.syncPages.map(pageName =>
      `<a href="${pageName}.html" style="display:block;padding:10px;margin:5px;background:#007aff;color:white;text-decoration:none;border-radius:4px;">
        📱 ${pageName} 页面
      </a>`
    ).join('');

    return `
    <div style="position:fixed;top:50px;right:10px;background:white;padding:10px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);z-index:10000;">
      <h4 style="margin:0 0 10px 0;">页面导航</h4>
      ${links}
    </div>`;
  }

  /**
   * 监听文件变化
   */
  watchFiles () {
    console.log('👀 开始监听文件变化...');

    const chokidar = require('chokidar');

    // 监听页面文件
    const watcher = chokidar.watch([
      path.join(this.pagesDir, '**/*.{wxml,wxss,js,json}'),
      path.join(this.componentsDir, '**/*.{wxml,wxss,js,json}'),
      path.join(this.projectRoot, 'app.{wxss,js,json}')
    ]);

    watcher.on('change', async (filePath) => {
      console.log(`📝 文件变化: ${path.relative(this.projectRoot, filePath)}`);

      // 延迟执行，避免频繁触发
      clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(async () => {
        try {
          await this.syncAll();
          console.log('🔄 自动同步完成');
        } catch (error) {
          console.error('❌ 自动同步失败:', error.message);
        }
      }, 1000);
    });

    console.log('✅ 文件监听已启动');
  }
}

// 命令行接口
if (require.main === module) {
  const syncTool = new MiniProgramSyncTool();

  const command = process.argv[2];
  const target = process.argv[3];

  // 如果没有命令参数，默认为sync
  const actualCommand = command || 'sync';

  switch (actualCommand) {
  case 'sync':
    if (target) {
      syncTool.syncPage(target);
    } else {
      syncTool.syncAll();
    }
    break;

  case 'watch':
    syncTool.watchFiles();
    break;

  default:
    // 如果第一个参数不是命令，可能是页面名
    if (command && !['sync', 'watch'].includes(command)) {
      syncTool.syncPage(command);
    } else {
      console.log(`
🚀 小程序开发同步工具

用法:
  node sync-dev.js [页面名]      # 同步指定页面
  node sync-dev.js sync [页面名]  # 同步指定页面或全部页面
  node sync-dev.js watch         # 监听文件变化并自动同步

示例:
  node sync-dev.js              # 同步所有页面
  node sync-dev.js home         # 只同步home页面
  node sync-dev.js sync         # 同步所有页面
  node sync-dev.js sync home    # 只同步home页面
  node sync-dev.js watch        # 启动文件监听
      `);
    }
  }
}

module.exports = MiniProgramSyncTool;
