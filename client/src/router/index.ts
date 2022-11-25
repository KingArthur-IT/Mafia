import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import ProfileView from '../views/ProfileView.vue'
import MainHero from '../components/Profile/MainHero.vue'
import ProfileSettings from '../components/Profile/ProfileSettings.vue'
import RulesView from '../views/RulesView.vue'
import MarketView from '../views/MarketView.vue'
import SupportView from '../views/SupportView.vue'
import MessageView from '../views/MessageView.vue'
import NotificationsView from '../views/NotificationsView.vue'
import HollView from '../views/HollView.vue'
import StatisticsView from '../views/StatisticsView.vue'

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
          { path: 'rules', name: 'profile.rules', component: RulesView, meta: { pageName: 'Правила игры' } },
          { path: 'market', name: 'profile.market', component: MarketView, meta: { pageName: 'Магазин' } },
          { path: 'support', name: 'profile.support', component: SupportView, meta: { pageName: 'Поддержка' } },
          { path: 'message', name: 'profile.message', component: MessageView, meta: { pageName: 'Сообщения' } },
          { path: 'notifications', name: 'profile.notifications', component: NotificationsView, meta: { pageName: 'Уведомления' } },
          { path: 'holl', name: 'profile.holl', component: HollView, meta: { pageName: 'Игровой холл' } },
          { path: 'statistics', name: 'profile.statistics', component: StatisticsView, meta: { pageName: 'Статистика' } },
        ]
    },
  ]
})

export default router
