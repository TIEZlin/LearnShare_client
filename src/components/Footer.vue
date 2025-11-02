<template>
  <footer class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
    <div class="container mx-auto px-8 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center mb-2 md:mb-0">
          <span class="iconify text-2xl mr-2 text-blue-400" data-icon="mdi:school"></span>
          <span class="font-semibold">智慧选课平台</span>
        </div>
        <div class="flex items-center space-x-6 text-sm">
          <router-link to="/" class="text-gray-300 hover:text-white transition-colors">首页</router-link>
          <router-link to="/resources" class="text-gray-300 hover:text-white transition-colors">资源广场</router-link>
          <router-link to="/courses" class="text-gray-300 hover:text-white transition-colors">全部课程</router-link>
        </div>
        <div class="text-center md:text-right mt-2 md:mt-0">
          <p class="text-gray-400 text-xs">
            © 2024 智慧选课平台. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  methods: {
    handleLogoError(event) {
      event.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
footer {
  background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
}

/* 响应式调整 */
@media (max-width: 768px) {
  footer {
    text-align: center;
  }
}
</style>

