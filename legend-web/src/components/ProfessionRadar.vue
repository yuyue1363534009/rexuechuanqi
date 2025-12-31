<script setup>
import { computed, ref } from 'vue'

const axes = [
  { key: 'survive', label: '生存' },
  { key: 'burst', label: '爆发' },
  { key: 'control', label: '控制' },
  { key: 'mobility', label: '机动' },
  { key: 'output', label: '输出' },
  { key: 'support', label: '辅助' },
]

const jobs = [
  {
    key: 'warrior',
    name: '战士',
    desc: '近战爆发 · 冲锋切入 · 以血换血',
    accent: '#FF6A00',
    stats: { survive: 0.78, burst: 0.86, control: 0.45, mobility: 0.62, output: 0.80, support: 0.18 },
    perks: ['单挑强势', '团战前排', '爆发压制'],
  },
  {
    key: 'mage',
    name: '法师',
    desc: '远程AOE · 走位风筝 · 清怪王者',
    accent: '#FFD36A',
    stats: { survive: 0.38, burst: 0.66, control: 0.72, mobility: 0.58, output: 0.92, support: 0.30 },
    perks: ['刷怪效率', '团战输出', '控场拉扯'],
  },
  {
    key: 'taoist',
    name: '道士',
    desc: '召唤辅助 · 持续消耗 · 稳健全能',
    accent: '#FFB300',
    stats: { survive: 0.62, burst: 0.48, control: 0.58, mobility: 0.52, output: 0.56, support: 0.86 },
    perks: ['续航强', '打宝稳定', '团队增益'],
  },
]

const active = ref('warrior')
const job = computed(() => jobs.find((j) => j.key === active.value) || jobs[0])

const size = 320
const cx = size / 2
const cy = size / 2
const r = 118

function pointAt(idx, val = 1) {
  const angle = (Math.PI * 2 * idx) / axes.length - Math.PI / 2
  const rr = r * val
  return { x: cx + Math.cos(angle) * rr, y: cy + Math.sin(angle) * rr }
}

const rings = computed(() => [0.25, 0.5, 0.75, 1.0])

const polygon = computed(() => {
  const pts = axes.map((a, i) => pointAt(i, job.value.stats[a.key] ?? 0))
  return pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
})

const labels = computed(() => {
  return axes.map((a, i) => {
    const p = pointAt(i, 1.08)
    const align = p.x < cx - 10 ? 'end' : p.x > cx + 10 ? 'start' : 'middle'
    const baseline = p.y < cy - 10 ? 'baseline' : p.y > cy + 10 ? 'hanging' : 'middle'
    return { ...a, x: p.x, y: p.y, align, baseline }
  })
})
</script>

