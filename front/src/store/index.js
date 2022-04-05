import { createStore } from "vuex";

export default createStore({
  state: {
    user: "",
    users: [],
  },
  getters: {
    getUser: (state) => state.user,
    getUsers: (state) => state.users,
  },
  mutations: {
    ADD_USER(state, data) {
      state.user = data;
    },
    ADD_USERS(state, data) {
      state.users = data
    },
  },
  actions: {},
  modules: {},
});
