<template>
  <div class="px-8 py-6">
    <!-- 英雄区域 Banner -->
    <div class="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative z-10 p-12 text-white">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h1 class="text-4xl font-bold mb-4">智慧选课平台</h1>
            <p class="text-xl mb-6 text-blue-100">发现优质课程，共享学习资源，打造个性化学习体验</p>
            <div class="flex space-x-4">
              <router-link to="/courses" class="btn-primary bg-white text-blue-600 hover:bg-blue-50">
                <span class="iconify mr-2" data-icon="mdi:book-open"></span>
                浏览课程
              </router-link>
              <router-link to="/resources" class="btn-secondary bg-blue-800 text-white hover:bg-blue-700 border-blue-700">
                <span class="iconify mr-2" data-icon="mdi:file-document"></span>
                学习资源
              </router-link>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-50"></div>
              <span class="iconify text-[200px] text-white relative z-10 opacity-80" data-icon="mdi:school"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-white bg-opacity-20 rounded-lg p-3">
            <span class="iconify text-3xl" data-icon="mdi:account-group"></span>
          </div>
          <span class="text-3xl font-bold">8.6K+</span>
        </div>
        <p class="text-blue-100 text-sm">注册用户</p>
        <div class="mt-2 flex items-center text-xs">
          <span class="iconify mr-1" data-icon="mdi:trending-up"></span>
          <span>+12.5% 本月增长</span>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-white bg-opacity-20 rounded-lg p-3">
            <span class="iconify text-3xl" data-icon="mdi:book-open"></span>
          </div>
          <span class="text-3xl font-bold">327</span>
        </div>
        <p class="text-green-100 text-sm">优质课程</p>
        <div class="mt-2 flex items-center text-xs">
          <span class="iconify mr-1" data-icon="mdi:trending-up"></span>
          <span>+5.2% 本月增长</span>
        </div>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-white bg-opacity-20 rounded-lg p-3">
            <span class="iconify text-3xl" data-icon="mdi:file-document"></span>
          </div>
          <span class="text-3xl font-bold">12.8K+</span>
        </div>
        <p class="text-orange-100 text-sm">学习资源</p>
        <div class="mt-2 flex items-center text-xs">
          <span class="iconify mr-1" data-icon="mdi:trending-up"></span>
          <span>+18.3% 本月增长</span>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-white bg-opacity-20 rounded-lg p-3">
            <span class="iconify text-3xl" data-icon="mdi:download"></span>
          </div>
          <span class="text-3xl font-bold">50K+</span>
        </div>
        <p class="text-purple-100 text-sm">资源下载</p>
        <div class="mt-2 flex items-center text-xs">
          <span class="iconify mr-1" data-icon="mdi:trending-up"></span>
          <span>+25.1% 本月增长</span>
        </div>
      </div>
    </div>
    
    <!-- 搜索筛选区域 -->
    <div class="bg-white card p-5 mb-8">
      <h2 class="text-xl font-bold mb-4">课程筛选</h2>
      <div class="grid grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">学院</label>
          <select 
            class="w-full border border-gray-300 rounded-md py-2 px-3"
            v-model="filters.college"
            @change="updateFilter('college', filters.college)"
          >
            <option>全部学院</option>
            <option>计算机学院</option>
            <option>经济学院</option>
            <option>医学院</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">专业</label>
          <select 
            class="w-full border border-gray-300 rounded-md py-2 px-3"
            v-model="filters.major"
            @change="updateFilter('major', filters.major)"
          >
            <option>全部专业</option>
            <option>计算机科学</option>
            <option>软件工程</option>
            <option>电子信息</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">年级</label>
          <select 
            class="w-full border border-gray-300 rounded-md py-2 px-3"
            v-model="filters.grade"
            @change="updateFilter('grade', filters.grade)"
          >
            <option>全部年级</option>
            <option>大一</option>
            <option>大二</option>
            <option>大三</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">学分</label>
          <select 
            class="w-full border border-gray-300 rounded-md py-2 px-3"
            v-model="filters.credits"
            @change="updateFilter('credits', filters.credits)"
          >
            <option>不限学分</option>
            <option>1学分</option>
            <option>2学分</option>
            <option>3学分</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">评分</label>
          <select 
            class="w-full border border-gray-300 rounded-md py-2 px-3"
            v-model="filters.rating"
            @change="updateFilter('rating', filters.rating)"
          >
            <option>全部评分</option>
            <option>4分以上</option>
            <option>3分以上</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 热门课程推荐 -->
    <h2 class="text-2xl font-bold mb-4">热门课程推荐</h2>
    <div class="custom-grid mb-12">
      <CourseCard 
        v-for="course in filteredCourses" 
        :key="course.id"
        :course="course"
        @view-details="viewCourseDetails"
      />
    </div>

    <!-- 最新资源 -->
    <h2 class="text-2xl font-bold mb-4">最新学习资源</h2>
    <div class="custom-grid">
      <ResourceCard 
        v-for="resource in latestResources" 
        :key="resource.id"
        :resource="resource"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CourseCard from '../components/CourseCard.vue'
import ResourceCard from '../components/ResourceCard.vue'

export default {
  name: 'Home',
  components: {
    CourseCard,
    ResourceCard
  },
  computed: {
    ...mapGetters(['filteredCourses', 'filteredResources']),
    filters() {
      return this.$store.state.filters
    },
    latestResources() {
      return this.filteredResources.slice(0, 3)
    }
  },
  methods: {
    ...mapActions(['updateFilter', 'selectCourse']),
    viewCourseDetails(course) {
      this.selectCourse(course)
      this.$router.push('/courses')
    }
  }
}
</script>






