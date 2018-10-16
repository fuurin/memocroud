<template>
  <main class="section columns is-centered">

    <div class="column is-half">
      <div class="box">

        <div class="level">
          <h2 class="level-item title is-4">Edit profile</h2>
        </div>

        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">User name</label>
          </div>
          <div class="field-body">
            <input class="input" type="text" placeholder="Your user name" required maxlength=20>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">E-mail</label>
          </div>
          <div class="field-body">
            <input class="input" type="email" placeholder="e-mail" required>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">Password</label>
          </div>
          <div class="field-body">
            <input class="input" type="password" placeholder="password" required maxlength=20 minlength=6>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">Confirm</label>
          </div>
          <div class="field-body">
            <input class="input" type="password" placeholder="retype password" required maxlength=20 minlength=6>
          </div>
        </div>

        <div class="is-centered columns">
          <div class="column is-half">
            <a class="button is-primary is-fullwidth">Finish</a>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Signedit',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
