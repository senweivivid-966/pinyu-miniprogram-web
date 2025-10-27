// 认证管理器
class AuthManager {
  constructor () {
    this.isLoggedIn = false
    this.currentUser = null
    this.currentStep = 1
  }

  init () {
    this.checkLoginStatus()
    this.bindEvents()
    this.initPageSpecificFeatures()
  }

  // 检查登录状态
  checkLoginStatus () {
    const loginStatus = localStorage.getItem('isLoggedIn')
    const userInfo = localStorage.getItem('user_info')

    if (loginStatus === 'true' && userInfo) {
      this.isLoggedIn = true
      try {
        this.currentUser = JSON.parse(userInfo)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        this.logout()
      }
    }
  }

  // 绑定全局事件
  bindEvents () {
    // 可以在这里添加全局事件监听器
  }

  // 初始化页面特定功能
  initPageSpecificFeatures () {
    const currentPage = this.getCurrentPage()

    switch (currentPage) {
      case 'login':
        this.initLoginPage()
        break
      case 'register':
        this.initRegisterPage()
        break
      case 'profile':
        this.initProfilePage()
        break
    }
  }

  // 获取当前页面
  getCurrentPage () {
    const path = window.location.pathname
    if (path.includes('login.html')) return 'login'
    if (path.includes('register.html')) return 'register'
    if (path.includes('profile.html')) return 'profile'
    return 'home'
  }

