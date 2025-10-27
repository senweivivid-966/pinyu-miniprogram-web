/**
 * 文件监听同步工具
 * 监听小程序文件变化，自动触发同步更新
 */

const chokidar = require('chokidar');
const path = require('path');
const { MiniProgramSyncTool } = require('./sync-dev');
const { ResourceMapper } = require('./resource-mapping');

class WatchSyncTool {
  constructor (options = {}) {
    this.syncTool = new MiniProgramSyncTool();
    this.resourceMapper = new ResourceMapper();
    this.debounceTime = options.debounceTime || 300;
    this.watchPaths = options.watchPaths || [
      'pages/**/*',
      'components/**/*',
      'app.wxss',
      'app.js',
      'images/**/*',
      'assets/**/*'
    ];

    // 防抖处理
    this.debounceTimers = new Map();
    this.isWatching = false;
  }

  /**
   * 开始监听文件变化
   */
  startWatching () {
    if (this.isWatching) {
      console.log('⚠️ 文件监听已经在运行中');
      return;
    }

    console.log('👀 开始监听文件变化...');
    console.log('📁 监听路径:', this.watchPaths);

    this.watcher = chokidar.watch(this.watchPaths, {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/web-preview/**',
        '**/*.log',
        '**/.DS_Store'
      ],
      persistent: true,
      ignoreInitial: true
    });

