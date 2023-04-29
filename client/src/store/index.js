import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import admin from './modules/admin'
import auth from './modules/auth'
import user from './modules/user'
import toast from './modules/toast'
import rooms from './modules/rooms'
import game from './modules/game'

export default createStore({
  modules: {
    admin, 
    auth,
    user,
    toast,
    rooms,
    game
  },
  // plugins: [createPersistedState()],
});
