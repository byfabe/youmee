import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Connection from "../views/Connection.vue";
import store from "../store/index.js";

const routes = [
  {
    path: "/home",
    name: "home",
    component: HomeView,
    //Si un nom d'utilisateur a été enregistré dans le store la page "home" est accessible 
    beforeEnter(route, redirect, next) {
      if (store.state.user === "") {
        next({ name: "connection" });
      } else {
        next();
      }
    },
  },
  {
    path: "/",
    name: "connection",
    component: Connection,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
