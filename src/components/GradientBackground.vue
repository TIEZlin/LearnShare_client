<template>
  <canvas 
    ref="canvas"
    class="fixed inset-0 w-full h-full"
    style="z-index: 0; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);"
  ></canvas>
</template>

<script>
export default {
  name: 'GradientBackground',
    data() {
    return {
      canvas: null,
      ctx: null,
      animationId: null,
      particles: [],
      numParticles: 6,
      speed: 0.3,
      maxRadius: 250,
      minRadius: 120,
      mouseX: 0,
      mouseY: 0,
      mouseActive: false,
      attractionStrength: 0.02 // 鼠标吸引力强度
    }
  },
  mounted() {
    this.initCanvas()
    this.createParticles()
    this.animate()
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseenter', this.handleMouseEnter)
    window.addEventListener('mouseleave', this.handleMouseLeave)
  },
  beforeDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseenter', this.handleMouseEnter)
    window.removeEventListener('mouseleave', this.handleMouseLeave)
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas
      this.ctx = this.canvas.getContext('2d')
      this.resizeCanvas()
    },
    resizeCanvas() {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
    },
    handleResize() {
      this.resizeCanvas()
      // 重置粒子位置，避免超出画布
      this.particles.forEach(particle => {
        if (particle.x > this.canvas.width) particle.x = this.canvas.width
        if (particle.y > this.canvas.height) particle.y = this.canvas.height
      })
    },
    handleMouseMove(e) {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
      this.mouseActive = true
    },
    handleMouseEnter() {
      this.mouseActive = true
    },
    handleMouseLeave() {
      this.mouseActive = false
    },
    createParticles() {
      const colors = [
        { r: 59, g: 130, b: 246 },   // blue-500 - 适合浅色背景
        { r: 139, g: 92, b: 246 },    // purple-500 - 更柔和的紫色
        { r: 236, g: 72, b: 153 },    // pink-500
        { r: 34, g: 197, b: 94 },     // green-500
        { r: 251, g: 146, b: 60 },     // orange-400 - 更柔和的橙色
        { r: 168, g: 85, b: 247 }     // purple-500
      ]
      
      this.particles = []
      for (let i = 0; i < this.numParticles; i++) {
        const angle = (Math.PI * 2 * i) / this.numParticles + Math.random() * 0.5
        const distance = Math.min(this.canvas.width, this.canvas.height) * 0.3
        this.particles.push({
          x: this.canvas.width / 2 + Math.cos(angle) * distance,
          y: this.canvas.height / 2 + Math.sin(angle) * distance,
          radius: this.minRadius + Math.random() * (this.maxRadius - this.minRadius),
          vx: (Math.random() - 0.5) * this.speed,
          vy: (Math.random() - 0.5) * this.speed,
          color: colors[i % colors.length],
          targetX: this.canvas.width / 2 + Math.cos(angle) * distance,
          targetY: this.canvas.height / 2 + Math.sin(angle) * distance,
          oscillation: Math.random() * Math.PI * 2 // 振荡相位
        })
      }
    },
    updateParticles() {
      this.particles.forEach((particle, index) => {
        // 振荡效果 - 让粒子围绕目标位置缓慢移动
        particle.oscillation += 0.01
        const offsetX = Math.cos(particle.oscillation) * 50
        const offsetY = Math.sin(particle.oscillation + index) * 50
        
        // 基础目标位置（中心振荡）
        let baseTargetX = this.canvas.width / 2 + offsetX
        let baseTargetY = this.canvas.height / 2 + offsetY
        
        // 如果鼠标激活，计算鼠标对粒子的吸引力
        if (this.mouseActive) {
          const dx = this.mouseX - particle.x
          const dy = this.mouseY - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // 避免除零错误
          if (distance > 0) {
            // 距离越近，吸引力越强（使用反平方定律）
            const maxDistance = Math.max(this.canvas.width, this.canvas.height)
            const normalizedDistance = Math.min(distance / maxDistance, 1)
            const attraction = (1 - normalizedDistance) * this.attractionStrength * 10
            
            // 计算向鼠标方向的力
            const forceX = (dx / distance) * attraction
            const forceY = (dy / distance) * attraction
          
            // 应用到目标位置
            baseTargetX += forceX * 50
            baseTargetY += forceY * 50
            
            // 同时也更新速度，让粒子有惯性跟随
            particle.vx += forceX
            particle.vy += forceY
          }
        }
        
        particle.targetX = baseTargetX
        particle.targetY = baseTargetY
        
        // 平滑移动到目标位置
        particle.x += (particle.targetX - particle.x) * 0.02
        particle.y += (particle.targetY - particle.y) * 0.02
        
        // 添加随机速度变化（仅在鼠标不活跃时）
        if (!this.mouseActive) {
          particle.vx += (Math.random() - 0.5) * 0.02
          particle.vy += (Math.random() - 0.5) * 0.02
        }
        
        // 限制速度
        particle.vx = Math.max(-this.speed, Math.min(this.speed, particle.vx))
        particle.vy = Math.max(-this.speed, Math.min(this.speed, particle.vy))
        
        // 更新位置
        particle.x += particle.vx
        particle.y += particle.vy
        
        // 边界反弹
        if (particle.x < -particle.radius || particle.x > this.canvas.width + particle.radius) {
          particle.vx *= -0.8
        }
        if (particle.y < -particle.radius || particle.y > this.canvas.height + particle.radius) {
          particle.vy *= -0.8
        }
        
        // 半径动态变化 - 鼠标附近时粒子稍微变大
        let radiusChange = Math.sin(particle.oscillation * 2) * 0.5
        if (this.mouseActive) {
          const dx = this.mouseX - particle.x
          const dy = this.mouseY - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance > 0) {
            const proximityEffect = Math.max(0, (200 - distance) / 200) * 10
            radiusChange += proximityEffect
          }
        }
        particle.radius += radiusChange
        particle.radius = Math.max(this.minRadius, Math.min(this.maxRadius, particle.radius))
      })
    },
    drawGradient() {
      // 使用半透明白色覆盖实现平滑过渡，创建拖尾效果
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)' // 浅色背景的覆盖色
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      
      // 绘制每个粒子的径向渐变
      this.particles.forEach(particle => {
        const gradient = this.ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius
        )
        
        const { r, g, b } = particle.color
        // 浅色背景上使用更高的不透明度，让渐变更明显
        const baseOpacity = 0.3 + Math.sin(particle.oscillation) * 0.1
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseOpacity})`)
        gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${baseOpacity * 0.7})`)
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${baseOpacity * 0.4})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        
        this.ctx.fillStyle = gradient
        this.ctx.beginPath()
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        this.ctx.fill()
      })
    },
    animate() {
      this.updateParticles()
      this.drawGradient()
      this.animationId = requestAnimationFrame(this.animate)
    }
  }
}
</script>

<style scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>

