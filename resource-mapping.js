const fs = require('fs');
const path = require('path');

class ResourceMapper {
  constructor (baseDir = '.', webBaseUrl = 'http://localhost:8081') {
    this.baseDir = baseDir;
    this.webBaseUrl = webBaseUrl;
    this.mappingFile = path.join(baseDir, 'resource-mapping.json');
    this.mapping = {};
    this.loadMapping();
  }

  // 加载现有映射
  loadMapping () {
    try {
      if (fs.existsSync(this.mappingFile)) {
        const data = fs.readFileSync(this.mappingFile, 'utf8');
        this.mapping = JSON.parse(data);
      }
    } catch (error) {
      console.warn('加载资源映射失败:', error.message);
      this.mapping = {};
    }
  }

  // 保存映射到文件
  saveMapping () {
    try {
      fs.writeFileSync(this.mappingFile, JSON.stringify(this.mapping, null, 2));
      console.log('资源映射已保存到:', this.mappingFile);
    } catch (error) {
      console.error('保存资源映射失败:', error.message);
    }
  }

  // 扫描项目中的资源文件
  scanResources (directories = ['images', 'static', 'assets']) {
    const resources = [];

    directories.forEach(dir => {
      const fullPath = path.join(this.baseDir, dir);
      if (fs.existsSync(fullPath)) {
        this.scanDirectory(fullPath, resources);
      } else {
        console.warn(`资源目录不存在: ${fullPath}`);
      }
    });

    return resources;
  }

  scanDirectory (dirPath, resources) {
    try {
      const items = fs.readdirSync(dirPath);

      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          this.scanDirectory(itemPath, resources);
        } else if (this.isResourceFile(item)) {
          const relativePath = path.relative(this.baseDir, itemPath);
          resources.push(relativePath);
        }
      });
    } catch (error) {
      console.warn(`扫描目录失败 ${dirPath}:`, error.message);
    }
  }

  // 判断是否为资源文件
  isResourceFile (filename) {
    const resourceExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'];
    const ext = path.extname(filename).toLowerCase();
    return resourceExtensions.includes(ext);
  }

  // 创建Web路径
  createWebPath (localPath) {
    // 将本地路径转换为Web路径
    const webPath = localPath.replace(/\\/g, '/');
    return `/${webPath}`;
  }

  // 获取资源的Web URL
  getWebUrl (localPath) {
    if (this.mapping[localPath]) {
      return this.mapping[localPath];
    }

    // 如果没有映射，创建默认映射
    const webPath = this.createWebPath(localPath);
    const webUrl = `${this.webBaseUrl}${webPath}`;
    this.mapping[localPath] = webUrl;
    return webUrl;
  }

  // 获取本地路径（从Web URL）
  getLocalPath (webUrl) {
    for (const [localPath, mappedUrl] of Object.entries(this.mapping)) {
      if (mappedUrl === webUrl) {
        return localPath;
      }
    }
    return null;
  }

  // 转换WXML中的资源路径
  transformWxmlResources (wxmlContent) {
    // 匹配src属性中的本地路径
    return wxmlContent.replace(/src=["']([^"']+)["']/g, (match, srcPath) => {
      if (this.isResourceFile(path.basename(srcPath))) {
        const webUrl = this.getWebUrl(srcPath);
        return `src="${webUrl}"`;
      }
      return match;
    });
  }

  // 转换WXSS中的资源路径
  transformWxssResources (wxssContent) {
    // 匹配background-image等CSS属性中的url()
    return wxssContent.replace(/url\(["']?([^"')]+)["']?\)/g, (match, urlPath) => {
      if (this.isResourceFile(path.basename(urlPath))) {
        const webUrl = this.getWebUrl(urlPath);
        return `url("${webUrl}")`;
      }
      return match;
    });
  }

  // 转换JS中的资源路径
  transformJsResources (jsContent) {
    // 匹配字符串中的资源路径
    return jsContent.replace(/["']([^"']*\.(png|jpg|jpeg|gif|svg|ico|webp))["']/g, (match, resourcePath) => {
      const webUrl = this.getWebUrl(resourcePath);
      return `"${webUrl}"`;
    });
  }

  // 验证资源文件是否存在
  validateResources () {
    const invalidResources = [];

    for (const localPath of Object.keys(this.mapping)) {
      const fullPath = path.join(this.baseDir, localPath);
      if (!fs.existsSync(fullPath)) {
        invalidResources.push(localPath);
      }
    }

    return invalidResources;
  }

  // 清理无效的映射
  cleanupInvalidMappings () {
    const invalidResources = this.validateResources();

    invalidResources.forEach(resource => {
      delete this.mapping[resource];
    });

    if (invalidResources.length > 0) {
      console.log(`清理了 ${invalidResources.length} 个无效的资源映射`);
      this.saveMapping();
    }

    return invalidResources;
  }

  // 获取映射统计信息
  getStats () {
    const stats = {
      totalMappings: Object.keys(this.mapping).length,
      byExtension: {}
    };

    for (const localPath of Object.keys(this.mapping)) {
      const ext = path.extname(localPath).toLowerCase();
      stats.byExtension[ext] = (stats.byExtension[ext] || 0) + 1;
    }

    return stats;
  }

  // 创建完整的资源映射
  createMapping () {
    console.log('开始扫描资源文件...');
    const resources = this.scanResources();

    console.log(`发现 ${resources.length} 个资源文件`);

    // 为每个资源创建映射
    resources.forEach(resource => {
      this.getWebUrl(resource);
    });

    // 保存映射
    this.saveMapping();

    // 验证映射
    const invalidResources = this.validateResources();
    if (invalidResources.length > 0) {
      console.warn(`发现 ${invalidResources.length} 个无效资源:`, invalidResources);
    }

    // 显示统计信息
    const stats = this.getStats();
    console.log('资源映射统计:', stats);

    return this.mapping;
  }
}

// 如果直接运行此文件，创建资源映射
if (require.main === module) {
  const mapper = new ResourceMapper();
  mapper.createMapping();
}

module.exports = ResourceMapper;
