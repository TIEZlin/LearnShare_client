<template>
  <div class="px-8 py-6">
    <h1 class="text-3xl font-bold mb-6 dark:text-white">我的选课</h1>
    
    <!-- 选课统计 -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      <div class="stats-card">
        <div class="flex justify-between">
          <h3 class="text-lg font-bold">已选课程</h3>
          <div class="bg-blue-100 dark:bg-blue-900/30 rounded-md p-2">
            <span class="iconify text-xl text-blue-700 dark:text-blue-400" data-icon="mdi:book-education"></span>
          </div>
        </div>
        <p class="text-3xl font-bold mt-4">{{ selectedCourses.length }}</p>
        <p class="text-gray-500 dark:text-gray-400 mt-1">门课程</p>
      </div>
      
      <div class="stats-card">
        <div class="flex justify-between">
          <h3 class="text-lg font-bold">总学分</h3>
          <div class="bg-green-100 dark:bg-green-900/30 rounded-md p-2">
            <span class="iconify text-xl text-green-700 dark:text-green-400" data-icon="mdi:credit-card"></span>
          </div>
        </div>
        <p class="text-3xl font-bold mt-4">{{ totalCredits }}</p>
        <p class="text-gray-500 dark:text-gray-400 mt-1">学分</p>
      </div>
      
      <div class="stats-card">
        <div class="flex justify-between">
          <h3 class="text-lg font-bold">本周课程</h3>
          <div class="bg-orange-100 dark:bg-orange-900/30 rounded-md p-2">
            <span class="iconify text-xl text-orange-700 dark:text-orange-400" data-icon="mdi:calendar-week"></span>
          </div>
        </div>
        <p class="text-3xl font-bold mt-4">{{ weeklyClasses }}</p>
        <p class="text-gray-500 dark:text-gray-400 mt-1">节</p>
      </div>
      
      <div class="stats-card">
        <div class="flex justify-between">
          <h3 class="text-lg font-bold">平均评分</h3>
          <div class="bg-purple-100 dark:bg-purple-900/30 rounded-md p-2">
            <span class="iconify text-xl text-purple-700 dark:text-purple-400" data-icon="mdi:star"></span>
          </div>
        </div>
        <p class="text-3xl font-bold mt-4">{{ averageRating }}</p>
        <p class="text-gray-500 dark:text-gray-400 mt-1">分</p>
      </div>
    </div>

    <!-- 课程表 -->
    <div class="card p-6 mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold dark:text-white">课程表</h2>
        <div class="flex space-x-2">
          <button 
            class="btn-secondary"
            @click="previousWeek"
          >
            <span class="iconify mr-1" data-icon="mdi:chevron-left"></span>
            上一周
          </button>
          <span class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            第 {{ currentWeek }} 周
          </span>
          <button 
            class="btn-secondary"
            @click="nextWeek"
          >
            下一周
            <span class="iconify ml-1" data-icon="mdi:chevron-right"></span>
          </button>
        </div>
      </div>
      
      <!-- 课程表网格 -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-center font-medium bg-gray-50 dark:bg-gray-700 dark:text-gray-300">时间</th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-center font-medium bg-gray-50 dark:bg-gray-700 dark:text-gray-300">周一</th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-center font-medium bg-gray-50 dark:bg-gray-700 dark:text-gray-300">周二</th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-center font-medium bg-gray-50 dark:bg-gray-700 dark:text-gray-300">周三</th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-center font-medium bg-gray-50 dark:bg-gray-700 dark:text-gray-300">周四</th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-center font-medium bg-gray-50 dark:bg-gray-700 dark:text-gray-300">周五</th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-center font-medium bg-gray-50 dark:bg-gray-700 dark:text-gray-300">周六</th>
              <th class="border border-gray-300 dark:border-gray-600 p-3 text-center font-medium bg-gray-50 dark:bg-gray-700 dark:text-gray-300">周日</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="timeSlot in timeSlots" :key="timeSlot.time">
              <td class="border border-gray-300 dark:border-gray-600 p-3 text-center font-medium bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                {{ timeSlot.time }}
              </td>
              <td 
                v-for="day in days" 
                :key="day"
                class="border border-gray-300 dark:border-gray-600 p-2 min-w-[120px] h-20"
              >
                <div 
                  v-for="course in getCourseAtTime(day, timeSlot.time)"
                  :key="course.id"
                  class="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 rounded p-2 text-xs cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                  @click="viewCourseDetail(course)"
                >
                  <div class="font-medium text-blue-800 dark:text-blue-300">{{ course.title }}</div>
                  <div class="text-blue-600 dark:text-blue-400">{{ course.instructor }}</div>
                  <div class="text-blue-500 dark:text-blue-500">{{ course.location }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 已选课程列表 -->
    <div class="card p-6">
      <h2 class="text-xl font-bold mb-4 dark:text-white">已选课程列表</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="course in selectedCourses" 
          :key="course.id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-300 dark:bg-gray-800"
        >
          <div class="flex items-start justify-between mb-3">
            <h3 class="font-bold text-lg dark:text-white">{{ course.title }}</h3>
            <button 
              class="text-red-500 hover:text-red-700"
              @click="dropCourse(course.id)"
            >
              <span class="iconify" data-icon="mdi:close"></span>
            </button>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ course.instructor }} · {{ course.college }}</p>
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">{{ course.credits }}学分</span>
            <div class="star-rating flex">
              <span 
                v-for="star in 5" 
                :key="star"
                class="iconify star text-sm"
                :class="{ active: star <= Math.floor(course.rating) }"
                data-icon="mdi:star"
              ></span>
              <span class="ml-1 text-sm text-gray-600 dark:text-gray-400">{{ course.rating }}</span>
            </div>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <div v-for="schedule in course.schedule" :key="schedule.day">
              {{ getDayName(schedule.day) }} {{ getTimeString(schedule.timeSlot) }} {{ schedule.location }}
            </div>
          </div>
          <button 
            class="btn-secondary w-full text-sm"
            @click="viewCourseDetail(course)"
          >
            查看详情
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'MyCourses',
  data() {
    return {
      currentWeek: 1,
      timeSlots: [
        { time: '08:20-10:00' },
        { time: '10:20-12:00' },
        { time: '14:00-15:40' },
        { time: '15:50-17:30' },
        { time: '19:00-21:35' }
      ],
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }
  },
  computed: {
    ...mapState(['courses', 'myCourses']),
    ...mapGetters(['currentUser']),
    selectedCourses() {
      return this.myCourses
    },
    totalCredits() {
      return this.selectedCourses.reduce((total, course) => total + course.credits, 0)
    },
    weeklyClasses() {
      return this.selectedCourses.reduce((total, course) => total + (course.schedule ? course.schedule.length : 0), 0)
    },
    averageRating() {
      if (this.selectedCourses.length === 0) return 0
      const total = this.selectedCourses.reduce((sum, course) => sum + course.rating, 0)
      return (total / this.selectedCourses.length).toFixed(1)
    }
  },
  methods: {
    getCourseAtTime(day, time) {
      // 找到对应时间段的索引
      const timeSlotIndex = this.timeSlots.findIndex(slot => slot.time === time)
      if (timeSlotIndex === -1) return []

      return this.selectedCourses.filter(course => 
        course.schedule && course.schedule.some(schedule => 
          schedule.day === day && schedule.timeSlot === timeSlotIndex
        )
      )
    },
    getTimeString(index) {
      return this.timeSlots[index] ? this.timeSlots[index].time : ''
    },
    getDayName(day) {
      const dayNames = {
        monday: '周一',
        tuesday: '周二',
        wednesday: '周三',
        thursday: '周四',
        friday: '周五',
        saturday: '周六',
        sunday: '周日'
      }
      return dayNames[day] || day
    },
    viewCourseDetail(course) {
      this.$store.commit('SET_SELECTED_COURSE', course)
      this.$router.push('/courses')
    },
    async dropCourse(courseId) {
      if (confirm('确定要退选这门课程吗？')) {
        try {
          await this.$store.dispatch('dropCourse', courseId)
          // alert('退选成功！') // 既然界面会响应式更新，就不必弹窗了，或者可以用toast
        } catch (error) {
          alert(error.message)
        }
      }
    },
    previousWeek() {
      if (this.currentWeek > 1) {
        this.currentWeek--
      }
    },
    nextWeek() {
      if (this.currentWeek < 20) {
        this.currentWeek++
      }
    }
  }
}
</script>

