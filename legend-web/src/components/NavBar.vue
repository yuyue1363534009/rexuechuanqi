<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)

const items = [
  { label: '首页', to: { name: 'home' } },
  { label: '游戏攻略', to: { name: 'guide' } },
  { label: '玩家中心', to: { name: 'player-center' } },
  { label: '新闻中心', to: { name: 'news' } },
  { label: '等级排行', to: { name: 'rank' } },
  { label: '游戏下载', to: { name: 'download' } },
  { label: '游戏充值', to: { name: 'recharge' } },
]

const activeName = computed(() => String(route.name || ''))

function toggle() {
  open.value = !open.value
}
function close() {
  open.value = false
}
</script>

<template>
  <header class="nav-wrap">
    <div class="nav-bg" aria-hidden="true" />
    <div class="container nav">
      <router-link class="brand" :to="{ name: 'home' }" @click="close">
        <span class="brand__mark" aria-hidden="true">烈焰</span>
        <span class="brand__name">热血传奇</span>
        <span class="brand__tag">官方站</span>
      </router-link>

      <nav class="links" aria-label="主导航">
        <router-link
          v-for="it in items"
          :key="it.label"
          class="link"
          :class="{ 'link--active': activeName === String(it.to.name) }"
          :to="it.to"
        >
          <span class="link__text">{{ it.label }}</span>
          <span class="link__glow" aria-hidden="true" />
        </router-link>
      </nav>

      <div class="actions">
        <router-link class="btn btn-ghost actions__login" :to="{ name: 'login' }">登录 / 注册</router-link>
        <button class="burger" type="button" @click="toggle" :aria-expanded="open" aria-label="打开菜单">
          <span />
          <span />
          <span />
        </button>
      </div>
    </div>

    <div class="mobile" :class="{ 'mobile--open': open }">
      <div class="mobile__panel glass">
        <div class="mobile__head">
          <div class="mobile__title">导航</div>
          <button class="mobile__close" type="button" @click="close" aria-label="关闭菜单">×</button>
        </div>
        <div class="mobile__list">
          <router-link
            v-for="it in items"
            :key="it.label"
            class="mobile__item"
            :to="it.to"
            @click="close"
          >
            <span>{{ it.label }}</span>
            <span class="mobile__chev" aria-hidden="true">›</span>
          </router-link>
          <router-link class="mobile__item mobile__item--cta" :to="{ name: 'login' }" @click="close">
            登录 / 注册
            <span class="mobile__chev" aria-hidden="true">›</span>
          </router-link>
        </div>
      </div>
      <div class="mobile__backdrop" @click="close" />
    </div>
  </header>
</template>

<style scoped>
.nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
}

/* 炫酷背景：火焰渐变 + 金属高光 + 微动流光 */
.nav-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(700px 220px at 18% 0%, rgba(255, 106, 0, 0.55), transparent 60%),
    radial-gradient(520px 220px at 70% 0%, rgba(255, 211, 106, 0.30), transparent 60%),
    radial-gradient(660px 240px at 40% 120%, rgba(255, 59, 46, 0.22), transparent 62%),
    linear-gradient(180deg, rgba(10, 12, 16, 0.82), rgba(8, 10, 14, 0.58));
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.52);
  backdrop-filter: blur(12px);
}
.nav-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.045) 0px,
    rgba(255, 255, 255, 0.045) 2px,
    rgba(0, 0, 0, 0.035) 4px,
    rgba(0, 0, 0, 0.035) 6px
  );
  opacity: 0.55;
  mix-blend-mode: overlay;
}
.nav-bg::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(120deg, transparent, rgba(255, 211, 106, 0.22), transparent);
  transform: translateX(-35%);
  animation: shimmer 6.5s linear infinite;
  filter: blur(0.2px);
  opacity: 0.8;
}

@keyframes shimmer {
  0% {
    transform: translateX(-55%);
  }
  100% {
    transform: translateX(55%);
  }
}

.nav {
  position: relative;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.brand {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  min-width: 220px;
}
.brand__mark {
  font-weight: 900;
  letter-spacing: 2px;
  font-size: 14px;
  color: rgba(10, 10, 12, 0.95);
  background: linear-gradient(135deg, var(--gold), var(--orange));
  padding: 6px 10px;
  border-radius: 999px;
  box-shadow: 0 10px 28px rgba(255, 106, 0, 0.22);
}
.brand__name {
  font-weight: 900;
  font-size: 18px;
  letter-spacing: 0.6px;
  text-shadow: 0 10px 28px rgba(0, 0, 0, 0.65);
}
.brand__tag {
  font-weight: 800;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.22);
}

.links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.link {
  position: relative;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid transparent;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 800;
  letter-spacing: 0.2px;
  transition: transform 140ms ease, color 140ms ease, background 140ms ease, border-color 140ms ease;
}
.link__glow {
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  opacity: 0;
  background: radial-gradient(120px 40px at 40% 10%, rgba(255, 211, 106, 0.55), transparent 60%),
    radial-gradient(120px 40px at 60% 90%, rgba(255, 106, 0, 0.45), transparent 60%);
  filter: blur(10px);
  transition: opacity 160ms ease;
  pointer-events: none;
}
.link:hover {
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}
.link:hover .link__glow {
  opacity: 0.75;
}
.link--active {
  color: rgba(10, 10, 12, 0.96);
  background: linear-gradient(135deg, rgba(255, 211, 106, 0.95), rgba(255, 106, 0, 0.86));
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 12px 34px rgba(255, 106, 0, 0.22);
}
.link--active .link__glow {
  opacity: 0.15;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.actions__login {
  padding: 10px 14px;
  font-size: 13px;
}

.burger {
  display: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
}
.burger span {
  display: block;
  width: 20px;
  height: 2px;
  margin: 4px auto;
  background: rgba(255, 255, 255, 0.82);
  border-radius: 999px;
}

.mobile {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0;
  transition: opacity 160ms ease;
}
.mobile--open {
  pointer-events: auto;
  opacity: 1;
}
.mobile__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
}
.mobile__panel {
  position: absolute;
  top: 86px;
  right: 14px;
  width: min(380px, calc(100% - 28px));
  overflow: hidden;
}
.mobile__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.mobile__title {
  font-weight: 900;
  letter-spacing: 0.3px;
}
.mobile__close {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  cursor: pointer;
}
.mobile__list {
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 6px;
}
.mobile__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.20);
  color: rgba(255, 255, 255, 0.86);
  font-weight: 800;
}
.mobile__item--cta {
  background: linear-gradient(135deg, rgba(255, 211, 106, 0.22), rgba(255, 106, 0, 0.16));
  border-color: rgba(255, 211, 106, 0.22);
}
.mobile__chev {
  color: rgba(255, 255, 255, 0.52);
  font-size: 18px;
}

@media (max-width: 980px) {
  .links {
    display: none;
  }
  .burger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .brand {
    min-width: auto;
  }
}

@media (max-width: 560px) {
  .actions__login {
    display: none;
  }
}
</style>

