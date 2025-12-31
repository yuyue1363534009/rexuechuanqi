import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Guide from '../pages/Guide.vue'
import PlayerCenter from '../pages/PlayerCenter.vue'
import News from '../pages/News.vue'
import Rank from '../pages/Rank.vue'
import Download from '../pages/Download.vue'
import Recharge from '../pages/Recharge.vue'
import Login from '../pages/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/guide', name: 'guide', component: Guide },
    { path: '/player-center', name: 'player-center', component: PlayerCenter },
    { path: '/news', name: 'news', component: News },
    { path: '/rank', name: 'rank', component: Rank },
    { path: '/download', name: 'download', component: Download },
    { path: '/recharge', name: 'recharge', component: Recharge },
    { path: '/login', name: 'login', component: Login },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router

