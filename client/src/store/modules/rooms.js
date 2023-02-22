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
    async createRoom({ commit }, data){
      const res = await sendRequest('/rooms/create', 'POST', data);
      if (res?.data?.data && res?.data?.id){
        commit('setRoomsList', res.data.data);
        return res.data.id;
      }
      else{
        this.dispatch('toast/showToast', {text: 'Failed to create room', type: 'error'}, { root: true })
        // return -1
        return 0
      }
    }
  },

  // plugins: [createPersistedState()],
};
