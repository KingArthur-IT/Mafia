import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'user', 
  namespaced: true,

  state: {
    user: {
      id: 0,
      nickname: 'NotFound',
      email: 'NotFound',
      email_notification: true,
      gender: 'male',
      age: '0',
      country: '',
      role: 'USER',
      account_type: 'standart',
      rating: 0,
      all_games_count: 0, 
      mafia_wins_count: 0, 
      citizen_wins_count: 0, 
      was_mafia_count: 0, 
      was_sheriff_count: 0, 
      was_doctor_count: 0, 
      was_lover_count: 0, 
      was_terrorist_count: 0, 
      was_barmer_count: 0, 
      was_bodyguard_count: 0, 
      bring_friend_count: 0, 
      bring_friend_score: 0
    }, 
    userStats: {
      allGames: { count: 0, score: 0 },
      mafiaWins: { count: 0, score: 0 },
      citizenWins: { count: 0, score: 0 },
      wasMafia: { count: 0, score: 0 },
      wasSheriff: { count: 0, score: 0 },
      wasDoctor: { count: 0, score: 0 },
      wasLover: { count: 0, score: 0 },
      wasTerrorist: { count: 0, score: 0 },
      wasBarmen: { count: 0, score: 0 },
      wasBodyguard: { count: 0, score: 0 },
    },
    userAdditions: {
      friends: { count: 0, score: 0 },
      socials: { count: 0, score: 0 },
    },
    notifications: []
  },

  getters: {
    userData: state => state.user,
    notificationsList: state => state.notifications,
    statsData: state => state.userStats,
    additionsData: state => state.userAdditions,
  },

  mutations: {
    setUserData: (state, data) => state.user = {...data},
    setUserNotifications: (state, data) => state.notifications = [...data],
    setUserStats: (state, data) => state.userStats = {...data},
    setUserAdditions: (state, data) => state.userAdditions = {...data},
    setUserRating: (state, data) => state.user.rating = data
  },

  actions: {
    //user data
    async getUserData ({ state, commit }) {
      const res = await sendRequest(`/user?id=${state.user.id}`);
      if (!res.status) {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }

      if (res.status === 'ok'){
        commit('setUserData', res.data);
        return true
      }
      else {
        this.dispatch('toast/showToast', { text: res.message, type: 'error' }, { root: true });
        return false
      }
    },
    async updateUserInfo ({ commit }, newUserData) {
      const res = await sendRequest('/user', 'PUT', newUserData);
      if (res?.status){
        if (res?.status === 'ok'){
          commit('setUserData', res.data);
          this.dispatch('toast/showToast', { text: res.message, type: 'ok' }, { root: true });
        }
        else {
          this.dispatch('toast/showToast', { text: res.message, type: 'error' }, { root: true });
        }
      }
      else 
        this.dispatch('toast/showToast', { text: 'Request failed or new data is empty', type: 'error' }, { root: true })
    },
    async updateUserPassword ({ commit }, passwordData) {
      const res = await sendRequest('/user/password', 'PUT', passwordData);
      if (res?.status){
        if (res?.status === 'ok'){
          this.dispatch('toast/showToast', { text: res.message, type: 'ok' }, { root: true });
          return true
        }
        else {
          this.dispatch('toast/showToast', { text: res.message, type: 'error' }, { root: true });
          return false
        }
      }
      else 
        this.dispatch('toast/showToast', { text: 'Request failed or new data is empty', type: 'error' }, { root: true })
    },
    //rating
    async getUserRating ({ commit }) {
      const res = await sendRequest('/user/rating', 'POST', { id: state.user.id });
      if (res?.status)
        if (res?.status === 'ok'){
          commit('setUserRating', res.data);
          return true
        }
        else {
          this.dispatch('toast/showToast', { text: res.message, type: 'error' }, { root: true });
          return false
        }
      else {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }
    },
    //notifications
    async getNotificationsData ({ commit, state }) {
      const res = await sendRequest('/user/notifications', 'POST', { id: state.user.id });
      if (res?.status) {
        if (res?.status === 'ok')
          commit('setUserNotifications', res.data.reverse())
        else this.dispatch('toast/showToast', { text: res.message, type: 'error' }, { root: true })
      } else {
        this.dispatch('toast/showToast', { text: 'Failed to get notifications', type: 'error' }, { root: true })
      }
    },
    async setAllNotificationsRead({ commit, state }) {
      const res = await sendRequest('/user/notifications', 'PUT', { id: state.user.id });
      //null if server in not available
      if (res?.status) {
        if (res?.status === 'ok')
          commit('setUserNotifications', res.data.reverse())
        else this.dispatch('toast/showToast', { text: res.message, type: 'error' }, { root: true })
      } else {
        this.dispatch('toast/showToast', { text: 'Cannot set all notifications as read', type: 'error' }, { root: true })
      }
    },
    //statistic
    async getStatsData ({ commit, state }) {
      const res = await sendRequest('/user/stats', 'POST', { id: state.user.id });
      if (res?.status) {
        if (res?.status === 'ok')
          commit('setUserStats', res.data)
        else this.dispatch('toast/showToast', { text: res.message, type: 'error' }, { root: true })
      } else {
        this.dispatch('toast/showToast', { text: 'Failed to get statistic', type: 'error' }, { root: true })
      }
    },
    async getAdditionsData ({ commit, state }) {
      const res = await sendRequest('/user/additions', 'POST', { id: state.user.id });
      if (res?.status) {
        if (res?.status === 'ok')
          commit('setUserAdditions', res.data)
        else this.dispatch('toast/showToast', { text: res.message, type: 'error' }, { root: true })
      } else {
        this.dispatch('toast/showToast', { text: 'Failed to get additions', type: 'error' }, { root: true })
      }
    },
  },

  // plugins: [createPersistedState()],
};
