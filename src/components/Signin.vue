<template>
  <main class="section columns is-vcentered">

    <div class="column is-half">
      <figure class="image">
        <img src="../assets/logo_main_lg.png">
      </figure>
    </div>

    <div class="column">
      <div class="notification" style="background-color: #eee">
        <i class="far fa-lightbulb"></i>&nbsp;The memocloud is an Web app to upload your idea, URL of favorite website, quotes, and so on only for your purpose.
        You can share those texts from anywhere and any of your devices.
      </div>

      <form @submit.prevent="signIn" class="box">

        <div class="level">
          <h2 class="level-item title is-4">Sign in</h2>
        </div>

        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">E-mail</label>
          </div>
          <div class="field-body">
            <input v-model="email" class="input" type="email" placeholder="e-mail" autofocus required>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">Password</label>
          </div>
          <div class="field-body">
            <input v-model="password" class="input" type="password" placeholder="password" required maxlength=20 minlength=6>
          </div>
        </div>

        <div class="is-centered columns">
          <div class="column is-half">
            <input type="submit" class="button is-primary is-fullwidth" value="Sign in">
          </div>
        </div>

      </form>

      <div class="box">
        <div class="is-centered columns">
          <div class="column is-half">
            <router-link to="/signup" class="button is-primary is-fullwidth">
              Sign up
            </router-link>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'Signin',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signIn () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          this.$router.push('/')
        })
        .catch(err => {
          alert(err.message)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
