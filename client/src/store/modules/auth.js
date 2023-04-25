// import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'auth', 
  namespaced: true,

  state: {
    
  },

  getters: {
    // userData: state => state.user,
  },

  mutations: {
    // setUserData: (state, data) => state.user = {...data},
  },

  actions: {
    async Register ({ commit }, { nickname, age, gender, country, email, password }) {
      const res = await sendRequest('/auth/registration', 'POST', { nickname, email, password, age, country, gender });
      if (res?.status) {
        this.dispatch('toast/showToast', { text: res.message, type: res.status }, { root: true });
        return res.status === 'ok'
      }
      else {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }
    },
    async Login ({ commit }, { email, password }) {
      const res = await sendRequest('/auth/login', 'POST', { email, password });
      if (res?.status) {
        if (res.status === 'ok') {
          localStorage.setItem('access_token', res.data.access_token)
          this.commit('user/setUserData', res.data.user_data, { root: true });
        } else
          this.dispatch('toast/showToast', { text: res.message, type: res.status }, { root: true });
        return res.status === 'ok'
      }
      else {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }
    },
  },

  // plugins: [createPersistedState()],
};
