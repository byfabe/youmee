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
        <div v-for="message in messages" :key="message" class="message">
          <div class="box-user" v-if="message.user">
            <div class="top-user">
              <span class="message-user">{{ message.user }}</span>
              <span class="message-date">{{ message.h }}h{{ message.m }}</span>
            </div>
            <div class="bot-user">
              <p class="message-content">{{ message.message }}</p>
            </div>
          </div>
          <span class="message-connect">{{ message.connect }}</span
          ><span class="message-connect-text">{{ message.text }}</span>
        </div>
      </div>
      <div class="container-textarea">
        <form action="" id="form">
          <textarea
            id="input"
            placeholder="Envoyer un message..."
            @keydown.enter.prevent.stop="sendMessage"
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
import { mapGetters } from "vuex";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
export default {
  data() {
    return {
      users: [],
      messages: [],
      user: "",
    };
  },
  methods: {
    sendMessage() {
      let textarea = document.querySelector("textarea");
      let minute = new Date().getMinutes();

      //Ajoute un "0" si les minutes sont inférieurs à 10 pour éviter 15h1 (par ex.)
      if (minute < 10 ) {
        minute = "0" + new Date().getMinutes()
      } else {
        minute = new Date().getMinutes()
      }
      if (textarea.value) {
        socket.emit("my message", {
          user: this.getUser,
          message: textarea.value,
          minute: minute,
          hour: new Date().getHours(),
        });
        textarea.value = "";
      }
    },
    //Ajoute le focus dans le textarea à la création de la page
    textareaFocus() {
      let textarea = document.querySelector("textarea");
      textarea.focus();
    },
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  mounted() {
    //Ecoute "my message" sur le serveur et push le message si un message est écouté 
    socket.on("my message", (data) => {
      this.messages.push(data);
    });
    // Ecoute "users" sur le serveur et push la liste des utilisateurs connectés
    socket.on("users", (data) => {
      this.users = data;
    });
    // Ecoute "User" sur le serveur et push le nom de l'utulisateur qui se connecte dans le chat
    socket.on("User", (data) => {
      this.messages.push(data);
    });
    // Déclenche la fonction "textareaFocus" à la création de la page
    this.textareaFocus();
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
      & .message {
        display: flex;
        align-items: center;
        list-style: none;
        background: #37383a;
        padding: 10px;
        font-size: 18px;
        border-radius: 10px;
        margin: 2% 0;
        font-family: "Roboto", sans-serif;
        & .box-user {
          display: flex;
          flex-direction: column;
          width: 100%;
          & .top-user {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 1%;
            & .message-user {
              margin-right: 2%;
              font-size: 16px;
              font-weight: bold;
            }
            & .message-date {
              font-size: 14px;
              font-family: "Comfortaa", cursive;
            }
          }
          & .bot-user {
            display: flex;
            width: 100%;
            & .message-content {
              font-size: 16px;
            }
          }
        }
        & .message-connect {
          font-weight: bold;
          font-size: 16px;
          margin-right: 6px;
        }
        & .message-connect-text {
          font-size: 16px;
        }
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
        border-radius: 10px;
        border: none;
        outline: none;
        color: #f1f1f1;
        resize: none;
        padding: 10px;
        font-size: 16px;
        font-family: "Roboto", sans-serif;
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
    font-size: 16px;
    font-family: "Roboto", sans-serif;
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