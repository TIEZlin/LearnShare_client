<template>
  <div class="card overflow-hidden">
    <div class="w-full h-48 bg-gray-100 flex items-center justify-center">
      <img 
        v-if="course.image" 
        :src="course.image" 
        :alt="course.title"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <div v-else-if="loadingImage" class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
        <span class="text-gray-500 text-sm">加载图片中...</span>
      </div>
      <div v-else class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
        <span class="text-gray-500 text-sm">暂无图片</span>
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-bold text-lg mb-1">{{ course.title }}</h3>
      <div class="flex justify-between items-center mb-3">
        <div class="star-rating flex">
          <span 
            v-for="star in 5" 
            :key="star"
            class="iconify star"
            :class="{ active: star <= Math.floor(course.rating) }"
            data-icon="mdi:star"
          ></span>
          <span class="ml-2 text-sm text-gray-600">{{ course.rating }}</span>
        </div>
        <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{{ course.credits }}学分</span>
      </div>
      <p class="text-gray-600 text-sm mb-4">{{ course.description }}</p>
      <button class="btn-secondary w-full" @click="$emit('view-details', course)">查看详情</button>
    </div>
  </div>
</template>

<script>
import { courseAPI } from '../api/course'

export default {
  name: 'CourseCard',
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loadingImage: false
    }
  },
  created() {
    // 当课程没有图片时，尝试获取课程图片
    if (!this.course.image && this.course.title) {
      this.fetchCourseImage()
    }
  },
  methods: {
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
    }
  }
}
</script>
