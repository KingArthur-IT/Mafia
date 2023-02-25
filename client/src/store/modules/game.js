export default{
  name: 'game', 
  namespaced: true,

  state: {
    //me
    role: 'unknown',
    isAlive: true,
    labels: [],
    //players
    players: [],
    //about game
    gameStatus: 'Набор игроков', 
    gameStage: 0,
    //chat
    chat: [],
    isChatEnable: true,
    //timer
    timer: -1,
    timerObj: null,
    //votes
    voicesCount: {},
    //rezult
    gameRezult: {}
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

    SOCKET_updateVoicesCount: (state, data) => state.voicesCount = {...data},

    SOCKET_showGameResult: (state, data) => {
      state.gameRezult = {...data}
    },

    clearAllStates: (state) => {
      state.role = 'unknown'
      state.isAlive = true
      state.labels = []
      state.players = []
      state.gameStatus = 'Набор игроков'
      state.gameStage = 0
      state.chat = []
      state.isChatEnable = true
      state.timer = -1
      state.timerObj = null
      state.voicesCount = {}
      state.gameRezult = {}
    }
  },

  actions: {
    clearAllGameStates: ({ commit }) => {
      commit('clearAllStates')
    }
  },

};