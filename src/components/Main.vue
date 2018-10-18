<template>
  <main>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Welcome to the memocloud!</h1>
          <h2 class="subtitle">{{ username }}</h2>
        </div>
      </div>
    </section>

    <section class="section columns">

      <form @submit.prevent="post" class="column is-3">
        <aside class="box">
          <div class="content">
            <textarea v-model="memo" @keyup.enter.ctrl="post" id="draft" class="textarea" placeholder="Write your memo!" autofocus></textarea>
            <small class="is-pulled-right has-text-grey-light">ctrl + Enter to post</small>
          </div>
          <div class="content">
            <input type="submit" class="button is-primary is-fullwidth" value="Post">
          </div>
        </aside>
      </form>

      <div class="column">
        <div class="columns is-multiline">
          <memo v-for="memo in displayedMemos" :key="memo.id" :id="memo.id" :memo="memo.memo" :created="memo.created"/>
        </div>
      </div>

    </section>

  </main>
</template>

<script>
import Memo from './Memo'
import moment from 'moment'
import firebase from 'firebase/app'
import db from './firebaseInit'
const collection = db.collection('memos')

export default {
  name: 'Main',
  props: ['keyword'],
  components: {
    'memo': Memo
  },
  data () {
    return {
      username: '',
      memo: '',
      memos: []
    }
  },
  methods: {
    post () {
      const user = firebase.auth().currentUser
      if (user === null) return

      const memo = this.memo.trim()
      if (memo === '') return

      this.memo = ''
      document.getElementById('draft').focus()

      collection.add({
        memo: memo,
        created: moment().format('YYYY/MM/DD HH:mm:ss'),
        uid: user.uid
      })
        .then(doc => {
        })
        .catch(error => {
          alert(error)
        })
    }
  },
  computed: {
    displayedMemos () {
      if (this.keyword === '') {
        return this.memos
      } else {
        return this.memos.filter(memo => {
          const words = this.keyword.split(' ').map(word => `(?=.*${word})`).join('')
          return memo.memo.match(new RegExp(`^${words}`))
        })
      }
    }
  },
  mounted () {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) return
      this.username = user.displayName
      collection
        .where('uid', '==', user.uid)
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
