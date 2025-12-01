<template>
  <div class="container mx-auto px-6 py-8">
    <!-- 面包屑导航 -->
    <div class="text-sm text-gray-500 mb-6">
      <router-link to="/courses" class="hover:text-blue-600">课程列表</router-link>
      <span class="mx-2">/</span>
      <span class="text-gray-800">课程详情</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左侧主要内容 -->
      <div class="lg:col-span-2">
        <!-- 课程头部信息 -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ course.title }}</h1>
          <div class="flex items-center text-sm text-gray-600 mb-6">
            <span class="mr-6 flex items-center">
              <span class="iconify mr-2" data-icon="mdi:school"></span>
              {{ course.college }}
            </span>
            <span class="mr-6 flex items-center">
              <span class="iconify mr-2" data-icon="mdi:account"></span>
              <span v-if="loadingTeacher">加载中...</span>
              <span v-else>{{ course.teacher }}</span>
            </span>
            <span class="flex items-center text-yellow-500">
              <span class="iconify mr-1" data-icon="mdi:star"></span>
              {{ course.rating }}
            </span>
          </div>
          
          <div class="prose max-w-none text-gray-600">
            <p>{{ course.description }}</p>
          </div>
        </div>

        <!-- 课程目录/资源 Tabs -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <button class="px-6 py-3 border-b-2 border-blue-500 text-blue-600 font-medium">课程资源</button>
              <button class="px-6 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">讨论区</button>
            </nav>
          </div>
          <div class="p-6">
            <div v-for="(file, index) in course.resources" :key="index" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div class="flex items-center">
                <span class="iconify text-2xl text-blue-500 mr-3" data-icon="mdi:file-document-outline"></span>
                <span>{{ file.name }}</span>
              </div>
              <button class="text-blue-600 hover:text-blue-800 text-sm">下载</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧侧边栏 -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <img 
            v-if="course.image" 
            :src="course.image" 
            class="w-full h-48 object-cover" 
            alt="Course cover"
            @error="handleImageError"
          />
          <div v-else-if="loadingImage" class="w-full h-48 bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
            <span class="text-gray-500 text-sm">加载图片中...</span>
          </div>
          <div v-else class="w-full h-48 bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
            <span class="text-gray-500 text-sm">暂无图片</span>
          </div>
          <div class="p-6">
            <button class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition mb-3">
              加入课程
            </button>
            <button class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center">
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
import { courseAPI } from '../api/course'

export default {
  name: 'CourseDetail',
  data() {
    return {
      course: {
        id: 1,
        title: '正在加载...',
        college: '',
        teacher: '',
        teacherId: null,
        rating: 0,
        description: '',
        resources: []
      },
      loadingImage: false,
      loadingTeacher: false
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
        teacherId: 1, // 添加教师ID
        rating: 4.8,
        description: '本课程主要介绍数据结构的基本概念、算法分析方法以及常见的数据结构（如线性表、栈、队列、树、图等）及其应用。',
        image: '',
        resources: [
          { name: '第一章：绪论.ppt' },
          { name: '第二章：线性表.ppt' },
          { name: '实验指导书.pdf' }
        ]
      }
      
      // 当课程没有图片时，尝试获取课程图片
      if (!this.course.image && this.course.title) {
        this.fetchCourseImage()
      }
      
      // 当课程有教师ID时，尝试获取教师详情
      if (this.course.teacherId) {
        this.fetchTeacherDetail(this.course.teacherId)
      }
    },
    handleImageError(event) {
      // 图片加载失败时显示占位符
      event.target.style.display = 'none'
      event.target.nextElementSibling.style.display = 'flex'
    },
    async fetchCourseImage() {
      try {
        this.loadingImage = true
        const response = await courseAPI.getCourseImage(this.course.title)
        // 检查响应结构，确保获取正确的图片URL（支持base64编码）
        if (response.data && response.data.url) {
          // 更新课程图片
          this.$set(this.course, 'image', response.data.url)
        }
      } catch (error) {
        console.error('获取课程图片失败:', error)
      } finally {
        this.loadingImage = false
      }
    },
    async fetchTeacherDetail(teacherId) {
      try {
        this.loadingTeacher = true
        const response = await courseAPI.getTeacherDetail(teacherId)
        
        // 检查响应结构，确保获取正确的教师信息
        if (response.data && response.data.baseResponse && response.data.baseResponse.code === 0) {
          // 根据API文档，教师信息应该在response.data中
          const teacherData = response.data
          
          // 更新教师姓名
          if (teacherData.teacherName) {
            this.$set(this.course, 'teacher', teacherData.teacherName)
          }
        }
      } catch (error) {
        console.error('获取教师详情失败:', error)
      } finally {
        this.loadingTeacher = false
      }
    }
  }
}
</script>