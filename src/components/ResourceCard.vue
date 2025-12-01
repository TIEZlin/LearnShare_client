<template>
  <div class="card p-4 flex">
    <div 
      class="rounded-md flex items-center justify-center p-3 mr-4 transition-colors"
      :class="getTypeClass(resource.type)"
    >
      <span 
        class="iconify text-3xl"
        :class="getTypeColor(resource.type)"
        :data-icon="getTypeIcon(resource.type)"
      ></span>
    </div>
    <div class="flex-1">
      <h3 class="font-bold mb-1 dark:text-white">{{ resource.title }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ resource.course }} · {{ resource.semester }}</p>
      <div class="flex justify-between text-sm">
        <span class="dark:text-gray-300">{{ resource.author }}</span>
        <div class="flex items-center dark:text-gray-300">
          <span class="iconify mr-1" data-icon="mdi:download"></span>
          <span>{{ resource.downloads }}次下载</span>
        </div>
      </div>
      <button 
        class="btn-secondary w-full mt-3 text-sm"
        @click="$emit('view-details', resource)"
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
    getTypeClass(type) {
      const classes = {
        pdf: 'bg-blue-100 dark:bg-blue-900',
        word: 'bg-orange-100 dark:bg-orange-900',
        presentation: 'bg-purple-100 dark:bg-purple-900',
        excel: 'bg-green-100 dark:bg-green-900',
        powerpoint: 'bg-yellow-100 dark:bg-yellow-900'
      }
      return classes[type] || 'bg-gray-100 dark:bg-gray-700'
    },
    getTypeColor(type) {
      const colors = {
        pdf: 'text-blue-600 dark:text-blue-300',
        word: 'text-orange-500 dark:text-orange-300',
        presentation: 'text-purple-600 dark:text-purple-300',
        excel: 'text-green-500 dark:text-green-300',
        powerpoint: 'text-yellow-500 dark:text-yellow-300'
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
    }
  }
}
</script>
