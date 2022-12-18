import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'game', 
  namespaced: true,

  state: {
    chat: [],
    players: [
        {
            nickname: 'nick',
            gender: 'male',
            role: 'unknown' 
        },
        {
            nickname: 'nick',
            gender: 'female',
            role: 'citizen' 
        },
        {
            nickname: 'nick',
            gender: 'male',
            role: 'mafia' 
        },
        {
            nickname: 'nick',
            gender: 'male',
            role: 'reporter' 
        },
        {
            nickname: 'nick',
            gender: 'male',
            role: 'barmen' 
        },
        {
            nickname: 'nick',
            gender: 'male',
            role: 'doctor' 
        },
        {
            nickname: 'nick',
            gender: 'male',
            role: 'bodyguard' 
        },
        {
            nickname: 'nick',
            gender: 'male',
            role: 'terrorist' 
        },
        {
            nickname: 'nick',
            gender: 'male',
            role: 'sheriff' 
        },
        {
            nickname: 'nick',
            gender: 'male',
            role: 'lover' 
        },
    ] 
  },

  getters: {
    gameChat: state => state.chat,
  },

  mutations: {
    // setRoomsList: (state, data) => state.user = [...data],
    SOCKET_newChatMsg: (state, data) => state.chat.push(data)
  },

  actions: {
    // async getRoomsList ({ commit }) {
    //   const res = await sendRequest('/rooms');
    //   if (res?.data?.data)
    //     commit('setRoomsList', res.data.data);
    //   else {
    //     this.dispatch('toast/showToast', {text: 'Failed to get rooms list', type: 'error'}, { root: true })
    //   }
    // },
  },

};
