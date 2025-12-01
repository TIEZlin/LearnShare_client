<template>
  <div class="px-8 py-6">
    <!-- Header with Back Button -->
    <div class="flex items-center mb-6">
      <button @click="$router.push('/profile')" class="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
        <span class="iconify text-xl text-gray-600" data-icon="mdi:arrow-left"></span>
      </button>
      <h1 class="text-2xl font-bold text-gray-800">账户安全</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Password & Authentication -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Password Change Section -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="bg-blue-100 p-3 rounded-full mr-4">
                <span class="iconify text-2xl text-blue-600" data-icon="mdi:lock-reset"></span>
              </div>
              <div>
                <h2 class="text-lg font-bold">修改密码</h2>
                <p class="text-sm text-gray-500">定期修改密码可以保护您的账户安全</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleChangePassword" class="space-y-4 max-w-md">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
              <div class="relative">
                <input 
                  :type="showOldPassword ? 'text' : 'password'" 
                  v-model="passwordForm.oldPassword"
                  class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请输入当前密码"
                />
                <button type="button" @click="showOldPassword = !showOldPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <span class="iconify" :data-icon="showOldPassword ? 'mdi:eye-off' : 'mdi:eye'"></span>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
              <div class="relative">
                <input 
                  :type="showNewPassword ? 'text' : 'password'" 
                  v-model="passwordForm.newPassword"
                  class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请输入新密码（至少6位）"
                />
                <button type="button" @click="showNewPassword = !showNewPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <span class="iconify" :data-icon="showNewPassword ? 'mdi:eye-off' : 'mdi:eye'"></span>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
              <div class="relative">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  v-model="passwordForm.confirmPassword"
                  class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请再次输入新密码"
                />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <span class="iconify" :data-icon="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'"></span>
                </button>
              </div>
            </div>
            <div class="pt-2">
              <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm flex items-center">
                <span class="iconify mr-2" data-icon="mdi:check-circle"></span>
                保存修改
              </button>
            </div>
          </form>
        </div>

        <!-- Login History -->
        <div class="card p-6">
          <h2 class="text-lg font-bold mb-4 flex items-center">
            <span class="iconify mr-2 text-gray-500" data-icon="mdi:history"></span>
            最近登录记录
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="py-3 px-4 text-sm font-medium text-gray-500">设备/浏览器</th>
                  <th class="py-3 px-4 text-sm font-medium text-gray-500">IP地址</th>
                  <th class="py-3 px-4 text-sm font-medium text-gray-500">时间</th>
                  <th class="py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(log, index) in loginHistory" :key="index" class="hover:bg-gray-50 transition-colors">
                  <td class="py-3 px-4 text-sm">
                    <div class="flex items-center">
                      <span class="iconify mr-2 text-lg text-gray-400" :data-icon="getDeviceIcon(log.device)"></span>
                      {{ log.device }}
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-600">{{ log.ip }}</td>
                  <td class="py-3 px-4 text-sm text-gray-600">{{ log.time }}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs rounded-full" :class="log.status === '成功' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                      {{ log.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Bindings & Danger Zone -->
      <div class="lg:col-span-1 space-y-8">
        <!-- Account Bindings -->
        <div class="card p-6">
          <h2 class="text-lg font-bold mb-6">账号绑定</h2>
          
          <div class="space-y-6">
            <!-- Email Binding -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span class="iconify text-xl text-indigo-600" data-icon="mdi:email"></span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">邮箱绑定</p>
                  <p class="text-xs text-gray-500">{{ userEmail }}</p>
                </div>
              </div>
              <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                {{ userEmail !== '未绑定' ? '更换' : '绑定' }}
              </button>
            </div>

            <!-- Phone Binding -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span class="iconify text-xl text-green-600" data-icon="mdi:cellphone"></span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">手机绑定</p>
                  <p class="text-xs text-gray-500">{{ user.phone || '未绑定' }}</p>
                </div>
              </div>
              <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                {{ user.phone ? '更换' : '绑定' }}
              </button>
            </div>

            <!-- WeChat Binding (Mock) -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                  <span class="iconify text-xl text-green-500" data-icon="mdi:wechat"></span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">微信绑定</p>
                  <p class="text-xs text-gray-500">未绑定</p>
                </div>
              </div>
              <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">绑定</button>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="card p-6">
          <h2 class="text-lg font-bold mb-4">安全设置</h2>
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p class="font-medium text-gray-900">两步验证</p>
              <p class="text-xs text-gray-500">登录时需要验证码</p>
            </div>
            <div class="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
              <input type="checkbox" name="toggle" id="toggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
              <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="card p-6 border border-red-100 bg-red-50">
          <h2 class="text-lg font-bold text-red-700 mb-2">危险区域</h2>
          <p class="text-sm text-red-600 mb-4">删除账户将永久清除所有数据，此操作不可恢复。</p>
          <button @click="handleDeleteAccount" class="w-full py-2 px-4 bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
            删除账户
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { authAPI } from '../api/auth'

export default {
  name: 'AccountSecurity',
  data() {
    return {
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      loginHistory: [
        { device: 'Chrome (Windows)', ip: '192.168.1.101', time: '2024-05-20 14:30', status: '成功' },
        { device: 'Safari (iPhone)', ip: '10.0.0.5', time: '2024-05-19 09:15', status: '成功' },
        { device: 'Firefox (Mac)', ip: '172.16.0.23', time: '2024-05-18 18:45', status: '成功' },
        { device: 'Chrome (Windows)', ip: '192.168.1.101', time: '2024-05-15 10:20', status: '失败' }
      ]
    }
  },
  computed: {
    ...mapState(['user', 'currentUser']), // Add currentUser
    userEmail() {
        return this.currentUser?.email || this.user?.email || '未绑定'
    }
  },
  methods: {
    getDeviceIcon(device) {
      if (device.includes('Windows')) return 'mdi:microsoft-windows';
      if (device.includes('Mac')) return 'mdi:apple';
      if (device.includes('iPhone') || device.includes('Android')) return 'mdi:cellphone';
      return 'mdi:monitor';
    },
    async handleChangePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        alert('两次输入的密码不一致');
        return;
      }
      if (this.passwordForm.newPassword.length < 6) {
        alert('新密码长度至少为6位');
        return;
      }

      try {
        // Note: In a real app, you would verify oldPassword first.
        // Since we don't have a specific change-password endpoint that takes oldPassword in the mock API,
        // we might just simulate it or call a reset endpoint.
        // For now, let's simulate a successful change.
        
        // await authAPI.changePassword(this.passwordForm); 
        
        console.log('Password change requested', this.passwordForm);
        alert('密码修改成功！请重新登录。');
        
        // Simulate logout
        // await authAPI.logout();
        // this.$router.push('/login');
        
        // Clear form
        this.passwordForm = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      } catch (error) {
        console.error('Failed to change password', error);
        alert('密码修改失败，请稍后重试');
      }
    },
    handleDeleteAccount() {
      if (confirm('确定要删除您的账户吗？此操作不可恢复！')) {
        alert('为了您的安全，请联系管理员进行账户注销。');
      }
    }
  }
}
</script>

<style scoped>
/* Toggle Switch Styles */
.toggle-checkbox:checked {
  @apply: right-0 border-green-400;
  right: 0;
  border-color: #68D391;
}
.toggle-checkbox:checked + .toggle-label {
  @apply: bg-green-400;
  background-color: #68D391;
}
.toggle-checkbox {
  right: 0;
  z-index: 1;
  transition: all 0.3s;
}
.toggle-label {
  width: 3rem;
  height: 1.5rem;
}
.toggle-checkbox {
    position: absolute;
    top: 0;
    left: 0;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 9999px;
    appearance: none;
    -webkit-appearance: none;
    border: 2px solid #CBD5E0;
    background-color: #fff;
    transition: all 0.3s;
    cursor: pointer;
}
.toggle-checkbox:checked {
    left: 1.5rem;
    border-color: #48BB78;
}
.toggle-checkbox:checked + .toggle-label {
    background-color: #48BB78;
}
.toggle-label {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border-radius: 9999px;
    height: 1.5rem;
    width: 3rem;
    background-color: #CBD5E0;
    transition: background-color 0.3s;
}
</style>


