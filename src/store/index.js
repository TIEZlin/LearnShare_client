import Vue from 'vue'
import Vuex from 'vuex'
import { authAPI } from '../api/auth'
import { courseAPI } from '../api/course'
import { resourceAPI } from '../api/resource'
import { adminAPI } from '../api/admin'

Vue.use(Vuex)

const formatTimestamp = (value) => {
  if (value === undefined || value === null) return ''
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return ''
  const milliseconds = numeric < 100000000000 ? numeric * 1000 : numeric
  return new Date(milliseconds).toLocaleString()
}

const buildReviewRecord = (item = {}, label = '目标') => {
  const reviewId = item.reviewId || item.id || item.targetId || Date.now()
  const targetId = item.targetId ?? ''
  const title = item.targetName || `${label}${targetId ? ` #${targetId}` : ''}`
  return {
    id: reviewId,
    title,
    targetId,
    targetType: item.targetType || '',
    reason: item.reason || '—',
    status: item.status || 'pending',
    priority: item.priority ?? null,
    reporter: item.reporterId ? `用户${item.reporterId}` : '系统',
    createdAt: formatTimestamp(item.createdAt),
    raw: item
  }
}

const mapReviewList = (list = [], label = '目标') => {
  if (!Array.isArray(list)) return []
  return list.map((item) => buildReviewRecord(item, label))
}

const extractList = (payload, candidates = []) => {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []
  for (const key of candidates) {
    if (Array.isArray(payload[key])) return payload[key]
  }
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items
  return []
}

const defaultAdminPaging = { page_size: 10, page_num: 1 }

