import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import ProfileView from '../views/ProfileView.vue'
import MainHero from '../components/Profile/MainHero.vue'
import ProfileSettings from '../components/Profile/ProfileSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { auth: false } },
    { path: '/authorize', name: 'auth', component: AuthView
    },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { auth: true },
        children: [
          { path: '', name: 'profile.main', component: MainHero, meta: { pageName: 'Главная' } },
          { path: 'settings', name: 'profile.settings', component: ProfileSettings, meta: { pageName: 'Настройки профиля' } },
        ]
    },
  ]
})

export default router
