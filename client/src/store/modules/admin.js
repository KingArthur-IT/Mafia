// import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'admin', 
  namespaced: true,

  state: {
    
  },

  getters: {

  },

  mutations: {

  },

  actions: {
    async sendEntryNotification ({ }, { email }) {
      const res = await sendRequest('/admin/sendEntryNotification', 'POST', { email });
      if (res.status !== 200) {
        console.log('Failed to send entry notification');
      }
    },
  },

  // plugins: [createPersistedState()],
};
