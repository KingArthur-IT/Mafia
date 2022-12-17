import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import user from './modules/user'
import toast from './modules/toast'
import rooms from './modules/rooms'

export default createStore({
  modules:{
    user,
    toast,
    rooms
  },
  // plugins: [createPersistedState()],
});
