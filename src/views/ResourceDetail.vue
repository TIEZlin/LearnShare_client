<template>
  <div class="px-8 py-6" v-if="displayResource">
    <!-- 返回资源广场按钮 -->
    <div class="mb-4">
      <button 
        @click="$router.push('/resources')"
        class="btn-secondary flex items-center mb-4"
      >
        <span class="iconify mr-2" data-icon="mdi:arrow-left"></span>
        返回资源广场
      </button>
    </div>
    
    <div class="grid grid-cols-3 gap-8">
      <!-- 左侧资源信息 -->
      <div class="col-span-1">
        <div class="card p-6">
          <div class="flex items-center mb-4">
            <div 
              class="rounded-md flex items-center justify-center p-3 mr-4"
              :class="getTypeClass(displayResource.type)"
            >
              <span 
                class="iconify text-3xl"
                :class="getTypeColor(displayResource.type)"
                :data-icon="getTypeIcon(displayResource.type)"
              ></span>
            </div>
            <div>
              <h1 class="text-2xl font-bold mb-1">{{ displayResource.title }}</h1>
            </div>
          </div>
          <div class="flex justify-between items-center text-sm mb-4">
            <div class="flex items-center">
            </div>
            <div class="flex items-center">
              <span class="iconify mr-1" data-icon="mdi:download"></span>
              <span>{{ displayResource.downloads }}次下载</span>
            </div>
          </div>
          <div class="flex items-center">
            <div class="star-rating flex mr-2">
            </div>
          </div>
        </div>

        <!-- 新增：作者信息卡片 -->
        <div class="card p-6 mt-6" v-if="authorInfo">
          <h3 class="text-lg font-bold mb-3">作者信息</h3>
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
              <img 
                v-if="authorInfo.avatar_url"
                :src="authorInfo.avatar_url" 
                :alt="authorInfo.username" 
                class="w-full h-full object-cover"
              >
              <span v-else class="iconify text-2xl flex items-center justify-center w-full h-full text-gray-500" data-icon="mdi:account"></span>
            </div>
            <div>
              <h4 class="font-bold">{{ authorInfo.username }}</h4>
              <p class="text-sm text-gray-600">{{ authorInfo.email }}</p>
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center">
              <span class="iconify mr-2 text-gray-500" data-icon="mdi:trophy"></span>
              <span>信誉分：{{ authorInfo.reputation_score || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- 新增：资源操作 + 文件信息 -->
        <div class="card p-6 mt-6">
          <h3 class="text-lg font-bold mb-3 dark:text-white">资源操作</h3>
          <div class="flex space-x-2 mb-4">
            <button class="btn-primary flex items-center" @click="downloadResource">
              <span class="iconify mr-2" data-icon="mdi:download"></span>
              下载资源
            </button>
            <button class="btn-secondary flex items-center" @click="toggleFavorite">
              <span class="iconify mr-2" :data-icon="isFavorite ? 'mdi:heart' : 'mdi:heart-outline'"></span>
              {{ isFavorite ? '已收藏' : '收藏' }}
            </button>
          </div>

          <h3 class="text-lg font-bold mb-3">文件信息</h3>
          <ul class="space-y-2 text-sm text-gray-700">
            <li class="flex items-center"><span class="iconify mr-2" data-icon="mdi:file"></span> 类型：{{ displayResource.type }}</li>
            <li class="flex items-center"><span class="iconify mr-2" data-icon="mdi:account"></span> 作者：{{ authorInfo.username }}</li>
            <li class="flex items-center"><span class="iconify mr-2" data-icon="mdi:download"></span> 下载：{{ displayResource.downloads }}</li>
          </ul>
        </div>

        <!-- 新增：相关资源 -->
        <div class="card p-6 mt-6">
          <h3 class="text-lg font-bold mb-3 dark:text-white">相关资源</h3>
          <div class="space-y-3">
            <div 
              v-for="res in relatedResources" 
              :key="res.id" 
              class="flex items-center justify-between border border-gray-100 dark:border-gray-700 rounded p-2"
            >
              <div>
                <div class="text-sm font-medium dark:text-white">{{ res.title }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ res.course }} · {{ res.semester }}</div>
              </div>
              <button class="btn-secondary text-xs" @click="openResource(res)">查看详情</button>
            </div>
            <div v-if="relatedResources.length === 0" class="text-sm text-gray-500 dark:text-gray-400">暂无相关资源</div>
          </div>
        </div>
      </div>

      <!-- 右侧评分和评论 -->
      <div class="col-span-2">
        <div class="card p-6 mb-8">
          <div class="mb-6">
            <h3 class="font-bold mb-3 dark:text-white">您的评价</h3>
            <div class="mb-4">
              <label class="block text-gray-700 dark:text-gray-300 mb-2">评分</label>
              <div class="star-rating flex space-x-1">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star-char text-2xl"
                  :class="star <= resourceUserRating.rating ? 'active' : 'inactive'"
                  role="button"
                  tabindex="0"
                  :aria-label="`评分${star}星`"
                  @click="setRating(star)"
                  @keydown.enter.prevent="setRating(star)"
                >{{ star <= resourceUserRating.rating ? '★' : '☆' }}</span>
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 dark:text-gray-300 mb-2">评论</label>
              <textarea 
                class="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                v-model="resourceUserRating.comment"
                placeholder="请输入您的评价..."
              ></textarea>
            </div>
            <button class="btn-primary" @click="submit">提交评价</button>
          </div>

          <!-- 评论列表 -->
          <div class="card p-6">
            <h2 class="text-xl font-bold mb-4 dark:text-white">用户评价（{{ resourceComments.length }}条）</h2>
            <div 
              v-for="comment in resourceComments" 
              :key="comment.id"
              class="comment-item"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center">
                  <div class="bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-10 h-10 mr-3"></div>
                  <div>
                    <h4 class="font-bold dark:text-white">{{ comment.author }}</h4>
                    <div class="flex items-center">
                      <div class="star-rating flex mr-2">
                        <span 
                          v-for="star in 5" 
                          :key="star"
                          class="iconify star"
                          :class="{ active: star <= comment.rating }"
                          data-icon="mdi:star"
                        ></span>
                      </div>
                      <span class="text-gray-500 dark:text-gray-400 text-sm">{{ comment.date }}</span>
                    </div>
                  </div>
                </div>
                <!-- 点赞按钮（右侧） -->
                <button
                  class="inline-flex items-center space-x-1 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition transform active:scale-95"
                  :class="comment.liked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
                  @click="toggleResourceCommentLike(comment)"
                  :aria-label="comment.liked ? '取消点赞' : '点赞'"
                >
                  <span class="iconify" :data-icon="comment.liked ? 'mdi:thumb-up' : 'mdi:thumb-up-outline'"></span>
                  <span>{{ comment.likes || 0 }}</span>
                </button>
              </div>
              <p class="text-gray-700 dark:text-gray-300">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { profileAPI } from '../api/profile'

export default {
  name: 'ResourceDetail',
  data() {
    return {
      isFavorite: false,
      authorInfo: null,
      authorLoading: false,
      authorError: null
    }
  },
  computed: {
    ...mapState(['selectedResource', 'resourceComments', 'resourceUserRating']),
    displayResource() {
      // 为selectedResource提供默认值，确保即使数据缺失也能正常显示
      if (!this.selectedResource) {
        return {
          id: '0',
          title: '未知资源',
          course: '未知课程',
          semester: '未知学期',
          author: '未知作者',
          authorId: null,
          downloads: 0,
          rating: 0,
          type: 'unknown'
        }
      }
      return {
        id: this.selectedResource.id || '0',
        title: this.selectedResource.title || '未知资源',
        course: this.selectedResource.course || '未知课程',
        semester: this.selectedResource.semester || '未知学期',
        author: this.selectedResource.author || '未知作者',
        authorId: this.selectedResource.authorId || this.selectedResource.userId || null,
        downloads: this.selectedResource.downloads || 0,
        rating: this.selectedResource.rating || 0,
        type: this.selectedResource.type || 'unknown'
      }
    },
    relatedResources() {
      const list = this.$store.state.resources || []
      const cur = this.selectedResource
      if (!cur) return []
      return list
        .filter(r => r.course === cur.course && r.id !== cur.id)
        .slice(0, 3)
    }
  },
  methods: {
    // 获取作者详细信息
    async fetchAuthorInfo() {
      if (!this.displayResource || !this.displayResource.authorId) {
        console.warn('缺少作者ID，无法获取作者信息');
        return;
      }

      this.authorLoading = true;
      this.authorError = null;

      try {
        const response = await profileAPI.getUserInfo(this.displayResource.authorId);
        // 适配后端返回的数据结构
        if (response && response.data) {
          if (response.data.baseResponse) {
            // 如果有baseResponse结构
            this.authorInfo = response.data.user || {};
          } else {
            // 直接获取用户数据
            this.authorInfo = response.data || {};
          }
          console.log('获取作者信息成功:', this.authorInfo);
        }
      } catch (error) {
        console.error('获取作者信息失败:', error);
        this.authorError = error.message || '获取作者信息失败';
        // 即使获取失败，也可以使用资源中的基本作者信息
      } finally {
        this.authorLoading = false;
      }
    },

    setRating(rating) {
      this.$store.commit('SET_RESOURCE_USER_RATING', {
        rating,
        comment: this.resourceUserRating.comment
      })
    },
    async submit() {
      if (this.resourceUserRating.rating > 0 && this.resourceUserRating.comment.trim()) {
        try {
          await this.$store.dispatch('submitResourceRating', {
            rating: this.resourceUserRating.rating,
            comment: this.resourceUserRating.comment
          })
          alert('评价提交成功！')
        } catch (error) {
          console.error('提交资源评价失败:', {
            status: error?.response?.status,
            data: error?.response?.data,
            url: error?.config?.url
          })
          const msg = error?.response?.data?.message || error?.message || '提交失败，后端报错(500)'
          alert(msg)
        }
      } else {
        alert('请选择评分并填写评论')
      }
    },
    downloadResource() {
      if (!this.displayResource) return
      this.$store.commit('INCREMENT_RESOURCE_DOWNLOADS', this.displayResource.id)
      alert('开始下载（示例）')
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
    },
    openResource(res) {
      this.$store.commit('SET_SELECTED_RESOURCE', res)
      // 当前页面即可刷新详情，无需跳转
    },
    getTypeClass(type) {
      const classes = {
        pdf: 'bg-blue-100 dark:bg-blue-900/30',
        word: 'bg-orange-100 dark:bg-orange-900/30',
        presentation: 'bg-purple-100 dark:bg-purple-900/30',
        excel: 'bg-green-100 dark:bg-green-900/30',
        powerpoint: 'bg-yellow-100 dark:bg-yellow-900/30'
      }
      return classes[type] || 'bg-gray-100 dark:bg-gray-700'
    },
    getTypeColor(type) {
      const colors = {
        pdf: 'text-blue-600 dark:text-blue-400',
        word: 'text-orange-500 dark:text-orange-400',
        presentation: 'text-purple-600 dark:text-purple-400',
        excel: 'text-green-500 dark:text-green-400',
        powerpoint: 'text-yellow-500 dark:text-yellow-400'
      }
      return colors[type] || 'text-gray-500 dark:text-gray-400'
    },
    getTypeIcon(type) {
      const icons = {
        pdf: 'mdi:file-pdf',
        word: 'mdi:file-word',
        presentation: 'mdi:file-presentation',
        excel: 'mdi:file-excel',
        powerpoint: 'mdi:file-powerpoint'
      }
      return icons[type] || 'mdi:file'
    },
    async toggleResourceCommentLike(comment) {
      if (!this.$store.getters.isAuthenticated) {
        this.$root?.$emit?.('message', '请先登录后再点赞', 'error')
        return
      }
      const id = comment.id
      try {
        if (comment.liked) {
          await this.$store.dispatch('unlikeResourceComment', id)
          this.$root?.$emit?.('message', '已取消点赞', 'success')
        } else {
          await this.$store.dispatch('likeResourceComment', id)
          this.$root?.$emit?.('message', '已点赞', 'success')
        }
      } catch (error) {
        const status = error?.response?.status
        const msg = error?.response?.data?.message || error?.message || '操作失败'
        console.error('资源评论点赞操作失败:', { id, likedBefore: comment.liked, status, msg })
        this.$root?.$emit?.('message', msg, 'error')
      }
    }
  },
  watch: {
    '$route.query.id': {
      immediate: true,
      async handler(newId) {
        if (newId) {
          // 1. 尝试从 store 已有的列表中查找
          let resource = this.$store.state.resources.find(r => r.id == newId)
          
          // 2. 如果没找到，尝试从 API 获取详情
          if (!resource) {
            try {
              // 尝试调用 fetchResourceById action
              const res = await this.$store.dispatch('fetchResourceById', newId)
              // 适配后端返回的数据结构，假设返回的是资源对象
              // 如果后端返回结构不同（比如包裹在 data 属性中），需要在这里处理
              if (res) {
                 resource = res.data || res
              }
            } catch (e) {
              console.warn('无法获取资源详情:', e)
            }
          }

          // 3. 设置选中资源
          if (resource) {
             this.$store.commit('SET_SELECTED_RESOURCE', resource)
          }
        }
      }
    },
    selectedResource: {
      immediate: true,
      async handler(res) {
        try {
          if (res && res.id) {
            await this.$store.dispatch('fetchResourceComments', res.id)
            // 当资源变化时，获取作者信息
            this.fetchAuthorInfo()
          } else {
            // 未选中资源时，清空评论和作者信息
            this.$store.commit('SET_RESOURCE_COMMENTS', [])
            this.authorInfo = null
          }
        } catch (error) {
          console.error('加载资源评论失败:', {
            status: error?.response?.status,
            data: error?.response?.data
          })
          const msg = error?.response?.data?.message || error?.message || '加载资源评论失败'
          this.$root?.$emit?.('message', msg, 'error')
        }
      }
    },
    // 监听displayResource变化，确保作者信息也会更新
    displayResource: {
      immediate: true,
      handler() {
        this.fetchAuthorInfo()
      }
    }
  },
  async created() {
    // 如果 URL 中指定了 ID，交给 watch 处理，这里不默认选中
    if (this.$route.query.id) return;

    // 若未选择资源，默认选第一条
    if (!this.selectedResource && this.$store.state.resources?.length > 0) {
      this.$store.commit('SET_SELECTED_RESOURCE', this.$store.state.resources[0])
    }
    
    // 获取作者信息
    this.fetchAuthorInfo()
  }
}
</script>