  // 初始化登录页面
  initLoginPage () {
    // 如果已登录，跳转到首页
    if (this.isLoggedIn) {
      window.location.href = 'home-main-page.html'
      return
    }

    // 恢复记住的用户名
    const rememberedUsername = localStorage.getItem('remembered_username')
    if (rememberedUsername) {
      const usernameInput = document.getElementById('username')
      const rememberCheckbox = document.getElementById('remember')
      if (usernameInput) usernameInput.value = rememberedUsername
      if (rememberCheckbox) rememberCheckbox.checked = true
    }

    // 绑定登录表单
    const loginForm = document.getElementById('loginForm')
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e))
    }

    // 绑定密码显示/隐藏
    const togglePasswordBtn = document.getElementById('togglePassword')
    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility())
    }
  }

  // 初始化注册页面
  initRegisterPage () {
    // 如果已登录，跳转到首页
    if (this.isLoggedIn) {
      window.location.href = 'home-main-page.html'
      return
    }

    // 绑定注册表单
    this.initRegisterSteps()
    this.bindVerificationCode()
    this.bindRealTimeValidation()
  }

  // 初始化个人资料页面
  initProfilePage () {
    // 如果未登录，120秒后跳转到登录页
    if (!this.isLoggedIn) {
      console.log('用户未登录，120秒后将自动跳转到登录页面');
      
      // 显示倒计时提示
      const countdownDiv = document.createElement('div');
      countdownDiv.id = 'loginCountdown';
      countdownDiv.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.7);color:white;padding:8px 12px;border-radius:4px;z-index:9999;';
      document.body.appendChild(countdownDiv);
      
      let countdown = 120;
      const updateCountdown = () => {
        countdownDiv.textContent = `${countdown}秒后跳转到登录页`;
        countdown--;
        if (countdown < 0) {
          clearInterval(countdownInterval);
          window.location.href = 'login.html';
        }
      };
      
      updateCountdown();
      const countdownInterval = setInterval(updateCountdown, 1000);
      return;
    }

    this.loadUserProfile()
    this.bindProfileEvents()
  }

  // 处理登录
  async handleLogin (event) {
    event.preventDefault()

    const username = document.getElementById('username').value.trim()
    const password = document.getElementById('password').value
    const rememberMe = document.getElementById('remember').checked

    if (!username || !password) {
      this.showMessage('请输入用户名和密码', 'error')
      return
    }

    const loginBtn = document.querySelector('.login-btn')
    if (loginBtn) {
      loginBtn.disabled = true
      loginBtn.textContent = '登录中...'
    }

    try {
      const result = await this.mockLoginAPI(username, password)

      if (result.success) {
        this.isLoggedIn = true
        this.currentUser = result.user
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userInfo', JSON.stringify(result.user))

        // 处理记住用户名
        if (rememberMe) {
          localStorage.setItem('remembered_username', username)
        } else {
          localStorage.removeItem('remembered_username')
        }

        this.showMessage('登录成功！正在跳转...', 'success')
        setTimeout(() => {
          window.location.href = 'home-main-page.html'
        }, 1000)
      } else {
        this.showMessage(result.message || '登录失败', 'error')
      }
    } catch (error) {
      console.error('登录失败:', error)
      this.showMessage('登录失败，请重试', 'error')
    } finally {
      if (loginBtn) {
        loginBtn.disabled = false
        loginBtn.textContent = '登录'
      }
    }
  }

  // 模拟登录API
  async mockLoginAPI (username, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 检查注册用户
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]')
        const user = registeredUsers.find(u => u.phone === username)

        if (user && user.password === password) {
          resolve({
            success: true,
            message: '登录成功',
            user: user
          })
        } else {
          // 默认测试账号
          const testAccounts = [
            { username: 'testuser', password: 'Test123!', user: { id: '1', nickname: '测试用户', phone: 'testuser', avatar: '/assets/images/default-avatar.png' } },
            { username: 'admin', password: 'Admin123!', user: { id: '2', nickname: '管理员', phone: 'admin', avatar: '/assets/images/default-avatar.png' } },
            { username: 'user1', password: 'User123!', user: { id: '3', nickname: '用户1', phone: 'user1', avatar: '/assets/images/default-avatar.png' } },
            { username: '13800138000', password: '123456', user: { id: '4', nickname: '张三', phone: '13800138000', avatar: '/assets/images/default-avatar.png' } }
          ]

          const account = testAccounts.find(acc => acc.username === username && acc.password === password)
          if (account) {
            resolve({
              success: true,
              message: '登录成功',
              user: account.user
            })
          } else {
            resolve({
              success: false,
              message: '用户名或密码错误'
            })
          }
        }
      }, 1000)
    })
  }

  // 初始化注册步骤
  initRegisterSteps () {
    this.currentStep = 1
    this.showStep(1)

    // 绑定步骤按钮
    const nextBtn = document.getElementById('nextBtn')
    const prevBtn = document.getElementById('prevBtn')
    const submitBtn = document.getElementById('submitBtn')

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep())
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevStep())
    }
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.handleRegister())
    }
  }

  // 显示注册步骤
  showStep (step) {
    const steps = document.querySelectorAll('.register-step')
    steps.forEach((stepEl, index) => {
      if (index + 1 === step) {
        stepEl.style.display = 'block'
      } else {
        stepEl.style.display = 'none'
      }
    })

    // 更新按钮状态
    const prevBtn = document.getElementById('prevBtn')
    const nextBtn = document.getElementById('nextBtn')
    const submitBtn = document.getElementById('submitBtn')

    if (prevBtn) prevBtn.style.display = step > 1 ? 'block' : 'none'
    if (nextBtn) nextBtn.style.display = step < 2 ? 'block' : 'none'
    if (submitBtn) submitBtn.style.display = step === 2 ? 'block' : 'none'
  }

  // 下一步
  nextStep () {
    if (this.validateStep(this.currentStep)) {
      this.currentStep++
      this.showStep(this.currentStep)
    }
  }

  // 上一步
  prevStep () {
    this.currentStep--
    this.showStep(this.currentStep)
  }

  // 验证步骤
  validateStep (step) {
    const errors = []

    if (step === 1) {
      // 第一步验证
      const phone = document.getElementById('phone')?.value?.trim()
      const password = document.getElementById('password')?.value
      const confirmPassword = document.getElementById('confirmPassword')?.value
      const verificationCode = document.getElementById('verificationCode')?.value?.trim()

      if (!phone) {
        errors.push('请输入手机号')
      } else if (!this.validatePhone(phone).isValid) {
        errors.push('手机号格式不正确')
      }

      if (!password) {
        errors.push('请输入密码')
      } else {
        const passwordValidation = this.validatePassword(password)
        if (!passwordValidation.isValid) {
          errors.push(passwordValidation.message)
        }
      }

      if (!confirmPassword) {
        errors.push('请确认密码')
      } else if (password !== confirmPassword) {
        errors.push('两次输入的密码不一致')
      }

      if (!verificationCode) {
        errors.push('请输入验证码')
      } else if (!this.validateVerificationCode(verificationCode).isValid) {
        errors.push('验证码格式不正确')
      }
    } else if (step === 2) {
      // 第二步验证
      const nickname = document.getElementById('nickname')?.value?.trim()
      const gender = document.querySelector('input[name="gender"]:checked')?.value
      const birthday = document.getElementById('birthday')?.value
      const city = document.getElementById('city')?.value?.trim()

      if (!nickname) {
        errors.push('请输入昵称')
      } else if (nickname.length < 2 || nickname.length > 20) {
        errors.push('昵称长度应在2-20个字符之间')
      } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(nickname)) {
        errors.push('昵称只能包含中文、英文、数字和下划线')
      }

      if (!gender) {
        errors.push('请选择性别')
      }

      if (!birthday) {
        errors.push('请选择生日')
      } else {
        const birthDate = new Date(birthday)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        if (age < 18 || age > 100) {
          errors.push('年龄应在18-100岁之间')
        }
      }

      if (!city) {
        errors.push('请输入所在城市')
      } else if (city.length > 20) {
        errors.push('城市名称不能超过20个字符')
      }
    }

    if (errors.length > 0) {
      this.showMessage(errors[0], 'error')
      return false
    }

    return true
  }

  // 验证密码
  validatePassword (password) {
    if (!password) {
      return { isValid: false, message: '密码不能为空', strength: 'weak', score: 0 }
    }

    if (password.length < 6) {
      return { isValid: false, message: '密码长度至少6位', strength: 'weak', score: 0 }
    }

    let score = 0
    let strength = 'weak'
    const tips = []

    // 长度检查
    if (password.length >= 8) {
      score += 25
      tips.push('长度充足')
    } else {
      tips.push('建议8位以上')
    }

    // 包含数字
    if (/\d/.test(password)) {
      score += 25
      tips.push('包含数字')
    } else {
      tips.push('建议包含数字')
    }

    // 包含小写字母
    if (/[a-z]/.test(password)) {
      score += 25
      tips.push('包含小写字母')
    } else {
      tips.push('建议包含小写字母')
    }

    // 包含大写字母或特殊字符
    if (/[A-Z]/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 25
      tips.push('包含大写字母或特殊字符')
    } else {
      tips.push('建议包含大写字母或特殊字符')
    }

    // 确定强度等级
    if (score >= 75) {
      strength = 'strong'
    } else if (score >= 50) {
      strength = 'medium'
    }

    return {
      isValid: score >= 50,
      message: score >= 50 ? '密码强度良好' : '密码强度较弱，' + tips.slice(-2).join('，'),
      strength: strength,
      score: score,
      tips: tips
    }
  }

  // 验证邮箱
  validateEmail (email) {
    if (!email) {
      return { isValid: false, message: '邮箱不能为空' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { isValid: false, message: '邮箱格式不正确' }
    }

    return { isValid: true, message: '邮箱格式正确' }
  }

  // 验证手机号
  validatePhone (phone) {
    if (!phone) {
      return { isValid: false, message: '手机号不能为空' }
    }

    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return { isValid: false, message: '手机号格式不正确' }
    }

    return { isValid: true, message: '手机号格式正确' }
  }

  // 验证验证码
  validateVerificationCode (code) {
    if (!code) {
      return { isValid: false, message: '验证码不能为空' }
    }

    if (!/^\d{6}$/.test(code)) {
      return { isValid: false, message: '验证码应为6位数字' }
    }

    return { isValid: true, message: '验证码格式正确' }
  }

  // 高亮错误字段
  highlightField (fieldId) {
    const field = document.getElementById(fieldId)
    if (field) {
      field.classList.add('error')
      setTimeout(() => {
        this.clearFieldError(fieldId)
      }, 3000)
    }
  }

  // 清除字段错误
  clearFieldError (fieldId) {
    const field = document.getElementById(fieldId)
    if (field) {
      field.classList.remove('error')
    }
  }

  // 绑定实时验证
  bindRealTimeValidation () {
    // 密码强度实时检查
    const passwordInput = document.getElementById('password')
    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => {
        const validation = this.validatePassword(e.target.value)
        this.updatePasswordStrength(validation)
      })
    }

    // 确认密码实时检查
    const confirmPasswordInput = document.getElementById('confirmPassword')
    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener('input', (e) => {
        const password = document.getElementById('password')?.value
        if (password && e.target.value && password !== e.target.value) {
          this.highlightField('confirmPassword')
        } else {
          this.clearFieldError('confirmPassword')
        }
      })
    }

    // 手机号实时检查
    const phoneInput = document.getElementById('phone')
    if (phoneInput) {
      phoneInput.addEventListener('blur', (e) => {
        const validation = this.validatePhone(e.target.value)
        if (!validation.isValid && e.target.value) {
          this.highlightField('phone')
        } else {
          this.clearFieldError('phone')
        }
      })
    }

    // 邮箱实时检查
    const emailInput = document.getElementById('email')
    if (emailInput) {
      emailInput.addEventListener('blur', (e) => {
        const validation = this.validateEmail(e.target.value)
        if (!validation.isValid && e.target.value) {
          this.highlightField('email')
        } else {
          this.clearFieldError('email')
        }
      })
    }

    // 验证码实时检查
    const verificationCodeInput = document.getElementById('verificationCode')
    if (verificationCodeInput) {
      verificationCodeInput.addEventListener('input', (e) => {
        const validation = this.validateVerificationCode(e.target.value)
        if (!validation.isValid && e.target.value) {
          this.highlightField('verificationCode')
        } else {
          this.clearFieldError('verificationCode')
        }
      })
    }
  }

  // 更新密码强度显示
  updatePasswordStrength (validation) {
    const strengthText = document.getElementById('passwordStrengthText')
    const strengthBar = document.getElementById('passwordStrengthBar')

    if (strengthText) {
      strengthText.textContent = validation.message
      strengthText.className = `password-strength-text ${validation.strength}`
    }

    if (strengthBar) {
      strengthBar.className = `password-strength-bar ${validation.strength}`
      strengthBar.style.width = `${validation.score}%`
    }
  }

  // 绑定验证码功能
  bindVerificationCode () {
    const sendCodeBtn = document.getElementById('sendCodeBtn')
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', () => this.sendVerificationCode())
    }
  }

  // 发送验证码
  async sendVerificationCode () {
    const phoneInput = document.getElementById('phone')
    const sendCodeBtn = document.getElementById('sendCodeBtn')

    if (!phoneInput || !sendCodeBtn) return

    const phone = phoneInput.value.trim()

    // 验证手机号
    const phoneValidation = this.validatePhone(phone)
    if (!phoneValidation.isValid) {
      this.showMessage(phoneValidation.message, 'error')
      this.highlightField('phone')
      return
    }

    // 禁用按钮并开始倒计时
    sendCodeBtn.disabled = true
    let countdown = 60

    const updateButton = () => {
      if (countdown > 0) {
        sendCodeBtn.textContent = `${countdown}秒后重发`
        countdown--
        setTimeout(updateButton, 1000)
      } else {
        sendCodeBtn.textContent = '获取验证码'
        sendCodeBtn.disabled = false
      }
    }

    updateButton()

    try {
      // 模拟发送验证码API
      await this.mockSendCodeAPI(phone)
      this.showMessage('验证码已发送', 'success')
    } catch (error) {
      console.error('发送验证码失败:', error)
      this.showMessage('发送验证码失败，请重试', 'error')
      // 重置按钮状态
      sendCodeBtn.textContent = '获取验证码'
      sendCodeBtn.disabled = false
    }
  }

  // 模拟发送验证码API
  async mockSendCodeAPI (phone) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟90%成功率
        if (Math.random() > 0.1) {
          console.log(`验证码已发送到 ${phone}`)
          resolve({ success: true, message: '验证码已发送' })
        } else {
          reject(new Error('网络错误'))
        }
      }, 1000)
    })
  }

  // 处理注册
  async handleRegister () {
    const step1Data = {
      phone: document.getElementById('phone')?.value?.trim(),
      password: document.getElementById('password')?.value,
      confirmPassword: document.getElementById('confirmPassword')?.value,
      verificationCode: document.getElementById('verificationCode')?.value?.trim()
    }

    const step2Data = {
      nickname: document.getElementById('nickname')?.value?.trim(),
      gender: document.querySelector('input[name="gender"]:checked')?.value,
      birthday: document.getElementById('birthday')?.value,
      city: document.getElementById('city')?.value?.trim()
    }

    // 验证所有数据
    if (!this.validateStep(1) || !this.validateStep(2)) {
      return
    }

    const submitBtn = document.getElementById('submitBtn')
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = '注册中...'
    }

    try {
      // 合并注册数据
      const registerData = { ...step1Data, ...step2Data }

      // 调用注册API
      const result = await this.mockRegisterAPI(registerData)

      if (result.success) {
        this.showMessage('注册成功！正在跳转...', 'success')

        // 保存用户信息
        this.currentUser = result.user
        this.isLoggedIn = true
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('user_info', JSON.stringify(result.user))

        // 跳转到首页
        setTimeout(() => {
          window.location.href = 'home-main-page.html'
        }, 1500)
      } else {
        this.showMessage(result.message || '注册失败', 'error')
      }
    } catch (error) {
      console.error('注册失败:', error)
      this.showMessage('注册失败，请重试', 'error')
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.textContent = '完成注册'
      }
    }
  }

  // 模拟注册API
  async mockRegisterAPI (userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 检查手机号是否已注册
        const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]')
        const phoneExists = existingUsers.some(user => user.phone === userData.phone)

        if (phoneExists) {
          resolve({
            success: false,
            message: '该手机号已注册'
          })
          return
        }

        // 创建新用户
        const newUser = {
          id: Date.now().toString(),
          phone: userData.phone,
          nickname: userData.nickname,
          gender: userData.gender,
          birthday: userData.birthday,
          city: userData.city,
          avatar: '/assets/images/default-avatar.png',
          bio: '',
          createdAt: new Date().toISOString()
        }

        // 保存到本地存储
        existingUsers.push(newUser)
        localStorage.setItem('registered_users', JSON.stringify(existingUsers))

        resolve({
          success: true,
          message: '注册成功',
          user: newUser
        })
      }, 1500)
    })
  }

  // 加载用户资料
  loadUserProfile () {
    if (!this.currentUser) return

    // 更新用户信息显示
    const elements = {
      userAvatar: document.getElementById('userAvatar'),
      userName: document.getElementById('userName'),
      userAge: document.getElementById('userAge'),
      userCity: document.getElementById('userCity'),
      userBio: document.getElementById('userBio')
    }

    if (elements.userAvatar) {
      elements.userAvatar.src = this.currentUser.avatar || '/assets/images/default-avatar.png'
    }
    if (elements.userName) {
      elements.userName.textContent = this.currentUser.nickname || '未设置'
    }
    if (elements.userAge && this.currentUser.birthday) {
      const age = this.calculateAge(this.currentUser.birthday)
      elements.userAge.textContent = `${age}岁`
    }
    if (elements.userCity) {
      elements.userCity.textContent = this.currentUser.city || '未设置'
    }
    if (elements.userBio) {
      elements.userBio.textContent = this.currentUser.bio || '暂无简介'
    }
  }

  // 绑定个人资料页面事件
  bindProfileEvents () {
    // 头像上传
    const avatarUpload = document.getElementById('avatarUpload')
    if (avatarUpload) {
      avatarUpload.addEventListener('change', (e) => this.handleAvatarUpload(e))
    }

    // 编辑按钮
    const editBtn = document.querySelector('.edit-btn')
    if (editBtn) {
      editBtn.addEventListener('click', () => toggleEdit())
    }
  }

  // 处理头像上传
  handleAvatarUpload (event) {
    const file = event.target.files[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      this.showMessage('请选择图片文件', 'error')
      return
    }

    // 检查文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showMessage('图片大小不能超过5MB', 'error')
      return
    }

    // 创建FileReader读取文件
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target.result

      // 更新头像显示
      const userAvatar = document.getElementById('userAvatar')
      if (userAvatar) {
        userAvatar.src = imageUrl
      }

      // 更新用户信息
      if (this.currentUser) {
        this.currentUser.avatar = imageUrl
        localStorage.setItem('user_info', JSON.stringify(this.currentUser))
      }

      this.showMessage('头像更新成功', 'success')
    }

    reader.readAsDataURL(file)
  }

  // 计算年龄
  calculateAge (birthday) {
    const birthDate = new Date(birthday)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  // 获取性别文本
  getGenderText (gender) {
    const genderMap = {
      male: '男',
      female: '女',
      other: '其他'
    }
    return genderMap[gender] || '未设置'
  }

  // 切换密码显示/隐藏
  togglePasswordVisibility () {
    const passwordInput = document.getElementById('password')
    const toggleBtn = document.getElementById('togglePassword')

    if (passwordInput && toggleBtn) {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text'
        toggleBtn.textContent = '隐藏'
      } else {
        passwordInput.type = 'password'
        toggleBtn.textContent = '显示'
      }
    }
  }

  // 微信登录
  async wechatLogin () {
    this.showMessage('微信登录功能开发中...', 'info')
  }

  // 退出登录
  logout () {
    this.isLoggedIn = false
    this.currentUser = null
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user_info')

    this.showMessage('已退出登录', 'info')

    // 跳转到登录页
    setTimeout(() => {
      window.location.href = 'login.html'
    }, 1000)
  }

  // 更新UI
  updateUI () {
    // 根据登录状态更新UI
    const loginElements = document.querySelectorAll('.login-required')
    const logoutElements = document.querySelectorAll('.logout-required')

    loginElements.forEach(el => {
      el.style.display = this.isLoggedIn ? 'block' : 'none'
    })

    logoutElements.forEach(el => {
      el.style.display = this.isLoggedIn ? 'none' : 'block'
    })
  }

  // 显示消息
  showMessage (message, type = 'info') {
    // 创建消息元素
    const messageEl = document.createElement('div')
    messageEl.className = 'toast-message'
    messageEl.textContent = message

    // 设置样式
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      border-radius: 6px;
      color: white;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideDown 0.3s ease-out;
    `

    // 根据类型设置背景色
    const colors = {
      success: '#52c41a',
      error: '#ff4d4f',
      warning: '#faad14',
      info: '#1890ff'
    }
    messageEl.style.backgroundColor = colors[type] || colors.info

    // 添加到页面
    document.body.appendChild(messageEl)

    // 3秒后自动移除
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl)
      }
    }, 3000)
  }
}

// 全局函数
function goBack () {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = 'home-main-page.html'
  }
}

function toggleEdit () {
  const editBtn = document.querySelector('.edit-btn .edit-text')
  const editActions = document.getElementById('editActions')
  const isEditing = editBtn.textContent === '取消'

  if (isEditing) {
    // 取消编辑
    cancelEdit()
  } else {
    // 开始编辑
    editBtn.textContent = '取消'
    if (editActions) editActions.style.display = 'flex'

    // 显示编辑控件
    showEditControls(true)
  }
}

function cancelEdit () {
  const editBtn = document.querySelector('.edit-btn .edit-text')
  const editActions = document.getElementById('editActions')

  editBtn.textContent = '编辑'
  if (editActions) editActions.style.display = 'none'

  // 隐藏编辑控件
  showEditControls(false)

  // 重新加载用户资料
  if (window.authManager) {
    window.authManager.loadUserProfile()
  }
}

function showEditControls (show) {
  const editableElements = [
    { id: 'nicknameValue', inputId: 'nicknameInput' },
    { id: 'genderValue', inputId: 'genderInput' },
    { id: 'birthdayValue', inputId: 'birthdayInput' },
    { id: 'cityValue', inputId: 'cityInput' },
    { id: 'bioValue', inputId: 'bioInput' }
  ]

  editableElements.forEach(({ id, inputId }) => {
    const displayEl = document.getElementById(id)
    let inputEl = document.getElementById(inputId)

    if (show) {
      if (displayEl && !inputEl) {
        const currentValue = displayEl.textContent

        if (id === 'genderValue') {
          inputEl = document.createElement('select')
          inputEl.innerHTML = `
            <option value="male" ${currentValue === '男' ? 'selected' : ''}>男</option>
            <option value="female" ${currentValue === '女' ? 'selected' : ''}>女</option>
            <option value="other" ${currentValue === '其他' ? 'selected' : ''}>其他</option>
          `
        } else if (id === 'birthdayValue') {
          inputEl = document.createElement('input')
          inputEl.type = 'date'
          inputEl.value = currentValue !== '未设置' ? currentValue : ''
        } else if (id === 'bioValue') {
          inputEl = document.createElement('textarea')
          inputEl.value = currentValue !== '暂无简介' ? currentValue : ''
          inputEl.rows = 3
        } else {
          inputEl = document.createElement('input')
          inputEl.type = 'text'
          inputEl.value = currentValue
        }

        inputEl.id = inputId
        inputEl.className = 'edit-input'
        displayEl.parentNode.insertBefore(inputEl, displayEl.nextSibling)
        displayEl.style.display = 'none'
      }
    } else {
      if (inputEl) {
        inputEl.remove()
      }
      if (displayEl) {
        displayEl.style.display = 'block'
      }
    }
  })
}

async function saveProfile () {
  const formData = {
    nickname: document.getElementById('nicknameInput')?.value,
    gender: document.getElementById('genderInput')?.value,
    birthday: document.getElementById('birthdayInput')?.value,
    city: document.getElementById('cityInput')?.value,
    bio: document.getElementById('bioInput')?.value
  }

  // 验证数据
  if (!formData.nickname || formData.nickname.trim() === '') {
    window.authManager.showMessage('昵称不能为空', 'error')
    return
  }

  try {
    // 模拟保存API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 更新本地用户信息
    if (window.authManager.currentUser) {
      Object.assign(window.authManager.currentUser, formData)
      localStorage.setItem('user_info', JSON.stringify(window.authManager.currentUser))
    }

    window.authManager.showMessage('保存成功', 'success')
    cancelEdit()
  } catch (error) {
    console.error('保存失败:', error)
    window.authManager.showMessage('保存失败，请重试', 'error')
  }
}

function changePassword () {
  window.authManager.showMessage('修改密码功能开发中...', 'info')
}

function bindEmail () {
  window.authManager.showMessage('绑定邮箱功能开发中...', 'info')
}

function privacySettings () {
  window.authManager.showMessage('隐私设置功能开发中...', 'info')
}

function logout () {
  if (window.authManager) {
    window.authManager.logout()
  }
}

// 初始化
window.authManager = new AuthManager()

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
  if (window.authManager) {
    window.authManager.init()
  }
})
