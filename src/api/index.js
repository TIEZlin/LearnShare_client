import axios from 'axios'

// 创建统一的axios实例（用于所有请求）
const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理错误
api.interceptors.response.use(
  (response) => {
    console.log('API响应:', {
      url: response.config?.url,
      method: response.config?.method,
      status: response.status,
      headers: response.headers
    });
    
    // 检查响应头中是否有token（支持多种大小写格式）
    let token = response.headers['authorization'] || 
                response.headers['x-auth-token'] || 
                response.headers['access-token'] ||
                response.headers['Authorization'] ||
                response.headers['X-Auth-Token'] ||
                response.headers['Access-Token'];
    
    // 如果响应头中的token包含Bearer前缀，需要去掉
    if (token && token.startsWith('Bearer ')) {
      token = token.substring(7);
    }
    
    // 如果响应头中没有token，检查响应体（支持多种响应格式）
    if (!token && response.data) {
      console.log('从响应头未找到token，尝试从响应体提取');
      console.log('响应体:', response.data);
      
      // 支持baseResponse格式
      if (response.data.baseResponse) {
        token = response.data.token || 
               response.data.access_token || 
               response.data.data?.token ||
               response.data.data?.access_token ||
               response.data.result?.token ||
               response.data.result?.access_token;
      } else {
        // 支持直接数据格式
        token = response.data.token || 
               response.data.access_token || 
               response.data.data?.token ||
               response.data.data?.access_token ||
               response.data.result?.token ||
               response.data.result?.access_token ||
               response.data.user?.token ||
               response.data.user?.access_token;
      }
    }
    
    if (token) {
      console.log('找到token:', token);
      // 保存token到sessionStorage
      sessionStorage.setItem('token', token.replace('Bearer ', ''));
    }
    
    // 返回完整的响应对象，而不仅仅是response.data
    // 这样Vuex action可以访问响应头
    return response;
  },
  (error) => {
    const ctx = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      responseData: error.response?.data,
      message: error.message
    }
    console.error('API错误详细:', ctx)
    
    // 检查响应数据中是否有baseResponse和错误码
    const baseResponse = error.response?.data?.baseResponse;
    
    // 处理认证错误
    // 情况1：标准401状态码
    // 情况2：自定义400状态码 + 30001错误码（令牌过期）
    if (error.response?.status === 401 || 
        (error.response?.status === 400 && baseResponse && baseResponse.code === 30001)) {
      console.error('认证失败，token已过期或无效');
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      // 设置明确的错误信息
      error.message = baseResponse?.message || '令牌已过期'
      // 不要直接跳转，让应用自己处理
      // window.location.href = '/login'
    }
    
    // 处理其他后端错误（如果有baseResponse，使用其message）
    else if (baseResponse && baseResponse.message) {
      console.error('后端返回错误:', baseResponse.message);
      error.message = baseResponse.message;
    }
    
    // 处理网络错误
    else if (!error.response) {
      console.error('网络连接失败');
      error.message = '网络连接失败，请检查网络设置'
    }
    
    return Promise.reject(error)
  }
)

export default api

// 导出所有API模块，都使用同一个api实例
export { authAPI } from './auth'
export { courseAPI } from './course'
export { resourceAPI } from './resource'
export { adminAPI } from './admin'
export { profileAPI } from './profile'
export { uploadAPI } from './upload'
export { notificationAPI } from './notification'
export { searchAPI } from './search'
export { statsAPI } from './stats'