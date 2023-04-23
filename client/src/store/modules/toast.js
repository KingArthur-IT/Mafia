import createPersistedState from "vuex-persistedstate";

export default {
  name: 'toast', 
  namespaced: true,

  state: {
    text: '',
    visible: false,
    type: 'info' //warning, error, ok, info, 
  },

  getters: {
    isShown: state => state.visible,
    text: state => state.text,
    type: state => state.type,
  },

  mutations: {
    setText: (state, text) => state.text = text,
    setType: (state, type) => state.type = type,
    setShown: (state, isShown) => state.visible = isShown
  },

  actions: {
    showToast({ commit }, {text, type = 'info'}){
        commit('setText', text);
        commit('setType', type);
        commit('setShown', true);
        setTimeout(() => {
            commit('setShown', false);
        }, 3000);
    }
  },

//   plugins: [createPersistedState()],
};
