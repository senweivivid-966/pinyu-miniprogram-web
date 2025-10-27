// 测试账号信息相关功能

// 快速填入函数
function quickFill (username, password) {
  document.getElementById('username').value = username
  document.getElementById('password').value = password

  // 添加填入动画效果
  const usernameInput = document.getElementById('username')
  const passwordInput = document.getElementById('password')

  // 添加高亮效果
  if (usernameInput) {
    usernameInput.style.backgroundColor = '#e8f5e8'
    setTimeout(() => {
      usernameInput.style.backgroundColor = ''
    }, 1000)
  }

  // 添加高亮效果
  if (passwordInput) {
    passwordInput.style.backgroundColor = '#e8f5e8'
    setTimeout(() => {
      passwordInput.style.backgroundColor = ''
    }, 1000)
  }
}

// 加载测试账号信息模块
function loadTestAccountsInfo () {
  const container = document.querySelector('.test-accounts-info')
  container.innerHTML = ''

  // 这里可以添加动态加载逻辑
  if (container) {
    // 可以从服务器获取测试账号信息
    // 或者使用本地配置
    container.style.display = 'block'
  }
}

// 显示测试账号信息
function showTestAccountsInfo () {
  const container = document.querySelector('.test-accounts-info')
  if (container) {
    container.style.display = 'block'
  }
}

// 隐藏测试账号信息
function hideTestAccountsInfo () {
  const container = document.querySelector('.test-accounts-info')
  if (container) {
    container.style.display = 'none'
  }
}