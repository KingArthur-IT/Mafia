// import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'rooms', 
  namespaced: true,

  state: {
    roomsList: [],
  },

  getters: {
    roomsList: state => state.roomsList,
  },

  mutations: {
    SOCKET_setRoomsList: (state, data) => state.roomsList = [...data]
  },

  actions: {
    async createRoom({ commit }, data) {
      const res = await sendRequest('/rooms/create', 'POST', data);
      if (res.status !== 200) {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }

      if (res.data?.resStatus === 'ok') {
        if (res.data?.data?.id){
          return res.data.data.id;
        }
        else {
          this.dispatch('toast/showToast', { text: res.data.message, type: 'error' }, { root: true })
          return -1
        }
      } else {
        this.dispatch('toast/showToast', { text: res.data.message, type: 'error' }, { root: true })
        return -1
      }
    }
  },

  // plugins: [createPersistedState()],
};