    // 监听文件变化事件
    this.watcher
      .on('change', (filePath) => this.handleFileChange(filePath, 'change'))
      .on('add', (filePath) => this.handleFileChange(filePath, 'add'))
      .on('unlink', (filePath) => this.handleFileChange(filePath, 'unlink'))
      .on('error', (error) => console.error('❌ 文件监听错误:', error))
      .on('ready', () => {
        this.isWatching = true;
        console.log('✅ 文件监听已启动');
        console.log('💡 提示: 修改文件后会自动同步到HTML预览');
      });
  }

  /**
   * 停止监听文件变化
   */
  stopWatching () {
    if (this.watcher) {
      this.watcher.close();
      this.isWatching = false;
      console.log('⏹️ 文件监听已停止');
    }
  }

  /**
   * 处理文件变化
   */
  handleFileChange (filePath, eventType) {
    const normalizedPath = path.normalize(filePath);
    console.log(`📝 文件${eventType === 'change' ? '修改' : eventType === 'add' ? '添加' : '删除'}: ${normalizedPath}`);

    // 防抖处理
    this.debounceFileChange(normalizedPath, eventType);
  }

  /**
   * 防抖处理文件变化
   */
  debounceFileChange (filePath, eventType) {
    const key = `${filePath}-${eventType}`;

    // 清除之前的定时器
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }

    // 设置新的定时器
    const timer = setTimeout(() => {
      this.processFileChange(filePath, eventType);
      this.debounceTimers.delete(key);
    }, this.debounceTime);

    this.debounceTimers.set(key, timer);
  }

  /**
   * 处理具体的文件变化
   */
  processFileChange (filePath, eventType) {
    const ext = path.extname(filePath).toLowerCase();

    try {
      switch (ext) {
      case '.wxml':
        this.handleWXMLChange(filePath, eventType);
        break;
      case '.wxss':
        this.handleWXSSChange(filePath, eventType);
        break;
      case '.js':
        this.handleJSChange(filePath, eventType);
        break;
      case '.json':
        this.handleJSONChange(filePath, eventType);
        break;
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.svg':
      case '.webp':
      case '.ico':
        this.handleImageChange(filePath, eventType);
        break;
      default:
        console.log(`ℹ️ 跳过不支持的文件类型: ${ext}`);
      }
    } catch (error) {
      console.error(`❌ 处理文件变化失败 (${filePath}):`, error.message);
    }
  }

  /**
   * 处理WXML文件变化
   */
  handleWXMLChange (filePath) {
    console.log('🔄 同步WXML文件...');

    if (filePath.includes('pages/')) {
      // 页面文件
      const pageName = this.extractPageName(filePath);
      if (pageName) {
        this.syncTool.syncPage(pageName);
        console.log(`✅ 页面 ${pageName} 同步完成`);
      }
    } else if (filePath.includes('components/')) {
      // 组件文件
      this.syncTool.syncAllPages();
      console.log('✅ 组件变化，同步所有页面完成');
    }
  }

  /**
   * 处理WXSS文件变化
   */
  handleWXSSChange (filePath) {
    console.log('🎨 同步样式文件...');

    if (filePath === 'app.wxss') {
      // 全局样式
      this.syncTool.syncGlobalStyles();
      console.log('✅ 全局样式同步完成');
    } else if (filePath.includes('pages/')) {
      // 页面样式
      const pageName = this.extractPageName(filePath);
      if (pageName) {
        this.syncTool.syncPage(pageName);
        console.log(`✅ 页面 ${pageName} 样式同步完成`);
      }
    } else if (filePath.includes('components/')) {
      // 组件样式
      this.syncTool.syncAllPages();
      console.log('✅ 组件样式变化，同步所有页面完成');
    }
  }

  /**
   * 处理JS文件变化
   */
  handleJSChange (filePath) {
    console.log('⚙️ 检测到JS文件变化...');

    if (filePath === 'app.js') {
      // 全局JS
      console.log('ℹ️ 全局JS文件变化，建议重新启动预览服务');
    } else if (filePath.includes('pages/')) {
      // 页面JS
      const pageName = this.extractPageName(filePath);
      if (pageName) {
        console.log(`ℹ️ 页面 ${pageName} JS文件变化，功能可能需要刷新页面`);
      }
    }
  }

  /**
   * 处理JSON配置文件变化
   */
  handleJSONChange (filePath) {
    console.log('📋 检测到配置文件变化...');

    if (filePath === 'app.json') {
      console.log('ℹ️ 应用配置变化，建议重新启动预览服务');
    } else if (filePath.includes('pages/') && filePath.endsWith('.json')) {
      const pageName = this.extractPageName(filePath);
      if (pageName) {
        this.syncTool.syncPage(pageName);
        console.log(`✅ 页面 ${pageName} 配置同步完成`);
      }
    }
  }

  /**
   * 处理图片资源变化
   */
  handleImageChange (filePath, eventType) {
    console.log('🖼️ 检测到图片资源变化...');

    // 更新资源映射
    if (eventType === 'add') {
      this.resourceMapper.createMapping();
      console.log('✅ 新增图片资源映射已更新');
    } else if (eventType === 'unlink') {
      this.resourceMapper.cleanupMapping();
      console.log('✅ 删除图片资源映射已清理');
    }

    // 重新同步所有页面以更新图片引用
    this.syncTool.syncAllPages();
    console.log('✅ 图片资源变化，所有页面已重新同步');
  }

  /**
   * 从文件路径提取页面名称
   */
  extractPageName (filePath) {
    const match = filePath.match(/pages\/([^/]+)\//);
    return match ? match[1] : null;
  }

  /**
   * 获取监听状态
   */
  getWatchStatus () {
    return {
      isWatching: this.isWatching,
      watchPaths: this.watchPaths,
      debounceTime: this.debounceTime,
      activeTimers: this.debounceTimers.size
    };
  }

  /**
   * 手动触发全量同步
   */
  triggerFullSync () {
    console.log('🔄 手动触发全量同步...');
    this.syncTool.syncAllPages();
    this.resourceMapper.createMapping();
    console.log('✅ 全量同步完成');
  }

  /**
   * 手动触发指定页面同步
   */
  triggerPageSync (pageName) {
    console.log(`🔄 手动触发页面同步: ${pageName}`);
    this.syncTool.syncPage(pageName);
    console.log(`✅ 页面 ${pageName} 同步完成`);
  }
}

// 导出类
module.exports = {
  WatchSyncTool
};

// 如果直接运行此文件，启动文件监听
if (require.main === module) {
  const watchTool = new WatchSyncTool();

  // 启动监听
  watchTool.startWatching();

  // 处理退出信号
  process.on('SIGINT', () => {
    console.log('\n🛑 收到退出信号...');
    watchTool.stopWatching();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 收到终止信号...');
    watchTool.stopWatching();
    process.exit(0);
  });

  // 保持进程运行
  console.log('💡 按 Ctrl+C 停止文件监听');

  // 防止进程退出
  setInterval(() => {}, 1000);
}
