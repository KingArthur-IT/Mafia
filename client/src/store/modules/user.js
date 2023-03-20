import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'user', 
  namespaced: true,

  state: {
    user: {
      id: 0,
      nickname: 'NotFound',
      gender: 'male',
      email: 'NotFound',
      emailNotification: true,
      accountType: 'standart',
      rating: 0,
    }, 
    userStats: {
      allGames: 0,
      mafiaWins: 0,
      citizenWins: 0,
      wasMafia: 0,
      wasSheriff: 0,
      wasDoctor: 0,
      wasLover: 0,
      wasTerrorist: 0,
      wasBarmen: 0,
      wasBodyguard: 0,
      friend: 50
    },
    userAchievements: [],
  },

  getters: {
    userData: state => state.user,
    statsData: state => state.userStats,
    achievementsData: state => state.userAchievements,
  },

  mutations: {
    setUserData: (state, data) => state.user = {...data},
    setUserStats: (state, data) => state.userStats = {...data},
    setUserAchievements: (state, data) => state.userAchievements = data,
  },

  actions: {
    async getUserData ({ commit }, {email, password}) {
      const res = await sendRequest('/user', 'POST', {email, password});
      if (res?.status)
        if (res?.status === 'ok'){
          commit('setUserData', res.data);
          return true
        }
        else {
          this.dispatch('toast/showToast', {text: res.text, type: 'error'}, { root: true });
          return false
        }
      else {
        this.dispatch('toast/showToast', {text: 'Не удалось получить ответ от сервера', type: 'error'}, { root: true });
        return false;
      }
    },
    async getStatsData ({ commit }) {
      const res = await sendRequest('/user/stats');
      if (res?.data)
        commit('setUserStats', res.data);
      else {
        this.dispatch('toast/showToast', { text: 'Failed to get statistics', type: 'error' }, { root: true })
      }
    },
    async getAchievementsData ({ commit }, userId) {
      const res = await sendRequest('/user/achievs', 'POST', {userId});
      if (res?.status)
        if (res?.status === 'ok') 
          commit('setUserAchievements', res.data);
        else this.dispatch('toast/showToast', {text: res.text, type: 'error'}, { root: true });
      else {
        this.dispatch('toast/showToast', {text: 'Не удалось получить ответ от сервера', type: 'error'}, { root: true })
      }
    },
    async updateUserInfo ({ commit }, newUserData) {
      const res = await sendRequest('/user', 'PUT', newUserData);
      //null if server in not available
      if (res?.data){
        commit('setUserData', res.data);
        this.dispatch('toast/showToast', {text: res.data.text, type: res.data.type}, { root: true })
      }
      else 
        this.dispatch('toast/showToast', {text: 'Request failed or new data is epmty', type: 'error'}, { root: true })
    },
  },

  // plugins: [createPersistedState()],
};
