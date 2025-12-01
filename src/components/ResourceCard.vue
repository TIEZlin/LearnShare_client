<template>
  <div class="card p-3 flex">
    <div 
      class="rounded-md flex items-center justify-center p-2.5 mr-3"
      :class="getTypeClass(resource.type)"
    >
      <span 
        class="iconify text-2xl"
        :class="getTypeColor(resource.type)"
        :data-icon="getTypeIcon(resource.type)"
      ></span>
    </div>
    <div class="flex-1">
      <h3 class="font-bold mb-1">{{ resource.title || '未知资源' }}</h3>
      <p class="text-sm text-gray-600 mb-1.5">{{ resource.course || '未知课程' }} · {{ resource.semester || '未知学期' }}</p>
      <div class="flex justify-between text-sm">
        <span>{{ resource.author || '未知作者' }}</span>
        <div class="flex items-center">
          <span class="iconify mr-0.5" data-icon="mdi:download"></span>
          <span>{{ resource.downloads || 0 }}次下载</span>
        </div>
      </div>
      <button 
        class="btn-secondary w-full mt-2 text-sm"
        @click="viewDetails"
      >查看详情</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResourceCard',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 查看详情方法，确保传递完整的资源信息
    viewDetails() {
      // 确保资源对象包含authorId信息
      const resourceWithAuthorInfo = {
        ...this.resource,
        authorId: this.resource.authorId || this.resource.userId || null,
        author: this.resource.author || '未知作者',
        title: this.resource.title || '未知资源',
        course: this.resource.course || '未知课程',
        semester: this.resource.semester || '未知学期',
        downloads: this.resource.downloads || 0
      }
      this.$emit('view-details', resourceWithAuthorInfo)
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
        pdf: 'text-blue-600',
        word: 'text-orange-500',
        presentation: 'text-purple-600',
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
    }
  }
}
</script>
