import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default createStore({
  state: {
    user: '',
  },
  getters: {
    userData: state => {
      return state.user
    }
  },
  mutations: {
    setUserData(state, data) {
      state.user = data;
      console.log('data = ', state.user);
    },
  },
  actions: {
    async getUserData ({ commit }) {
      const data = await sendRequest('/user', 'GET');
      commit('setUserData', data)
    }
  },

  plugins: [createPersistedState()],
});