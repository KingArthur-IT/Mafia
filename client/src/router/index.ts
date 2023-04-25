import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import ProfileView from '../views/ProfileView.vue'
import ProfileStartView from '../views/ProfileStartView.vue'
import ProfileSettingsView from '../views/ProfileSettingsView.vue'
import RulesView from '../views/RulesView.vue'
import MarketView from '../views/MarketView.vue'
import AboutView from '../views/AboutView.vue'
import MessageView from '../views/MessageView.vue'
import NotificationsView from '../views/NotificationsView.vue'
import HollView from '../views/HollView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import RoomCreateView from '../views/RoomCreateView.vue'
import RoomView from '../views/RoomView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { auth: false } },
    { path: '/authorize', name: 'auth', component: AuthView },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { auth: true },
        children: [
          { path: '', name: 'profile.main', component: ProfileStartView, meta: { pageName: 'Главная' } },
          { path: 'settings', name: 'profile.settings', component: ProfileSettingsView, meta: { pageName: 'Настройки профиля' } },
          { path: 'rules', name: 'profile.rules', component: RulesView, meta: { pageName: 'Правила игры' } },
          { path: 'market', name: 'profile.market', component: MarketView, meta: { pageName: 'Магазин' } },
          { path: 'about', name: 'profile.about', component: AboutView, meta: { pageName: 'О проекте' } },
          { path: 'message', name: 'profile.message', component: MessageView, meta: { pageName: 'Сообщения' } },
          { path: 'notifications', name: 'profile.notifications', component: NotificationsView, meta: { pageName: 'Уведомления' } },
          { path: 'holl', name: 'profile.holl', component: HollView, meta: { pageName: 'Игровой холл' } },
          { path: 'statistics', name: 'profile.statistics', component: StatisticsView, meta: { pageName: 'Статистика' } },
          { path: 'create', name: 'profile.create', component: RoomCreateView, meta: { pageName: 'Создать комнату' } },
        ]
    },
    { path: '/room/:id', name: 'room', component: RoomView, meta: { auth: true }}
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = localStorage.getItem('access_token');
  const requireAuth = to.matched.some(page => page.meta.auth)
  
  if (requireAuth && !currentUser){
    next('/authorize')
  } else {
    next()
  }
})

export default router
