<template>
  <main class="section columns is-centered">

    <div class="column is-two-thirds">
      <div class="box">

        <div class="level">
          <h2 class="level-item title is-4">Edit profile</h2>
        </div>

        <form @submit.prevent="usernameEdit" class="columns">
          <div class="field is-horizontal column is-10">
            <div class="field-label is-normal">
              <label class="label">User name</label>
            </div>
            <div class="field-body">
              <input v-model="username" class="input" type="text" placeholder="Your user name" autofocus maxlength=20>
            </div>
          </div>
          <div class="column">
            <input type="submit" class="button is-primary" value="Modify">
          </div>
        </form>

        <hr/>

        <form @submit.prevent="emailEdit" class="columns">
          <div class="field is-horizontal column is-10">
            <div class="field-label is-normal">
              <label class="label">E-mail</label>
            </div>
            <div class="field-body">
              <input v-model="email" class="input" type="text" placeholder="Your e-mail address" maxlength=20>
            </div>
          </div>
          <div class="column">
            <input type="submit" class="button is-primary" value="Modify">
          </div>
        </form>

        <hr/>

        <form @submit.prevent="passwordEdit" class="columns is-vcentered">
          <div class="column is-10">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Password</label>
              </div>
              <div class="field-body">
                <input v-model="password" class="input" type="password" placeholder="password" maxlength=20 minlength=6>
              </div>
            </div>

            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Confirm</label>
              </div>
              <div class="field-body">
                <input v-model="confirm" class="input" type="password" placeholder="retype password" maxlength=20 minlength=6>
              </div>
            </div>
          </div>
          <div class="column is-vcentered">
            <input type="submit" class="button is-primary" value="Modify">
          </div>
        </form>

        <hr/>

        <div class="is-centered columns">
          <div class="column is-half">
            <router-link to="/" class="button is-fullwidth">Back to memos list</router-link>
          </div>
        </div>

      </div>

      <div class="box">
        <div class="is-centered columns">
          <div class="column is-half">
            <a @click="deleteAccount" class="button is-danger is-fullwidth">Delete account</a>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'Signedit',
  data () {
    return {
      username: '',
      email: '',
      password: '',
      confirm: ''
    }
  },
  methods: {
    usernameEdit () {
      if (this.username.length > 20) {
        alert('The length of user name is up to 20. Please re-consider your user name!')
        return
      }

      const user = firebase.auth().currentUser
      user.updateProfile({displayName: this.username})
        .then(() => {
          alert('User name updated: ' + user.displayName)
        })
        .catch(err => {
          alert(err.message)
        })
    },
    emailEdit () {
      const user = firebase.auth().currentUser
      user.updateEmail(this.email)
        .then(() => {
          alert('E-mail updated: ' + user.email)
        })
        .catch(err => {
          alert(err.message)
        })
    },
    passwordEdit () {
      if (this.password !== this.confirm) {
        alert('Password and the one to confirm are different. Please double check them!')
        return
      }

      const user = firebase.auth().currentUser
      user.updateEmail(this.email)
        .then(() => {
          alert('Password updated')
        })
        .catch(err => {
          alert(err.message)
        })
    },
    deleteAccount () {
      if (confirm('Are you really sure deleting your account? You cannot restore the data.')) {
        var user = firebase.auth().currentUser
        user.delete().then(() => {
          this.$router.push('/signin')
        }).catch((error) => {
          alert(error)
        })
      }
    }
  },
  created () {
    const user = firebase.auth().currentUser
    this.username = user.displayName
    this.email = user.email
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
