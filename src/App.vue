<template>
  <div id="app" class="has-footer-fixed-bottom">
    <nav class="navbar is-fixed-top">
      <div class="navbar-brand" @click.stop="menuToggle">
        <router-link to="/" class="navbar-item">
          <img id="nav-logo" src="./assets/logo_main_sm.png" alt="site logo">
        </router-link>

        <a v-if="is_login" role="button" class="navbar-burger burger" :class="{ 'is-active': menuActive }" aria-label="menu" aria-expanded="false" data-target="burgerContent">
          <span></span>
          <span></span>
          <span></span>
        </a>

      </div>

      <div v-if="is_login" id="burgerContent" class="navbar-menu" :class="{ 'is-active': menuActive }">
        <div v-if="is_login && $route.path === '/'" class="navbar-item">
          <div class="control has-icons-left has-icons-right">
            <input v-model="keyword" id="search-box" class="input" type="search" name="search" placeholder="keywords...">
            <span class="icon is-small is-left">
              <i class="fa fa-search"></i>
            </span>
            <a @click="clearKeyword" class="icon is-small is-right" style="pointer-events: initial; cursor: pointer;">
              <i class="fas fa-times"></i>
            </a>
          </div>
        </div>
        <div v-if="is_login && $route.path === '/'" class="navbar-item">
          <div class="button" :class="{ 'is-danger': isRecording }" @click="speech">
            <i class="fa fa-search"></i>
            <i class="fas fa-microphone"></i>
          </div>
        </div>
        <div v-if="is_login && $route.path === '/'" class="navbar-item">
          <div class="control has-icons-left">
            <div class="select">
              <select v-model="speechLang">
                <option value="ja" selected="true">Japanese</option>
                <option value="en-US">English</option>
              </select>
            </div>
            <div class="icon is-small is-left">
              <i class="fas fa-microphone"></i>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <router-link to="/signedit">
              <i class="fa fa-user-circle fa-2x" style="color: #e4b414"></i>
            </router-link>
          </div>
          <div class="navbar-item">
            <a @click="signOut" class="button is-primary">Sign out</a>
          </div>
        </div>
      </div>

    </nav>

    <div @click="menuClose">
      <router-view
        @search-tag="searchTag"
        :keyword="keyword"
        :speechLang="speechLang"
      />
    </div>

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          2018 ©fuurin<br>
          contact: komatsu@dais.is.tohoku.ac.jp
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import SpeechToText from 'speech-to-text'

function modifySpeechText (text) {
  text = text.replace(/(改行|ブレイク|ブレーク|break )/g, '\n')
  text = text.replace(/(空白|スペース|space )/g, ' ')
  text = text.replace(/(シャープ|タグ|sharp |tag )/g, '#')
  text = text.replace(/([^ \n])#/gi, '$1 #')
  return text
}

export default {
  name: 'App',
  data () {
    return {
      menuActive: false,
      is_login: false,
      keyword: '',
      speechLang: 'ja',
      isRecording: false,
      listener: null,
      SpeechToText: SpeechToText
    }
  },
  methods: {
    menuToggle () {
      this.menuActive = !this.menuActive
    },
    menuClose () {
      this.menuActive = false
    },
    signOut () {
      firebase.auth().signOut().then(() => {
        this.$router.push('/signin')
      })
    },
    searchTag (tag) {
      this.keyword = (this.keyword.trim() + ` ${tag.trim()}`).trim() + ' '
    },
    clearKeyword () {
      this.keyword = ''
    },
    stopSpeech () {
      if (this.isRecording) {
        if (this.listener !== null) {
          this.listener.stopListening()
        }
        this.isRecording = false
        return true
      }
      return false
    },
    speech () {
      if (this.stopSpeech()) return

      this.isRecording = true

      if (!('webkitSpeechRecognition' in window)) {
        alert('Your brouser doesn\'t support speech recognitin. Please Try Google Chrome browser.')
        this.isRecording = false
        return
      }

      const onSpeechFinished = (text) => {
        if (!this.isRecording) return
        this.listener.stopListening()
        this.isRecording = false
        this.keyword = modifySpeechText(text).trim()
      }

      const onSpeechDetected = (text) => {
        if (!this.isRecording) return
        this.keyword = modifySpeechText(text).trim()
      }

      try {
        this.listener = new this.SpeechToText(onSpeechFinished, onSpeechDetected, this.speechLang)
        this.listener.startListening()
      } catch (error) {
        alert(error)
      }
    }
  },
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      this.is_login = (user !== null)
    })
  },
  mounted () {
    [].forEach.call(document.getElementsByClassName('stop'), dom => {
      dom.addEventListener('click', ev => {
        ev.stopPropagation()
      })
    })
  }
}
</script>

<style lang="scss">
@import "../node_modules/bulma/sass/utilities/initial-variables";
@import "../node_modules/bulma/sass/utilities/functions";

$primary: #e4b414;
$footer-background-color: ivory;

// customize bulma over here
@import "../node_modules/bulma/bulma.sass";
@import "../node_modules/bulma-extensions/bulma-tooltip/dist/css/bulma-tooltip.sass";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 50px;
}

.navbar {
  background-color: ivory;
}

#nav-logo {
  max-height: 42px;
}

.has-footer-fixed-bottom {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

footer {
  margin-top: auto;
}
</style>
