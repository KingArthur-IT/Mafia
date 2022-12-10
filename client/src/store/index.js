import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default createStore({
  state: {
    user: {
      id: 0,
      nickname: 'NotFound',
      gender: 'male',
      email: 'NotFound',
      emailNotification: true,
      accountType: 'standart',
      rating: 0,
      achivements: [],
      statistics: {}
    }
  },
  getters: {
    userData: state => state.user
  },
  mutations: {
    setUserData: (state, data) => state.user = data,
  },
  actions: {
    async getUserData ({ commit }) {
      const data = await sendRequest('/user', 'GET');
      if (data)
        commit('setUserData', data);
    }
  },

  plugins: [createPersistedState()],
});
