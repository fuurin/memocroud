<template>
  <main>
    <div id="top"></div>

    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Welcome to the memo cloud!</h1>
          <h2 class="subtitle">{{ username }}</h2>
        </div>
      </div>
    </section>

    <section class="section columns">

      <form @submit.prevent="post" class="column is-3">
        <aside class="box" :class="{'sticky': !isMobile()}">
          <div class="content">
            <textarea v-model="memo" @keyup.enter.ctrl="post" @keyup.16.ctrl="speech" id="draft" class="textarea" placeholder="Write your memo!" autofocus></textarea>
          </div>
          <div class="content columns">
            <div class="column is-9">
              <button type="submit" class="button is-primary is-fullwidth tooltip" data-tooltip="ctrl + Enter to post">
                Post
              </button>
            </div>
            <div class="column">
              <div class="button is-fullwidth tooltip" :class="{ 'is-danger': isRecording }" @click="speech" data-tooltip="ctrl + shift to speech">
                <i class="fas fa-microphone"></i>
              </div>
            </div>
          </div>
        </aside>
      </form>

      <div class="column">
        <div class="columns is-multiline">
          <memo v-for="memo in displayedMemos"
            @search-tag="searchTag"
            :key="memo.id"
            :id="memo.id"
            :memo="memo.memo"
            :created="memo.created"
            :keyword="keyword"
            :collection="collection"
            :SpeechToText="SpeechToText"
            :speechLang="speechLang"/>
        </div>
      </div>

    </section>

    <transition name="fade">
      <a href="#" id="return-top" v-show="showTopButton" v-scroll-to="'#top'">▲</a>
    </transition>

  </main>
</template>

<script>
import Memo from './Memo'
import moment from 'moment'
import isMobile from 'ismobilejs'
import firebase from 'firebase/app'
import db from './firebaseInit'
import SpeechToText from 'speech-to-text'
import { setTimeout } from 'timers'
const MEMOS_PER_PAGE = 9
const SHOW_TOP_BUTTON_PERIOD = 1000

var showTopButtonTimer = null

function modifySpeechText (text) {
  text = text.replace(/(改行|ブレイク|ブレーク|break )/g, '\n')
  text = text.replace(/(空白|スペース|space )/g, ' ')
  text = text.replace(/(シャープ|タグ|sharp |tag )/g, '#')
  text = text.replace(/([^ \n])#/gi, '$1 #')
  return text
}

export default {
  name: 'Main',
  props: ['keyword', 'speechLang'],
  components: {
    'memo': Memo
  },
  data () {
    return {
      username: '',
      uid: '',
      memo: '',
      memos: [],
      displayNum: MEMOS_PER_PAGE,
      isRecording: false,
      listener: null,
      SpeechToText: SpeechToText,
      collection: null,
      showTopButton: false
    }
  },
  methods: {
    post () {
      if (this.uid === '') return

      var memo = this.memo.trim()
      if (memo === '') return

      if (this.keyword !== '') {
        memo = this.keyword.split(' ').filter(word => word[0] === '#').join(' ') + '\n' + memo
      }

      this.stopSpeech()

      this.memo = ''
      if (!this.isMobile()) this.$el.querySelector('#draft').focus()

      this.collection.add({
        memo: memo,
        created: moment().format('YYYY/MM/DD HH:mm:ss')
      })
        .then(doc => {
        })
        .catch(error => {
          alert(error)
        })
    },
    showMore () {
      this.displayNum += MEMOS_PER_PAGE
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

      var originalMemo = this.memo

      const onSpeechFinished = (text) => {
        if (!this.isRecording) return
        this.listener.stopListening()
        this.isRecording = false
        const modifiedText = modifySpeechText(text)
        this.memo = (originalMemo + '\n' + modifiedText).trim()
      }

      const onSpeechDetected = (text) => {
        if (!this.isRecording) return
        const modifiedText = modifySpeechText(text)
        this.memo = (originalMemo + '\n' + modifiedText).trim()
      }

      try {
        this.listener = new this.SpeechToText(onSpeechFinished, onSpeechDetected, this.speechLang)
        this.listener.startListening()
      } catch (error) {
        alert(error)
      }
    },
    searchTag (tag) {
      this.$emit('search-tag', tag)
    },
    isMobile () {
      return isMobile.any
    }
  },

  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) return
      this.username = user.displayName
      this.uid = user.uid
      this.collection = db.collection('users').doc(this.uid).collection('memos')
      this.collection
        .orderBy('created')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              let data = change.doc.data()
              data['id'] = change.doc.id
              this.memos.unshift(data)
            }
            if (change.type === 'modified') {
              const memo = this.memos.find(memo => memo.id === change.doc.id)
              memo.memo = change.doc.data().memo
              memo.created = change.doc.data().created
            }
            if (change.type === 'removed') {
              this.memos = this.memos.filter(memo => memo.id !== change.doc.id)
            }
          })
        }, error => {
          alert(error)
        })
    })
  },

  computed: {
    displayedMemos () {
      let memos = []

      if (this.keyword === '') {
        memos = this.memos
      } else {
        const words = this.keyword.split(' ').filter(word => word.length > 0)
        memos = this.memos.filter(memo => {
          const m = memo.memo
          return words.every(word => {
            if (word[0] === '#' && word.length > 1) {
              return m.includes(word + ' ') || m.includes(word + '\n') || m.endsWith(word)
            }
            return m.includes(word)
          })
        })
      }

      return memos.slice(0, this.displayNum)
    }
  },

  mounted () {
    window.addEventListener('scroll', () => {
      this.showTopButton = true
      if (showTopButtonTimer !== null) clearTimeout(showTopButtonTimer)
      showTopButtonTimer = setTimeout(() => {
        this.showTopButton = false
        showTopButtonTimer = null
      }, SHOW_TOP_BUTTON_PERIOD)
      if (window.scrollY > document.body.clientHeight - window.innerHeight - 100) this.showMore()
    })
    setTimeout(() => {
      this.$el.querySelector('#draft').focus()
    }, 1)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #return-top {
    background-color: #e4b414;
    border-radius: 50%;
    bottom: 50px;
    color: #fff;
    font-size:20px;
    height: 50px;
    line-height: 50px;
    outline: 0;
    position: fixed;
    right: 50px;
    text-align: center;
    width: 50px;
  }

  #top {
    position: absolute;
    top: -1000px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

.sticky {
  position: -webkit-sticky; /* safari対応 */
  position: sticky;
  top: 85px;
}

</style>
