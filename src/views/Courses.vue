<template>
  <div class="px-8 py-6">
    <!-- 如果没有选中课程，显示课程列表 -->
    <template v-if="!selectedCourse">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">全部课程</h1>
        
        <!-- 搜索框组件 -->
        <div class="relative w-80">
          <input
            type="text"
            v-model="searchKeyword"
            @input="debouncedSearch"
            @focus="showSearchHistory = true"
            @keydown.down.prevent="navigateSuggestions(1)"
            @keydown.up.prevent="navigateSuggestions(-1)"
            @keydown.enter="executeSearch"
            placeholder="搜索课程名称"
            class="w-full py-2 px-4 pr-10 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          />
          <button
            @click="executeSearch"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
          >
            <span class="iconify text-xl" data-icon="mdi:magnify"></span>
          </button>
          
          <!-- 搜索历史和联想下拉列表 -->
          <div
            v-if="showSearchHistory || searchSuggestions.length > 0"
            class="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto"
          >
            <!-- 搜索历史 -->
            <div v-if="showSearchHistory && searchHistory.length > 0" class="p-2 border-b border-gray-200">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-500">搜索历史</span>
                <button
                  @click="clearAllHistory"
                  class="text-xs text-gray-400 hover:text-gray-600"
                >
                  清除全部
                </button>
              </div>
              <ul>
                <li
                  v-for="(history, index) in searchHistory"
                  :key="'history-' + index"
                  class="flex items-center justify-between py-2 px-3 hover:bg-gray-100 cursor-pointer transition-colors"
                  @click="selectHistory(history)"
                >
                  <span class="text-sm flex items-center">
                    <span class="iconify mr-2 text-gray-400" data-icon="mdi:clock-outline"></span>
                    {{ history }}
                  </span>
                  <button
                    @click.stop="deleteHistory(history)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <span class="iconify text-sm" data-icon="mdi:close"></span>
                  </button>
                </li>
              </ul>
            </div>
            
            <!-- 搜索联想 -->
            <div v-if="searchSuggestions.length > 0" class="p-2">
              <div v-if="showSearchHistory && searchHistory.length > 0" class="text-sm font-medium text-gray-500 mb-2">搜索联想</div>
              <ul>
                <li
                  v-for="(suggestion, index) in searchSuggestions"
                  :key="'suggestion-' + index"
                  :class="['flex items-center py-2 px-3 cursor-pointer transition-colors', activeSuggestionIndex === index ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100']"
                  @click="selectSuggestion(suggestion)"
                >
                  <span class="iconify mr-2 text-gray-400" data-icon="mdi:magnify"></span>
                  <span class="text-sm">{{ suggestion }}</span>
                </li>
              </ul>
            </div>
            
            <!-- 空状态 -->
            <div v-if="showSearchHistory && searchHistory.length === 0 && searchSuggestions.length === 0" class="p-4 text-center text-gray-500">
              暂无搜索历史
            </div>
          </div>
        </div>
      </div>
      
      <!-- 课程筛选 -->
      <div class="bg-white card p-5 mb-8">
        <h2 class="text-xl font-bold mb-4">课程筛选</h2>
        <div class="grid grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">学院</label>
            <select 
              class="w-full border border-gray-300 rounded-md py-2 px-3"
              v-model="filters.college"
              @change="onFilterChange('college', filters.college)"
            >
              <option>全部学院</option>
              <option>计算机学院</option>
              <option>经济学院</option>
              <option>医学院</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">学分</label>
            <select 
              class="w-full border border-gray-300 rounded-md py-2 px-3"
              v-model="filters.credits"
              @change="onFilterChange('credits', filters.credits)"
            >
              <option>不限学分</option>
              <option>1学分</option>
              <option>2学分</option>
              <option>3学分</option>
              <option>4学分</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">评分</label>
            <select 
              class="w-full border border-gray-300 rounded-md py-2 px-3"
              v-model="filters.rating"
              @change="onFilterChange('rating', filters.rating)"
            >
              <option>全部评分</option>
              <option>4分以上</option>
              <option>3分以上</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 搜索结果统计 -->
      <div v-if="hasSearched && searchKeyword" class="mb-4 text-sm text-gray-600">
        <span v-if="!isSearching">
          找到 <strong>{{ searchResults.length }}</strong> 个与 "{{ searchKeyword }}" 相关的课程
        </span>
        <span v-else class="flex items-center">
          <span class="iconify animate-spin mr-2" data-icon="mdi:loading"></span>
          搜索中...
        </span>
      </div>

      <!-- 加载状态 -->
      <div v-if="$store.state.loading.courses" class="card p-8 text-center text-gray-600 mb-8">
        <div class="flex flex-col items-center justify-center">
          <span class="iconify text-4xl animate-spin mb-4 text-blue-500" data-icon="mdi:loading"></span>
          <p>正在加载课程数据...</p>
        </div>
      </div>

      <!-- 搜索无结果状态 -->
      <div v-else-if="hasSearched && searchKeyword && searchResults.length === 0" class="card p-8 text-center text-gray-600 mb-8">
        <div class="flex flex-col items-center justify-center">
          <span class="iconify text-4xl mb-4 text-gray-400" data-icon="mdi:magnify"></span>
          <h3 class="text-xl font-medium mb-2">未找到相关课程</h3>
          <p class="mb-4">没有找到与 "{{ searchKeyword }}" 相关的课程</p>
          <div class="flex flex-wrap justify-center gap-2 mb-6">
            <button @click="clearSearch" class="btn-secondary px-4 py-2">清除搜索</button>
            <button @click="executeSearch" class="btn-primary px-4 py-2">重新搜索</button>
          </div>
          
          <!-- 推荐课程 -->
          <div class="w-full max-w-md">
            <h4 class="text-lg font-medium mb-3 text-left">推荐课程</h4>
            <div class="bg-gray-50 p-3 rounded-lg">
              <div v-for="(course, index) in courses.slice(0, 3)" :key="index" class="text-left mb-2 last:mb-0">
                <button 
                  @click="selectCourse(course)" 
                  class="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                  {{ course.title }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态与重试 -->
      <div v-else-if="courses.length === 0" class="card p-8 text-center text-gray-600 mb-8">
        <p class="mb-4">暂无课程数据或加载失败。</p>
        <button class="btn-primary" @click="loadCoursesDoc">重试加载</button>
      </div>

      <!-- 课程列表 -->
      <transition-group name="course-list" tag="div" class="custom-grid">
        <CourseCard 
          v-for="course in searchResults" 
          :key="course.id"
          :course="course"
          @view-details="viewCourseDetails"
        />
      </transition-group>
    </template>

    <!-- 如果选中了课程，显示课程详情 -->
    <template v-else>
      <div class="mb-4">
        <button 
          @click="backToCourseList"
          class="btn-secondary flex items-center mb-4"
        >
          <span class="iconify mr-2" data-icon="mdi:arrow-left"></span>
          返回课程列表
        </button>
      </div>
      
      <div class="grid grid-cols-3 gap-8">
      <!-- 左侧课程信息 -->
                <div class="col-span-1">
                    <div class="card p-6">
                        <div class="w-full h-64 mb-4 bg-gray-100 flex items-center justify-center">
                            <img 
                                v-if="selectedCourse.image" 
                                :src="selectedCourse.image" 
                                :alt="selectedCourse.title"
                                class="w-full h-full object-cover rounded-lg"
                                @error="handleImageError"
                            />
                            <div v-else class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                                <span class="text-gray-500">暂无图片</span>
                            </div>
                        </div>
          <h1 class="text-2xl font-bold mb-2">{{ selectedCourse.title }}</h1>
          <p class="text-gray-600 mb-4">课程代码：CS201</p>
          <div class="flex items-center mb-4">
            <span class="iconify text-xl mr-1" data-icon="mdi:account"></span>
            <button 
              class="text-gray-700 hover:text-blue-600 hover:underline cursor-pointer"
              @click="showTeacherDetail = true"
            >
              {{ selectedCourse.instructor }}
            </button>
          </div>
          <div class="flex items-center mb-4">
            <span class="iconify text-xl mr-1" data-icon="mdi:school"></span>
            <span class="text-gray-700">{{ selectedCourse.college }}</span>
          </div>
          <div class="flex items-center mb-4">
            <span class="iconify text-xl mr-1" data-icon="mdi:credit-card"></span>
            <span class="text-gray-700">{{ selectedCourse.credits }}学分</span>
          </div>
          <div class="flex items-center mb-4">
            <span class="iconify text-xl mr-1" data-icon="mdi:calendar"></span>
            <span class="text-gray-700">秋季学期</span>
          </div>
          <div class="mt-6">
            <h3 class="font-bold mb-2">课程简介</h3>
            <p class="text-gray-600">{{ selectedCourse.description }}</p>
          </div>
        </div>

        <!-- 教师信息框 -->
        <div class="card p-6 mt-6">
          <h3 class="text-xl font-bold mb-4">授课教师</h3>
          <div class="flex items-center space-x-4">
            <img 
              :src="getTeacherAvatar(selectedCourse.instructor)" 
              :alt="selectedCourse.instructor"
              class="w-16 h-16 rounded-full object-cover"
              @error="handleTeacherAvatarError"
            />
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ selectedCourse.instructor }}</h4>
              <p class="text-gray-600 mb-2">{{ getTeacherInfo(selectedCourse.instructor).title }} · {{ selectedCourse.college }}</p>
              <p class="text-sm text-gray-500 mb-3">{{ getTeacherInfo(selectedCourse.instructor).research }}</p>
              <button 
                class="btn-primary text-sm"
                @click="showTeacherDetail = true"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧评分和评论 -->
      <div class="col-span-2">
        <!-- 综合评分卡 -->
        <div class="card p-6 mb-8">

          <div class="mb-6">
            <h3 class="font-bold mb-3">您的评价</h3>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">评分</label>
              <div class="star-rating flex space-x-1">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star-char text-2xl"
                  :class="star <= userRating.rating ? 'active' : 'inactive'"
                  role="button"
                  tabindex="0"
                  :aria-label="`评分${star}星`"
                  @click="setRating(star)"
                  @keydown.enter.prevent="setRating(star)"
                >{{ star <= userRating.rating ? '★' : '☆' }}</span>
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">评论</label>
              <textarea 
                class="w-full border border-gray-300 rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="userRating.comment"
                placeholder="请输入您的评价..."
              ></textarea>
            </div>
            <button class="btn-primary" @click="submitRating">提交评价</button>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="card p-6">
          <h2 class="text-xl font-bold mb-4">用户评价（{{ comments.length }}条）</h2>
          
          <!-- 加载状态 -->
          <div v-if="$store.state.loading.comments" class="flex justify-center items-center py-8">
            <span class="iconify text-2xl animate-spin text-blue-500" data-icon="mdi:loading"></span>
            <span class="ml-2 text-gray-600">加载评论中...</span>
          </div>
          
          <!-- 评论列表 -->
          <div v-else>
            <div 
              v-for="comment in comments" 
              :key="comment.id"
              class="comment-item border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center">
                  <div class="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3 flex items-center justify-center">
                    <span class="iconify" data-icon="mdi:account"></span>
                  </div>
                  <div>
                    <!-- 尝试多种可能的字段名，确保评论者名字能够显示 -->
                    <h4 class="font-bold">{{ comment.author || comment.user || comment.username || comment.nickname || '匿名用户' }}</h4>
                    <div class="flex items-center">
                      <div class="star-rating flex mr-2">
                        <span 
                          v-for="star in 5" 
                          :key="star"
                          class="iconify star"
                          :class="{ active: star <= (comment.rating || 0) }"
                          data-icon="mdi:star"
                          :style="{ color: star <= (comment.rating || 0) ? '#f59e0b' : '#e5e7eb' }"
                        ></span>
                      </div>
                      <!-- 尝试多种可能的字段名，确保评论日期能够显示 -->
                      <span class="text-gray-500 text-sm">{{ comment.date || comment.createdAt || comment.create_time || '' }}</span>
                    </div>
                  </div>
                </div>
                <!-- 点赞按钮（右侧） -->
                <button
                  class="inline-flex items-center space-x-1 px-2 py-1 rounded hover:bg-blue-50 transition transform active:scale-95"
                  :class="(comment.liked || comment.isLiked) ? 'text-blue-600' : 'text-gray-600'"
                  @click="toggleCourseCommentLike(comment)"
                  :aria-label="(comment.liked || comment.isLiked) ? '取消点赞' : '点赞'"
                >
                  <span class="iconify" :data-icon="(comment.liked || comment.isLiked) ? 'mdi:thumb-up' : 'mdi:thumb-up-outline'"></span>
                  <!-- 尝试多种可能的字段名，确保点赞数能够显示 -->
                  <span>{{ (comment.likes || comment.likeCount || comment.like_count || 0) }}</span>
                </button>
              </div>
              <!-- 确保评论内容能够显示 -->
              <p class="text-gray-700 pl-13">{{ comment.content || comment.text || comment.comment || '' }}</p>
            </div>
            
            <!-- 无评论状态 -->
            <div v-if="comments.length === 0" class="text-center py-8 text-gray-500">
              <span class="iconify text-4xl mb-2" data-icon="mdi:comment-outline"></span>
              <p>暂无评论，快来发表第一条评论吧！</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </template>

    <!-- 教师详情浮窗 -->
    <div v-if="showTeacherDetail" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900">教师详情</h3>
          <button @click="showTeacherDetail = false" class="text-gray-400 hover:text-gray-600">
            <span class="iconify text-2xl" data-icon="mdi:close"></span>
          </button>
        </div>

        <div class="flex items-start space-x-6">
          <!-- 教师头像 -->
          <div class="flex-shrink-0">
            <img 
              :src="getTeacherAvatar(selectedCourse.instructor)" 
              :alt="selectedCourse.instructor"
              class="w-24 h-24 rounded-full object-cover"
              @error="handleTeacherAvatarError"
            />
          </div>

          <!-- 教师信息 -->
          <div class="flex-1">
            <h4 class="text-xl font-bold text-gray-900 mb-2">{{ selectedCourse.instructor }}</h4>
            <p class="text-gray-600 mb-4">{{ selectedCourse.college }}</p>
            
            <!-- 基本信息 -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span class="text-sm font-medium text-gray-500">职称</span>
                <p class="text-gray-900">{{ getTeacherInfo(selectedCourse.instructor).title }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">研究方向</span>
                <p class="text-gray-900">{{ getTeacherInfo(selectedCourse.instructor).research }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">教龄</span>
                <p class="text-gray-900">{{ getTeacherInfo(selectedCourse.instructor).experience }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">邮箱</span>
                <p class="text-gray-900">{{ getTeacherInfo(selectedCourse.instructor).email }}</p>
              </div>
            </div>

            <!-- 教师简介 -->
            <div class="mb-6">
              <h5 class="text-lg font-semibold text-gray-900 mb-3">个人简介</h5>
              <p class="text-gray-700 leading-relaxed">{{ getTeacherInfo(selectedCourse.instructor).bio }}</p>
            </div>

            <!-- 教学成果 -->
            <div class="mb-6">
              <h5 class="text-lg font-semibold text-gray-900 mb-3">教学成果</h5>
              <ul class="space-y-2">
                <li v-for="achievement in getTeacherInfo(selectedCourse.instructor).achievements" :key="achievement" class="flex items-start">
                  <span class="iconify text-green-500 mr-2 mt-1" data-icon="mdi:check-circle"></span>
                  <span class="text-gray-700">{{ achievement }}</span>
                </li>
              </ul>
            </div>

            <!-- 联系方式 -->
            <div class="flex space-x-4">
              <button class="btn-primary flex items-center">
                <span class="iconify mr-2" data-icon="mdi:email"></span>
                发送邮件
              </button>
              <button class="btn-secondary flex items-center">
                <span class="iconify mr-2" data-icon="mdi:calendar"></span>
                预约咨询
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import CourseCard from '../components/CourseCard.vue'
import { courseAPI } from '../api/index'

export default {
  name: 'Courses',
  components: {
    CourseCard
  },
  data() {
      return {
        showTeacherDetail: false,
        // 搜索相关数据
        searchKeyword: '',
        showSearchHistory: false,
        searchHistory: [],
        searchSuggestions: [],
        activeSuggestionIndex: -1,
        isSearching: false,
        searchTimeout: null,
        hasSearched: false
      }
    },
  computed: {
    ...mapState(['selectedCourse', 'comments', 'userRating', 'filters', 'courses']),
    ...mapGetters(['filteredCourses']),
    
    // 搜索结果过滤
    searchResults() {
      if (!this.hasSearched || !this.searchKeyword) {
        return this.filteredCourses
      }
      
      const keyword = this.searchKeyword.toLowerCase().trim()
      return this.filteredCourses.filter(course => {
        return (
          course.title.toLowerCase().includes(keyword) ||
          course.instructor.toLowerCase().includes(keyword) ||
          course.college.toLowerCase().includes(keyword) ||
          course.description.toLowerCase().includes(keyword)
        )
      })
    }
  },
  watch: {
    // 点击页面其他地方关闭搜索历史
    showSearchHistory(newVal) {
      if (newVal) {
        setTimeout(() => {
          document.addEventListener('click', this.closeSearchHistory)
        }, 0)
      }
    }
  },
  beforeDestroy() {
    // 清除事件监听器和定时器
    document.removeEventListener('click', this.closeSearchHistory)
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  },
  methods: {
    ...mapActions(['submitRating', 'updateFilter', 'selectCourse', 'searchCoursesDoc', 'fetchCourseComments']),
    
    // 加载搜索历史
    loadSearchHistory() {
      try {
        const history = localStorage.getItem('courseSearchHistory')
        if (history) {
          this.searchHistory = JSON.parse(history)
        }
      } catch (e) {
        console.error('加载搜索历史失败:', e)
        this.searchHistory = []
      }
    },
    
    // 保存搜索历史
    saveSearchHistory() {
      try {
        localStorage.setItem('courseSearchHistory', JSON.stringify(this.searchHistory))
      } catch (e) {
        console.error('保存搜索历史失败:', e)
      }
    },
    
    // 清除所有搜索历史
    clearAllHistory() {
      this.searchHistory = []
      this.saveSearchHistory()
    },
    
    // 添加搜索记录
    addSearchHistory(keyword) {
      if (!keyword.trim()) return
      
      // 移除重复项
      this.searchHistory = this.searchHistory.filter(item => item !== keyword)
      
      // 添加到开头
      this.searchHistory.unshift(keyword)
      
      // 保持最多10条记录
      if (this.searchHistory.length > 10) {
        this.searchHistory = this.searchHistory.slice(0, 10)
      }
      
      // 保存到localStorage
      this.saveSearchHistory()
    },
    
    // 删除单条搜索记录
    deleteHistory(keyword) {
      this.searchHistory = this.searchHistory.filter(item => item !== keyword)
      this.saveSearchHistory()
    },
    
    // 清除所有搜索历史
    clearAllHistory() {
      this.searchHistory = []
      this.saveSearchHistory()
    },
    
    // 选择历史记录
    selectHistory(keyword) {
      this.searchKeyword = keyword
      this.showSearchHistory = false
      this.executeSearch()
    },
    
    // 获取搜索建议
    async fetchSuggestions(keyword) {
      if (!keyword.trim()) {
        this.searchSuggestions = []
        return
      }
      
      try {
        // 模拟获取搜索建议（实际项目中应调用真实API）
        // 这里使用课程数据生成建议
        const suggestions = this.courses
          .filter(course => 
            course.title.toLowerCase().includes(keyword.toLowerCase()) ||
            course.instructor.toLowerCase().includes(keyword.toLowerCase()) ||
            course.college.toLowerCase().includes(keyword.toLowerCase())
          )
          .map(course => [course.title, course.instructor, course.college])
          .flat()
          .filter((item, index, self) => 
            item.toLowerCase().includes(keyword.toLowerCase()) && self.indexOf(item) === index
          )
          .slice(0, 5)
        
        this.searchSuggestions = suggestions
      } catch (e) {
        console.error('获取搜索建议失败:', e)
        this.searchSuggestions = []
      }
    },
    
    // 选择搜索建议
    selectSuggestion(suggestion) {
      this.searchKeyword = suggestion
      this.showSearchHistory = false
      this.searchSuggestions = []
      this.executeSearch()
    },
    
    // 导航建议列表
    navigateSuggestions(direction) {
      const total = this.searchSuggestions.length
      if (total === 0) return
      
      this.activeSuggestionIndex = (this.activeSuggestionIndex + direction + total) % total
    },
    
    // 关闭搜索历史
    closeSearchHistory(event) {
      if (event.target.closest('.relative.w-80') === null) {
        this.showSearchHistory = false
        document.removeEventListener('click', this.closeSearchHistory)
      }
    },
    
    // 防抖搜索
    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      this.searchTimeout = setTimeout(async () => {
        await this.fetchSuggestions(this.searchKeyword)
      }, 300)
    },
    
    // 执行搜索
    async executeSearch() {
      const keyword = this.searchKeyword.trim()
      
      this.isSearching = true
      this.hasSearched = false // 空搜索时不设置为已搜索状态，显示全部课程
      this.showSearchHistory = false
      this.searchSuggestions = []
      
      // 只有非空关键词才添加到搜索历史
      if (keyword) {
        this.hasSearched = true
        this.addSearchHistory(keyword)
      }
      
      try {
        // 调用课程搜索API，空关键词时显示全部课程
        await this.loadCoursesWithSearch(keyword)
      } catch (e) {
        console.error('搜索课程失败:', e)
      } finally {
        this.isSearching = false
      }
    },
    
    // 清除搜索
    clearSearch() {
      this.searchKeyword = ''
      this.hasSearched = false
      this.showSearchHistory = false
      this.searchSuggestions = []
      this.loadCoursesWithSearch()
    },
    
    // 加载课程（带搜索功能）
    async loadCoursesWithSearch(keyword = '') {
      // 将现有筛选条件映射到文档版参数
      const params = {}
      
      // 添加搜索关键词
      if (keyword) {
        params.keywords = keyword
      }
      
      // 学院 -> 暂无真实映射，保留占位（若后端需要，可传 collegeId）
      // 评分 -> minRating
      if (this.filters.rating && this.filters.rating !== '全部评分') {
        const num = parseFloat(String(this.filters.rating).replace('分以上', ''))
        if (!isNaN(num)) params.minRating = num
      }
      // 学分筛选
      if (this.filters.credits && this.filters.credits !== '全部学分') {
        const credits = parseInt(this.filters.credits)
        if (!isNaN(credits)) params.credits = credits
      }
      // 分页
      params.page_size = 20
      params.page_num = 1

      try {
        this.$store.commit('SET_LOADING', { key: 'courses', value: true })
        console.log('请求参数:', params)
        
        // 直接调用API而不是通过store action，以便查看完整响应
        const api = courseAPI
        if (!api) {
          console.error('courseAPI未定义')
          throw new Error('courseAPI未定义')
        }
        
        const response = await api.searchCoursesDoc(params)
        console.log('API完整响应:', response)
        
        const data = response.data
        console.log('API响应数据:', data)
        
        // 检查数据结构并适配不同的响应格式
        let coursesList = []
        
        if (data && data.courses) {
          // 文档格式: { baseResponse, courses: [...] }
          coursesList = data.courses
        } else if (Array.isArray(data)) {
          // 直接返回数组格式
          coursesList = data
        } else if (data && data.baseResponse) {
          // 检查baseResponse中的数据
          console.log('BaseResponse:', data.baseResponse)
          if (data.baseResponse.courses) {
            coursesList = data.baseResponse.courses
          }
        } else if (data && data.data) {
          // 检查data.data中的数据
          if (data.data.courses) {
            coursesList = data.data.courses
          } else if (Array.isArray(data.data)) {
            coursesList = data.data
          }
        } else if (data && data.response) {
          // 检查response中的数据
          if (data.response.courses) {
            coursesList = data.response.courses
          } else if (Array.isArray(data.response)) {
            coursesList = data.response
          }
        }
        
        console.log('提取的课程列表:', coursesList)
        
        // 如果没有数据，使用模拟数据
        if (!Array.isArray(coursesList) || coursesList.length === 0) {
          console.log('使用模拟课程数据')
          coursesList = [
            {
              courseId: '1',
              courseName: '数据结构',
              credit: 3,
              description: '数据结构是计算机科学的核心课程，介绍各种数据组织方式和算法。',
              instructor: '张教授'
            },
            {
              courseId: '2',
              courseName: '操作系统',
              credit: 4,
              description: '操作系统是管理计算机硬件和软件资源的系统软件。',
              instructor: '李教授'
            },
            {
              courseId: '3',
              courseName: '计算机网络',
              credit: 3,
              description: '计算机网络课程涵盖网络协议、体系结构和网络应用等内容。',
              instructor: '王教授'
            }
          ]
        }
        
        const mapped = coursesList.map(item => {
          // 从原始courses数组中查找匹配的课程，获取完整信息
          const originalCourse = this.courses.find(c => c.id === item.courseId || c.id === item.id)
          
          return {
            id: item.courseId || item.id,
            title: item.courseName || item.title || (originalCourse ? originalCourse.title : '未知课程'),
            instructor: item.instructor || (originalCourse ? originalCourse.instructor : '授课教师'),
            college: item.college || (originalCourse ? originalCourse.college : '学院'),
            rating: parseFloat(item.rating || (originalCourse ? originalCourse.rating : 4.0)),
            credits: item.credit || item.credits || (originalCourse ? originalCourse.credits : 3),
            description: item.description || (originalCourse ? originalCourse.description : '暂无描述'),
            // 只使用实际存在的image值，不设置默认占位图，让CourseCard组件的fetchCourseImage方法能够被调用
            image: item.image || (originalCourse ? originalCourse.image : null)
          }
        })
        
        console.log('映射后的课程数据:', mapped)
        this.$store.commit('SET_COURSES', mapped)
      } catch (e) {
        console.error('加载课程失败:', e)
        this.$store.commit('SET_ERROR', { title: '加载失败', message: '无法加载课程列表，请稍后重试' })
        
        // 发生错误时使用模拟数据
        const mockCourses = [
          {
            id: '1',
            title: '数据结构',
            instructor: '张教授',
            college: '计算机学院',
            rating: 4.5,
            credits: 3,
            description: '数据结构是计算机科学的核心课程，介绍各种数据组织方式和算法。',
            image: null
          },
          {
            id: '2',
            title: '操作系统',
            instructor: '李教授',
            college: '计算机学院',
            rating: 4.2,
            credits: 4,
            description: '操作系统是管理计算机硬件和软件资源的系统软件。',
            image: null
          },
          {
            id: '3',
            title: '计算机网络',
            instructor: '王教授',
            college: '计算机学院',
            rating: 4.0,
            credits: 3,
            description: '计算机网络课程涵盖网络协议、体系结构和网络应用等内容。',
            image: null
          }
        ]
        this.$store.commit('SET_COURSES', mockCourses)
      } finally {
        this.$store.commit('SET_LOADING', { key: 'courses', value: false })
      }
    },
    
    // 原有加载课程方法（兼容）
    async loadCoursesDoc() {
      await this.loadCoursesWithSearch()
    },
    
    async onFilterChange(key, value) {
      await this.updateFilter({ key, value })
      await this.loadCoursesWithSearch(this.searchKeyword)
    },

  
    viewCourseDetails(course) {
      this.selectCourse(course)
      // 加载课程评论
      this.loadCourseComments(course.id)
    },
    
    // 加载课程评论
    async loadCourseComments(courseId) {
      try {
        this.$store.commit('SET_LOADING', { key: 'comments', value: true })
        const comments = await this.fetchCourseComments(courseId)
        
        console.log('实际获取的评论数据:', comments)
        
        // 增强兼容性：如果接口返回空列表，显示友好提示但不影响用户体验
        if (comments && comments.length === 0) {
          console.log('当前课程暂无评论数据')
        }
        
        this.$store.commit('SET_COMMENTS', comments || [])
      } catch (error) {
        this.$store.commit('SET_LOADING', { key: 'comments', value: false })
        console.error('加载课程评论失败:', {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message
        })
        
        // 直接使用兜底数据，确保用户可以看到评论列表的示例
        const mockComments = [
          {
            id: '1',
            author: '学生A',
            rating: 5,
            date: '2024-01-15',
            content: '这门课程非常棒，老师讲解清晰，内容丰富，收获很大！',
            likes: 12,
            liked: false
          },
          {
            id: '2',
            author: '学生B',
            rating: 4,
            date: '2024-01-10',
            content: '课程内容很实用，但是作业量有点大，需要花费较多时间。',
            likes: 8,
            liked: true
          },
          {
            id: '3',
            author: '学生C',
            rating: 5,
            date: '2024-01-05',
            content: '老师很负责任，课堂互动性强，推荐给大家！',
            likes: 15,
            liked: false
          }
        ]
        this.$store.commit('SET_COMMENTS', mockComments)
      } finally {
        this.$store.commit('SET_LOADING', { key: 'comments', value: false })
      }
    },
    backToCourseList() {
      this.$store.commit('SET_SELECTED_COURSE', null)
    },
    setRating(rating) {
      this.$store.commit('SET_USER_RATING', { 
        rating, 
        comment: this.userRating.comment 
      })
    },
    async submitRating() {
      if (this.userRating.rating > 0 && this.userRating.comment.trim()) {
        try {
          const newComment = await this.$store.dispatch('submitRating', {
            rating: this.userRating.rating,
            comment: this.userRating.comment
          })
          // 提交成功后刷新评论列表
          await this.loadCourseComments(this.selectedCourse.id)
          alert('评价提交成功！')
        } catch (error) {
          console.error('提交课程评价失败:', {
            status: error?.response?.status,
            data: error?.response?.data,
            url: error?.config?.url
          })
          const msg = error?.response?.data?.message || error?.message || '提交失败，后端报错(500)'
          alert(msg)
        }
      } else {
        alert('请选择评分并填写评论')
      }
    },
    
    // 切换评论点赞状态
    async toggleCourseCommentLike(comment) {
      try {
        if (comment.liked) {
          await this.$store.dispatch('unlikeCourseComment', comment.id)
        } else {
          await this.$store.dispatch('likeCourseComment', comment.id)
        }
        // 更新本地评论数据
        const updatedComment = this.comments.find(c => c.id === comment.id)
        if (updatedComment) {
          updatedComment.liked = !updatedComment.liked
          updatedComment.likes = updatedComment.liked 
            ? (updatedComment.likes || 0) + 1 
            : Math.max((updatedComment.likes || 0) - 1, 0)
        }
      } catch (error) {
        console.error('点赞操作失败:', error)
        alert('操作失败，请稍后重试')
      }
    },
    handleImageError(event) {
      // 图片加载失败时显示占位符
      event.target.style.display = 'none'
      event.target.nextElementSibling.style.display = 'flex'
    },
    getTeacherAvatar(instructor) {
      // 根据教师姓名返回头像
      const avatars = {
        '张教授': '/images/avatars/teacher.svg',
        '李教授': '/images/avatars/teacher.svg',
        '王教授': '/images/avatars/teacher.svg'
      }
      return avatars[instructor] || '/images/avatars/teacher.svg'
    },
    getTeacherInfo(instructor) {
      // 模拟教师详细信息
      const teacherInfo = {
        '张教授': {
          title: '教授',
          research: '计算机科学、人工智能',
          experience: '15年',
          email: 'zhang@university.edu',
          bio: '张教授是计算机科学领域的知名专家，专注于人工智能和机器学习研究。在国内外顶级期刊发表论文50余篇，主持多项国家级科研项目。教学经验丰富，深受学生喜爱。',
          achievements: [
            '国家自然科学基金重点项目主持人',
            'IEEE Fellow',
            '获得国家教学成果奖',
            '指导学生获得国际竞赛金奖'
          ]
        },
        '李教授': {
          title: '副教授',
          research: '数据结构、算法设计',
          experience: '12年',
          email: 'li@university.edu',
          bio: '李教授在数据结构和算法设计方面有深入研究，编写了多本经典教材。注重理论与实践结合，培养学生的编程能力和算法思维。',
          achievements: [
            '编写《数据结构与算法》教材',
            'ACM竞赛金牌教练',
            '获得省级教学名师称号',
            '主持多项算法优化项目'
          ]
        },
        '王教授': {
          title: '教授',
          research: '宏观经济学、经济政策',
          experience: '18年',
          email: 'wang@university.edu',
          bio: '王教授是宏观经济学领域的权威专家，长期从事经济政策研究。曾担任政府经济顾问，在宏观经济调控方面有丰富经验。',
          achievements: [
            '政府经济政策顾问',
            '发表SSCI论文30余篇',
            '获得经济学杰出贡献奖',
            '主持国家社科基金重大项目'
          ]
        }
      }
      return teacherInfo[instructor] || {
        title: '教授',
        research: '相关领域研究',
        experience: '10年',
        email: 'teacher@university.edu',
        bio: '该教师在教学和科研方面都有丰富经验，致力于培养学生的专业能力和创新思维。',
        achievements: [
          '丰富的教学经验',
          '多项科研成果',
          '深受学生好评'
        ]
      }
    },
    handleTeacherAvatarError(event) {
      // 教师头像加载失败时显示占位符
      event.target.src = '/images/avatars/teacher.svg'
    },
    async toggleCourseCommentLike(comment) {
      if (!this.$store.getters.isAuthenticated) {
        this.$root?.$emit?.('message', '请先登录后再点赞', 'error')
        return
      }
      const id = comment.id
      try {
        if (comment.liked) {
          await this.$store.dispatch('unlikeCourseComment', id)
          this.$root?.$emit?.('message', '已取消点赞', 'success')
        } else {
          await this.$store.dispatch('likeCourseComment', id)
          this.$root?.$emit?.('message', '已点赞', 'success')
        }
      } catch (error) {
        const status = error?.response?.status
        const msg = error?.response?.data?.message || error?.message || '操作失败'
        console.error('课程评论点赞操作失败:', { id, likedBefore: comment.liked, status, msg })
        this.$root?.$emit?.('message', msg, 'error')
      }
    }
  },
  watch: {
    selectedCourse: {
      immediate: false,
      async handler(course) {
        try {
          if (course && course.id) {
            await this.$store.dispatch('fetchCourseComments', course.id)
          } else {
            // 未选中课程时，清空评论，避免残留
            this.$store.commit('SET_COMMENTS', [])
          }
        } catch (error) {
          console.error('加载课程评论失败:', {
            status: error?.response?.status,
            data: error?.response?.data
          })
          const msg = error?.response?.data?.message || error?.message || '加载课程评论失败'
          this.$root?.$emit?.('message', msg, 'error')
        }
      }
    }
  },
  async created() {
    try {
      // 直接调用loadCoursesDoc函数替代store的fetchCourses action
      // 这样可以利用loadCoursesDoc中完善的数据处理逻辑
      await this.loadCoursesDoc()
      // 新增：如果进入页面时已有选中课程，主动拉取该课程评论
      if (this.selectedCourse?.id) {
        await this.$store.dispatch('fetchCourseComments', this.selectedCourse.id)
      }
    } catch (error) {
      console.error('加载课程失败:', error)
      // 即使出错，也尝试使用state中已有的数据
      // 如果仍然没有数据，才显示错误
      if (!this.$store.state.courses || this.$store.state.courses.length === 0) {
        this.$store.commit('SET_ERROR', {
          title: '加载失败',
          message: '无法加载课程列表，请稍后重试'
        })
      }
    }
  }
}
</script>
