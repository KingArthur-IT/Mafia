import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'game', 
  namespaced: true,

  state: {
    chat: [],
    isChatEnable: true,
    players: [],
    timer: -1,
    timerObj: null,
    gameStatus: 'Набор игроков', 
    role: 'unknown',
    gameStage: 0
  },

  getters: {
    gameChat: state => state.chat,
    gameChatEnable: state => state.isChatEnable,
    gamePlayers: state => state.players,
    gameTimer: state => state.timer,
    gameRole: state => state.role,
    gameStatus: state => state.gameStatus, //collecting, countdown, playing
    gameStage: state => state.gameStage,
  },

  mutations: {
    // setRoomsList: (state, data) => state.user = [...data],
    //chat
    SOCKET_newChatMsg: (state, data) => state.chat.push(data),
    SOCKET_copyChat: (state, data) => state.chat = data,
    SOCKET_clearChat: (state) => state.chat = [],
    SOCKET_chatEnable: (state, data) => state.isChatEnable = data,

    //users
    SOCKET_updateUsers: (state, data) => state.players = data,
    SOCKET_updateUserData: (state, data) => state.players = [...state.players.filter(pl => pl.id !== data.id), data],
    SOCKET_setPlayerRole: (state, data) => state.role = data,


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
    SOCKET_updateGameTitle: (state, data) => state.gameStatus = data,
    SOCKET_setGameStage: (state, data) => state.gameStage = data
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
обработать эти события на клиенте:

chatEnable - TF
*/