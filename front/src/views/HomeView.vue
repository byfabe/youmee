<template>
  <div class="container-home">
    <!-- TOP DEBUT -->
    <div class="top">
      <p>youmee.</p>
    </div>
    <!-- TOP FIN -->

    <!-- LEFT DEBUT -->
    <div class="left">
      <div class="rooms">
        <p class="rooms-title">Rooms</p>
        <div class="box-rooms">
          <p data-room="Général" class="room active" @click="dataRoom($event)">
            #️⃣ Général
          </p>
          <p data-room="Room 1" class="room" @click="dataRoom">🟢 Room 1</p>
          <p data-room="Room 2" class="room" @click="dataRoom">🟡 Room 2</p>
          <p data-room="Room 3" class="room" @click="dataRoom">🟠 Room 3</p>
        </div>
      </div>
      <div class="userManage">
        <span>@{{ getUser }}</span>
        <a href="/"><img src="../assets/deconnect.png" alt="" /></a>
      </div>
    </div>
    <!-- LEFT FIN-->

    <!-- MID DEBUT -->
    <div class="mid">
      <div class="messages" ref="messagesContainer">
        <div v-for="message in roomMessages" :key="message" class="message">
          <div class="box-user" v-if="message.user">
            <div class="top-user">
              <span class="message-user">{{ message.user }}</span>
              <span class="message-date"
                >{{ message.hour }}h{{ message.minute }}</span
              >
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
            v-model="inputValue"
            :placeholder="'Envoyer un message dans ' + placeholderRoom + '...'"
            @keydown.enter.exact.prevent.stop="sendMessage"
            @keyup="scroll($event)"
            @input="isTyping"
            @click="removeEmoji"
            @keydown.enter.shift.exact.prevent="inputValue += '\n'"
            maxlength="450"
            rows="1"
          />
          <Picker
            :data="emojiIndex"
            set="twitter"
            @select="showEmoji($event)"
            class="picker hidden"
            native
            exclude="[flags]"
            :i18n="{
              categories: {
                recent: 'Fréquemment utilisés',
                smileys: 'Smileys & Emoticon',
                people: 'Personnes',
                nature: 'Animaux et Nature',
                foods: 'Nourriture et boisson',
                activity: 'Activités',
                places: 'Voyage',
                objects: 'Objets',
                symbols: 'Symboles',
              },
            }"
          />
          <span class="emoji-btn" @click="hiddenEmoji">😜</span>
          <div class="typing">
            <p v-show="this.typing === true">
              {{ typingUser }} est en train d'écrire...
            </p>
          </div>
        </form>
      </div>
    </div>
    <!-- MID FIN -->

    <!-- RIGHT DEBUT -->
    <div class="right">
      <div class="title-contacts"><span>CONTACTS</span></div>
      <div class="contacts">
        <div class="contact" v-for="user in getUsers" :key="user">
          <img :src="require(`@/assets/${user.avatar}`)" alt="Avatar" />
          <span>{{ user.user }}</span>
        </div>
      </div>
    </div>
    <!-- RIGHT FIN -->
  </div>
</template>

<script>
import data from "emoji-mart-vue-fast/data/all.json";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import "emoji-mart-vue-fast/css/emoji-mart.css";
let exclude = ["flags"];
let emojiIndex = new EmojiIndex(data, {
  exclude,
});

