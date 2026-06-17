/**
 * router/index.ts
 *
 * Manual routes for ./src/pages/*.vue
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/pages/index.vue'
import Rechner from '@/pages/Rechner.vue'
import FRechner from '@/pages/FRechner.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Index,
    },
    {
      path: '/Rechner',
      component: Rechner,
    },
    {
      path: '/FRechner',
      component: FRechner,
    },
  ],
})

export default router
