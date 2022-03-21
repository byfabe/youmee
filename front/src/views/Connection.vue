<template>
  <div class="container-connection">
    <div class="title"><h1>youmee.</h1></div>
    <div class="input">
      <input type="text" placeholder="Pseudo" @keydown.enter.prevent.stop="connection"/>
    </div>
    <footer><a href="mailto:byfabe@gmail.com">"byfabe"</a></footer>
  </div>
</template>

<script>
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
export default {
  methods: {
    connection() {
      let input = document.querySelector("input");
      if (input.value) {
        socket.emit('users', input.value)

        input.value = "";
        document.location.href = "/";
      }
    },
  },
  mounted() {},
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