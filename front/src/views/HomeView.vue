<template>
  <div class="container-home">
    <!-- TOP DEBUT -->
    <div class="top">
      <p>youmee.</p>
    </div>
    <!-- TOP FIN -->

    <!-- LEFT DEBUT -->
    <div class="left"></div>
    <!-- LEFT FIN-->

    <!-- MID DEBUT -->
    <div class="mid">
      <div class="messages">
        <ul></ul>
      </div>
      <div class="container-textarea">
        <form action="" id="form">
          <textarea
            id="input"
            placeholder="Envoyer un message..."
            @keydown.enter.prevent.stop="sendMessage"
            autofocus
          />
        </form>
      </div>
    </div>
    <!-- MID FIN -->

    <!-- RIGHT DEBUT -->
    <div class="right">
      <div class="title-contacts"><span>CONTACTS</span></div>
      <div class="contacts">
        <span v-for="user in users" :key="user">{{ user }}</span>
      </div>
    </div>
    <!-- RIGHT FIN -->
  </div>
</template>

<script>
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
export default {
  setup() {
    // let messages = document.querySelector(".messages");
    // socket.on("my message", function (msg) {
    //   this.messages.push(msg)
    //   let item = document.createElement("li");
    //   item.textContent = msg;
    //   messages.appendChild(item);
    // });
  },
  data() {
    return {
      users: [],
    };
  },
  methods: {
    sendMessage() {
      let textarea = document.querySelector("textarea");
      if (textarea.value) {
        socket.emit("my message", textarea.value);
        textarea.value = "";
      }
    },
  },
  mounted() {
    socket.on("my message", (data) => {
      //this.messages.push(data);
      let message = document.createElement("li");
      let ul = document.querySelector("ul");
      message.textContent = data;
      ul.appendChild(message);
    });
    socket.on("users", (data) => {
      this.users = data;
    });
    socket.on("User", (data) => {
      //this.messages.push(data + ` vient de se connecter`);
      let message = document.createElement("li");
      let ul = document.querySelector("ul");
      message.classList.add("li-connect");
      message.textContent = data + ` vient de se connecter`;
      ul.appendChild(message);
    });
  },
};
</script>

<style lang="scss" scoped>
.container-home {
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
  background: #242526;
  & .top {
    display: flex;
    align-items: center;
    width: 100%;
    height: 5vh;
    background: #242526;
    & p {
      width: 15%;
      text-align: center;
      color: #f1f1f1;
      font-size: 26px;
      font-family: "Bubblegum Sans", cursive;
    }
  }
  & .left {
    width: 15%;
    height: 95vh;
    background: #37383a;
    border-top-right-radius: 10px;
  }
  & .mid {
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
    width: 70%;
    height: 95vh;
    & .messages::v-deep {
      width: 90%;
      color: #f1f1f1;
      margin: 2% 0;
      overflow: auto;
      & li {
        list-style: none;
        background: #37383a;
        padding: 10px;
        font-size: 18px;
        border-radius: 10px;
        margin: 2% 0;
      }
      & .li-connect {
        background: #222b3d;
        font-size: 14px;
      }
    }
    & .container-textarea {
      width: 90%;
      & textarea {
        width: 100%;
        margin-bottom: 2%;
        background: #37383a;
        border: none;
        outline: none;
        color: #f1f1f1;
        resize: none;
        padding: 10px;
        font-size: 18px;
        border-radius: 10px;
      }
    }
  }
  & .right {
    display: flex;
    flex-direction: column;
    width: 15%;
    height: 95vh;
    background: #37383a;
    border-top-left-radius: 10px;
    & .title-contacts {
      font-size: 16px;
      color: #f1f1f1;
      margin: 5% 5%;
    }
    & .contacts {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      color: #d6d6d6;
      margin: 2% 5%;
      & span {
        margin: 5% 0;
      }
    }
  }
}
</style>