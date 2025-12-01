<template>
  <div class="container mx-auto px-6 py-8">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <button @click="$router.back()" class="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <span class="iconify text-xl dark:text-gray-200" data-icon="mdi:arrow-left"></span>
        </button>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">我的贡献</h1>
      </div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center">
        <span class="iconify mr-2" data-icon="mdi:upload"></span>
        上传新资源
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
      <div v-if="contributions.length > 0">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">资源名称</th>
              <th class="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium hidden md:table-cell">所属课程</th>
              <th class="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium hidden sm:table-cell">上传时间</th>
              <th class="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium text-center">状态</th>
              <th class="text-left py-4 px-6 text-gray-600 dark:text-gray-300 font-medium text-center">下载/评分</th>
              <th class="text-right py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in contributions" :key="item.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer" @click="goToResource(item.id)">
              <td class="py-4 px-6">
                <div class="flex items-center">
                  <span class="iconify text-2xl mr-3 text-blue-500" :data-icon="getFileIcon(item.type)"></span>
                  <div>
                    <p class="font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">{{ item.title }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 md:hidden">{{ item.course }} · {{ item.date }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 text-gray-600 dark:text-gray-300 hidden md:table-cell">{{ item.course }}</td>
              <td class="py-4 px-6 text-gray-600 dark:text-gray-300 hidden sm:table-cell">{{ item.date }}</td>
              <td class="py-4 px-6 text-center">
                <span 
                  :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(item.status)]"
                >
                  {{ getStatusText(item.status) }}
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  <span class="flex items-center justify-center mb-1">
                    <span class="iconify mr-1" data-icon="mdi:download"></span> {{ item.downloads }}
                  </span>
                  <span class="flex items-center justify-center text-yellow-500">
                    <span class="iconify mr-1" data-icon="mdi:star"></span> {{ item.rating }}
                  </span>
                </div>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end space-x-2" @click.stop>
                   <button class="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors" title="编辑">
                     <span class="iconify" data-icon="mdi:pencil"></span>
                   </button>
                   <button class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors" title="删除" @click="deleteContribution(item.id)">
                     <span class="iconify" data-icon="mdi:delete"></span>
                   </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-16">
        <div class="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
           <span class="iconify text-4xl text-gray-400 dark:text-gray-500" data-icon="mdi:upload-off"></span>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">暂无贡献</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">分享您的学习资源，帮助更多同学</p>
        <button class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700">
          立即上传
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyContributions',
  data() {
    return {
      // Mock 数据
      contributions: [
        { 
          id: 201, 
          title: 'Java编程思想笔记', 
          course: 'Java程序设计', 
          type: 'pdf', 
          date: '2023-06-15', 
          status: 'approved',
          downloads: 128,
          rating: 4.8
        },
        { 
          id: 202, 
          title: '计算机网络思维导图', 
          course: '计算机网络', 
          type: 'img', 
          date: '2023-06-20', 
          status: 'pending',
          downloads: 0,
          rating: 0
        }
      ]
    }
  },
  methods: {
    getFileIcon(type) {
      const icons = {
        pdf: 'mdi:file-pdf-box',
        doc: 'mdi:file-word-box',
        img: 'mdi:file-image',
        zip: 'mdi:zip-box',
        default: 'mdi:file'
      }
      return icons[type] || icons.default
    },
    getStatusClass(status) {
      const classes = {
        approved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      }
      return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    },
    getStatusText(status) {
      const texts = {
        approved: '已发布',
        pending: '审核中',
        rejected: '已驳回'
      }
      return texts[status] || status
    },
    goToResource(id) {
      this.$router.push({ path: '/resource', query: { id } })
    },
    deleteContribution(id) {
      if(confirm('确定删除该资源吗？')) {
        this.contributions = this.contributions.filter(c => c.id !== id)
        // TODO: Call API
      }
    }
  }
}
</script>