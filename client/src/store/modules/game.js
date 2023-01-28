import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'game', 
  namespaced: true,

  state: {
    chat: [],
    players: [],
    timer: -1,
    timerObj: null,
    gameStatus: 'Набор игроков', 
    role: 'unknown'
  },

  getters: {
    gameChat: state => state.chat,
    gamePlayers: state => state.players,
    gameTimer: state => state.timer,
    gameRole: state => state.role,
    gameStatus: state => state.gameStatus //collecting, countdown, playing
  },

  mutations: {
    // setRoomsList: (state, data) => state.user = [...data],
    SOCKET_newChatMsg: (state, data) => state.chat.push(data),
    SOCKET_copyChat: (state, data) => state.chat = data,
    SOCKET_clearChat: (state) => state.chat = [],
    SOCKET_updateUsers: (state, data) => state.players = data,
    SOCKET_setCountdown: (state, data) => {
      state.timer = data;
      if (data <= 0) {
        clearInterval(state.timerObj)
        state.timerObj = null
      }

      if (!state.timerObj)
        state.timerObj = setInterval(() => {
          state.timer --
          if (state.timer <= 0) {
            clearInterval(state.timerObj)
            state.timerObj = null
            state.timer = 0
          }
        }, 1000);
    },
    SOCKET_updateGameStage: (state, data) => state.gameStatus = data,
    SOCKET_setPlayerRole: (state, data) => state.role = data
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

/*
обработать эти события на клиенте
setGameStage = 1-4
chatEnable TF

*/
