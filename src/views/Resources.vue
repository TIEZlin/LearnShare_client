<template>
  <div class="px-4 py-4">
    <!-- 资源筛选和上传 -->
    <div class="bg-white card p-4 mb-6">
      <h2 class="text-xl font-bold mb-3">资源筛选</h2>
      <div class="grid grid-cols-5 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">类型</label>
          <select 
            class="w-full border border-gray-300 rounded-md py-2 px-3"
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
          <label class="block text-sm font-medium text-gray-700 mb-1">评分</label>
          <select 
            class="w-full border border-gray-300 rounded-md py-2 px-3"
            v-model="selectedRating"
            @change="onRatingFilterChange"
          >
            <option>全部评分</option>
            <option>4分以上</option>
            <option>3分以上</option>
          </select>
        </div>
        <div class="col-span-2 flex justify-end">
        </div>
      </div>
    </div>

    <!-- 热门资源推荐 -->
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-3">热门资源</h2>
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
    <h2 class="text-xl font-bold mb-3">全部资源</h2>
    
    <!-- 空状态与重试 -->
    <div v-if="filteredResources.length === 0" class="card p-6 text-center text-gray-600 mb-6">
      <p class="mb-3">暂无资源数据或加载失败。</p>
      <button class="btn-primary" @click="onSearchDoc">重试加载</button>
    </div>

    <div v-else class="custom-grid">
      <div 
        v-for="resource in filteredResources" 
        :key="resource.id || Math.random()"
        class="card p-3 flex flex-col"
      >
        <div class="flex items-center mb-2">
          <div 
            class="rounded-md flex items-center justify-center p-1.5 mr-2.5"
            :class="getTypeClass(resource.type)"
          >
            <span 
              class="iconify text-xl"
              :class="getTypeColor(resource.type)"
              :data-icon="getTypeIcon(resource.type)"
            ></span>
          </div>
          <h3 class="font-bold">{{ resource.title || '未知资源' }}</h3>
        </div>
        <div class="flex justify-between mt-auto">
          <div class="flex items-center text-sm">
            <div class="bg-gray-200 border-2 border-dashed rounded-xl w-5 h-5 mr-1.5"></div>

          </div>
          <div class="flex items-center text-sm text-gray-500">
            <div class="star-rating flex mr-1.5">
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-1.5 mt-2">
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
          class="btn-danger w-full mt-1.5 text-xs"
          @click="onReport(resource)"
        >举报</button>
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
      selectedRating: '全部评分'
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
        await this.reportResource({ resourceId: resource.id, authorId: resource.authorId, reason: '低质量或侵权' })
        alert('举报已提交')
      } catch (e) {
        alert('举报失败，请稍后重试')
      }
    },
    async onUploadMock() {
      try {
        await this.uploadResource({ title: '示例上传', course_id: 1, tags: [{ tagId: 1, tagName: '示例' }] })
        alert('上传完成（示例）')
      } catch (e) {
        alert('上传失败，请稍后重试')
      }
    },
    getTypeClass(type) {
      const classes = {
        pdf: 'bg-blue-100',
        word: 'bg-orange-100',
        presentation: 'bg-purple-100',
        excel: 'bg-green-100',
        powerpoint: 'bg-yellow-100'
      }
      return classes[type] || 'bg-gray-100'
    },
    getTypeColor(type) {
      const colors = {
        pdf: 'text-blue-500',
        word: 'text-orange-500',
        presentation: 'text-purple-500',
        excel: 'text-green-500',
        powerpoint: 'text-yellow-500'
      }
      return colors[type] || 'text-gray-500'
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
      // 确保资源对象包含authorId信息
      const resourceWithAuthorInfo = {
        ...resource,
        authorId: resource.authorId || resource.userId || null,
        author: resource.author || '未知作者'
      }
      this.$store.commit('SET_SELECTED_RESOURCE', resourceWithAuthorInfo)
      this.$router.push('/resource')
    }
  }
}
</script>

