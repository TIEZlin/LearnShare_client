<template>
  <div class="container mx-auto px-6 py-8">
    <!-- 面包屑导航 -->
    <div class="text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors duration-300">
      <router-link to="/courses" class="hover:text-blue-600 dark:hover:text-blue-400">课程列表</router-link>
      <span class="mx-2">/</span>
      <span class="text-gray-800 dark:text-gray-200">课程详情</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左侧主要内容 -->
      <div class="lg:col-span-2">
        <!-- 课程头部信息 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 transition-colors duration-300">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">{{ course.title }}</h1>
          <div class="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-6">
            <span class="mr-6 flex items-center">
              <span class="iconify mr-2" data-icon="mdi:school"></span>
              {{ course.college }}
            </span>
            <span class="mr-6 flex items-center">
              <span class="iconify mr-2" data-icon="mdi:account"></span>
              {{ course.teacher }}
            </span>
            <span class="flex items-center text-yellow-500">
              <span class="iconify mr-1" data-icon="mdi:star"></span>
              {{ course.rating }}
            </span>
          </div>
          
          <div class="prose max-w-none text-gray-600 dark:text-gray-300">
            <p>{{ course.description }}</p>
          </div>
        </div>

        <!-- 课程目录/资源 Tabs -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex -mb-px">
              <button class="px-6 py-3 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium">课程资源</button>
              <button class="px-6 py-3 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors">讨论区</button>
            </nav>
          </div>
          <div class="p-6">
            <div v-for="(file, index) in course.resources" :key="index" class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div class="flex items-center">
                <span class="iconify text-2xl text-blue-500 dark:text-blue-400 mr-3" data-icon="mdi:file-document-outline"></span>
                <span class="dark:text-gray-200">{{ file.name }}</span>
              </div>
              <button class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors">下载</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧侧边栏 -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6 transition-colors duration-300">
          <img :src="course.image || 'https://via.placeholder.com/400x200'" class="w-full h-48 object-cover" alt="Course cover">
          <div class="p-6">
            <button class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition mb-3">
              加入课程
            </button>
            <button class="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center">
              <span class="iconify mr-2 text-red-500" data-icon="mdi:heart"></span>
              已收藏
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseDetail',
  data() {
    return {
      course: {
        id: 1,
        title: '正在加载...',
        college: '',
        teacher: '',
        rating: 0,
        description: '',
        resources: []
      }
    }
  },
  created() {
    // 模拟根据 ID 获取数据
    const id = this.$route.params.id
    this.fetchCourseDetail(id)
  },
  methods: {
    fetchCourseDetail(id) {
      // Mock Data
      this.course = {
        id: id,
        title: '数据结构与算法',
        college: '计算机学院',
        teacher: '张教授',
        rating: 4.8,
        description: '本课程主要介绍数据结构的基本概念、算法分析方法以及常见的数据结构（如线性表、栈、队列、树、图等）及其应用。',
        image: '',
        resources: [
          { name: '第一章：绪论.ppt' },
          { name: '第二章：线性表.ppt' },
          { name: '实验指导书.pdf' }
        ]
      }
    }
  }
}
</script>