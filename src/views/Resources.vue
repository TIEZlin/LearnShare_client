<template>
  <div class="px-8 py-6">
    <!-- 资源筛选和上传 -->
    <div class="bg-white dark:bg-gray-800 card p-5 mb-8 transition-colors duration-300">
      <h2 class="text-xl font-bold mb-4 dark:text-white">资源筛选</h2>
      <div class="grid grid-cols-5 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">课程</label>
          <select 
            class="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="selectedCourseTitle"
            @change="onCourseFilterChange"
          >
            <option value="全部课程">全部课程</option>
            <option v-for="course in courseTitles" :key="course" :value="course">{{ course }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">类型</label>
          <select 
            class="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="selectedType"
            @change="onTypeFilterChange"
          >
            <option>全部类型</option>
            <option value="pdf">讲义资料（PDF）</option>
            <option value="word">课程作业（Word）</option>
            <option value="excel">数据表（Excel）</option>
            <option value="presentation">课件（PPT）</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">评分</label>
          <select 
            class="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            v-model="selectedRating"
            @change="onRatingFilterChange"
          >
            <option>全部评分</option>
            <option>4分以上</option>
            <option>3分以上</option>
          </select>
        </div>
        <div class="col-span-2 flex justify-end">
          <button class="btn-primary flex items-center h-10 mr-3" @click="onSearchDoc">
            <span class="iconify mr-2" data-icon="mdi:magnify"></span>
            文档版搜索
          </button>
          <label class="btn-secondary flex items-center h-10 cursor-pointer">
            <input type="file" ref="fileInput" @change="onFileSelected" accept=".pdf,.docx,.pptx,.zip" class="hidden">
            <span class="iconify mr-2" data-icon="mdi:upload"></span>
            上传资源
          </label>
        </div>
      </div>
    </div>

    <!-- 热门资源推荐 -->
    <div class="mb-8">
      <h2 class="text-xl font-bold mb-4 dark:text-white">热门资源</h2>
      <div class="custom-grid">
        <ResourceCard 
          v-for="resource in hotResources" 
          :key="resource.id"
          :resource="resource"
          @view-details="viewResourceDetail"
        />
      </div>
    </div>

    <!-- 全部资源列表 -->
    <h2 class="text-xl font-bold mb-4 dark:text-white">全部资源</h2>
    
    <!-- 空状态与重试 -->
    <div v-if="filteredResources.length === 0" class="card p-8 text-center text-gray-600 dark:text-gray-400 mb-8">
      <p class="mb-4">暂无资源数据或加载失败。</p>
      <button class="btn-primary" @click="onSearchDoc">重试加载</button>
    </div>

    <div v-else class="custom-grid">
      <div 
        v-for="resource in filteredResources" 
        :key="resource.id"
        class="card p-4 flex flex-col"
      >
        <div class="flex items-center mb-3">
          <div 
            class="rounded-md flex items-center justify-center p-2 mr-3"
            :class="getTypeClass(resource.type)"
          >
            <span 
              class="iconify text-2xl"
              :class="getTypeColor(resource.type)"
              :data-icon="getTypeIcon(resource.type)"
            ></span>
          </div>
          <h3 class="font-bold dark:text-white">{{ resource.title }}</h3>
        </div>
        <div class="flex justify-between mt-auto">
          <div class="flex items-center text-sm">
            <div class="bg-gray-200 dark:bg-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-xl w-6 h-6 mr-2"></div>
          </div>
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div class="star-rating flex mr-2">
              <span 
                v-for="star in 5" 
                :key="star"
                class="iconify star"
                :class="{ active: star <= Math.floor(resource.rating) }"
                data-icon="mdi:star"
              ></span>
            </div>
            <span>{{ resource.rating }}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-3">
          <button 
            class="btn-secondary w-full text-sm"
            @click="viewResourceDetail(resource)"
          >查看详情</button>
          <button 
            class="btn-primary w-full text-sm"
            @click="onDownload(resource)"
          >下载</button>
        </div>
        <button 
          class="w-full mt-2 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          @click="onReport(resource)"
        >举报</button>
      </div>
    </div>
    
    <!-- 上传资源对话框 -->
    <div v-if="showUploadDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="cancelUpload">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl" @click.stop>
        <h2 class="text-xl font-bold mb-4 dark:text-white">上传资源</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">文件 *</label>
            <div class="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ uploadForm.file ? uploadForm.file.name : '未选择文件' }}</span>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">资源标题 *</label>
            <input 
              v-model="uploadForm.title"
              type="text"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入资源标题"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">资源描述</label>
            <textarea 
              v-model="uploadForm.description"
              rows="3"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入资源描述（可选）"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">关联课程ID *</label>
            <input 
              v-model.number="uploadForm.course_id"
              type="number"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入课程ID"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标签（用逗号分隔）</label>
            <input 
              v-model="uploadForm.tags"
              type="text"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如：期末复习, 重点资料"
            >
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button 
            class="btn-secondary"
            @click="cancelUpload"
            :disabled="uploading"
          >取消</button>
          <button 
            class="btn-primary"
            @click="onSubmitUpload"
            :disabled="uploading"
          >
            {{ uploading ? '上传中...' : '确认上传' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ResourceCard from '../components/ResourceCard.vue'

export default {
  name: 'Resources',
  components: {
    ResourceCard
  },
  data() {
    return {
      activeTab: 'all',
      tabs: [
        { key: 'all', label: '全部资源' },
        { key: 'handout', label: '讲义资料' },
        { key: 'homework', label: '课程作业' },
        { key: 'exam', label: '考试真题' }
      ],
      selectedCourseTitle: '全部课程',
      selectedType: '全部类型',
      selectedRating: '全部评分',
      showUploadDialog: false,
      uploadForm: {
        file: null,
        title: '',
        description: '',
        course_id: '',
        tags: ''
      },
      uploading: false
    }
  },
  computed: {
    ...mapGetters(['filteredResources']),
    courseTitles() {
      // 从资源列表提取课程名并去重
      const titles = this.filteredResources.map(r => r.course)
      return Array.from(new Set(titles))
    },
    hotResources() {
      return this.filteredResources.slice(0, 3)
    }
  },
  created() {
    // 组件加载时自动加载资源数据
    this.onSearchDoc()
  },
  
  methods: {
    ...mapActions(['updateFilter', 'searchResources', 'getResourceDownloadUrl', 'reportResource', 'uploadResource']),
    
    onCourseFilterChange() {
      this.updateFilter({ key: 'courseTitle', value: this.selectedCourseTitle })
    },
    onTypeFilterChange() {
      this.updateFilter({ key: 'resourceType', value: this.selectedType })
    },
    onRatingFilterChange() {
      this.updateFilter({ key: 'resourceRating', value: this.selectedRating })
    },
    async onSearchDoc() {
      try {
        const params = { page_size: 10, page_num: 1 }
        // keyword 暂不从UI输入，保持空；类型映射
        if (this.selectedType && this.selectedType !== '全部类型') params.sortBy = 'latest'
        // 评分筛选不在文档搜索直接支持，先忽略或前端过滤
        const res = await this.searchResources('', params)
        // searchResources 已返回 data，且 store 内会未变更资源；这里不强制覆盖
        console.log('文档版资源搜索完成', res)
      } catch (e) {
        this.$store.commit('SET_ERROR', { title: '加载失败', message: '无法加载资源列表，请稍后重试' })
      }
    },
    async onDownload(resource) {
      try {
        const data = await this.getResourceDownloadUrl(resource.id)
        if (data && data.download_url) {
          window.location.href = data.download_url
          this.$store.commit('INCREMENT_RESOURCE_DOWNLOADS', resource.id)
        }
      } catch (e) {
        alert('下载失败，请稍后重试')
      }
    },
    async onReport(resource) {
      try {
        await this.reportResource({ resourceId: resource.id, reason: '低质量或侵权' })
        alert('举报已提交')
      } catch (e) {
        alert('举报失败，请稍后重试')
      }
    },
    onFileSelected(event) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件类型
      const allowedTypes = ['.pdf', '.docx', '.pptx', '.zip']
      const fileExt = '.' + file.name.split('.').pop().toLowerCase()
      if (!allowedTypes.includes(fileExt)) {
        alert('文件类型不支持，仅支持 .pdf, .docx, .pptx, .zip')
        event.target.value = ''
        return
      }
      
      // 验证文件大小（最大3MB）
      const maxSize = 3 * 1024 * 1024 // 3MB
      if (file.size > maxSize) {
        alert('文件大小超过3MB限制')
        event.target.value = ''
        return
      }
      
      this.uploadForm.file = file
      this.uploadForm.title = file.name.replace(/\.[^/.]+$/, '') // 使用文件名（不含扩展名）作为默认标题
      this.showUploadDialog = true
    },
    
    async onSubmitUpload() {
      // 验证必填字段
      if (!this.uploadForm.file) {
        alert('请选择文件')
        return
      }
      if (!this.uploadForm.title.trim()) {
        alert('请输入资源标题')
        return
      }
      // 验证课程ID：必须是有效的正整数
      const courseId = typeof this.uploadForm.course_id === 'number' 
        ? this.uploadForm.course_id 
        : parseInt(String(this.uploadForm.course_id || ''), 10)
      if (!courseId || isNaN(courseId) || courseId <= 0) {
        alert('请输入有效的课程ID（正整数）')
        return
      }
      
      this.uploading = true
      try {
        // 处理 tags：如果是字符串，转换为数组；如果是对象数组，提取 tagName
        let tags = []
        if (this.uploadForm.tags) {
          if (typeof this.uploadForm.tags === 'string') {
            // 字符串格式：用逗号分隔
            tags = this.uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean)
          } else if (Array.isArray(this.uploadForm.tags)) {
            // 数组格式：如果是对象数组，提取 tagName；如果是字符串数组，直接使用
            tags = this.uploadForm.tags.map(t => 
              typeof t === 'string' ? t : (t.tagName || t.name || String(t))
            )
          }
        }
        
        const uploadData = {
          file: this.uploadForm.file,
          title: this.uploadForm.title.trim(),
          description: this.uploadForm.description.trim() || '',
          course_id: courseId, // 使用验证后的 courseId
          tags: tags
        }
        
        const response = await this.uploadResource(uploadData)
        console.log('上传响应:', response)
        
        // 检查响应状态码
        const status = response?.status || response?.data?.status
        if (status === 201 || status === 202) {
          alert('上传成功！资源已提交审核')
        } else {
          alert('上传成功！')
        }
        
        // 重置表单
        this.uploadForm = {
          file: null,
          title: '',
          description: '',
          course_id: '',
          tags: ''
        }
        this.showUploadDialog = false
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = ''
        }
        
        // 刷新资源列表
        await this.onSearchDoc()
      } catch (error) {
        console.error('上传失败:', error)
        console.error('错误响应:', error?.response?.data)
        
        // 提取错误信息
        let errorMsg = '上传失败，请稍后重试'
        if (error?.response?.data) {
          const data = error.response.data
          if (data.baseResponse?.message) {
            errorMsg = data.baseResponse.message
          } else if (data.message) {
            errorMsg = data.message
          } else if (typeof data === 'string') {
            errorMsg = data
          }
        } else if (error?.message) {
          errorMsg = error.message
        }
        
        alert(`上传失败：${errorMsg}`)
      } finally {
        this.uploading = false
      }
    },
    
    cancelUpload() {
      this.uploadForm = {
        file: null,
        title: '',
        description: '',
        course_id: '',
        tags: ''
      }
      this.showUploadDialog = false
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
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
        pdf: 'text-blue-500 dark:text-blue-400',
        word: 'text-orange-500 dark:text-orange-400',
        presentation: 'text-purple-500 dark:text-purple-400',
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
    viewResourceDetail(resource) {
      this.$store.commit('SET_SELECTED_RESOURCE', resource)
      this.$router.push('/resource')
    }
  }
}
</script>


