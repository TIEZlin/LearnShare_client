import api from './index'

// 管理员相关API，参照 guanlier.md 接口文档
export const adminAPI = {
  // —— 学校结构 ——
  createCollege(data) {
    return api.post('/admin/colleges', data)
  },
  createMajor(data) {
    return api.post('/admin/majors', data)
  },
  createTeacher(formData) {
    return api.post('/admin/teachers', formData)
  },

  // —— 用户管理 ——
  getUsers(params = {}) {
    return api.get('/admin/users', { params })
  },
  createUser(userData) {
    return api.post('/admin/users', userData)
  },
  updateUser(userData) {
    return api.put('/admin/users', userData)
  },
  deleteUser(userId) {
    return api.delete(`/admin/users/${userId}`)
  },

  // —— 审核队列 ——
  getResourceReviewList(params = {}) {
    return api.get('/admin/audit/resources', { params })
  },
  processResourceReview(reviewId, action) {
    return api.post(`/admin/audit/resources/${reviewId}`, { action })
  },
  getCourseReviewList(params = {}) {
    return api.get('/admin/audit/courses', { params })
  },
  processCourseReview(reviewId, action) {
    return api.post(`/admin/audit/courses/${reviewId}`, { action })
  },
  getCourseCommentReviewList(params = {}) {
    return api.get('/admin/audit/course_comments', { params })
  },
  processCourseCommentReview(reviewId, action) {
    return api.post(`/admin/audit/course_comments/${reviewId}`, { action })
  },
  getResourceCommentReviewList(params = {}) {
    return api.get('/admin/audit/resource_comments', { params })
  },
  processResourceCommentReview(reviewId, action) {
    return api.post(`/admin/audit/resource_comments/${reviewId}`, { action })
  },

  // —— 权限/角色 ——
  getPermissions(params = {}) {
    return api.get('/admin/permissions', { params })
  },
  getRoles(params = {}) {
    return api.get('/admin/roles', { params })
  },
  createRole(roleData) {
    return api.post('/admin/roles', roleData)
  },

  // —— 课程/资源管理 ——
  deleteCourse(courseId) {
    return api.delete(`/admin/courses/${courseId}`)
  },
  deleteResource(resourceId) {
    return api.delete(`/admin/resources/${resourceId}`)
  },
  deleteResourceComment(commentId) {
    return api.delete(`/admin/resource_comments/${commentId}`)
  },
  deleteCourseComment(commentId) {
    return api.delete(`/admin/course_comments/${commentId}`)
  },
  deleteResourceRating(ratingId) {
    return api.delete(`/admin/resource_ratings/${ratingId}`)
  },
  deleteCourseRating(ratingId) {
    return api.delete(`/admin/course_ratings/${ratingId}`)
  },

  // —— 商城 ——
  createShopProduct(productData) {
    return api.post('/admin/shop/products', productData)
  },
  deleteShopProducts(ids = []) {
    return api.delete('/admin/shop/products', {
      params: { id: ids }
    })
  },
  deleteShopCategory(id) {
    return api.delete('/admin/shop/categories', { params: { id } })
  },
  updateInventory(id, payload) {
    return api.put(`/admin/shop/inventory/${id}`, payload)
  },

  // —— 统计/日志（沿用原有接口） ——
  getStatistics() {
    return api.get('/admin/statistics')
  },
  getSystemLogs(params = {}) {
    return api.get('/admin/logs', { params })
  }
}

