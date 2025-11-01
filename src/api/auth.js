import api from './index'

/**
 * 认证相关API接口
 */
export const authAPI = {
  /**
   * 用户登录
   * @param {Object} credentials - 登录凭证
   * @param {string} credentials.email - 账号（邮箱）
   * @param {string} credentials.password - 密码
   * @param {string} [credentials.captcha] - 验证码（可选）
   * @returns {Promise} 登录结果Promise
   */
  login(credentials) {
    return api.post('/auth/login', credentials)
  },
  
  /**
   * 用户注册
   * @param {Object} userData - 用户注册数据
   * @param {string} userData.username - 用户名
   * @param {string} userData.password - 密码
   * @param {string} userData.email - 邮箱
   * @returns {Promise} 注册结果Promise
   */
  register(userData) {
    return api.post('/auth/register', userData)
  },
  
  /**
   * 刷新访问令牌
   * @param {Object} data - 刷新令牌数据
   * @param {string} data.refresh_token - 刷新令牌
   * @returns {Promise} 刷新结果Promise
   */
  refreshToken(data) {
    return api.post('/auth/refresh', data)
  },
  
  /**
   * 用户登出
   * @returns {Promise} 登出结果Promise
   */
  logout() {
    return api.post('/auth/logout')
  },
  
  /**
   * 获取邮箱验证码
   * @param {Object} data - 邮箱数据
   * @param {string} data.email - 邮箱地址
   * @returns {Promise} 获取验证码结果Promise
   */
  getEmailCode(data) {
    return api.post('/users/me/email/get', data)
  },
  
  /**
   * 验证邮箱
   * @param {Object} data - 验证数据
   * @param {string} data.email - 邮箱地址
   * @param {string} data.code - 验证码
   * @returns {Promise} 验证结果Promise
   */
  verifyEmail(data) {
    return api.post('/users/me/email/verify', data)
  },
  
  /**
   * 重置密码
   * @param {Object} data - 重置密码数据
   * @param {string} data.email - 邮箱地址
   * @param {string} data.code - 验证码
   * @param {string} data.new_password - 新密码
   * @returns {Promise} 重置密码结果Promise
   */
  resetPassword(data) {
    return api.post('/users/me/password/reset', data)
  },
  
  /**
   * 获取当前用户信息
   * @returns {Promise} 用户信息Promise
   */
  getCurrentUser() {
    return api.get('/auth/me')
  }
}