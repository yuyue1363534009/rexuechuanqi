<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import GlobalParticles from './components/GlobalParticles.vue'
import NavBar from './components/NavBar.vue'

const route = useRoute()
const isHome = computed(() => route.name === 'home')
</script>

<template>
  <GlobalParticles />
  <NavBar />

  <main :class="['app-main', { 'app-main--home': isHome }]">
    <router-view />
  </main>
</template>

<style scoped>
.app-main {
  padding-top: 84px;
}
.app-main--home {
  padding-top: 92px;
}
</style>
