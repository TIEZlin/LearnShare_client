import api from './index'

// 资源相关API
export const resourceAPI = {
  // 获取资源列表
  getResources(params = {}) {
    return api.get('/resources', { params })
  },

  // 获取资源详情
  getResourceById(id) {
    return api.get(`/resources/${id}`)
  },

  // 搜索资源（兼容：传入 keyword+filters 或直接传入完整 params）
  searchResources(keywordOrParams, filters = {}) {
    const params = typeof keywordOrParams === 'object'
      ? (keywordOrParams || {})
      : { keyword: keywordOrParams, ...filters }
    // 文档参数：keyword, tagId, sortBy, course_id, page_size, page_num
    return api.get('/resources/search', { params })
  },

  // 上传资源（multipart/form-data）
  // 支持两种用法：
  //  1) 直接传入 FormData
  //  2) 传入普通对象：{ file, title, description, course_id, tags }
  uploadResource(resourceData, config = {}) {
    let body = resourceData
    const cfg = { ...(config || {}) }
    const isFormData = typeof FormData !== 'undefined' && resourceData instanceof FormData
    if (!isFormData) {
      body = new FormData()
      if (resourceData && typeof resourceData === 'object') {
        if (resourceData.file !== undefined) body.append('file', resourceData.file)
        if (resourceData.title !== undefined) body.append('title', resourceData.title)
        if (resourceData.description !== undefined) body.append('description', resourceData.description)
        if (resourceData.course_id !== undefined) body.append('course_id', resourceData.course_id)
        // 文档 tags 为 [string]，既兼容数组也兼容逗号分隔字符串
        if (resourceData.tags !== undefined) {
          const tags = Array.isArray(resourceData.tags)
            ? resourceData.tags
            : String(resourceData.tags).split(',').map(s => s.trim()).filter(Boolean)
          tags.forEach(t => body.append('tags', t))
        }
      }
    }
    cfg.headers = { ...(cfg.headers || {}), 'Content-Type': 'multipart/form-data' }
    return api.post('/resources', body, cfg)
  },

  // 更新资源信息
  updateResource(id, resourceData) {
    return api.put(`/resources/${id}`, resourceData)
  },

  // 删除资源
  deleteResource(id) {
    return api.delete(`/resources/${id}`)
  },

  // 下载资源
  downloadResource(id) {
    // 文档返回 { download_url }，前端可自行跳转
    return api.get(`/resources/${id}/download`)
  },

  // 举报资源（POST /resources/{resource_id}/report）
  reportResource(resourceId, reason) {
    return api.post(`/resources/${resourceId}/report`, { reason })
  },

  // 获取资源评价
  getResourceReviews(resourceId, params = {}) {
    return api.get(`/resources/${resourceId}/reviews`, { params })
  },

  // 获取资源评论（支持分页 params & 回退到 reviews 路径）
  getResourceComments(resourceId, params = {}, config = {}) {
    const cfg = { params, ...(config || {}) }
    
    // 1. 首先尝试API文档中指定的正确路径：/api/resource/{resource_id}/comment
    return api.get(`/resource/${resourceId}/comment`, cfg).catch((err) => {
      const status = err?.response?.status
      if (status === 404 || status === 405) {
        console.warn('[getResourceComments] /api/resource/:id/comment 未实现，尝试 /resource_comments/{resource_id}', { resourceId })
        
        // 2. 尝试其他可能的路径
        return api.get(`/resource_comments/${resourceId}`, cfg).catch((err2) => {
          const s2 = err2?.response?.status
          if (s2 === 404 || s2 === 405) {
            console.warn('[getResourceComments] /resource_comments/:id 未实现，尝试 /resources/:id/comments', { resourceId })
            
            // 3. 尝试标准REST路径
            return api.get(`/resources/${resourceId}/comments`, cfg).catch((err3) => {
              const s3 = err3?.response?.status
              if (s3 === 404 || s3 === 405) {
                console.warn('[getResourceComments] /resources/:id/comments 未实现，尝试 /resource_comments?resourceId=:id', { resourceId })
                const cfg2 = { params: { resourceId, ...(params || {}) }, ...(config || {}) }
                
                // 4. 尝试查询参数路径
                return api.get('/resource_comments', cfg2).catch((err4) => {
                  const s4 = err4?.response?.status
                  if (s4 === 404 || s4 === 405) {
                    console.warn('[getResourceComments] /resource_comments 未实现，尝试 /resources_comments?resourceId=:id', { resourceId })
                    
                    // 5. 尝试复数形式的查询参数路径
                    return api.get('/resources_comments', cfg2).catch((err5) => {
                      const s5 = err5?.response?.status
                      if (s5 === 404 || s5 === 405) {
                        console.warn('[getResourceComments] 所有评论路径未实现，尝试 /resources/:id/reviews', { resourceId })
                        
                        // 6. 最后尝试reviews路径作为回退
                        return api.get(`/resources/${resourceId}/reviews`, cfg)
                      }
                      return Promise.reject(err5)
                    })
                  }
                  return Promise.reject(err4)
                })
              }
              return Promise.reject(err3)
            })
          }
          return Promise.reject(err2)
        })
      }
      return Promise.reject(err)
    })
  },



  // 提交资源评论（根据API文档使用正确路径：POST /resource_comments/{resource_id}）
  // commentData 可以是浏览器的 FormData 或 node 的 form-data 实例
  submitResourceComment(commentData, config = {}) {
    const cfg = { ...(config || {}) }
    // 如果是 node 的 form-data，它会提供 getHeaders()
    if (commentData && typeof commentData.getHeaders === 'function') {
      cfg.headers = { ...(cfg.headers || {}), ...commentData.getHeaders() }
      // 如果是FormData，直接使用
      const resourceId = commentData?.get('resourceId') || commentData?.get('resource_id');
      if (!resourceId) {
        return Promise.reject(new Error('提交评论时缺少resource_id参数'));
      }
      return api.post(`/resource_comments/${resourceId}`, commentData, cfg);
    }
    
    // 从commentData中提取resource_id
    const resourceId = commentData?.resource_id || commentData?.resourceId;
    if (!resourceId) {
      return Promise.reject(new Error('提交评论时缺少resource_id参数'));
    }
    
    // 只发送后端期望的字段，避免发送resourceId
    const requestBody = {
      content: commentData.content,
      rating: commentData.rating
    };
    
    return api.post(`/resource_comments/${resourceId}`, requestBody, cfg)
  },

  // 提交资源评分（根据API文档使用正确路径：POST /resource_ratings/{resource_id}）
  // ratingData 可以是浏览器的 FormData 或 node 的 form-data 实例
  submitResourceRating(ratingData, config = {}) {
    const cfg = { ...(config || {}) }
    // 如果是 node 的 form-data，它会提供 getHeaders()
    if (ratingData && typeof ratingData.getHeaders === 'function') {
      cfg.headers = { ...(cfg.headers || {}), ...ratingData.getHeaders() }
      // 如果是FormData，直接使用
      const resourceId = ratingData?.get('resourceId') || ratingData?.get('resource_id');
      if (!resourceId) {
        return Promise.reject(new Error('提交评分时缺少resource_id参数'));
      }
      return api.post(`/resource_ratings/${resourceId}`, ratingData, cfg);
    }
    
    // 从ratingData中提取resource_id
    const resourceId = ratingData?.resource_id || ratingData?.resourceId;
    if (!resourceId) {
      return Promise.reject(new Error('提交评分时缺少resource_id参数'));
    }
    
    // 只发送后端期望的字段，避免发送resourceId
    const requestBody = {
      rating: ratingData.rating
    };
    
    return api.post(`/resource_ratings/${resourceId}`, requestBody, cfg)
  },

  // 删除资源评分
  // 支持两种用法：
  //  - deleteResourceRating(ratingId) -> DELETE /resource_ratings/{rating_id} (根据API文档)
  //  - deleteResourceRating() -> DELETE /resource_ratings (后端根据 token 删除当前用户的评分或批量删除)
  deleteResourceRating(ratingId, config = {}) {
    const cfg = { ...(config || {}) }
    if (ratingId) {
      return api.delete(`/resource_ratings/${ratingId}`, cfg)
    }
    return api.delete('/resource_ratings', cfg)
  },

  // 删除资源评论
  // 用法：
  //  - deleteResourceComment(commentId) -> DELETE /resource_comments/{comment_id} (根据API文档)
  //  - deleteResourceComment(null, params) -> DELETE /resource_comments?...
  // 同时对路径 /resources_comments 做回退兼容
  deleteResourceComment(commentId, params = {}, config = {}) {
    const cfg = { ...(config || {}) }
    if (commentId) {
      return api.delete(`/resource_comments/${commentId}`, cfg).catch((err) => {
        const status = err?.response?.status
        if (status === 404 || status === 405) {
          return api.delete(`/resources_comments/${commentId}`, cfg)
        }
        return Promise.reject(err)
      })
    }
    const cfgWithParams = { params: params || {}, ...(config || {}) }
    return api.delete('/resource_comments', cfgWithParams).catch((err) => {
      const status = err?.response?.status
      if (status === 404 || status === 405) {
        return api.delete('/resources_comments', cfgWithParams)
      }
      return Promise.reject(err)
    })
  },
  // 资源评论点赞
  // 根据API文档：POST /api/resource_comments/{comment_id}/likes
  likeResourceComment(commentId, config = {}) {
    // 构建请求体，根据API文档需要提供action参数
    const data = { action: 'like' }
    return api.post(`/resource_comments/${commentId}/likes`, data, config)
  },
  
  // 资源评论取消点赞
  // 根据API文档：POST /api/resource_comments/{comment_id}/likes，action设为cancel_like
  unlikeResourceComment(commentId, config = {}) {
    // 构建请求体，根据API文档需要提供action参数
    const data = { action: 'cancel_like' }
    return api.post(`/resource_comments/${commentId}/likes`, data, config)
  },
  // 获取我的资源
  getMyResources() {
    return api.get('/resources/my-resources')
  },

  // 获取收藏的资源
  getFavoriteResources() {
    return api.get('/resources/favorites')
  },

  // 收藏/取消收藏资源
  toggleFavorite(resourceId) {
    return api.post(`/resources/${resourceId}/favorite`)
  },

  // 获取资源统计
  getResourceStats(resourceId) {
    return api.get(`/resources/${resourceId}/stats`)
  }
}