import { mapGetters } from "vuex";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000"); // https://youmeechat.herokuapp.com // http://localhost:3000
export default {
  components: {
    Picker,
  },
  setup() {},
  data() {
    return {
      emojiIndex: emojiIndex,
      emojisOutput: "",
      users: [], //Verification
      messages: [], // Verification
      roomMessages: [],
      user: "",
      typing: false,
      typingUser: "",
      inputValue: "",
      placeholderRoom: "Général",
    };
  },
  methods: {
    sendMessage() {
      let textarea = document.querySelector("textarea");
      let minute = new Date().getMinutes();
      let room = document.querySelector(".box-rooms p.active");

      //Ajoute un "0" si les minutes sont inférieurs à 10 pour éviter 15h1 (par ex.)
      if (minute < 10) {
        minute = "0" + new Date().getMinutes();
      } else {
        minute = new Date().getMinutes();
      }

      if (textarea.value) {
        socket.emit("my message", {
          user: this.getUser,
          message: textarea.value,
          minute: minute,
          hour: new Date().getHours(),
          room: room.dataset.room,
        });

        //Envoi typing false // remet le textarea vide // remet la hauteur du textarea par défaut -> Déclenché par la touche "Entrée"
        socket.emit("typing", { typing: false });
        textarea.value = "";
        this.inputValue = "";
        textarea.style.height = "auto";
      }
    },

    //Detecte si il y a une saisie dans le textarea // et resize automatiquement la hauteur du textarea
    isTyping() {
      let textarea = document.querySelector("textarea");
      const room = document.querySelector(".box-rooms p.active");

      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";

      if (textarea.value != "") {
        socket.emit("typing", {
          user: this.getUser,
          typing: true,
          room: room.dataset.room,
        });
      } else {
        socket.emit("typing", { typing: false });
      }
    },

    //Ajoute le focus dans le textarea à la création de la page
    textareaFocus() {
      let textarea = document.querySelector("textarea");
      textarea.focus();
    },

    //Scroll les messages automatiquement vers le bas // et resize automatiquement le textarea
    scroll(event) {
      let textarea = document.querySelector("textarea");
      //scroll
      let content = this.$refs.messagesContainer;
      content.scrollTop = content.scrollHeight;

      //resize
      let scrollHeight = event.target.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    },

    //Ajoute les emoji dans le textarea
    showEmoji(emoji) {
      this.emojisOutput = emoji.native;
      let textarea = document.querySelector("textarea");
      if (textarea.value.length < 450) {
        textarea.value += this.emojisOutput;
      }
    },

    //Toggle la classe "hidden" pour afficher ou non les emoji
    hiddenEmoji() {
      let picker = document.querySelector(".picker");
      let btn = document.querySelector(".emoji-btn");
      picker.classList.toggle("hidden");
      btn.classList.toggle("opacity");
    },

    //Cache la box emoji au clic dans le textarea
    removeEmoji() {
      let picker = document.querySelector(".picker");
      if (!picker.classList.contains("hidden")) {
        picker.classList.add("hidden");
      }
    },

    //On change d'onglet (room) au clic et on le rend actif // On efface les messages
    changeRoom() {
      document.querySelectorAll(".box-rooms p").forEach((tab) => {
        tab.addEventListener("click", function () {
          if (!this.classList.contains("active")) {
            const active = document.querySelector(".box-rooms p.active");
            active.classList.remove("active");
            this.classList.add("active");
            let message = document.querySelectorAll(".message");
            // for (let i in message) {
            //   message[i].remove();
            // }
          }
        });
      });
    },

    // On emit le nom de la room dans lequel on entre avec enter_room // On emit le nom de la room dans lequel on sort avec leave_room
    // On remet le focus dans le textarea au changement d'onglet
    // On change le placeholder avec le nom de la room correspondant
    dataRoom(event) {
      const active = document.querySelector(".box-rooms p.active");
      let target = event.target;
      socket.emit("enter_room", target.dataset.room);
      socket.emit("leave_room", active.dataset.room);
      this.textareaFocus();
      this.placeholderRoom = target.dataset.room;

      ///////AJOUTE TYPING EVENT/////////
      socket.emit("typing", { typing: false });
      this.typing = false;
      
      //On filtre les messages et on ajoute les messages correspondant à la room dans "roomMessages"
      this.roomMessages = this.getMessages.filter(function (el) {
        return el.room === target.dataset.room;
      });
    },

    //Se connecte au chargement de la page (mounted) dans la room #general
    connect() {
      socket.emit("enter_room", "Général");
    },

    // Quand l'onglet redevient actif, le title réaffiche "youmee."
    focusWindow() {
      window.addEventListener("focus", function () {
        let title = document.querySelector("title");
        title.innerText = "youmee.";
      });
    },
  },

  computed: {
    ...mapGetters(["getUser", "getUsers", "getMessages"]),
  },

  updated() {
    this.$nextTick(() => this.scroll());
  },

  mounted() {
    this.changeRoom();
    this.connect();
    this.focusWindow();

    //Ecoute "my message" sur le serveur et push le message si un message est écouté
    socket.on("my message", (data) => {
      let title = document.querySelector("title");
      const active = document.querySelector(".box-rooms p.active");

      this.$store.commit("ADD_MESSAGES", data);
      //this.messages.push(data);
      this.roomMessages = this.getMessages.filter(function (el) {
        return el.room === active.dataset.room;
      });

      if (document.hidden) {
        title.innerText = "Nouveaux messages...";
      }
      console.log("messages", this.messages);
      console.log("roomMessages", this.roomMessages);
    });

    // Ecoute "users" sur le serveur et push la liste des utilisateurs connectés
    socket.on("users", (data) => {
      //this.users = data;
      this.$store.commit("ADD_USERS", data);
    });

    // Ecoute "User" sur le serveur et push le nom de l'utulisateur qui se connecte dans le chat
    socket.on("User", (data) => {
      this.messages.push(data);
    });

    //Ecoute typing
    socket.on("typing", (data) => {
      this.typing = data.typing;
      this.typingUser = data.user;
    });

    //Arrivé d'un utilisateur dans une room
    socket.on("connect", () => {
      socket.emit("enter_room", "Général");
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
      //text-align: center;
      color: #f1f1f1;
      font-size: 26px;
      font-family: "Bubblegum Sans", cursive;
      padding: 0 20px;
    }
  }
  & .left {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 15%;
    height: 95vh;
    background: #37383a;
    border-top-right-radius: 10px;
    font-family: "Roboto", sans-serif;
    color: #f1f1f1;
    & .rooms {
      & .rooms-title {
        width: 100%;
        padding: 20px;
      }
      & .box-rooms {
        width: auto;
        border-left: 1px solid rgba(255, 255, 255, 0.178);
        margin-left: 10%;
        & .active {
          background: #242526;
          border-radius: 10px;
        }
      }
      & .room {
        width: 90%;
        padding: 10px 10px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    & .userManage {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 7%;
      border-top: 1px solid #f1f1f14d;
      background: #151616bb;
      & span {
        margin-left: 10%;
      }
      & a {
        display: flex;
        justify-content: flex-end;
        & img {
          width: 10%;
          margin-right: 11%;
        }
      }
    }
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
      &::-webkit-scrollbar {
        display: none;
      }
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
        word-break: break-word;
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
              white-space: pre-wrap;
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
    & .container-textarea::v-deep {
      position: relative;
      width: 90%;
      user-select: none;
      & textarea {
        width: 100%;
        margin-bottom: 2%;
        background: #37383a;
        border-radius: 10px;
        border: none;
        outline: none;
        color: #f1f1f1;
        resize: none;
        padding: 15px;
        font-size: 16px;
        font-family: "Roboto", sans-serif;
        overflow: hidden;
      }
      & .picker {
        position: absolute;
        bottom: 110%;
        right: 0;
        background: #37383a;
        border: none;
        box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
          rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
      }
      & .emoji-mart-category-label {
        background: #37383a;
        color: #f1f1f1;
        padding: 5px 4px;
        border-radius: 5px;
      }
      & .emoji-btn {
        position: absolute;
        top: 4%;
        right: 0.5%;
        font-size: 30px;
        cursor: pointer;
        opacity: 0.5;
        transition: all 0.2s ease-in-out;
        &:hover {
          transition: all 0.2s ease-in-out;
        }
      }
      & .typing {
        height: 2vh;
        font-size: 14px;
        font-family: "Roboto", sans-serif;
        color: #f1f1f1a6;
        margin-bottom: 1%;
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
      padding: 20px;
    }
    & .contacts {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 16px;
      color: #d6d6d6;
      margin: 2% 0;
      & .contact {
        display: flex;
        align-items: center;
        width: 90%;
        cursor: pointer;
        &:hover {
          background: #242526;
          border-radius: 10px;
        }
        & span {
          margin: 5% 0;
        }
        & img {
          width: 30px;
          margin-right: 3%;
          margin-left: 10px;
        }
      }
    }
  }
}
.hidden {
  display: none;
}
.opacity {
  opacity: 1 !important;
}
</style>