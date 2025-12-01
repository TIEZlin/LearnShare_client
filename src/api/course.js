import api from './index'

// 课程相关API
export const courseAPI = {
  // 获取课程列表
  getCourses(params = {}) {
    return api.get('/courses', { params })
  },

  // 获取课程详情
  getCourseById(id) {
    return api.get(`/courses/${id}`)
  },

  // LearnShare1.md: 课程详情（文档版结构）
  getCourseDetailsDoc(courseId) {
    return api.get(`/courses/${courseId}/details`)
  },

  // 搜索课程
  searchCourses(keyword, filters = {}) {
    const params = { keyword }
    
    // 转换过滤器参数为API要求的格式
    if (filters) {
      if (filters.collegeId) params.collegeId = filters.collegeId
      if (filters.grade) params.grade = filters.grade
      if (filters.minRating) params.minRating = filters.minRating
      if (filters.pageSize) params.page_size = filters.pageSize
      if (filters.pageNum) params.page_num = filters.pageNum
      
      // 处理原生API参数名
      if (filters.page_size) params.page_size = filters.page_size
      if (filters.page_num) params.page_num = filters.page_num
    }
    
    return api.get('/courses/search', { params })
  },

  // LearnShare1.md: 搜索课程（文档版参数名）
  searchCoursesDoc(params = {}) {
    // 支持 keywords、collegeId、grade、minRating、page_size、page_num
    return api.get('/courses/search', { params })
  },

  // LearnShare1.md: 获取课程资源列表
  getCourseResourcesDoc(courseId, params = {}) {
    return api.get(`/courses/${courseId}/resources`, { params })
  },

  // 获取用户收藏的课程
  getFavoriteCourses() {
    return api.get('/courses/favorites')
  },

  // 收藏/取消收藏课程
  toggleFavorite(courseId) {
    return api.post(`/courses/${courseId}/favorite`)
  },


  getCourseComments(courseId, params = {}, config = {}) {
    // 根据API文档，确保包含必需参数
    const defaultParams = {
      page_size: 20,
      page_num: 1
    }
    
    // 合并默认参数和用户提供的参数
    const mergedParams = { ...defaultParams, ...(params || {}) }
    const cfg = { params: mergedParams, ...(config || {}) }
    
    return api.get(`/courses/${courseId}/comments`, cfg).catch((err) => {
      const status = err?.response?.status
      if (status === 404 || status === 405) {
        console.warn('[getCourseComments] /courses/:id/comments 未实现，尝试 /course_comments?courseId=:id', { courseId })
        const cfg2 = { params: { courseId, ...mergedParams }, ...(config || {}) }
        return api.get('/course_comments', cfg2).catch((err2) => {
          const s2 = err2?.response?.status
          if (s2 === 404 || s2 === 405) {
            console.warn('[getCourseComments] /course_comments 未实现，尝试 /courses/:id/reviews', { courseId })
            return api.get(`/courses/${courseId}/reviews`, cfg)
          }
          return Promise.reject(err2)
        })
      }
      return Promise.reject(err)
    })
  },



  // 提交课程评论（支持 FormData 或 Node form-data）
  // 示例后端路径: POST /course_comments/ (
  submitCourseComment(commentData, config = {}) {
    const cfg = { ...(config || {}) }
    // 如果是 node 的 form-data，它会提供 getHeaders()
    if (commentData && typeof commentData.getHeaders === 'function') {
      cfg.headers = { ...(cfg.headers || {}), ...commentData.getHeaders() }
    }
    return api.post('/course_comments', commentData, cfg)
  },

  // 删除课程评论
  // 支持两种用法：
  //  - deleteCourseComment(commentId) -> DELETE /course_comments/:id
  //  - deleteCourseComment() -> DELETE /course_comments (后端根据 token 删除当前用户的评论或批量删除)
  deleteCourseComment(commentId, config = {}) {
    const cfg = { ...(config || {}) }
    if (commentId) {
      return api.delete(`/course_comments/${commentId}`, cfg)
    }
    return api.delete('/course_comments', cfg)
  },

  // 提交课程评分（兼容后端 /course_ratings/ 路径）
  likeCourseComment(commentId, config = {}) {
    return api.post(`/course_comments/${commentId}/like`, null, config)
  },
  unlikeCourseComment(commentId, config = {}) {
    return api.delete(`/course_comments/${commentId}/like`, config)
  },
  submitCourseRating(ratingData, config = {}) {
    const cfg = { ...(config || {}) }
    // Node form-data 有 getHeaders()，将其 headers 合并
    if (ratingData && typeof ratingData.getHeaders === 'function') {
      cfg.headers = { ...(cfg.headers || {}), ...ratingData.getHeaders() }
    }
    return api.post('/course_ratings', ratingData, cfg)
  },

  // 删除课程评分
  // 支持两种用法：
  //  - deleteCourseRating(ratingId) -> DELETE /course_ratings/:id
  //  - deleteCourseRating() -> DELETE /course_ratings (后端根据 token 删除当前用户的评分或批量删除)
  deleteCourseRating(ratingId, config = {}) {
    const cfg = { ...(config || {}) }
    if (ratingId) {
      return api.delete(`/course_ratings/${ratingId}`, cfg)
    }
    return api.delete('/course_ratings', cfg)
  },

  // 获取我的课程
  getMyCourses() {
    return api.get('/courses/my-courses')
  },

  // 选课
  enrollCourse(courseId) {
    return api.post(`/courses/${courseId}/enroll`)
  },

  // 退课
  dropCourse(courseId) {
    return api.delete(`/courses/${courseId}/enroll`)
  }
}

