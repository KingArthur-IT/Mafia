import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import user from './modules/user'
import toast from './modules/toast'

export default createStore({
  modules:{
    user,
    toast
  },
  plugins: [createPersistedState()],
});
