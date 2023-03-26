import createPersistedState from "vuex-persistedstate";
import { sendRequest } from '@/use/useRequest' 

export default{
  name: 'user', 
  namespaced: true,

  state: {
    user: {
      id: 0,
      name: 'Артем',
      nickname: 'NotFound',
      gender: 'male',
      email: 'NotFound',
      emailNotification: true,
      accountType: 'standart',
      rating: 0,
    }, 
    userStats: {
      allGames: { count: 0, score: 0 },
      mafiaWins: { count: 0, score: 0 },
      citizenWins: { count: 0, score: 0 },
      wasMafia: { count: 0, score: 0 },
      wasSheriff: { count: 0, score: 0 },
      wasDoctor: { count: 0, score: 0 },
      wasLover: { count: 0, score: 0 },
      wasTerrorist: { count: 0, score: 0 },
      wasBarmen: { count: 0, score: 0 },
      wasBodyguard: { count: 0, score: 0 },
    },
    userAdditions: {
      friends: { count: 0, score: 0 },
    },
    notifications: [
      {
          title: 'Очень важное уведомление',
          msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
          date: '20.03.2023',
          isRead: false
      },
      {
          title: 'Очень важное уведомление',
          msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
          date: '21.03.2023',
          isRead: true
      },
      {
          title: 'Очень важное уведомление',
          msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
          date: '21.03.2023',
          isRead: true
      },
      {
          title: 'Очень важное уведомление',
          msg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor maxime, temporibus voluptate eius, quod natus eos sed cum rem eum quam reprehenderit praesentium, fugit laudantium voluptates nulla modi in distinctio!',
          date: '21.03.2023',
          isRead: true
      }
    ]
  },

  getters: {
    userData: state => state.user,
    statsData: state => state.userStats,
    additionsData: state => state.userAdditions,
    notificationsList: state => state.notifications
  },

  mutations: {
    setUserData: (state, data) => state.user = {...data},
    setUserStats: (state, data) => state.userStats = {...data},
    setUserAdditions: (state, data) => state.userAdditions = {...data},
    setUserAchievements: (state, data) => state.userAchievements = data,
    setUserNotifications: (state, data) => state.notifications = [...data].reverse(),
  },

  actions: {
    async getUserData ({ commit }, { email, password }) {
      const res = await sendRequest('/user', 'POST', { email, password });
      if (res?.status)
        if (res?.status === 'ok'){
          commit('setUserData', res.data);
          return true
        }
        else {
          this.dispatch('toast/showToast', { text: res.text, type: 'error' }, { root: true });
          return false
        }
      else {
        this.dispatch('toast/showToast', { text: 'Не удалось получить ответ от сервера', type: 'error' }, { root: true });
        return false;
      }
    },
    async updateUserInfo ({ commit }, newUserData) {
      const res = await sendRequest('/user', 'PUT', newUserData);
      //null if server in not available
      if (res?.data){
        commit('setUserData', res.data);
        this.dispatch('toast/showToast', {text: res.data.text, type: res.data.type}, { root: true })
      }
      else 
        this.dispatch('toast/showToast', {text: 'Request failed or new data is epmty', type: 'error'}, { root: true })
    },
    async getStatsData ({ commit }) {
      const res = await sendRequest('/user/stats');
      if (res?.data)
        commit('setUserStats', res.data);
      else {
        this.dispatch('toast/showToast', { text: 'Failed to get statistics', type: 'error' }, { root: true })
      }
    },
    async getAdditionsData ({ commit }) {
      const res = await sendRequest('/user/additions');
      if (res?.data)
        commit('setUserAdditions', res.data);
      else {
        this.dispatch('toast/showToast', { text: 'Failed to get additions', type: 'error' }, { root: true })
      }
    },
    async getNotificationsData ({ commit }) {
      const res = await sendRequest('/user/notifications');
      if (res?.data)
        commit('setUserNotifications', res.data);
      else {
        this.dispatch('toast/showToast', { text: 'Failed to get notifications', type: 'error' }, { root: true })
      }
    },
    async setAllNotificationsRead({ commit, dispatch }) {
      dispatch('getNotificationsData')
      console.log('set all to read');
      // const res = await sendRequest('/user/notifications', 'POST');
      // //null if server in not available
      // if (res?.data){
      //   commit('setAllNotificationsRead', res.data);
      // }
      // else 
      //   console.error('Cannot set all notifications as read');
    }
  },

  // plugins: [createPersistedState()],
};
