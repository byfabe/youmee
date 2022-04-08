import { createStore } from "vuex";

export default createStore({
  state: {
    user: "",
    users: [],
    messages: [],
  },
  getters: {
    getUser: (state) => state.user,
    getUsers: (state) => state.users,
    getMessages: (state) => state.messages,
  },
  mutations: {
    ADD_USER(state, data) {
      state.user = data;
    },
    ADD_USERS(state, data) {
      state.users = data;
    },
    ADD_MESSAGES(state, data) {
      state.messages = data;
    },
  },
  actions: {},
  modules: {},
});
