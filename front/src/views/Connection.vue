<template>
  <div class="container-connection">
    <span class="youmee alias" v-if="!getUser">alias.</span>
    <span class="youmee hidden face">avatar.</span>
    <div class="title"><h1>youmee.</h1></div>
    <div class="input">
      <input
        v-if="!getUser"
        type="text"
        placeholder="Pseudo"
        @keydown.enter.prevent.stop="toggleHidden"
        maxlength="10"
        autofocus
      />
      <router-link to="home">
        <p v-if="getUser" class="comeback">
          {{ getUser }} reviens nous voir dans le chat !
        </p>
      </router-link>
    </div>

    <!-- SELECT AVATAR DEBUT-->
    <div class="avatar hidden">
      <div class="select-avatar" v-for="avatar in avatars" :key="avatar">
        <img
          :src="require(`@/assets/${avatar}`)"
          alt="Avatar"
          @click="connection(avatar)"
        />
      </div>
    </div>
    <!-- SELECT AVATAR FIN-->

    <footer>
      <a href="https://www.rivetportfolio.ovh/#/" target="blank"
        >💠 portfolio 💠</a
      >
    </footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { io } from "socket.io-client";
const socket = io("https://youmeechat.herokuapp.com"); // https://youmeechat.herokuapp.com // http://localhost:3000
export default {
  data() {
    return {
      avatars: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"],
    };
  },
  methods: {
    //Envoi les informations de l'input au serveur // Ajoute l'utisateur dans le store de Vue // Renvoi vers la page "home"
    connection(item) {
      let input = document.querySelector("input");
      let user = { user: input.value, avatar: item };

      if (input.value) {
        socket.emit("users", user);
        this.$store.commit("ADD_USER", input.value);
        input.value = "";
        this.$router.push({ name: "home" });
      }
    },
    toggleHidden() {
      let avatar = document.querySelector(".avatar");
      let input = document.querySelector("input");
      let alias = document.querySelector(".alias");
      let face = document.querySelector(".face");
      avatar.classList.toggle("hidden");
      input.classList.toggle("hidden");
      alias.classList.toggle("hidden");
      face.classList.toggle("hidden");
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
  & .youmee {
    position: absolute;
    top: 0;
    left: 0;
    margin: 10px 20px;
    font-size: 26px;
    font-family: "Bubblegum Sans", cursive;
    color: #f1f1f1;
    user-select: none;
  }
  & .title {
    margin: 5% 0;
    font-size: 56px;
    font-family: "Bubblegum Sans", cursive;
    color: #f1f1f1;
    user-select: none;
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
    user-select: none;
  }
  & .avatar {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 50%;
    & .select-avatar {
      display: flex;
      justify-content: center;
      width: 33%;
      user-select: none;
      -webkit-user-drag: none;
      & img {
        width: 50%;
        min-width: 75px;
        margin: 15px;
        cursor: pointer;
        -webkit-user-drag: none;
      }
    }
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
.hidden {
  display: none !important;
}

@media screen and (max-width: 1144px) {
  .container-connection {
    & .title {
      font-size: clamp(25px, 5vw, 30px);
      margin-top: 100px;
    }
    & .input {
      display: flex;
      justify-content: center;
      & input {
        width: 80%;
      }
    }
    & .avatar {
      width: 100%;
      margin-top: 50px;
    }
  }
}
</style>