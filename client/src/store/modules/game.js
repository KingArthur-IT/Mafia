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
    gameStage: 0,
    isAlive: true,
    labels: [],
    voicesCount: {}
  },

  getters: {
    gameChat: state => state.chat,
    gameChatEnable: state => state.isChatEnable,
    gamePlayers: state => state.players,
    gameTimer: state => state.timer,
    gameRole: state => state.role,
    gameStatus: state => state.gameStatus, //collecting, countdown, playing
    gameStage: state => state.gameStage,
    gamePlayerIsAlive: state => state.isAlive,
    gameLabels: state => state.labels,
    gameVoicesCount: state => state.voicesCount,
  },

  mutations: {
    //chat
    SOCKET_newChatMsg: (state, data) => state.chat.push(data),
    SOCKET_copyChat: (state, data) => state.chat = data,
    SOCKET_clearChat: (state) => state.chat = [],
    SOCKET_chatEnable: (state, data) => state.isChatEnable = data,

    //users
    SOCKET_updateUsers: (state, data) => state.players = data,
    SOCKET_updateUserData: (state, data) => {
      const index = state.players.findIndex(pl => pl.id === data.id)
      console.log(index);
      if (index !== -1)
        state.players[index] = data
    },
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
    SOCKET_setGameStage: (state, data) => state.gameStage = data,

    SOCKET_wasKilled: (state, data) => state.isAlive = !data,
    SOCKET_setLabel: (state, data) => state.labels.push(data),
    SOCKET_setLabels: (state, data) => state.labels = [...data],
    clearLabels: (state) => state.labels = [],

    SOCKET_updateVoicesCount: (state, data) => state.voicesCount = {...data}
  },

  actions: {

  },

};