<template>
  <div class="wrap">
    <div class="tabs">
      <button
        v-for="j in jobs"
        :key="j.key"
        class="tab"
        :class="{ 'tab--active': active === j.key }"
        type="button"
        @click="active = j.key"
      >
        <span class="tab__dot" :style="{ background: j.accent }" />
        <span class="tab__name">{{ j.name }}</span>
      </button>
    </div>

    <div class="grid">
      <div class="chart glass">
        <div class="chart__head">
          <div class="chart__title">
            <span class="chart__name">{{ job.name }}</span>
            <span class="chart__desc">{{ job.desc }}</span>
          </div>
          <span class="tag">六维职业雷达</span>
        </div>

        <svg class="svg" :viewBox="`0 0 ${size} ${size}`" role="img" aria-label="职业六维雷达图">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- rings -->
          <g>
            <polygon
              v-for="rr in rings"
              :key="rr"
              :points="axes.map((_, i) => { const p = pointAt(i, rr); return `${p.x},${p.y}` }).join(' ')"
              class="ring"
            />
          </g>

          <!-- axes -->
          <g>
            <line v-for="(_, i) in axes" :key="i" class="axis" :x1="cx" :y1="cy" :x2="pointAt(i, 1).x" :y2="pointAt(i, 1).y" />
          </g>

          <!-- polygon -->
          <polygon class="poly__shadow" :points="polygon" />
          <polygon class="poly" :points="polygon" :style="{ '--accent': job.accent }" filter="url(#glow)" />

          <!-- points -->
          <g>
            <circle
              v-for="(a, i) in axes"
              :key="a.key"
              class="dot"
              :style="{ '--accent': job.accent }"
              :cx="pointAt(i, job.stats[a.key]).x"
              :cy="pointAt(i, job.stats[a.key]).y"
              r="4"
            />
          </g>

          <!-- labels -->
          <g>
            <text
              v-for="l in labels"
              :key="l.key"
              class="label"
              :x="l.x"
              :y="l.y"
              :text-anchor="l.align"
              :dominant-baseline="l.baseline"
            >
              {{ l.label }}
            </text>
          </g>
        </svg>
      </div>

      <div class="detail glass">
        <div class="detail__title">职业定位</div>
        <div class="detail__text">{{ job.desc }}</div>

        <div class="perks">
          <div v-for="p in job.perks" :key="p" class="perk">
            <span class="perk__dot" :style="{ background: job.accent }" />
            <span class="perk__text">{{ p }}</span>
          </div>
        </div>

        <div class="hint">
          <div class="hint__k">提示</div>
          <div class="hint__v">数值仅用于官网展示（后续可对接真实职业数据与版本迭代说明）。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tabs {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.80);
  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease, background 120ms ease, border-color 120ms ease;
}
.tab:hover {
  filter: brightness(1.06);
  border-color: rgba(255, 211, 106, 0.22);
  transform: translateY(-1px);
}
.tab--active {
  background: linear-gradient(135deg, rgba(255, 211, 106, 0.20), rgba(255, 106, 0, 0.12));
  border-color: rgba(255, 211, 106, 0.28);
  color: rgba(255, 255, 255, 0.92);
}
.tab__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  box-shadow: 0 0 18px rgba(255, 106, 0, 0.35);
}
.tab__name {
  font-weight: 900;
  letter-spacing: 0.2px;
}

.grid {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 14px;
}

.chart {
  padding: 16px 16px 10px;
  overflow: hidden;
}
.chart__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.chart__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.chart__name {
  font-weight: 1000;
  font-size: 18px;
  letter-spacing: 0.3px;
}
.chart__desc {
  color: rgba(255, 255, 255, 0.68);
  font-weight: 700;
  font-size: 13px;
}

.svg {
  width: 100%;
  height: 320px;
  display: block;
}

.ring {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 1;
}
.axis {
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 1;
}
.poly__shadow {
  fill: rgba(0, 0, 0, 0.22);
  stroke: rgba(0, 0, 0, 0.12);
  stroke-width: 2;
  transform: translate(2px, 4px);
  filter: blur(0.2px);
}
.poly {
  fill: color-mix(in oklab, var(--accent), transparent 72%);
  stroke: color-mix(in oklab, var(--accent), white 16%);
  stroke-width: 2;
}
.dot {
  fill: color-mix(in oklab, var(--accent), white 10%);
  stroke: rgba(0, 0, 0, 0.35);
  stroke-width: 1;
}
.label {
  fill: rgba(255, 255, 255, 0.72);
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.2px;
}

.detail {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.detail__title {
  font-weight: 1000;
  letter-spacing: 0.3px;
}
.detail__text {
  color: rgba(255, 255, 255, 0.72);
  font-weight: 700;
  font-size: 13px;
}
.perks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}
.perk {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(0, 0, 0, 0.18);
}
.perk__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  box-shadow: 0 0 18px rgba(255, 106, 0, 0.35);
}
.perk__text {
  font-weight: 900;
  letter-spacing: 0.2px;
}
.hint {
  margin-top: auto;
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 211, 106, 0.18);
  background: linear-gradient(135deg, rgba(255, 211, 106, 0.10), rgba(255, 106, 0, 0.06));
}
.hint__k {
  font-weight: 1000;
  font-size: 12px;
  color: rgba(255, 211, 106, 0.92);
}
.hint__v {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.68);
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .svg {
    height: 300px;
  }
}

@media (max-width: 520px) {
  .svg {
    height: 280px;
  }
}
</style>

