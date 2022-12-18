// import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'rooms', 
  namespaced: true,

  state: {
    roomsList: [
      // {
      //     id: 0,
      //     name: 'Крутая комната',
      //     maxPersons: 10,
      //     minPersons: 8,
      //     currentPersons: 10,
      //     roles: [
      //         {role: 'lover', count: 1},
      //         {role: 'reporter', count: 1},
      //         {role: 'barmen', count: 1},
      //         {role: 'doctor', count: 1},
      //         {role: 'bodyguard', count: 1},
      //         {role: 'terrorist', count: 1}
      //     ]
      // },
      // {
      //     id: 1,
      //     name: 'Крутая комната 2',
      //     maxPersons: 16,
      //     minPersons: 8,
      //     currentPersons: 10,
      //     roles: []
      // },
    ]
  },

  getters: {
    roomsList: state => state.roomsList,
  },

  mutations: {
    setRoomsList: (state, data) => state.roomsList = [...data],
  },

  actions: {
    async getRoomsList ({ commit }) {
      const res = await sendRequest('/rooms');
      console.log(res);
      if (res?.data){
        commit('setRoomsList', res.data);
      }
      else {
        this.dispatch('toast/showToast', {text: 'Failed to get rooms list', type: 'error'}, { root: true })
      }
    },
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
