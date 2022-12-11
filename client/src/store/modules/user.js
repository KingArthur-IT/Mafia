import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default{
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
      const data = await sendRequest('/user');
      if (data)
        commit('setUserData', data);
    },
    async getStatsData ({ commit }) {
      const data = await sendRequest('/user/stats');
      if (data)
        commit('setUserStats', data);
    },
    async getAchievementsData ({ commit }) {
      const data = await sendRequest('/user/achievs');
      if (data)
        commit('setUserAchievements', data);
    },
    async updateUserInfo ({ commit }, newUserData) {
      const data = await sendRequest('/user', 'PUT', newUserData);
      //null if server in not available
      if (data){
        commit('setUserData', data);
      }
      else 
        this.dispatch('toast/show', {text: 'Request failed'}, { root: true })
    },
  },

  plugins: [createPersistedState()],
};
