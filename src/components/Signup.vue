<template>
  <main class='section columns'>

    <div class='column is-half'>
      <figure class='image is-4by3'>
        <img src='https://bulma.io/images/placeholders/640x480.png'>
      </figure>
    </div>

    <div class='column'>
      <form @submit.prevent="signUp" class='box'>

        <div class='level'>
          <h2 class='level-item title is-4'>Sign up</h2>
        </div>

        <div class='field is-horizontal'>
          <div class='field-label'>
            <label class='label'>User name</label>
          </div>
          <div class='field-body'>
            <input v-model='username' class='input' type='text' placeholder='Your user name' autofocus required maxlength=20>
          </div>
        </div>

        <div class='field is-horizontal'>
          <div class='field-label'>
            <label class='label'>E-mail</label>
          </div>
          <div class='field-body'>
            <input v-model='email' class='input' type='email' placeholder='e-mail' required>
          </div>
        </div>

        <div class='field is-horizontal'>
          <div class='field-label'>
            <label class='label'>Password</label>
          </div>
          <div class='field-body'>
            <input v-model='password' class='input' type='password' placeholder='password' required maxlength=20 minlength=6>
          </div>
        </div>

        <div class='field is-horizontal'>
          <div class='field-label'>
            <label class='label'>Confirm</label>
          </div>
          <div class='field-body'>
            <input v-model='confirm' class='input' type='password' placeholder='retype password' required maxlength=20 minlength=6>
          </div>
        </div>

        <div class='is-centered columns'>
          <div class='column is-half'>
            <input type="submit" class='button is-primary is-fullwidth' value="Finish">
          </div>
        </div>

      </form>
    </div>
  </main>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'Signup',
  data () {
    return {
      username: '',
      email: '',
      password: '',
      confirm: ''
    }
  },
  methods: {
    signUp () {
      if (this.password !== this.confirm) {
        alert('Password and the one to confirm are different. Please double check them!')
        return
      }

      if (this.username.length > 20) {
        alert('The length of user name is up to 20. Please re-consider your user name!')
        return
      }

      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          const currentUser = user.user
          currentUser.updateProfile({
            displayName: this.username
          })
            .then(() => {
              alert('Create account: ' + currentUser.displayName)
              this.$router.push('/')
            })
            .catch(error => {
              alert(error.message)
            })
        })
        .catch(error => {
          alert(error.message)
        })
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
