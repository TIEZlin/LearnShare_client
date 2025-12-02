<template>
  <div class="px-8 py-6">
    <div class="grid grid-cols-4 gap-6">
      <div class="col-span-1">
        <div class="card p-4">
          <h2 class="text-xl font-bold mb-4">管理面板</h2>
          <ul class="space-y-2">
            <li
              v-for="menu in menuItems"
              :key="menu.key"
              class="py-2 px-3 rounded-md font-medium flex items-center cursor-pointer"
              :class="activeMenu === menu.key ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'"
              @click="activeMenu = menu.key"
            >
              <span class="iconify mr-2" :data-icon="menu.icon"></span>
              {{ menu.label }}
            </li>
          </ul>
        </div>
      </div>

      <div class="col-span-3 space-y-6">
        <!-- 数据概览 -->
        <section v-if="activeMenu === 'overview'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="stat in statCards"
              :key="stat.key"
              class="stats-card"
            >
              <div class="flex justify-between">
                <h3 class="text-lg font-bold">{{ stat.title }}</h3>
                <div
                  class="rounded-md p-2"
                  :class="stat.bgClass"
                >
                  <span
                    class="iconify text-xl"
                    :class="stat.colorClass"
                    :data-icon="stat.icon"
                  ></span>
                </div>
              </div>
              <p class="text-3xl font-bold mt-4">{{ stat.value }}</p>
              <p class="text-green-500 mt-1 flex items-center">
                <span class="iconify" data-icon="mdi:arrow-top-right"></span>
                <span>{{ stat.growth }}% 增长率</span>
              </p>
            </div>
          </div>

          <!-- 数据分布扇形图 -->
          <div class="card p-6">
            <h2 class="text-xl font-bold mb-4">数据分布</h2>
            <div class="flex flex-col md:flex-row items-center justify-center gap-8">
              <div class="relative" style="width: 200px; height: 200px;">
                <svg width="200" height="200" viewBox="0 0 200 200" style="position: absolute; top: 0; left: 0;">
                  <path
                    v-for="(segment, index) in pieChartData"
                    :key="index"
                    :d="segment.path"
                    :fill="segment.color"
                    class="transition-all duration-500 hover:opacity-80"
                    :style="{ 
                      opacity: segment.value > 0 ? 1 : 0,
                      stroke: '#fff',
                      strokeWidth: 2,
                      cursor: 'pointer'
                    }"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="text-center">
                    <div class="text-2xl font-bold">{{ totalCount.toLocaleString() }}</div>
                    <div class="text-sm text-gray-500">总计</div>
                  </div>
                </div>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(segment, index) in pieChartData"
                  :key="index"
                  class="flex items-center gap-3"
                >
                  <div
                    class="w-4 h-4 rounded-full"
                    :style="{ backgroundColor: segment.color }"
                  ></div>
                  <div class="flex-1">
                    <div class="font-medium">{{ segment.label }}</div>
                    <div class="text-sm text-gray-500">{{ segment.value }} ({{ segment.percentage }}%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h2 class="text-xl font-bold">最近待审核资源</h2>
                <p class="text-sm text-gray-500">来自内容审核接口</p>
              </div>
              <button class="btn-secondary text-sm" @click="activeMenu = 'review'">
                查看全部
              </button>
            </div>

            <div v-if="pendingResources.length === 0" class="text-gray-500">
              暂无待审核资源。
            </div>
            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 text-gray-600 font-medium">对象</th>
                    <th class="text-left py-3 text-gray-600 font-medium">原因</th>
                    <th class="text-left py-3 text-gray-600 font-medium">提交者</th>
                    <th class="text-left py-3 text-gray-600 font-medium">提交时间</th>
                    <th class="text-left py-3 text-gray-600 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="review in pendingResources.slice(0, 5)"
                    :key="review.id"
                    class="border-b border-gray-100"
                  >
                    <td class="py-3 font-medium">{{ review.title }}</td>
                    <td class="py-3 text-gray-600">{{ review.reason }}</td>
                    <td class="py-3 text-gray-600">{{ review.reporter }}</td>
                    <td class="py-3 text-gray-600">{{ review.createdAt }}</td>
                    <td class="py-3 space-x-2">
                      <button class="btn-secondary text-xs" @click="handleReviewAction(review, 'reject')">驳回</button>
                      <button class="btn-primary text-xs" @click="handleReviewAction(review, 'approve')">通过</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- 用户管理 -->
        <section v-else-if="activeMenu === 'users'" class="space-y-6">
          <div class="card p-6">
            <h2 class="text-xl font-bold mb-4">新增用户</h2>
            <form class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="submitNewUser">
              <input v-model.trim="newUserForm.username" class="border border-gray-300 rounded-md py-2 px-4" placeholder="用户名 *">
              <input v-model.trim="newUserForm.email" type="email" class="border border-gray-300 rounded-md py-2 px-4" placeholder="邮箱 *">
              <input v-model="newUserForm.password" type="password" class="border border-gray-300 rounded-md py-2 px-4" placeholder="初始密码 *">
              <select v-model="newUserForm.role_id" class="border border-gray-300 rounded-md py-2 px-4">
                <option value="">选择角色</option>
                <option v-for="role in roleOptions" :key="role.value" :value="role.value">{{ role.label }}</option>
              </select>
              <select v-model="newUserForm.status" class="border border-gray-300 rounded-md py-2 px-4">
                <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
              </select>
              <div class="md:col-span-2">
                <button class="btn-primary" type="submit">创建用户</button>
              </div>
            </form>
          </div>

          <div class="card p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 class="text-xl font-bold">用户列表</h2>
              <div class="flex flex-col md:flex-row gap-3 md:items-center">
                <input
                  type="text"
                  placeholder="搜索用户..."
                  class="border border-gray-300 rounded-md py-2 px-4 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="userSearchKeyword"
                >
                <button class="btn-secondary text-sm" @click="reloadUsers">刷新列表</button>
              </div>
            </div>

            <div v-if="filteredUsers.length === 0" class="text-gray-500">暂无用户数据。</div>
            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 text-gray-600 font-medium">用户ID</th>
                    <th class="text-left py-3 text-gray-600 font-medium">用户名</th>
                    <th class="text-left py-3 text-gray-600 font-medium">学院</th>
                    <th class="text-left py-3 text-gray-600 font-medium">账户状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="user in filteredUsers"
                    :key="user.id"
                    class="border-b border-gray-100"
                  >
                    <td class="py-3">{{ user.id }}</td>
                    <td class="py-3 font-medium">{{ user.name || user.username }}</td>
                    <td class="py-3 text-gray-600">{{ user.college || user.college_name || '—' }}</td>
                    <td class="py-3">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="getStatusClass(user.status)"
                      >
                        {{ user.status || 'active' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- 课程管理 -->
        <section v-else-if="activeMenu === 'courses'" class="card p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 class="text-xl font-bold">课程管理</h2>
              <p class="text-sm text-gray-500">基于课程列表，可快速定位异常课程并删除</p>
            </div>
            <div class="flex flex-col md:flex-row gap-3 md:items-center">
              <input
                v-model.trim="courseSearchKeyword"
                type="text"
                placeholder="搜索课程..."
                class="border border-gray-300 rounded-md py-2 px-4 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <button class="btn-secondary text-sm" @click="reloadCourses">刷新列表</button>
            </div>
          </div>
          <div v-if="courseList.length === 0" class="text-gray-500">暂无课程数据。</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 text-gray-600 font-medium w-12">ID</th>
                  <th class="text-left py-3 text-gray-600 font-medium">课程名称</th>
                  <th class="text-left py-3 text-gray-600 font-medium">授课教师</th>
                  <th class="text-left py-3 text-gray-600 font-medium">所属学院</th>
                  <th class="text-left py-3 text-gray-600 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="course in courseList"
                  :key="course.id"
                  class="border-b border-gray-100"
                >
                  <td class="py-3 text-gray-500">{{ course.id }}</td>
                  <td class="py-3 font-medium">{{ course.title || course.name }}</td>
                  <td class="py-3 text-gray-600">{{ course.instructor || course.teacher || '—' }}</td>
                  <td class="py-3 text-gray-600">{{ course.college || course.collegeName || '—' }}</td>
                  <td class="py-3 space-x-2">
                    <button class="btn-secondary text-xs" @click="viewCourseDetail(course)">查看</button>
                    <button class="btn-primary text-xs" @click="handleDeleteCourse(course)">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 资源管理 -->
        <section v-else-if="activeMenu === 'resources'" class="card p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 class="text-xl font-bold">资源管理</h2>
              <p class="text-sm text-gray-500">可查看平台资源，执行删除等运维操作</p>
            </div>
            <div class="flex flex-col md:flex-row gap-3 md:items-center">
              <input
                v-model.trim="resourceSearchKeyword"
                type="text"
                placeholder="搜索资源..."
                class="border border-gray-300 rounded-md py-2 px-4 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <button class="btn-secondary text-sm" @click="reloadResources">刷新列表</button>
            </div>
          </div>
          <div v-if="resourceList.length === 0" class="text-gray-500">暂无资源数据。</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 text-gray-600 font-medium w-12">ID</th>
                  <th class="text-left py-3 text-gray-600 font-medium">资源标题</th>
                  <th class="text-left py-3 text-gray-600 font-medium">课程 / 类型</th>
                  <th class="text-left py-3 text-gray-600 font-medium">上传者</th>
                  <th class="text-left py-3 text-gray-600 font-medium">下载 / 评分</th>
                  <th class="text-left py-3 text-gray-600 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="resource in resourceList"
                  :key="resource.id"
                  class="border-b border-gray-100"
                >
                  <td class="py-3 text-gray-500">{{ resource.id }}</td>
                  <td class="py-3 font-medium">{{ resource.title }}</td>
                  <td class="py-3 text-gray-600">
                    <div>{{ resource.course || '未关联课程' }}</div>
                    <div class="text-xs text-gray-400">{{ resource.type || resource.fileType }}</div>
                  </td>
                  <td class="py-3 text-gray-600">{{ resource.author || resource.uploaderId || '—' }}</td>
                  <td class="py-3 text-gray-600 text-sm">
                    <div>下载：{{ resource.downloads ?? resource.downloadCount ?? 0 }}</div>
                    <div>评分：{{ resource.rating ?? resource.averageRating ?? '—' }}</div>
                  </td>
                  <td class="py-3 space-x-2">
                    <button class="btn-secondary text-xs" @click="viewResourceDetail(resource)">查看</button>
                    <button class="btn-primary text-xs" @click="handleDeleteResource(resource)">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 内容审核 -->
        <section v-else-if="activeMenu === 'review'" class="card p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div>
              <h2 class="text-xl font-bold">内容审核</h2>
              <p class="text-sm text-gray-500">审核待处理的内容，包括资源、课程和评论</p>
            </div>
            <div class="flex flex-col md:flex-row gap-3 md:items-center">
              <select v-model="reviewType" class="border border-gray-300 rounded-md py-2 px-4 w-full md:w-64" @change="loadReviewList">
                <option v-for="type in reviewTypeOptions" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
              <button class="btn-secondary text-sm" @click="loadReviewList" :disabled="reviewLoading">
                {{ reviewLoading ? '加载中...' : '刷新列表' }}
              </button>
            </div>
          </div>
          
          <div v-if="reviewLoading" class="text-gray-500 text-center py-8">加载中...</div>
          <div v-else-if="currentReviewList.length === 0" class="text-gray-500 text-center py-8">
            暂无待审核任务。
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 text-gray-600 font-medium">ID</th>
                  <th class="text-left py-3 text-gray-600 font-medium">对象</th>
                  <th class="text-left py-3 text-gray-600 font-medium">类型</th>
                  <th class="text-left py-3 text-gray-600 font-medium">原因</th>
                  <th class="text-left py-3 text-gray-600 font-medium">提交者</th>
                  <th class="text-left py-3 text-gray-600 font-medium">优先级</th>
                  <th class="text-left py-3 text-gray-600 font-medium">状态</th>
                  <th class="text-left py-3 text-gray-600 font-medium">提交时间</th>
                  <th class="text-left py-3 text-gray-600 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="review in currentReviewList"
                  :key="review.id"
                  class="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td class="py-3 text-gray-500 text-sm">{{ review.id }}</td>
                  <td class="py-3 font-medium">
                    <div>{{ review.title }}</div>
                    <div class="text-xs text-gray-400">目标ID: {{ review.targetId || '—' }}</div>
                  </td>
                  <td class="py-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ review.targetType || '—' }}
                    </span>
                  </td>
                  <td class="py-3 text-gray-600 max-w-xs">
                    <div class="truncate" :title="review.reason">{{ review.reason || '—' }}</div>
                  </td>
                  <td class="py-3 text-gray-600">{{ review.reporter || '系统' }}</td>
                  <td class="py-3">
                    <span 
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getPriorityClass(review.priority)"
                    >
                      {{ getPriorityText(review.priority) }}
                    </span>
                  </td>
                  <td class="py-3">
                    <span 
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getReviewStatusClass(review.status)"
                    >
                      {{ getReviewStatusText(review.status) }}
                    </span>
                  </td>
                  <td class="py-3 text-gray-600 text-sm">{{ review.createdAt || '—' }}</td>
                  <td class="py-3">
                    <div class="flex flex-col gap-1">
                      <button 
                        class="btn-primary text-xs px-3 py-1" 
                        @click="handleReviewAction(review, 'approve')"
                        :disabled="review.status === 'approved' || review.status === 'rejected'"
                      >
                        通过
                      </button>
                      <button 
                        class="btn-secondary text-xs px-3 py-1" 
                        @click="handleReviewAction(review, 'reject')"
                        :disabled="review.status === 'approved' || review.status === 'rejected'"
                      >
                        驳回
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 系统设置 -->
        <section v-else-if="activeMenu === 'settings'" class="space-y-6">
          <div class="card p-6">
            <h2 class="text-xl font-bold mb-4">学院管理</h2>
            <form class="flex flex-col md:flex-row gap-4" @submit.prevent="submitCollege">
              <input v-model.trim="newCollegeName" class="border border-gray-300 rounded-md py-2 px-4 flex-1" placeholder="学院名称 *">
              <button class="btn-primary" type="submit">新增学院</button>
            </form>
          </div>

          <div class="card p-6">
            <h2 class="text-xl font-bold mb-4">专业管理</h2>
            <form class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="submitMajor">
              <input v-model.trim="newMajorForm.major_name" class="border border-gray-300 rounded-md py-2 px-4" placeholder="专业名称 *">
              <input v-model.trim="newMajorForm.college_id" class="border border-gray-300 rounded-md py-2 px-4" placeholder="所属学院ID *">
              <div class="md:col-span-2">
                <button class="btn-primary" type="submit">新增专业</button>
              </div>
            </form>
          </div>

          <div class="card p-6">
            <h2 class="text-xl font-bold mb-4">教师管理</h2>
            <form class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="submitTeacher">
              <input v-model.trim="newTeacherForm.teacher_name" class="border border-gray-300 rounded-md py-2 px-4" placeholder="教师姓名 *">
              <input v-model.trim="newTeacherForm.college_id" class="border border-gray-300 rounded-md py-2 px-4" placeholder="学院ID *">
              <input v-model.trim="newTeacherForm.email" type="email" class="border border-gray-300 rounded-md py-2 px-4" placeholder="邮箱 *">
              <textarea v-model="newTeacherForm.introduction" class="border border-gray-300 rounded-md py-2 px-4 md:col-span-2" rows="3" placeholder="简介"></textarea>
              <label class="md:col-span-2 flex items-center space-x-3 text-sm text-gray-600">
                <input type="file" accept="image/*" @change="handleTeacherAvatarChange">
                <span>{{ newTeacherForm.avatar ? newTeacherForm.avatar.name : '上传头像（可选）' }}</span>
              </label>
              <div class="md:col-span-2">
                <button class="btn-primary" type="submit">新增教师</button>
              </div>
            </form>
          </div>
        </section>

        <!-- 占位 -->
        <section v-else class="card p-6 text-gray-600">
          <h2 class="text-xl font-bold mb-2">功能规划中</h2>
          <p>该功能将按照管理员接口逐步完善。</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Admin',
  data() {
    return {
      activeMenu: 'overview',
      userSearchKeyword: '',
      courseSearchKeyword: '',
      resourceSearchKeyword: '',
      reviewType: 'resources',
      reviewLoading: false,
      newUserForm: {
        username: '',
        email: '',
        password: '',
        role_id: '',
        status: 'active'
      },
      newCollegeName: '',
      newMajorForm: {
        major_name: '',
        college_id: ''
      },
      newTeacherForm: {
        teacher_name: '',
        college_id: '',
        introduction: '',
        email: '',
        avatar: null
      },
      menuItems: [
        { key: 'overview', label: '数据概览', icon: 'mdi:view-dashboard' },
        { key: 'users', label: '用户管理', icon: 'mdi:account-group' },
        { key: 'courses', label: '课程管理', icon: 'mdi:book-education' },
        { key: 'resources', label: '资源管理', icon: 'mdi:file-document' },
        { key: 'review', label: '内容审核', icon: 'mdi:check-decagram' },
        { key: 'settings', label: '系统设置', icon: 'mdi:cog' }
      ],
      reviewTypeOptions: [
        { value: 'resources', label: '资源审核' },
        { value: 'courses', label: '课程审核' },
        { value: 'courseComments', label: '课程评论' },
        { value: 'resourceComments', label: '资源评论' }
      ],
      roleOptions: [
        { label: '管理员', value: 1 },
        { label: '教师', value: 2 },
        { label: '学生', value: 3 }
      ],
      statusOptions: ['active', 'limited', 'disabled']
    }
  },
  computed: {
    ...mapState([
      'statistics',
      'pendingResources',
      'pendingCourseReviews',
      'pendingCourseCommentReviews',
      'pendingResourceCommentReviews',
      'users',
      'courses',
      'resources'
    ]),
    courseList() {
      const source = Array.isArray(this.courses) ? this.courses : []
      if (!this.courseSearchKeyword) return source
      return source.filter(course =>
        (course.title || course.name || '').includes(this.courseSearchKeyword) ||
        (course.instructor || course.teacher || '').includes(this.courseSearchKeyword) ||
        (course.college || '').includes(this.courseSearchKeyword)
      )
    },
    resourceList() {
      const source = Array.isArray(this.resources) ? this.resources : []
      if (!this.resourceSearchKeyword) return source
      return source.filter(resource =>
        (resource.title || '').includes(this.resourceSearchKeyword) ||
        (resource.course || '').includes(this.resourceSearchKeyword) ||
        (resource.author || '').includes(this.resourceSearchKeyword)
      )
    },
    filteredUsers() {
      if (!Array.isArray(this.users)) {
        return []
      }
      if (!this.userSearchKeyword) {
        return this.users
      }
      return this.users.filter(user =>
        (user.name || user.username || '').includes(this.userSearchKeyword) ||
        (user.id || '').toString().includes(this.userSearchKeyword) ||
        (user.college || '').includes(this.userSearchKeyword)
      )
    },
    currentReviewList() {
      if (this.reviewType === 'resources') return this.pendingResources
      if (this.reviewType === 'courses') return this.pendingCourseReviews
      if (this.reviewType === 'courseComments') return this.pendingCourseCommentReviews
      return this.pendingResourceCommentReviews
    },
    statCards() {
      const stats = this.statistics || {}
      return [
        { key: 'users', title: '注册用户', value: stats.totalUsers || 0, growth: stats.userGrowth || 0, icon: 'mdi:account-group', bgClass: 'bg-blue-100', colorClass: 'text-blue-600' },
        { key: 'courses', title: '课程数量', value: stats.totalCourses || 0, growth: stats.courseGrowth || 0, icon: 'mdi:book-education', bgClass: 'bg-green-100', colorClass: 'text-green-600' },
        { key: 'resources', title: '资源数量', value: stats.totalResources || 0, growth: stats.resourceGrowth || 0, icon: 'mdi:file-document', bgClass: 'bg-purple-100', colorClass: 'text-purple-600' }
      ]
    },
    totalCount() {
      const stats = this.statistics || {}
      return (stats.totalUsers || 0) + (stats.totalCourses || 0) + (stats.totalResources || 0)
    },
    pieChartData() {
      const stats = this.statistics || {}
      const users = stats.totalUsers || 0
      const courses = stats.totalCourses || 0
      const resources = stats.totalResources || 0
      const total = users + courses + resources
      
      if (total === 0) {
        return [
          { label: '暂无数据', value: 0, percentage: 0, color: '#e5e7eb', path: '' }
        ]
      }
      
      const centerX = 100
      const centerY = 100
      const radius = 80
      const colors = ['#3b82f6', '#10b981', '#8b5cf6'] // blue, green, purple
      const labels = ['用户', '课程', '资源']
      const values = [users, courses, resources]
      
      let currentAngle = -Math.PI / 2 // 从顶部开始，-90度
      return values.map((value, index) => {
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
        const angle = (value / total) * 2 * Math.PI
        
        // 计算扇形的起始和结束点
        const startAngle = currentAngle
        const endAngle = currentAngle + angle
        currentAngle = endAngle
        
        // 计算起点和终点坐标
        const x1 = centerX + radius * Math.cos(startAngle)
        const y1 = centerY + radius * Math.sin(startAngle)
        const x2 = centerX + radius * Math.cos(endAngle)
        const y2 = centerY + radius * Math.sin(endAngle)
        
        // 大弧标志（如果角度大于180度）
        const largeArcFlag = angle > Math.PI ? 1 : 0
        
        // 生成path路径
        const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
        
        return {
          label: labels[index],
          value: value,
          percentage: percentage,
          color: colors[index],
          path: path
        }
      })
    }
  },
  watch: {
    reviewType() {
      this.loadReviewList()
    },
    activeMenu(newMenu) {
      if (newMenu === 'users') {
        this.ensureUsersLoaded()
      } else if (newMenu === 'courses') {
        this.ensureCoursesLoaded()
      } else if (newMenu === 'resources') {
        this.ensureResourcesLoaded()
      } else if (newMenu === 'review') {
        this.loadReviewList()
      }
    }
  },
  created() {
    this.initializeAdmin()
  },
  methods: {
    ...mapActions([
      'fetchStatistics',
      'fetchUsers',
      'fetchCourses',
      'fetchResources',
      'createAdminUser',
      'createCollege',
      'createMajor',
      'createTeacher',
      'fetchResourceReviewList',
      'fetchCourseReviewList',
      'fetchCourseCommentReviewList',
      'fetchResourceCommentReviewList',
      'processResourceReview',
      'processCourseReview',
      'processCourseCommentReview',
      'processResourceCommentReview',
      'deleteAdminCourse',
      'deleteAdminResource'
    ]),
    async initializeAdmin() {
      try {
        await Promise.all([
          this.fetchStatistics(),
          this.fetchUsers(),
          this.fetchResourceReviewList(),
          this.fetchCourses(),
          this.fetchResources()
        ])
      } catch (error) {
        this.handleError(error, '初始化管理员数据失败')
      }
    },
    async ensureUsersLoaded() {
      if (!Array.isArray(this.users) || this.users.length === 0) {
        try {
          await this.fetchUsers()
        } catch (error) {
          this.handleError(error, '加载用户数据失败')
        }
      }
    },
    async ensureCoursesLoaded() {
      if (!Array.isArray(this.courses) || this.courses.length === 0) {
        try {
          await this.fetchCourses()
        } catch (error) {
          this.handleError(error, '加载课程数据失败')
        }
      }
    },
    async ensureResourcesLoaded() {
      if (!Array.isArray(this.resources) || this.resources.length === 0) {
        try {
          await this.fetchResources()
        } catch (error) {
          this.handleError(error, '加载资源数据失败')
        }
      }
    },
    async reloadCourses() {
      try {
        await this.fetchCourses()
        this.notifySuccess('课程列表已更新')
      } catch (error) {
        this.handleError(error, '刷新课程列表失败')
      }
    },
    async reloadResources() {
      try {
        await this.fetchResources()
        this.notifySuccess('资源列表已更新')
      } catch (error) {
        this.handleError(error, '刷新资源列表失败')
      }
    },
    async reloadUsers() {
      try {
        await this.fetchUsers()
        this.notifySuccess('用户列表已更新')
      } catch (error) {
        this.handleError(error, '刷新用户列表失败')
      }
    },
    viewCourseDetail(course) {
      this.$router.push({ path: '/courses', query: { courseId: course.id } })
    },
    viewResourceDetail(resource) {
      if (resource) {
        this.$store.commit('SET_SELECTED_RESOURCE', resource)
      }
      this.$router.push({ name: 'ResourceDetail' })
    },
    async handleDeleteCourse(course) {
      if (!course?.id) return
      if (!confirm(`确认删除课程「${course.title || course.name}」？`)) return
      try {
        await this.deleteAdminCourse(course.id)
        this.notifySuccess('课程已删除')
        await this.fetchCourses()
      } catch (error) {
        this.handleError(error, '删除课程失败')
      }
    },
    async handleDeleteResource(resource) {
      if (!resource?.id) return
      if (!confirm(`确认删除资源「${resource.title}」？`)) return
      try {
        await this.deleteAdminResource(resource.id)
        this.notifySuccess('资源已删除')
        await this.fetchResources()
      } catch (error) {
        this.handleError(error, '删除资源失败')
      }
    },
    async loadReviewList() {
      this.reviewLoading = true
      try {
        if (this.reviewType === 'resources') {
          await this.fetchResourceReviewList()
        } else if (this.reviewType === 'courses') {
          await this.fetchCourseReviewList()
        } else if (this.reviewType === 'courseComments') {
          await this.fetchCourseCommentReviewList()
        } else {
          await this.fetchResourceCommentReviewList()
        }
      } catch (error) {
        this.handleError(error, '获取审核列表失败')
      } finally {
        this.reviewLoading = false
      }
    },
    async handleReviewAction(review, action) {
      const actionText = action === 'approve' ? '通过' : '驳回'
      if (!confirm(`确认${actionText}审核项「${review.title}」？`)) return
      
      try {
        const payload = { reviewId: review.id, action }
        if (this.reviewType === 'resources') {
          await this.processResourceReview(payload)
        } else if (this.reviewType === 'courses') {
          await this.processCourseReview(payload)
        } else if (this.reviewType === 'courseComments') {
          await this.processCourseCommentReview(payload)
        } else {
          await this.processResourceCommentReview(payload)
        }
        this.notifySuccess(`审核操作已提交：${actionText}`)
        // 刷新列表
        await this.loadReviewList()
      } catch (error) {
        this.handleError(error, '审核操作失败')
      }
    },
    getPriorityClass(priority) {
      if (priority === null || priority === undefined) return 'bg-gray-100 text-gray-800'
      if (priority >= 8) return 'bg-red-100 text-red-800'
      if (priority >= 5) return 'bg-orange-100 text-orange-800'
      if (priority >= 3) return 'bg-yellow-100 text-yellow-800'
      return 'bg-blue-100 text-blue-800'
    },
    getPriorityText(priority) {
      if (priority === null || priority === undefined) return '普通'
      if (priority >= 8) return '紧急'
      if (priority >= 5) return '高'
      if (priority >= 3) return '中'
      return '低'
    },
    getReviewStatusClass(status) {
      const normalized = (status || 'pending').toLowerCase()
      const map = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        processing: 'bg-blue-100 text-blue-800'
      }
      return map[normalized] || 'bg-gray-100 text-gray-800'
    },
    getReviewStatusText(status) {
      const normalized = (status || 'pending').toLowerCase()
      const map = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已驳回',
        processing: '处理中'
      }
      return map[normalized] || '未知'
    },
    async submitNewUser() {
      if (!this.newUserForm.username || !this.newUserForm.email || !this.newUserForm.password || !this.newUserForm.role_id) {
        this.handleError(new Error('请完整填写用户信息'), '请完整填写用户信息')
        return
      }
      try {
        await this.createAdminUser({ ...this.newUserForm })
        this.notifySuccess('用户创建成功')
        this.newUserForm = { username: '', email: '', password: '', role_id: '', status: 'active' }
      } catch (error) {
        this.handleError(error, '创建用户失败')
      }
    },
    async submitCollege() {
      if (!this.newCollegeName) {
        this.handleError(new Error('请输入学院名称'), '请输入学院名称')
        return
      }
      try {
        await this.createCollege({ college_name: this.newCollegeName })
        this.notifySuccess('学院创建成功')
        this.newCollegeName = ''
      } catch (error) {
        this.handleError(error, '创建学院失败')
      }
    },
    async submitMajor() {
      if (!this.newMajorForm.major_name || !this.newMajorForm.college_id) {
        this.handleError(new Error('请输入完整信息'), '请输入完整信息')
        return
      }
      try {
        await this.createMajor({ ...this.newMajorForm })
        this.notifySuccess('专业创建成功')
        this.newMajorForm = { major_name: '', college_id: '' }
      } catch (error) {
        this.handleError(error, '创建专业失败')
      }
    },
    async submitTeacher() {
      if (!this.newTeacherForm.teacher_name || !this.newTeacherForm.college_id || !this.newTeacherForm.email) {
        this.handleError(new Error('请输入完整信息'), '请输入完整信息')
        return
      }
      try {
        const formData = new FormData()
        formData.append('teacher_name', this.newTeacherForm.teacher_name)
        formData.append('college_id', this.newTeacherForm.college_id)
        formData.append('introduction', this.newTeacherForm.introduction || '')
        formData.append('email', this.newTeacherForm.email)
        if (this.newTeacherForm.avatar) {
          formData.append('avatar', this.newTeacherForm.avatar)
        }
        await this.createTeacher(formData)
        this.notifySuccess('教师创建成功')
        this.newTeacherForm = { teacher_name: '', college_id: '', introduction: '', email: '', avatar: null }
      } catch (error) {
        this.handleError(error, '创建教师失败')
      }
    },
    handleTeacherAvatarChange(event) {
      const [file] = event.target.files || []
      this.newTeacherForm.avatar = file || null
    },
    getStatusClass(status) {
      const normalized = (status || 'active').toLowerCase()
      const map = {
        active: 'bg-green-100 text-green-800',
        limited: 'bg-yellow-100 text-yellow-800',
        disabled: 'bg-red-100 text-red-800'
      }
      return map[normalized] || 'bg-gray-100 text-gray-800'
    },
    notifySuccess(message) {
      if (this.$root && this.$root.$emit) {
        this.$root.$emit('message', message, 'success')
      } else {
        alert(message)
      }
    },
    handleError(error, fallbackMessage) {
      const message =
        error?.response?.data?.base_resp?.message ||
        error?.response?.data?.baseResp?.message ||
        error?.message ||
        fallbackMessage ||
        '操作失败'
      if (this.$root && this.$root.$emit) {
        this.$root.$emit('message', message, 'error')
      } else {
        alert(message)
      }
    }
  }
}
</script>