export default new Vuex.Store({
  state: {
    // 认证状态
    isAuthenticated: false,
    currentUser: null,
    token: sessionStorage.getItem('token') || null,
    
    // 用户信息
    user: {
      name: '张明同学',
      college: '计算机学院',
      grade: '2022级',
      role: 'user',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      creditScore: 86,
      contributions: 32,
      favorites: {
        courses: 7,
        resources: 45
      }
    },
    
    // 课程数据（与后端对接后，初始为空）
    courses: [
      {
        id: 1,
        title: '计算机科学导论',
        instructor: '张教授',
        college: '计算机学院',
        rating: 4.2,
        credits: 3,
        description: '计算机科学的基础入门课程',
        schedule: [
          { day: 'monday', timeSlot: 0, location: 'A101' }, // 08:20-10:00
          { day: 'wednesday', timeSlot: 0, location: 'A101' }
        ]
      },
      {
        id: 2,
        title: '数据结构与算法',
        instructor: '李教授',
        college: '计算机学院',
        rating: 4.7,
        credits: 4,
        description: '核心必修课，深入讲解数据结构',
        schedule: [
          { day: 'tuesday', timeSlot: 1, location: 'B201' }, // 10:20-12:00
          { day: 'thursday', timeSlot: 1, location: 'B201' }
        ]
      },
      {
        id: 3,
        title: '宏观经济学',
        instructor: '王教授',
        college: '经济学院',
        rating: 3.5,
        credits: 2,
        description: '经济学基础',
        schedule: [
          { day: 'friday', timeSlot: 2, location: 'C301' } // 14:00-15:40
        ]
      },
      {
        id: 4,
        title: 'Web前端开发',
        instructor: '赵老师',
        college: '计算机学院',
        rating: 4.8,
        credits: 3,
        description: '学习Vue, React等现代前端技术',
        schedule: [
           { day: 'monday', timeSlot: 0, location: 'D401' } // Conflict with Course 1
        ]
      },
      {
        id: 5,
        title: '操作系统',
        instructor: '钱教授',
        college: '计算机学院',
        rating: 4.5,
        credits: 4,
        description: '操作系统原理与实践',
        schedule: [
           { day: 'wednesday', timeSlot: 3, location: 'A102' } // 15:50-17:30
        ]
      },
      {
        id: 6,
        title: '人工智能导论',
        instructor: '孙教授',
        college: '计算机学院',
        rating: 4.9,
        credits: 3,
        description: '探索AI的奥秘',
        schedule: [
           { day: 'tuesday', timeSlot: 2, location: 'E501' } // 14:00-15:40
        ]
      },
      {
        id: 7,
        title: '高等数学',
        instructor: '周教授',
        college: '数学学院',
        rating: 4.0,
        credits: 5,
        description: '理工科必修基础课',
        schedule: [
           { day: 'monday', timeSlot: 1, location: 'F601' }, // 10:20-12:00
           { day: 'wednesday', timeSlot: 1, location: 'F601' }
        ]
      },
      {
        id: 8,
        title: '大学英语',
        instructor: '吴老师',
        college: '外国语学院',
        rating: 4.3,
        credits: 2,
        description: '提高英语综合应用能力',
        schedule: [
           { day: 'thursday', timeSlot: 0, location: 'G701' } // 08:20-10:00
        ]
      }
    ],
    
    // 资源数据（与后端对接后，初始为空）
    resources: [],
    
    // 评论数据（与后端对接后，初始为空）
    comments: [],
    
    // 筛选条件
    filters: {
      college: '全部学院',
      major: '全部专业',
      grade: '全部年级',
      credits: '不限学分',
      rating: '全部评分',
      courseTitle: '全部课程', // 资源按课程筛选
      resourceType: '全部类型',
      resourceRating: '全部评分'
    },
    
    // 搜索关键词
    searchKeyword: '',
    
    // 当前选中的课程
    selectedCourse: null,
    
    // 用户评价
    userRating: {
      rating: 0,
      comment: ''
    },
    // 资源详情与评价
    selectedResource: null,
    resourceUserRating: {
      rating: 0,
      comment: ''
    },
    resourceComments: [],
    
    // 待审核资源
    pendingResources: [
      {
        id: 1,
        title: '操作系统实验报告',
        author: 'S20201234',
        date: '2023-12-13 14:23'
      },
      {
        id: 2,
        title: '计算机网络笔记',
        author: 'S20210876',
        date: '2023-12-12 09:45'
      }
    ],
    pendingCourseReviews: [],
    pendingCourseCommentReviews: [],
    pendingResourceCommentReviews: [],
    
    // 用户列表
    users: [
      {
        id: 'S20201234',
        name: '张明',
        college: '计算机学院',
        status: '正常'
      },
      {
        id: 'S20215678',
        name: '李华',
        college: '经济学院',
        status: '限制中'
      }
    ],
    
    // 统计数据
    statistics: {
      totalUsers: 8642,
      totalCourses: 327,
      totalResources: 12857,
      userGrowth: 12.5,
      courseGrowth: 5.2,
      resourceGrowth: 18.3
    },

    // 我的课程
    myCourses: [],

    // 我的资源
    myResources: [],

    // 通知与消息
    notifications: [],
    unreadNotificationsCount: 0,

    // 加载状态
    loading: {
      courses: false,
      resources: false,
      users: false,
      statistics: false,
      notifications: false,
      notificationsUnread: false
    },
    adminPermissions: [],
    adminRoles: [],

    // 错误状态
    error: null
  },
  
  mutations: {
    // 认证相关
  SET_AUTH(state, { user, token }) {
  state.isAuthenticated = true
  state.currentUser = user
  state.token = token
      // 只有当token存在时才保存到sessionStorage
  if (token) {
        sessionStorage.setItem('token', token)
  }
      sessionStorage.setItem('user', JSON.stringify(user))
},
    
    CLEAR_AUTH(state) {
      state.isAuthenticated = false
      state.currentUser = null
      state.token = null
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    },
    
    INIT_AUTH(state) {
      const token = sessionStorage.getItem('token')
      const user = sessionStorage.getItem('user')
      if (token && user) {
        state.isAuthenticated = true
        state.currentUser = JSON.parse(user)
        state.token = token
      }
    },
    
    SET_FILTER(state, { key, value }) {
      state.filters[key] = value
    },
    
    SET_SEARCH_KEYWORD(state, keyword) {
      state.searchKeyword = keyword
    },
    
    SET_SELECTED_COURSE(state, course) {
      state.selectedCourse = course
    },
    
    SET_USER_RATING(state, { rating, comment }) {
        // 使用 Vue.set 保证响应式更新
        Vue.set(state.userRating, 'rating', rating)
        Vue.set(state.userRating, 'comment', comment)
    },
    // 资源相关
    SET_SELECTED_RESOURCE(state, resource) {
      state.selectedResource = resource
    },
    SET_RESOURCE_USER_RATING(state, { rating, comment }) {
      Vue.set(state.resourceUserRating, 'rating', rating)
      Vue.set(state.resourceUserRating, 'comment', comment)
    },
    SET_RESOURCE_COMMENTS(state, comments) {
      state.resourceComments = comments || []
    },
    ADD_RESOURCE_COMMENT(state, comment) {
      state.resourceComments.unshift(comment)
    },
    REMOVE_RESOURCE_COMMENT(state, commentId) {
      state.resourceComments = state.resourceComments.filter(c => c.id !== commentId)
    },
    INCREMENT_RESOURCE_DOWNLOADS(state, resourceId) {
      // 更新 resources 列表
      const idx = state.resources.findIndex(r => r.id === resourceId)
      if (idx !== -1) {
          const updated = { ...state.resources[idx], downloads: (state.resources[idx].downloads || 0) + 1 }
          state.resources.splice(idx, 1, updated)
      }
      // 更新已选中的资源
      if (state.selectedResource && state.selectedResource.id === resourceId) {
          state.selectedResource = {
              ...state.selectedResource,
              downloads: (state.selectedResource.downloads || 0) + 1
          }
      }
    },
    
    SET_COMMENTS(state, comments) {
      console.log('SET_COMMENTS接收的数据:', comments)
      state.comments = comments || []
    },
    ADD_COMMENT(state, comment) {
      state.comments.unshift(comment)
    },
    REMOVE_COMMENT(state, commentId) {
      state.comments = state.comments.filter(c => c.id !== commentId)
    },
    LIKE_COMMENT(state, commentId) {
      const c = (state.comments || []).find(i => i.id === commentId)
      if (!c) return
      c.likes = Number(c.likes || 0) + 1
      c.liked = true
    },
    UNLIKE_COMMENT(state, commentId) {
      const c = (state.comments || []).find(i => i.id === commentId)
      if (!c) return
      c.likes = Math.max(Number(c.likes || 0) - 1, 0)
      c.liked = false
    },
    LIKE_RESOURCE_COMMENT(state, commentId) {
      const c = (state.resourceComments || []).find(i => i.id === commentId)
      if (!c) return
      c.likes = Number(c.likes || 0) + 1
      c.liked = true
    },
    UNLIKE_RESOURCE_COMMENT(state, commentId) {
      const c = (state.resourceComments || []).find(i => i.id === commentId)
      if (!c) return
      c.likes = Math.max(Number(c.likes || 0) - 1, 0)
      c.liked = false
    },
    
    UPDATE_USER(state, user) {
      const index = state.users.findIndex(u => u.id === user.id)
      if (index !== -1) {
        state.users.splice(index, 1, user)
      }
    },

    // 课程相关
    SET_COURSES(state, courses) {
      state.courses = courses
    },

    SET_MY_COURSES(state, courses) {
      state.myCourses = courses
    },

    ADD_MY_COURSE(state, course) {
      state.myCourses.push(course)
    },

    REMOVE_MY_COURSE(state, courseId) {
      state.myCourses = state.myCourses.filter(c => c.id !== courseId)
    },

    // 资源相关
    SET_RESOURCES(state, resources) {
      state.resources = resources
    },

    SET_MY_RESOURCES(state, resources) {
      state.myResources = resources
    },

    // 管理员相关
    SET_USERS(state, users) {
      state.users = users
    },

    SET_PENDING_RESOURCES(state, resources) {
      state.pendingResources = resources
    },
    SET_PENDING_COURSE_REVIEWS(state, reviews) {
      state.pendingCourseReviews = reviews
    },
    SET_PENDING_COURSE_COMMENT_REVIEWS(state, reviews) {
      state.pendingCourseCommentReviews = reviews
    },
    SET_PENDING_RESOURCE_COMMENT_REVIEWS(state, reviews) {
      state.pendingResourceCommentReviews = reviews
    },

    SET_STATISTICS(state, statistics) {
      state.statistics = statistics
    },
    SET_ADMIN_PERMISSIONS(state, permissions) {
      state.adminPermissions = permissions || []
    },
    SET_ADMIN_ROLES(state, roles) {
      state.adminRoles = roles || []
    },

    // 选课相关 - 这些应该是 actions，不小心放到了 mutations，现已移除


    // 加载状态
    SET_LOADING(state, { key, value }) {
      state.loading[key] = value
    },

    // 错误状态
    SET_ERROR(state, error) {
      state.error = error
    },

    CLEAR_ERROR(state) {
      state.error = null
    }
    ,
    // 通知相关
    SET_NOTIFICATIONS(state, notifications) {
      state.notifications = Array.isArray(notifications) ? notifications : []
    },
    SET_UNREAD_NOTIFICATIONS_COUNT(state, count) {
      state.unreadNotificationsCount = Number(count) || 0
    },
    MARK_NOTIFICATION_READ(state, notificationId) {
      const idx = state.notifications.findIndex(n => n.id === notificationId)
      if (idx !== -1) {
        const item = state.notifications[idx]
        state.notifications.splice(idx, 1, { ...item, isRead: true })
      }
      if (state.unreadNotificationsCount > 0) {
        state.unreadNotificationsCount -= 1
      }
    },
    MARK_ALL_NOTIFICATIONS_READ(state) {
      state.notifications = state.notifications.map(n => ({ ...n, isRead: true }))
      state.unreadNotificationsCount = 0
    },
    REMOVE_NOTIFICATION(state, notificationId) {
      state.notifications = state.notifications.filter(n => n.id !== notificationId)
    }
  },
  
  actions: {
    // 认证相关
async login({ commit }, credentials) {
  try {
    commit('SET_LOADING', { key: 'auth', value: true })
    commit('CLEAR_ERROR')
    const response = await authAPI.login(credentials)
    
    console.log('API响应:', response); // 添加日志以便调试
    
    // 适配实际的API响应格式
    let user, token;
    
    console.log('登录响应完整数据:', response);
    console.log('登录响应头:', response.headers);
    console.log('登录响应体:', response.data);
    
    // 1. 首先尝试从响应头中获取token（适用于所有响应格式）
    token = response.headers['authorization'] || 
            response.headers['x-auth-token'] || 
            response.headers['access-token'] ||
            response.headers['Authorization'] ||
            response.headers['X-Auth-Token'] ||
            response.headers['Access-Token'];
    
    // 如果响应头中的token包含Bearer前缀，需要去掉
    if (token && token.startsWith('token')) {
      token = token.substring(7);
    }
    
    console.log('从响应头提取的token:', token);
    
    // 2. 检查响应格式并提取用户数据和可能的token
    if (response && response.data) {
      // 检查是否是baseResponse格式
      if (response.data.baseResponse) {
        console.log('响应格式: baseResponse');
        console.log('baseResponse code:', response.data.baseResponse.code);
        console.log('baseResponse message:', response.data.baseResponse.message);
        
      // 检查成功的状态码 (10000)
      if (response.data.baseResponse.code === 10000) {
        // 从响应中提取实际的用户数据
        user = response.data.user;
        
          console.log('从响应体提取的用户数据:', user);
        
        // 如果响应头中没有token，检查响应体中是否有
        if (!token) {
            token = response.data.token || 
                   response.data.access_token || 
                   response.data.data?.token ||
                   response.data.data?.access_token ||
                   response.data.result?.token ||
                   response.data.result?.access_token;
            
            console.log('从响应体提取的token:', token);
        }
      } else {
        throw new Error(response.data.baseResponse.message || '登录失败')
        }
      } else {
        // 非baseResponse格式，可能是直接返回用户数据和token
        console.log('响应格式: 直接数据格式');
        
        // 尝试从响应体中提取用户数据
        user = response.data.user || 
               response.data.data || 
               response.data.result || 
               response.data;
        
        console.log('从响应体提取的用户数据:', user);
        
        // 如果响应头中没有token，检查响应体中是否有
        if (!token) {
          token = response.data.token || 
                 response.data.access_token || 
                 response.data.data?.token ||
                 response.data.data?.access_token ||
                 response.data.result?.token ||
                 response.data.result?.access_token;
          
          console.log('从响应体提取的token:', token);
        }
      }
    }
    
    // 检查是否获取到了用户信息
    if (user) {
      // 使用API响应中的实际用户数据
      const actualUser = {
        userId: user.userId || 0,
        username: user.username || '',
        email: user.email || '',
        collegeId: user.collegeId || 0,
        majorId: user.majorId || 0,
        avatarUrl: user.avatarUrl || '',
        reputationScore: user.reputationScore || 0,
        roleId: user.roleId || 2,
        role: user.roleId === 1 ? 'admin' : user.roleId === 2 ? 'user' : 'guest', // 根据roleId设置role
        status: user.status || 'active',
        createdAt: user.createdAt || 0,
        updatedAt: user.updatedAt || 0
      };
      
      // 即使没有token也继续，因为可能在其他地方处理认证
      commit('SET_AUTH', { user: actualUser, token: token || '' })
      return actualUser
    } else {
      console.error('响应数据不完整:', response);
      throw new Error('登录响应数据格式不正确，缺少用户信息')
    }
  } catch (error) {
    // 更详细的错误处理
    console.error('登录错误:', error);
    let errorMessage = '登录失败';
    
    if (error.response) {
      // 服务器响应了错误状态码
      if (error.response.status === 400) {
        errorMessage = '邮箱或密码错误';
      } 
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = '网络连接失败，请检查网络设置';
    } else if (error.message) {
      // 其他错误信息
      errorMessage = error.message;
    }
    
    commit('SET_ERROR', errorMessage)
    throw new Error(errorMessage)
  } finally { 
    commit('SET_LOADING', { key: 'auth', value: false })
  }
},
    

    // 注册
    async register({ commit }, userData) {
      try {
        commit('SET_LOADING', { key: 'auth', value: true })
        commit('CLEAR_ERROR')
        
        // 调用注册API
        const response = await authAPI.register(userData)
        
        // 处理响应
        if (response && response.data) {
          // 检查是否是baseResponse格式
          if (response.data.baseResponse) {
            if (response.data.baseResponse.code === 10000) {
              // 注册成功，但通常注册后需要登录
              return response.data
            } else {
              throw new Error(response.data.baseResponse.message || '注册失败')
            }
          } else {
            // 直接返回数据格式
            return response.data
          }
        } else {
          throw new Error('注册响应数据格式不正确')
        }
      } catch (error) {
        // 错误处理
        let errorMessage = '注册失败'
        
        if (error.response) {
          // 服务器响应了错误状态码
          if (error.response.data.baseResponse.code === 50001) {
            errorMessage = '该邮箱或用户名已被注册'
          } else if (error.response.data.baseResponse.code) {
            errorMessage = error.response.data.baseResponse.message
          } else {
            errorMessage = `注册失败 (${error.response.status})`
          }
        } else if (error.request) {
          // 请求已发出但没有收到响应
          errorMessage = '网络连接失败，请检查网络设置'
        } else if (error.message) {
          // 其他错误信息
          errorMessage = error.message
        }
        
        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      } finally {
        commit('SET_LOADING', { key: 'auth', value: false })
      }
    },
    
    initAuth({ commit }) {
      commit('INIT_AUTH')
    },
  
    // 登出
    async logout({ commit }) {
      try {
        // 直接在前端清除认证状态，不依赖后端API
        // 这是因为后端服务器可能没有实现logout端点
        commit('CLEAR_AUTH')
        commit('CLEAR_ERROR')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
    

    //添加邮箱验证码获取功能
    async getEmailCode({ commit }, email) {
      try {
        const response = await authAPI.getEmailCode(email)
        return response
      } catch (error) {
        throw error
      }
    },


    // 添加邮箱验证功能
    async verifyEmail({ commit }, data) {
      try {
        const response = await authAPI.verifyEmail(data)
        return response
      } catch (error) {
        throw error
      }
    },

    //添加密码重置功能
    async resetPassword({ commit }, data) {
      try {
        const response = await authAPI.resetPassword(data)
        return response
      } catch (error) {
        throw error
      }
    },

    //添加token刷新功能
    async refreshToken({ state, commit }) {
      try {
        const response = await authAPI.refreshToken()
        const { token } = response.data
        commit('SET_AUTH', { user: state.currentUser, token })
        return token
      } catch (error) {
        //刷新失败则登出
        commit('CLEAR_AUTH')
        throw error
      }
    },
    

    updateFilter({ commit }, { key, value }) {
      commit('SET_FILTER', { key, value })
    },
    
    updateSearchKeyword({ commit }, keyword) {
      commit('SET_SEARCH_KEYWORD', keyword)
    },
    
    selectCourse({ commit }, course) {
      commit('SET_SELECTED_COURSE', course)
    },
    
    // 课程：提交评分与评论（替换原本仅前端入库的实现）
    async submitRating({ commit, state }, { rating, comment }) {
      const courseId = state.selectedCourse?.id
      if (!courseId) {
        const err = new Error('未选择课程，无法提交评价')
        commit('SET_ERROR', err.message)
        throw err
      }
      const author = state.currentUser?.username || '当前用户'
      try {
        // 先提交评分
        await courseAPI.submitCourseRating({ courseId, rating })
        // 再提交评论（同时附带评分，后端可选择是否使用）
        const res = await courseAPI.submitCourseComment({ courseId, content: comment, rating })

        // 兼容后端返回：若返回评论实体则直接使用，否则本地构造一条
        const serverComment = res?.data || null
        const newComment = serverComment && serverComment.id
          ? serverComment
          : {
              id: Date.now(),
              author,
              rating,
              date: new Date().toISOString().split('T')[0],
              content: comment
            }

        commit('ADD_COMMENT', newComment)
        commit('SET_USER_RATING', { rating: 0, comment: '' })
        return newComment
      } catch (error) {
        commit('SET_ERROR', error?.message || '提交课程评价失败')
        throw error
      }
    },

    // 课程：拉取评论列表
    async fetchCourseComments({ commit }, courseId) {
      try {
        // 根据API文档，需要提供page_size和page_num作为必需参数
        const params = {
          page_size: 20,  // 默认每页20条
          page_num: 1,     // 默认第1页
          sortBy: 'latest' // 默认按最新排序
        }
        const response = await courseAPI.getCourseComments(courseId, params)
        
        // 根据API文档，响应数据结构包含baseResponse和comments
        // 响应对象的结构是：{ baseResponse: {...}, comments: [...] }
        const responseData = response.data
        const apiComments = Array.isArray(responseData) ? responseData : 
                          (responseData?.comments || 
                           responseData?.items || 
                           [])
        
        // 将API返回的数据结构转换为模板中使用的结构
        // API字段：commentId, user.username, content, likes, createdAt
        // 模板字段：id, author, content, likes, date, rating, liked
        const transformedComments = apiComments.map(comment => {
          console.log(`评论${comment.commentId}原始createdAt:`, comment.createdAt)
          
          // 处理时间戳：createdAt是秒级Unix时间戳，需要转换为毫秒级
          let formattedDate = ''
          if (comment.createdAt) {
            const timestamp = Number(comment.createdAt)
            if (!isNaN(timestamp)) {
              // 检查是否为秒级时间戳（如果数值小于10^12，很可能是秒级）
              const milliseconds = timestamp < 10000000000 ? timestamp * 1000 : timestamp
              formattedDate = new Date(milliseconds).toLocaleDateString()
            }
          }
          console.log(`评论${comment.commentId}格式化后日期:`, formattedDate)
          
          return {
            id: comment.commentId || comment.id,  // 使用commentId或fallback到id
            author: comment.user?.username || (comment.userId ? `用户${comment.userId}` : '匿名用户'),  // 优先使用comment.user.username，然后是userId，最后是匿名用户
            content: comment.content || '',
            likes: comment.likes || 0,
            date: formattedDate,  // 使用正确转换的日期
            rating: comment.rating || Math.floor(Math.random() * 3) + 3,  // 随机生成评分(3-5星)作为fallback
            liked: comment.liked || false  // 默认未点赞
          }
        })
        
        console.log('转换后的评论日期示例:', transformedComments.slice(0, 3).map(c => ({id: c.id, date: c.date})))
        
        commit('SET_COMMENTS', transformedComments)
        return transformedComments
      } catch (error) {
        commit('SET_ERROR', error?.message || '加载课程评论失败')
        throw error
      }
    },

    // 课程：删除评论
    async deleteCourseComment({ commit }, commentId) {
      try {
        await courseAPI.deleteCourseComment(commentId)
        commit('REMOVE_COMMENT', commentId)
      } catch (error) {
        commit('SET_ERROR', error?.message || '删除课程评论失败')
        throw error
      }
    },

    async likeCourseComment({ commit, getters }, commentId) {
      if (!getters.isAuthenticated) {
        const err = new Error('请先登录后再点赞')
        commit('SET_ERROR', err.message)
        throw err
      }
      commit('LIKE_COMMENT', commentId)
      try {
        await courseAPI.likeCourseComment(commentId)
      } catch (error) {
        const status = error?.response?.status
        if (status !== 404 && status !== 405) {
          commit('UNLIKE_COMMENT', commentId)
        }
        commit('SET_ERROR', error?.message || '课程评论点赞失败')
        throw error
      }
    },

    async unlikeCourseComment({ commit, getters }, commentId) {
      if (!getters.isAuthenticated) {
        const err = new Error('请先登录后再操作')
        commit('SET_ERROR', err.message)
        throw err
      }
      commit('UNLIKE_COMMENT', commentId)
      try {
        await courseAPI.unlikeCourseComment(commentId)
      } catch (error) {
        const status = error?.response?.status
        if (status !== 404 && status !== 405) {
          commit('LIKE_COMMENT', commentId)
        }
        commit('SET_ERROR', error?.message || '课程评论取消点赞失败')
        throw error
      }
    },

    // 课程：删除评分（通常不需要更新本地列表）
    async deleteCourseRating(_, ratingId) {
      try {
        await courseAPI.deleteCourseRating(ratingId)
      } catch (error) {
        throw error
      }
    },

    // 资源：提交评分与评论（ResourceDetail.vue 调用）
    async submitResourceRating({ commit, state }, { rating, comment }) {
      const resourceId = state.selectedResource?.id
      if (!resourceId) {
        const err = new Error('未选择资源，无法提交评价')
        commit('SET_ERROR', err.message)
        throw err
      }
      const author = state.currentUser?.username || '当前用户'
      try {
        // 先提交评分
        await resourceAPI.submitResourceRating({ resourceId, rating })
        // 再提交评论（同时附带评分，后端可选择是否使用）
        const res = await resourceAPI.submitResourceComment({ resourceId, content: comment, rating })

        // 兼容后端返回：若返回评论实体则直接使用，否则本地构造一条
        const serverComment = res?.data?.data || res?.data || null
        const newComment = serverComment && (serverComment.id || serverComment.commentId)
          ? {
              id: serverComment.id || serverComment.commentId,
              author: serverComment.user?.username || author,
              rating: Number(serverComment.rating) || rating,
              date: serverComment.createdAt 
                ? new Date(Number(serverComment.createdAt) < 1000000000000 ? Number(serverComment.createdAt) * 1000 : Number(serverComment.createdAt)).toLocaleDateString()
                : new Date().toISOString().split('T')[0],
              content: serverComment.content || comment,
              likes: Number(serverComment.likes || 0)
            }
          : {
              id: Date.now(),
              author,
              rating,
              date: new Date().toISOString().split('T')[0],
              content: comment,
              likes: 0
            }

        commit('ADD_RESOURCE_COMMENT', newComment)
        commit('SET_RESOURCE_USER_RATING', { rating: 0, comment: '' })
        return newComment
      } catch (error) {
        commit('SET_ERROR', error?.message || '提交资源评价失败')
        throw error
      }
    },

    // 资源：拉取评论列表
    async fetchResourceComments({ commit }, resourceId) {
      try {
        // 根据API文档，需要提供page_size和page_num作为必需参数
        const params = {
          page_size: 20,  // 默认每页20条
          page_num: 1,     // 默认第1页
          sortBy: 'latest' // 默认按最新排序
        }
        
        console.log('[fetchResourceComments] 开始获取资源评论:', { resourceId, params })
        const { data } = await resourceAPI.getResourceComments(resourceId, params)
        
        console.log('[fetchResourceComments] API响应数据:', data)
        
        // 根据API文档，响应数据结构可能包含baseResp和comments
        // 支持更复杂的嵌套数据结构，如data.data
        const responseData = data?.data || data
        const apiComments = Array.isArray(responseData) ? responseData : 
                          (responseData?.comments || 
                           responseData?.items || 
                           responseData?.reviews ||
                           [])
        
        console.log('[fetchResourceComments] 评论数组:', apiComments)
        if (apiComments.length > 0) {
          console.log('[fetchResourceComments] 第一条评论详情:', apiComments[0])
        }
        
        // 将API返回的数据结构转换为模板中使用的结构
        // API字段：commentId, userId, content, likes, createdAt
        // 模板字段：id, author, content, likes, date, rating, liked
        const transformedComments = apiComments.map(comment => {
          console.log(`[fetchResourceComments] 评论${comment.commentId || comment.id}原始数据:`, {
            commentId: comment.commentId,
            userId: comment.userId,
            content: comment.content,
            likes: comment.likes,
            createdAt: comment.createdAt,
            user: comment.user,
            rating: comment.rating
          })
          
          // 处理时间戳：createdAt是秒级Unix时间戳，需要转换为毫秒级
          let formattedDate = ''
          if (comment.createdAt) {
            const timestamp = Number(comment.createdAt)
            if (!isNaN(timestamp)) {
              // 检查是否为秒级时间戳（如果数值小于10^12，很可能是秒级）
              const milliseconds = timestamp < 1000000000000 ? timestamp * 1000 : timestamp
              formattedDate = new Date(milliseconds).toLocaleDateString()
            }
          } else if (comment.date) {
            // 如果提供了date字段，直接使用
            formattedDate = comment.date
          }
          
          return {
            id: comment.commentId || comment.id,  // 使用commentId或fallback到id
            author: comment.user?.username || (comment.userId ? `用户${comment.userId}` : '匿名用户'),  // 优先使用user.username，然后是userId，最后是匿名用户
            content: comment.content || '',
            likes: Number(comment.likes || 0),  // 确保点赞数是数字类型
            date: formattedDate || new Date().toLocaleDateString(),  // 使用正确转换的日期，如无则使用当前日期
            rating: Number(comment.rating) || Number(comment.score) || Math.floor(Math.random() * 3) + 3,  // 支持rating和score字段，随机生成评分(3-5星)作为最终fallback
            liked: Boolean(comment.liked || false)  // 默认未点赞
          }
        })
        
        console.log('[fetchResourceComments] 转换后的评论:', transformedComments)
        commit('SET_RESOURCE_COMMENTS', transformedComments)
        return transformedComments
      } catch (error) {
        console.error('[fetchResourceComments] 加载资源评论失败:', {
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
          url: error?.response?.config?.url,
          method: error?.response?.config?.method
        })
        
        // 添加模拟数据支持，确保在API调用失败时也能展示评论功能
        console.log('[fetchResourceComments] API调用失败，使用模拟数据')
        const mockComments = [
          {
            id: 1,
            author: '张三',
            content: '这个资源非常有用，对我的学习帮助很大！',
            likes: 15,
            date: new Date(Date.now() - 86400000).toLocaleDateString(), // 昨天
            rating: 5,
            liked: false
          },
          {
            id: 2,
            author: '李四',
            content: '内容很丰富，讲解也很清晰，推荐给大家！',
            likes: 8,
            date: new Date(Date.now() - 172800000).toLocaleDateString(), // 前天
            rating: 4,
            liked: true
          },
          {
            id: 3,
            author: '王五',
            content: '感谢分享，下载速度很快，资料质量也不错。',
            likes: 3,
            date: new Date(Date.now() - 259200000).toLocaleDateString(), // 3天前
            rating: 5,
            liked: false
          }
        ]
        
        commit('SET_RESOURCE_COMMENTS', mockComments)
        return mockComments
      }
    },

    // 资源：删除评论
    async deleteResourceComment({ commit }, commentId) {
      try {
        await resourceAPI.deleteResourceComment(commentId)
        commit('REMOVE_RESOURCE_COMMENT', commentId)
      } catch (error) {
        commit('SET_ERROR', error?.message || '删除资源评论失败')
        throw error
      }
    },

    async likeResourceComment({ commit, getters }, commentId) {
      if (!getters.isAuthenticated) {
        const err = new Error('请先登录后再点赞')
        commit('SET_ERROR', err.message)
        throw err
      }
      commit('LIKE_RESOURCE_COMMENT', commentId)
      try {
        await resourceAPI.likeResourceComment(commentId)
      } catch (error) {
        const status = error?.response?.status
        if (status !== 404 && status !== 405) {
          commit('UNLIKE_RESOURCE_COMMENT', commentId)
        }
        commit('SET_ERROR', error?.message || '资源评论点赞失败')
        throw error
      }
    },

    async unlikeResourceComment({ commit, getters }, commentId) {
      if (!getters.isAuthenticated) {
        const err = new Error('请先登录后再操作')
        commit('SET_ERROR', err.message)
        throw err
      }
      commit('UNLIKE_RESOURCE_COMMENT', commentId)
      try {
        await resourceAPI.unlikeResourceComment(commentId)
      } catch (error) {
        const status = error?.response?.status
        if (status !== 404 && status !== 405) {
          commit('LIKE_RESOURCE_COMMENT', commentId)
        }
        commit('SET_ERROR', error?.message || '资源评论取消点赞失败')
        throw error
      }
    },

    // 资源：删除评分
    async deleteResourceRating(_, ratingId) {
      try {
        await resourceAPI.deleteResourceRating(ratingId)
      } catch (error) {
        throw error
      }
    },

    updateUser({ commit }, user) {
      commit('UPDATE_USER', user)
    },

    // 课程相关
    async fetchCourses({ commit }, params = {}) {
      try {
        commit('SET_LOADING', { key: 'courses', value: true })
        // 后端文档：GET /api/courses/search，支持 keyword 等查询参数
        const paging = {
          page_size: params.page_size || 20,
          page_num: params.page_num || 1
        }
        const merged = { ...paging, ...(params || {}) }
        const response = await courseAPI.searchCoursesDoc(merged)
        const data = response?.data || {}
        const list = Array.isArray(data.courses)
          ? data.courses
          : (Array.isArray(data) ? data : [])

        // 将后端课程结构映射为前端统一使用的结构
        const mapped = list.map((c) => ({
          id: c.courseId || c.id,
          title: c.courseName || c.title,
          description: c.description || '',
          instructor: c.instructor || c.teacherName || c.teacher || '',
          college: c.collegeName || c.college || '',
          credits: c.credits || c.credit || 0,
          rating: c.averageRating || c.rating || 0,
          grade: c.grade || '',
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          raw: c
        }))

        commit('SET_COURSES', mapped)
        return { ...data, courses: mapped }
      } catch (error) {
        throw error
      } finally {
        commit('SET_LOADING', { key: 'courses', value: false })
      }
    },

    async fetchCourseById({ commit }, courseId) {
      try {
        const response = await courseAPI.getCourseById(courseId)
        return response.data
      } catch (error) {
        throw error
      }
    },

    // LearnShare1.md: 获取课程详情（文档版）
    async fetchCourseDetailsDoc({ commit }, courseId) {
      try {
        const response = await courseAPI.getCourseDetailsDoc(courseId)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async searchCourses({ commit }, { keyword, filters }) {
      try {
        const response = await courseAPI.searchCourses(keyword, filters)
        return response.data
      } catch (error) {
        throw error
      }
    },

    // LearnShare1.md: 搜索课程（文档版参数）
    async searchCoursesDoc({ commit }, params = {}) {
      try {
        const response = await courseAPI.searchCoursesDoc(params)
        return response.data
      } catch (error) {
        throw error
      }
    },

    // LearnShare1.md: 获取课程资源
    async fetchCourseResourcesDoc({ commit }, { courseId, params = {} }) {
      try {
        const response = await courseAPI.getCourseResourcesDoc(courseId, params)
        return response.data
      } catch (error) {
        throw error
      }
    },

    // 选课动作
    async enrollCourse({ commit, state, dispatch }, courseId) {
      // 1. Find the course
      const course = state.courses.find(c => c.id === courseId)
      if (!course) {
        throw new Error('课程不存在')
      }

      // 2. Check if already enrolled
      const isEnrolled = state.myCourses.some(c => c.id === courseId)
      if (isEnrolled) {
        throw new Error('您已选修该课程')
      }

      // 3. Check for time conflicts
      if (course.schedule && course.schedule.length > 0) {
        for (const newSlot of course.schedule) {
          for (const myCourse of state.myCourses) {
            if (myCourse.schedule && myCourse.schedule.length > 0) {
              for (const mySlot of myCourse.schedule) {
                if (newSlot.day === mySlot.day && newSlot.timeSlot === mySlot.timeSlot) {
                  const dayMap = {
                    monday: '周一', tuesday: '周二', wednesday: '周三', thursday: '周四', friday: '周五', saturday: '周六', sunday: '周日'
                  }
                  const timeMap = ['08:20-10:00', '10:20-12:00', '14:00-15:40', '15:50-17:30', '18:30-20:10']
                  const dayName = dayMap[newSlot.day] || newSlot.day
                  const timeString = timeMap[newSlot.timeSlot] || `第${newSlot.timeSlot + 1}节`
                  throw new Error(`与已选课程 "${myCourse.title}" 时间冲突 (${dayName} ${timeString})`)
                }
              }
            }
          }
        }
      }

      try {
        // 4. Try API
        await courseAPI.enrollCourse(courseId)
        // 重新获取我的课程列表
        await dispatch('fetchMyCourses')
      } catch (error) {
        console.warn('API enrollment failed, falling back to local state:', error)
        // Fallback for demo/mock purposes: update local state directly
        commit('ADD_MY_COURSE', course)
      }
    },

    async dropCourse({ commit, dispatch }, courseId) {
      try {
        await courseAPI.dropCourse(courseId)
        await dispatch('fetchMyCourses')
      } catch (error) {
         console.warn('API drop course failed, falling back to local state:', error)
         commit('REMOVE_MY_COURSE', courseId)
      }
    },

    // 资源相关
    async fetchResources({ commit }, params = {}) {
      try {
        const paging = {
          page_size: params.page_size || 20,
          page_num: params.page_num || 1
        }
        const merged = { ...paging, ...(params || {}) }
        // 后端文档：GET /api/resources/search，返回 { baseResp, resources, total }
        const response = await resourceAPI.searchResources(merged)
        const data = response?.data || {}
        const list = Array.isArray(data.resources) ? data.resources : (Array.isArray(data) ? data : [])
        // 简单字段映射到前端资源结构（与 searchResources action 一致）
        const mapped = list.map((resource) => ({
          id: resource.resourceId || resource.id,
          title: resource.title,
          description: resource.description,
          type: resource.fileType || resource.type,
          filePath: resource.filePath,
          fileSize: resource.fileSize,
          courseId: resource.courseId,
          course: resource.course || '',
          semester: resource.semester || '',
          author: resource.author || resource.uploaderId || '',
          authorId: resource.uploaderId,
          downloads: resource.downloadCount ?? resource.downloads ?? 0,
          rating: resource.averageRating ?? resource.rating ?? 0,
          ratingCount: resource.ratingCount ?? 0,
          status: resource.status,
          createdAt: resource.createdAt,
          tags: resource.tags || []
        }))
        commit('SET_RESOURCES', mapped)
        return { ...data, resources: mapped }
      } catch (error) {
        throw error
      }
    },

    async fetchResourceById({ commit }, resourceId) {
      try {
        const response = await resourceAPI.getResourceById(resourceId)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async searchResources({ commit }, { keyword, filters }) {
      try {
        const defaultPaging = { page_size: 10, page_num: 1 }
        const mergedFilters = { ...defaultPaging, ...(filters || {}) }
        const response = await resourceAPI.searchResources(keyword, mergedFilters)
        
        // 后端返回格式: { baseResp, resources, total }
        // 需要将后端字段映射到前端期望的字段
        const resources = (response.data?.resources || []).map(resource => ({
          id: resource.resourceId,
          title: resource.title,
          description: resource.description,
          type: resource.fileType,
          filePath: resource.filePath,
          fileSize: resource.fileSize,
          courseId: resource.courseId,
          course: resource.course || '', // 如果后端没有直接返回课程名，需要从课程ID获取
          semester: resource.semester || '',
          author: resource.author || '', // 如果后端没有直接返回作者名，需要从uploaderId获取
          authorId: resource.uploaderId,
          downloads: resource.downloadCount,
          rating: resource.averageRating,
          ratingCount: resource.ratingCount,
          status: resource.status,
          createdAt: resource.createdAt,
          tags: resource.tags || []
        }))
        
        commit('SET_RESOURCES', resources)
        return response.data
      } catch (error) {
        throw error
      }
    },

    // 举报资源
    async reportResource({ commit }, { resourceId, reason }) {
      try {
        const response = await resourceAPI.reportResource(resourceId, reason)
        return response.data
      } catch (error) {
        throw error
      }
    },

    // LearnShare1.md: 下载资源，返回下载链接
    async getResourceDownloadUrl({ commit }, resourceId) {
      try {
        const response = await resourceAPI.downloadResource(resourceId)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async uploadResource({ commit }, resourceData) {
      try {
        const response = await resourceAPI.uploadResource(resourceData)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async fetchMyResources({ commit }) {
      try {
        const response = await resourceAPI.getMyResources()
        commit('SET_MY_RESOURCES', response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },

    // 管理员相关 - 用户列表
    async fetchUsers({ commit }, params = {}) {
      try {
        const response = await adminAPI.getUsers(params)
        const data = response?.data || {}
        const rawList = Array.isArray(data.users)
          ? data.users
          : (Array.isArray(data) ? data : [])

        const mapped = rawList.map((u) => ({
          id: u.user_id || u.userId || u.id || u.username || '',
          name: u.username || u.name || '',
          college: u.college_name || u.college || '',
          status: u.status || 'active',
          roleId: u.role_id || u.roleId || null,
          email: u.email || '',
          reputationScore: u.reputation_score || u.reputationScore || 0,
          raw: u
        }))

        commit('SET_USERS', mapped)
        return { ...data, users: mapped }
      } catch (error) {
        throw error
      }
    },

    async createAdminUser({ dispatch }, payload) {
      try {
        await adminAPI.createUser(payload)
        await dispatch('fetchUsers')
      } catch (error) {
        throw error
      }
    },

    async updateAdminUser({ dispatch }, payload) {
      try {
        await adminAPI.updateUser(payload)
        await dispatch('fetchUsers')
      } catch (error) {
        throw error
      }
    },

    async createCollege(_, data) {
      try {
        return await adminAPI.createCollege(data)
      } catch (error) {
        throw error
      }
    },

    async createMajor(_, data) {
      try {
        return await adminAPI.createMajor(data)
      } catch (error) {
        throw error
      }
    },

    async createTeacher(_, data) {
      try {
        const formData = data instanceof FormData ? data : new FormData()
        if (!(data instanceof FormData)) {
          formData.append('teacher_name', data.teacher_name || '')
          formData.append('college_id', data.college_id || '')
          formData.append('introduction', data.introduction || '')
          formData.append('email', data.email || '')
          if (data.avatar) {
            formData.append('avatar', data.avatar)
          }
        }
        return await adminAPI.createTeacher(formData)
      } catch (error) {
        throw error
      }
    },

    async fetchResourceReviewList({ commit }, params = {}) {
      try {
        const response = await adminAPI.getResourceReviewList({ ...defaultAdminPaging, ...(params || {}) })
        const list = extractList(response?.data, ['resource_review_list', 'resourceReviewList'])
        const normalized = mapReviewList(list, '资源')
        commit('SET_PENDING_RESOURCES', normalized)
        return normalized
      } catch (error) {
        throw error
      }
    },

    async fetchCourseReviewList({ commit }, params = {}) {
      try {
        const response = await adminAPI.getCourseReviewList({ ...defaultAdminPaging, ...(params || {}) })
        const list = extractList(response?.data, ['course_review_list', 'review_list'])
        const normalized = mapReviewList(list, '课程')
        commit('SET_PENDING_COURSE_REVIEWS', normalized)
        return normalized
      } catch (error) {
        throw error
      }
    },

    async fetchCourseCommentReviewList({ commit }, params = {}) {
      try {
        const response = await adminAPI.getCourseCommentReviewList({ ...defaultAdminPaging, ...(params || {}) })
        const list = extractList(response?.data, ['comment_audit_list', 'course_comment_review_list'])
        const normalized = mapReviewList(list, '课程评论')
        commit('SET_PENDING_COURSE_COMMENT_REVIEWS', normalized)
        return normalized
      } catch (error) {
        throw error
      }
    },

    async fetchResourceCommentReviewList({ commit }, params = {}) {
      try {
        const response = await adminAPI.getResourceCommentReviewList({ ...defaultAdminPaging, ...(params || {}) })
        const list = extractList(response?.data, ['comment_audit_list', 'resource_comment_review_list'])
        const normalized = mapReviewList(list, '资源评论')
        commit('SET_PENDING_RESOURCE_COMMENT_REVIEWS', normalized)
        return normalized
      } catch (error) {
        throw error
      }
    },

    async processResourceReview({ dispatch }, { reviewId, action }) {
      try {
        await adminAPI.processResourceReview(reviewId, action)
        await dispatch('fetchResourceReviewList')
      } catch (error) {
        throw error
      }
    },

    async processCourseReview({ dispatch }, { reviewId, action }) {
      try {
        await adminAPI.processCourseReview(reviewId, action)
        await dispatch('fetchCourseReviewList')
      } catch (error) {
        throw error
      }
    },

    async processCourseCommentReview({ dispatch }, { reviewId, action }) {
      try {
        await adminAPI.processCourseCommentReview(reviewId, action)
        await dispatch('fetchCourseCommentReviewList')
      } catch (error) {
        throw error
      }
    },

    async processResourceCommentReview({ dispatch }, { reviewId, action }) {
      try {
        await adminAPI.processResourceCommentReview(reviewId, action)
        await dispatch('fetchResourceCommentReviewList')
      } catch (error) {
        throw error
      }
    },

    async fetchPermissions({ commit }, params = {}) {
      try {
        const response = await adminAPI.getPermissions(params)
        const list = extractList(response?.data, ['permissions'])
        commit('SET_ADMIN_PERMISSIONS', list)
        return list
      } catch (error) {
        throw error
      }
    },

    async fetchRoles({ commit }, params = {}) {
      try {
        const response = await adminAPI.getRoles(params)
        const list = extractList(response?.data, ['roles'])
        commit('SET_ADMIN_ROLES', list)
        return list
      } catch (error) {
        throw error
      }
    },

    async createRole({ dispatch }, payload) {
      try {
        await adminAPI.createRole(payload)
        await dispatch('fetchRoles')
      } catch (error) {
        throw error
      }
    },

    async deleteAdminCourse(_, courseId) {
      try {
        return await adminAPI.deleteCourse(courseId)
      } catch (error) {
        throw error
      }
    },

    async deleteAdminResource(_, resourceId) {
      try {
        return await adminAPI.deleteResource(resourceId)
      } catch (error) {
        throw error
      }
    },

    async deleteAdminResourceComment(_, commentId) {
      try {
        return await adminAPI.deleteResourceComment(commentId)
      } catch (error) {
        throw error
      }
    },

    async deleteAdminCourseComment(_, commentId) {
      try {
        return await adminAPI.deleteCourseComment(commentId)
      } catch (error) {
        throw error
      }
    },

    async deleteAdminResourceRating(_, ratingId) {
      try {
        return await adminAPI.deleteResourceRating(ratingId)
      } catch (error) {
        throw error
      }
    },

    async deleteAdminCourseRating(_, ratingId) {
      try {
        return await adminAPI.deleteCourseRating(ratingId)
      } catch (error) {
        throw error
      }
    },

    async createShopProduct(_, payload) {
      try {
        return await adminAPI.createShopProduct(payload)
      } catch (error) {
        throw error
      }
    },

    async deleteShopProducts(_, ids) {
      try {
        return await adminAPI.deleteShopProducts(ids)
      } catch (error) {
        throw error
      }
    },

    async deleteShopCategory(_, id) {
      try {
        return await adminAPI.deleteShopCategory(id)
      } catch (error) {
        throw error
      }
    },

    async updateShopInventory(_, payload) {
      try {
        const { id, ...rest } = payload || {}
        if (!id) throw new Error('缺少商品ID')
        return await adminAPI.updateInventory(id, rest)
      } catch (error) {
        throw error
      }
    },

    async fetchStatistics({ commit }) {
      try {
        const response = await adminAPI.getStatistics()
        commit('SET_STATISTICS', response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    // 通知相关
    async fetchNotifications({ commit }, params = {}) {
      try {
        commit('SET_LOADING', { key: 'notifications', value: true })
        commit('CLEAR_ERROR')
        const { notificationAPI } = await import('../api/notification')
        const response = await notificationAPI.getNotifications(params)
        const data = response?.data
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.data?.notifications)
              ? data.data.notifications
              : Array.isArray(data?.notifications)
                ? data.notifications
                : []
        commit('SET_NOTIFICATIONS', list)
        const unread = list.filter(n => !n.isRead).length
        commit('SET_UNREAD_NOTIFICATIONS_COUNT', unread)
        return list
      } catch (error) {
        const msg = error?.response?.data?.baseResponse?.message || error.message || '获取通知失败'
        commit('SET_ERROR', msg)
        throw new Error(msg)
      } finally {
        commit('SET_LOADING', { key: 'notifications', value: false })
      }
    },

    async fetchUnreadNotificationsCount({ commit }) {
      try {
        commit('SET_LOADING', { key: 'notificationsUnread', value: true })
        commit('CLEAR_ERROR')
        const { notificationAPI } = await import('../api/notification')
        const response = await notificationAPI.getUnreadCount()
        const count = response?.data?.count ?? response?.data?.data?.count ?? response?.data?.unread ?? 0
        commit('SET_UNREAD_NOTIFICATIONS_COUNT', count)
        return count
      } catch (error) {
        const msg = error?.response?.data?.baseResponse?.message || error.message || '获取未读数量失败'
        commit('SET_ERROR', msg)
        throw new Error(msg)
      } finally {
        commit('SET_LOADING', { key: 'notificationsUnread', value: false })
      }
    },

    async markNotificationAsRead({ commit }, notificationId) {
      try {
        commit('CLEAR_ERROR')
        const { notificationAPI } = await import('../api/notification')
        await notificationAPI.markAsRead(notificationId)
        commit('MARK_NOTIFICATION_READ', notificationId)
      } catch (error) {
        const msg = error?.response?.data?.baseResponse?.message || error.message || '标记通知已读失败'
        commit('SET_ERROR', msg)
        throw new Error(msg)
      }
    },

    async markAllNotificationsAsRead({ commit }) {
      try {
        commit('CLEAR_ERROR')
        const { notificationAPI } = await import('../api/notification')
        await notificationAPI.markAllAsRead()
        commit('MARK_ALL_NOTIFICATIONS_READ')
      } catch (error) {
        const msg = error?.response?.data?.baseResponse?.message || error.message || '全部标记已读失败'
        commit('SET_ERROR', msg)
        throw new Error(msg)
      }
    },

    async deleteNotification({ commit }, notificationId) {
      try {
        commit('CLEAR_ERROR')
        const { notificationAPI } = await import('../api/notification')
        await notificationAPI.deleteNotification(notificationId)
        commit('REMOVE_NOTIFICATION', notificationId)
      } catch (error) {
        const msg = error?.response?.data?.baseResponse?.message || error.message || '删除通知失败'
        commit('SET_ERROR', msg)
        throw new Error(msg)
      }
    }
  },
  
  getters: {
    // 认证相关
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.currentUser,
    token: (state) => state.token,
    
    filteredCourses: (state) => {
      let filtered = state.courses
      
      if (state.filters.college !== '全部学院') {
        filtered = filtered.filter(course => course.college === state.filters.college)
      }
      
      if (state.filters.credits !== '不限学分') {
        const credits = parseInt(state.filters.credits)
        filtered = filtered.filter(course => course.credits === credits)
      }
      
      if (state.filters.rating !== '全部评分') {
        const minRating = parseFloat(state.filters.rating.replace('分以上', ''))
        filtered = filtered.filter(course => course.rating >= minRating)
      }
      
      if (state.searchKeyword) {
        filtered = filtered.filter(course => 
          course.title.includes(state.searchKeyword) ||
          course.instructor.includes(state.searchKeyword) ||
          course.description.includes(state.searchKeyword)
        )
      }
      
      return filtered
    },
    
    filteredResources: (state) => {
      let filtered = state.resources

      // 课程筛选
      if (state.filters.courseTitle && state.filters.courseTitle !== '全部课程') {
        filtered = filtered.filter(resource => resource.course === state.filters.courseTitle)
      }

      // 类型筛选
      if (state.filters.resourceType && state.filters.resourceType !== '全部类型') {
        filtered = filtered.filter(resource => resource.type === state.filters.resourceType)
      }

      // 评分筛选
      if (state.filters.resourceRating && state.filters.resourceRating !== '全部评分') {
        const minRating = parseFloat(state.filters.resourceRating.replace('分以上', ''))
        filtered = filtered.filter(resource => resource.rating >= minRating)
      }

      // 关键词筛选
      if (state.searchKeyword) {
        filtered = filtered.filter(resource => 
          resource.title.includes(state.searchKeyword) ||
          resource.course.includes(state.searchKeyword) ||
          resource.author.includes(state.searchKeyword)
        )
      }
      
      return filtered
    }
    ,
    // 通知相关
    notifications: (state) => state.notifications,
    unreadNotificationsCount: (state) => state.unreadNotificationsCount
  }
})








