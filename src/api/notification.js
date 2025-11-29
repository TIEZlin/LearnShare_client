import api from './index'
import { mockNotificationAPI } from './mockNotifications'

// 强制使用 Mock 数据用于演示
const USE_MOCK = true

// 通知相关API
export const notificationAPI = USE_MOCK ? mockNotificationAPI : {
  // 获取通知列表
  getNotifications(params = {}) {
    return api.get('/notifications', { params })
  },

  // 标记通知为已读
  markAsRead(notificationId) {
    return api.put(`/notifications/${notificationId}/read`)
  },

  // 标记所有通知为已读
  markAllAsRead() {
    return api.put('/notifications/read-all')
  },

  // 删除通知
  deleteNotification(notificationId) {
    return api.delete(`/notifications/${notificationId}`)
  },

  // 获取未读通知数量
  getUnreadCount() {
    return api.get('/notifications/unread-count')
  }
}
