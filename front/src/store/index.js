import { createStore } from "vuex";

export default createStore({
  state: {
    user: "",
  },
  getters: {
    getUser: (state) => state.user,
  },
  mutations: {
    ADD_USER(state, data) {
      state.user = data;
    },
  },
  actions: {},
  modules: {},
});
