// import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'auth', 
  namespaced: true,

  state: {
    
  },

  getters: {

  },

  mutations: {

  },

  actions: {
    async Register ({ }, { nickname, age, gender, country, email, password }) {
      const res = await sendRequest('/auth/registration', 'POST', { nickname, email, password, age, country, gender });
      if (res.status === 200 && res.data?.resStatus) {
        this.dispatch('toast/showToast', { text: res.data.message, type: res.data.resStatus }, { root: true });
        return res.resStatus === 'ok'
      }
      else {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }
    },
    async Login ({ }, { email, password }) {
      const res = await sendRequest('/auth/login', 'POST', { email, password });
      if (res.status === 200 && res.data?.resStatus) {
        if (res.data.resStatus === 'ok' && res.data?.data?.access_token && res.data?.data?.user_data) {
          localStorage.setItem('access_token', res.data.data.access_token)
          this.commit('user/setUserData', res.data.data.user_data, { root: true });
        } else
          this.dispatch('toast/showToast', { text: res.data.message, type: res.data.resStatus }, { root: true });
        return res.data.resStatus === 'ok'
      }
      else {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }
    },
  },

  // plugins: [createPersistedState()],
};
