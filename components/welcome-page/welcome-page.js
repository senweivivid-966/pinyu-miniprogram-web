function navigateToMainPage () {
  window.location.href = '../../social-discovery-page.html'
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

// 添加页面交互增强
document.addEventListener('DOMContentLoaded', function () {
  // 添加鼠标移动视差效果
  document.addEventListener('mousemove', function (e) {
    const container = document.querySelector('.container')
    if (container) {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100

      container.style.transform = `translate(${(x - 50) * 0.02}px, ${(y - 50) * 0.02}px)`
    }
  })

  // 添加触摸设备的倾斜效果
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function (e) {
      const container = document.querySelector('.container')
      if (container && e.gamma !== null && e.beta !== null) {
        const x = e.gamma * 0.1 // 左右倾斜
        const y = e.beta * 0.1 // 前后倾斜

        container.style.transform = `translate(${x}px, ${y}px)`
      }
    })
  }
})