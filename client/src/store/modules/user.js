import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'user', 
  namespaced: true,

  state: {
    user: {
      id: 0,
      nickname: 'NotFound',
      email: 'NotFound',
      email_notification: true,
      gender: 'male',
      age: '0',
      country: '',
      role: 'USER',
      account_type: 'standart',
      rating: 0,
      all_games_count: 0, 
      mafia_wins_count: 0, 
      citizen_wins_count: 0, 
      was_mafia_count: 0, 
      was_sheriff_count: 0, 
      was_doctor_count: 0, 
      was_lover_count: 0, 
      was_terrorist_count: 0, 
      was_barmer_count: 0, 
      was_bodyguard_count: 0, 
      bring_friend_count: 0, 
      bring_friend_score: 0
    }, 
    statsDescription: {
      all_games_count: 'Сыгнано игр', 
      mafia_wins_count: 'Побед в команде мафии', 
      citizen_wins_count: 'Побед в команде мирных жителей', 
      was_mafia_count: 'Играл в роли мафии', 
      was_sheriff_count: 'Играл в роли шериф', 
      was_doctor_count: 'Играл в роли доктора', 
      was_lover_count: 'Играл в роли любовницы', 
      was_terrorist_count: 'Играл в роли террориста', 
      was_barmer_count: 'Играл в роли бармена', 
      was_bodyguard_count: 'Играл в роли телохранителя'
    },
    additionalDesctiption: { 
      bring_friend_count: 'Приведи друга', 
      bring_friend_score: 'Пост в соцсетях'
    },
    notifications: []
  },

  getters: {
    userData: state => state.user,
    statsDescription: state => state.statsDescription,
    additionalDesctiption: state => state.additionalDesctiption,
    notificationsList: state => state.notifications,
  },

  mutations: {
    setUserData: (state, data) => state.user = {...data},
    setUserNotifications: (state, data) => state.notifications = [...data],
    setUserRating: (state, data) => state.user.rating = data
  },

  actions: {
    //user data
    async getUserData ({ state, commit }) {
      const res = await sendRequest(`/user?id=${state.user.id}`);
      if (res.status !== 200) {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }

      if (res.data?.resStatus === 'ok'){
        commit('setUserData', res.data.data);
        return true
      }
      else {
        this.dispatch('toast/showToast', { text: res.data.message, type: 'error' }, { root: true });
        return false
      }
    },
    async updateUserInfo ({ commit }, newUserData) {
      const res = await sendRequest('/user', 'PUT', newUserData);
      if (res.status !== 200) {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }

      if (res.data?.resStatus === 'ok'){
        this.dispatch('toast/showToast', { text: res.data.message, type: 'ok' }, { root: true });
        commit('setUserData', res.data.data);
      }
      else {
        this.dispatch('toast/showToast', { text: res.data.message, type: 'error' }, { root: true });
      }
    },
    async updateUserPassword ({ }, passwordData) {
      const res = await sendRequest('/user/password', 'PUT', passwordData);

      if (res.status !== 200) {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }

      if (res?.data?.resStatus === 'ok'){
        this.dispatch('toast/showToast', { text: res.data.message, type: 'ok' }, { root: true });
        return true
      }
      else {
        this.dispatch('toast/showToast', { text: res.data.message, type: 'error' }, { root: true });
        return false
      }
    },
    //rating
    async getUserRating ({ state, commit }) {
      const res = await sendRequest(`/user/rating?id=${state.user.id}`);
      if (res.status !== 200) {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }

      if (res.data?.resStatus === 'ok'){
          commit('setUserRating', res.data.data);
          return true
        }
        else {
          this.dispatch('toast/showToast', { text: res.data.message, type: 'error' }, { root: true });
          return false
        }

    },
    //notifications
    async getNotificationsData ({ commit, state }) {
      // const res = await sendRequest('/user/notifications', 'POST', { id: state.user.id });
      // if (res?.status) {
      //   if (res?.status === 'ok')
      //     commit('setUserNotifications', res.data.reverse())
      //   else this.dispatch('toast/showToast', { text: res.message, type: 'error' }, { root: true })
      // } else {
      //   this.dispatch('toast/showToast', { text: 'Failed to get notifications', type: 'error' }, { root: true })
      // }
    },
    async setAllNotificationsRead({ commit, state }) {
      const res = await sendRequest('/user/notifications', 'PUT', { id: state.user.id });
      //null if server in not available
      if (res?.status) {
        if (res?.status === 'ok')
          commit('setUserNotifications', res.data.reverse())
        else this.dispatch('toast/showToast', { text: res.message, type: 'error' }, { root: true })
      } else {
        this.dispatch('toast/showToast', { text: 'Cannot set all notifications as read', type: 'error' }, { root: true })
      }
    },
  },

  // plugins: [createPersistedState()],
};
