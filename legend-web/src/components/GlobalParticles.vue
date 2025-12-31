<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasRef = ref(null)

let raf = 0
let last = 0
let burstAt = 0
let cleanup = () => {}

const palette = ['#FFD36A', '#FFB300', '#FF6A00', '#FF3B2E', '#FFF4A3']

function rand(min, max) {
  return Math.random() * (max - min) + min
}
function pick(arr) {
  return arr[(Math.random() * arr.length) | 0]
}

function createSpark(w, h, dpr, fromTop = true) {
  const x = rand(0, w)
  const y = fromTop ? rand(-h * 0.2, 0) : rand(0, h)
  const vy = rand(40, 140) // px/s
  const vx = rand(-18, 18)
  const size = rand(0.8, 2.2) * dpr
  const alpha = rand(0.10, 0.22)
  const life = rand(2.4, 4.8)
  return {
    kind: 'spark',
    x,
    y,
    px: x,
    py: y,
    vx,
    vy,
    size,
    alpha,
    t: 0,
    life,
    hue: pick(palette),
    sway: rand(0.6, 1.4),
    phase: rand(0, Math.PI * 2),
  }
}

function createBurst(w, h, dpr) {
  const cx = rand(w * 0.15, w * 0.85)
  const cy = rand(h * 0.12, h * 0.42)
  const count = (rand(10, 18) | 0)
  const particles = []
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * Math.PI * 2 + rand(-0.25, 0.25)
    const speed = rand(90, 210)
    const vx = Math.cos(a) * speed + rand(-12, 12)
    const vy = Math.sin(a) * speed - rand(40, 120)
    const x = cx + rand(-6, 6)
    const y = cy + rand(-6, 6)
    particles.push({
      kind: 'burst',
      x,
      y,
      px: x,
      py: y,
      vx,
      vy,
      size: rand(0.8, 1.8) * dpr,
      alpha: rand(0.10, 0.20),
      t: 0,
      life: rand(0.8, 1.5),
      hue: pick(palette),
      sway: rand(0.2, 0.6),
      phase: rand(0, Math.PI * 2),
    })
  }
  return particles
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
  if (!ctx) return

  const state = {
    w: 0,
    h: 0,
    dpr: 1,
    sparks: [],
    targetCount: 100,
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(1, window.innerWidth)
    const h = Math.max(1, window.innerHeight)
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    state.w = canvas.width
    state.h = canvas.height
    state.dpr = dpr
  }

  resize()
  window.addEventListener('resize', resize, { passive: true })

  // 初始 50 个粒子，动态补到 100
  for (let i = 0; i < 50; i += 1) {
    state.sparks.push(createSpark(state.w, state.h, state.dpr, false))
    state.sparks[state.sparks.length - 1].y = rand(0, state.h)
  }

  function drawSpark(p, dt) {
    p.px = p.x
    p.py = p.y

    const t = (performance.now() / 1000) * p.sway + p.phase
    const sway = Math.sin(t) * 12 * state.dpr

    p.vy += p.kind === 'burst' ? 240 * dt : 0

    p.x += (p.vx * dt) * state.dpr + sway * dt
    p.y += (p.vy * dt) * state.dpr

    p.t += dt

    // 轻微缩放与闪烁
    const flicker = 0.6 + 0.4 * Math.sin((p.t * 10 + p.phase) * 2)
    const a = p.alpha * flicker

    // 拖尾：从“后”到“头”做渐变
    const tx = p.x - (p.x - p.px) * 6
    const ty = p.y - (p.y - p.py) * 6

    const g = ctx.createLinearGradient(tx, ty, p.x, p.y)
    g.addColorStop(0, `${p.hue}00`)
    g.addColorStop(1, `${p.hue}${Math.floor(a * 255).toString(16).padStart(2, '0')}`)

    ctx.lineWidth = p.size
    ctx.strokeStyle = g
    ctx.shadowBlur = 14 * state.dpr
    ctx.shadowColor = p.hue
    ctx.beginPath()
    ctx.moveTo(tx, ty)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }

  function step(now) {
    raf = requestAnimationFrame(step)
    if (!last) last = now
    const dt = Math.min((now - last) / 1000, 0.033)
    last = now

    // 动态增加粒子：逐步补到 100
    if (state.sparks.length < state.targetCount && Math.random() < 0.20) {
      state.sparks.push(createSpark(state.w, state.h, state.dpr, true))
    }

    // “透明不遮挡内容”：用 destination-out 轻擦除，保留拖尾、且不引入黑色遮罩
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'rgba(0,0,0,0.12)'
    ctx.fillRect(0, 0, state.w, state.h)

    // 火焰氛围：加色叠加发光
    ctx.globalCompositeOperation = 'lighter'

    // 偶发烟火（弱一些，不抢内容）
    if (now > burstAt) {
      burstAt = now + rand(900, 1600)
      state.sparks.push(...createBurst(state.w, state.h, state.dpr))
    }

    for (let i = 0; i < state.sparks.length; i += 1) {
      const p = state.sparks[i]
      drawSpark(p, dt)

      const out = p.x < -80 || p.x > state.w + 80 || p.y > state.h + 120
      const dead = p.t > p.life
      if (out || dead) {
        // burst 粒子直接复用为火星
        state.sparks[i] = createSpark(state.w, state.h, state.dpr, true)
      }
    }
  }

  raf = requestAnimationFrame(step)
  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  }
})

onBeforeUnmount(() => cleanup())
</script>

<template>
  <canvas ref="canvasRef" class="fx" aria-hidden="true" />
</template>

<style scoped>
.fx {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.55; /* 全局“透明”，不遮挡内容 */
  filter: saturate(1.15) contrast(1.05);
}
</style>

