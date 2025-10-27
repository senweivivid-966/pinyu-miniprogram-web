function navigateToMainPage () {
  window.location.href = 'social-discovery-page.html'
}

// 检查是否是首次访问或直接访问欢迎页面
const isDirectAccess = !document.referrer || document.referrer.indexOf(window.location.hostname) === -1
const hasVisitedWelcome = sessionStorage.getItem('welcomePageVisited')

// 只有在首次访问或直接访问欢迎页面时才显示完整的欢迎体验
if (isDirectAccess || !hasVisitedWelcome) {
  // 标记已访问欢迎页面
  sessionStorage.setItem('welcomePageVisited', 'true')

  // 5秒后自动跳转（给用户更多时间看到欢迎页面）
  setTimeout(function () {
    navigateToMainPage()
  }, 5000)

  console.log('PINYU CLUB - 启动页面 (首次访问)')
} else {
  // 如果不是首次访问，立即跳转
  navigateToMainPage()
}
