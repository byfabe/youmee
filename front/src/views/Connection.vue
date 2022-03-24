<template>
  <div class="container-connection">
    <div class="title"><h1>youmee.</h1></div>
    <div class="input">
      <input
        v-if="!getUser"
        type="text"
        placeholder="Pseudo"
        @keydown.enter.prevent.stop="connection"
        maxlength="10"
        autofocus
      />
      <router-link to="home">
        <p v-if="getUser" class="comeback">
          {{ getUser }} reviens nous voir dans le chat !
        </p>
      </router-link>
    </div>
    <footer><a href="mailto:byfabe@gmail.com">"byfabe"</a></footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
export default {
  methods: {
    //Envoi les informations de l'input au serveur // Ajoute l'utisateur dans le store de Vue // Renvoi vers la page "home"
    connection() {
      let input = document.querySelector("input");
      if (input.value) {
        socket.emit("users", input.value);
        this.$store.commit("ADD_USER", input.value);
        input.value = "";
        this.$router.push({ name: "home" });
      }
    },
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
};
</script>

<style lang="scss" scoped>
.container-connection {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: #242526;
  & .title {
    margin: 5% 0;
    font-size: 56px;
    font-family: "Bubblegum Sans", cursive;
    color: #f1f1f1;
  }
  & .comeback {
      font-size: 20px;
      font-family: "Roboto", sans-serif;
      color: #f1f1f1;
    }
  & input {
    font-size: 26px;
    font-weight: bold;
    padding: 20px;
    outline: none;
    border: none;
    border-radius: 35px;
    margin: 20% 0;
    color: rgba(48, 49, 49, 0.973);
    text-align: center;
  }
  footer {
    & a {
      position: fixed;
      bottom: 0;
      right: 50%;
      transform: translateX(50%);
      color: #f1f1f1;
      font-size: 22px;
      font-family: "Bubblegum Sans", cursive;
      margin-bottom: 1%;
    }
  }
}
</style>