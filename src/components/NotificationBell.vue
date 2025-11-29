<template>
  <div class="relative" v-click-outside="closeDropdown">
    <!-- 铃铛图标 -->
    <button 
      @click="toggleDropdown" 
      class="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors duration-200"
    >
      <span class="iconify w-6 h-6" data-icon="mdi:bell-outline"></span>
      <!-- 未读角标 -->
      <span 
        v-if="unreadCount > 0" 
        class="absolute top-1 right-1 flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[1rem] h-4 transform translate-x-1/4 -translate-y-1/4"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- 下拉列表 -->
    <div 
      v-if="isOpen" 
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-100 overflow-hidden"
    >
      <!-- 头部 -->
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <h3 class="text-sm font-semibold text-gray-700">通知</h3>
        <button 
          v-if="unreadCount > 0"
          @click="markAllRead" 
          class="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          全部已读
        </button>
      </div>

      <!-- 列表内容 -->
      <div class="max-h-96 overflow-y-auto custom-scrollbar">
        <div v-if="loading" class="py-8 text-center text-gray-500">
          <span class="iconify animate-spin w-5 h-5 mx-auto mb-2" data-icon="mdi:loading"></span>
          <p class="text-xs">加载中...</p>
        </div>
        
        <template v-else-if="notifications && notifications.length > 0">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150 relative group"
            :class="{ 'bg-blue-50/30': !notification.isRead }"
          >
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-sm font-medium text-gray-800 line-clamp-1 w-3/4" :class="{ 'font-bold': !notification.isRead }">
                {{ notification.title }}
              </h4>
              <span class="text-xs text-gray-400 whitespace-nowrap ml-2">{{ formatDate(notification.createdAt) }}</span>
            </div>
            <p class="text-xs text-gray-600 line-clamp-2 mb-2">{{ notification.content }}</p>
            
            <!-- 操作按钮 -->
            <div class="flex justify-end space-x-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
               <button 
                v-if="!notification.isRead"
                @click.stop="markRead(notification.id)" 
                class="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                title="标记已读"
              >
                <span class="iconify mr-1" data-icon="mdi:check"></span>
                已读
              </button>
              <button 
                @click.stop="removeNotification(notification.id)" 
                class="text-xs text-red-500 hover:text-red-700 flex items-center"
                title="删除"
              >
                <span class="iconify mr-1" data-icon="mdi:delete-outline"></span>
                删除
              </button>
            </div>
            
            <!-- 未读红点 -->
            <span v-if="!notification.isRead" class="absolute top-3 left-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </div>
        </template>

        <!-- 空状态 -->
        <div v-else class="py-8 text-center text-gray-500">
          <span class="iconify w-8 h-8 mx-auto mb-2 text-gray-300" data-icon="mdi:bell-off-outline"></span>
          <p class="text-xs">暂无通知</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'NotificationBell',
  data() {
    return {
      isOpen: false,
      pollingInterval: null,
      pollingDelay: 30000, // 30秒轮询一次
      isVisible: true
    }
  },
  computed: {
    ...mapState({
        loading: state => state.loading.notifications
    }),
    ...mapGetters({
        notifications: 'notifications',
        unreadCount: 'unreadNotificationsCount'
    })
  },
  created() {
    // 初始加载未读数量
    this.fetchUnreadNotificationsCount()
    
    // 启动轮询
    this.startPolling()
    
    // 监听页面可见性
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  },
  beforeDestroy() {
    this.stopPolling()
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  },
  methods: {
    ...mapActions([
      'fetchNotifications',
      'fetchUnreadNotificationsCount',
      'markNotificationAsRead',
      'markAllNotificationsAsRead',
      'deleteNotification'
    ]),
    
    toggleDropdown() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.fetchNotifications() // 打开时加载列表
      }
    },
    
    closeDropdown() {
      this.isOpen = false
    },
    
    async markRead(id) {
      await this.markNotificationAsRead(id)
      // 如果在列表中操作，可能需要重新计算未读数或者本地更新，
      // 这里假设 vuex actions 已经处理了本地状态更新
    },
    
    async markAllRead() {
      await this.markAllNotificationsAsRead()
    },
    
    async removeNotification(id) {
      await this.deleteNotification(id)
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      if (days < 30) return `${days}天前`
      return date.toLocaleDateString()
    },
    
    startPolling() {
      if (this.pollingInterval) return
      this.pollingInterval = setInterval(() => {
        // 仅当页面可见且下拉框关闭时轮询，避免打扰用户操作
        if (this.isVisible && !this.isOpen) { 
            this.fetchUnreadNotificationsCount()
        }
      }, this.pollingDelay)
    },
    
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    },
    
    handleVisibilityChange() {
      this.isVisible = !document.hidden
      if (this.isVisible) {
        this.fetchUnreadNotificationsCount()
        this.startPolling()
      } else {
        this.stopPolling()
      }
    }
  },
  directives: {
    clickOutside: {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db; 
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af; 
}
</style>