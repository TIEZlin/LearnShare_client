// 本地模拟通知数据
let notifications = [
  {
    id: 1,
    title: '课程评分提醒',
    content: '您选修的《高级Web开发》课程已结课，请前往评价。',
    type: 'course',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30分钟前
  },
  {
    id: 2,
    title: '新资源推荐',
    content: '根据您的兴趣，为您推荐了新的前端学习资源。',
    type: 'resource',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2小时前
  },
  {
    id: 3,
    title: '系统维护通知',
    content: '系统将于本周日凌晨 2:00 进行例行维护，预计耗时 2 小时。',
    type: 'system',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1天前
  },
  {
    id: 4,
    title: '选课截止提醒',
    content: '《算法设计与分析》选课将于明天截止，请及时确定。',
    type: 'course',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2天前
  }
]

export const mockNotificationAPI = {
  getNotifications(params = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...notifications]
        
        // 简单的过滤逻辑（如果有需要）
        if (params.read !== undefined) {
            // params.read 可能是字符串 "false" 或布尔值
            const isRead = params.read === true || params.read === 'true'
            result = result.filter(n => n.isRead === isRead)
        }

        // 排序
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        resolve({
          data: {
            code: 10000,
            message: 'success',
            data: {
                notifications: result,
                total: result.length
            }
          }
        })
      }, 300)
    })
  },

  getUnreadCount() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const count = notifications.filter(n => !n.isRead).length
        resolve({
          data: {
            code: 10000,
            message: 'success',
            data: {
                count: count
            }
          }
        })
      }, 200)
    })
  },

  markAsRead(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = notifications.find(n => n.id === id)
        if (notification) {
          notification.isRead = true
        }
        resolve({
          data: {
            code: 10000,
            message: 'success'
          }
        })
      }, 200)
    })
  },

  markAllAsRead() {
    return new Promise((resolve) => {
      setTimeout(() => {
        notifications.forEach(n => n.isRead = true)
        resolve({
          data: {
            code: 10000,
            message: 'success'
          }
        })
      }, 300)
    })
  },

  deleteNotification(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        notifications = notifications.filter(n => n.id !== id)
        resolve({
          data: {
            code: 10000,
            message: 'success'
          }
        })
      }, 200)
    })
  }
}
