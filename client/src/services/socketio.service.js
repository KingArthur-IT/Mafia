import { io } from 'socket.io-client';
import store from "../store";

class SocketioService {
    socket;
    constructor() {}
  
    setupSocketConnection() {
        this.socket = io(import.meta.env.VITE_ENDPOINT_HOST);
        
        this.socket.on('setRoomsList', data => store.commit('rooms/SOCKET_setRoomsList', data.reverse()));

        this.socket.on('newChatMsg', data => store.commit('game/SOCKET_newChatMsg', data));
        this.socket.on('copyChat', data => store.commit('game/SOCKET_copyChat', data));
        this.socket.on('clearChat', data => store.commit('game/SOCKET_clearChat', data));
        this.socket.on('chatEnable', data => store.commit('game/SOCKET_chatEnable', data));

        this.socket.on('updateUsers', data => store.commit('game/SOCKET_updateUsers', data));
        this.socket.on('updateUserData', data => store.commit('game/SOCKET_updateUserData', data));
        this.socket.on('setPlayerRole', data => store.commit('game/SOCKET_setPlayerRole', data));

        this.socket.on('setCountdown', data => store.commit('game/SOCKET_setCountdown', data));
        this.socket.on('updateGameTitle', data => store.commit('game/SOCKET_updateGameTitle', data));
        this.socket.on('setGameStage', data => store.commit('game/SOCKET_setGameStage', data));

        this.socket.on('wasKilled', data => store.commit('game/SOCKET_wasKilled', data));
        this.socket.on('setActionSend', data => store.commit('game/SOCKET_setActionSend', data));
        this.socket.on('setLabel', data => store.commit('game/SOCKET_setLabel', data));
        this.socket.on('setLabels', data => store.commit('game/SOCKET_setLabels', data));

        this.socket.on('updateVoicesCount', data => store.commit('game/SOCKET_updateVoicesCount', data));

        this.socket.on('showGameResult', data => store.commit('game/SOCKET_showGameResult', data));
        this.socket.on('setMafiaPlayersCount', data => store.commit('game/SOCKET_setMafiaPlayersCount', data));
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
  }
  
  export default new SocketioService();