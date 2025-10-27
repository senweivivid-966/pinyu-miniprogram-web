// 欢迎页面备份恢复脚本
// 使用方法：在终端中运行 node restore-backup.js

const fs = require('fs')
const path = require('path')

const backupFile = path.join(__dirname, 'welcome-page-backup.css')
const currentFile = path.join(__dirname, 'welcome-page.css')

function restoreBackup () {
  try {
    if (!fs.existsSync(backupFile)) {
      console.error('❌ 备份文件不存在！')
      return
    }

    // 读取备份文件内容
    const backupContent = fs.readFileSync(backupFile, 'utf8')

    // 写入到当前文件
    fs.writeFileSync(currentFile, backupContent)

    console.log('✅ 成功恢复欢迎页面到备份版本！')
    console.log('📁 已恢复文件：welcome-page.css')
    console.log('🔄 请刷新浏览器查看效果')
  } catch (error) {
    console.error('❌ 恢复失败：', error.message)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  restoreBackup()
}

module.exports = { restoreBackup }