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
      rating: 10,
    }, 
    userStats:{
      allGames: 0,
      wins: 0,
      wasMafia: 0,
      wasSheriff: 0,
      wasDoctor: 0,
      wasLover: 0,
      wasTerrorist: 0,
      wasBarmen: 0,
      wasBodyguard: 0
    },
    userAchievements: ['sheriff'],
  },

  getters: {
    userData: state => state.user,
    statsData: state => state.userStats,
    achievementsData: state => state.userAchievements,
  },

  mutations: {
    setUserData: (state, data) => state.user = {...data},
    setUserStats: (state, data) => state.userStats = {...data},
    setUserAchievements: (state, data) => state.userAchievements = [...data],
  },

  actions: {
    async getUserData ({ commit }) {
      const res = await sendRequest('/user');
      if (res?.data?.data)
        commit('setUserData', res.data.data);
      else {
        this.dispatch('toast/showToast', {text: 'Failed to get user info', type: 'error'}, { root: true })
      }
    },
    async getStatsData ({ commit }) {
      const res = await sendRequest('/user/stats');
      if (res?.data?.data)
        commit('setUserStats', res.data.data);
      else {
        this.dispatch('toast/showToast', {text: 'Failed to get statistics', type: 'error'}, { root: true })
      }
    },
    async getAchievementsData ({ commit }) {
      const res = await sendRequest('/user/achievs');
      if (res?.data?.data)
        commit('setUserAchievements', res.data.data);
      else {
        this.dispatch('toast/showToast', {text: 'Failed to get achievements', type: 'error'}, { root: true })
      }
    },
    async updateUserInfo ({ commit }, newUserData) {
      const res = await sendRequest('/user', 'PUT', newUserData);
      //null if server in not available
      if (res?.data?.data){
        commit('setUserData', res.data.data);
        this.dispatch('toast/showToast', {text: res.data.text, type: res.data.type}, { root: true })
      }
      else 
        this.dispatch('toast/showToast', {text: 'Request failed or new data is epmty', type: 'error'}, { root: true })
    },
  },

  // plugins: [createPersistedState()],
};
