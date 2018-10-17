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

      <div class="column is-3">
        <aside class="box">
          <div class="content">
            <textarea class="textarea" placeholder="Write your memo!"></textarea>
          </div>
          <div class="content">
            <a class="button is-primary is-fullwidth">Post</a>
          </div>
        </aside>
      </div>

      <div class="column">

        <div class="columns">
          <div class="column is-4">
            <a class="box">
                <button class="delete is-pulled-right"></button>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                <br><time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </a>
          </div>
          <div class="column is-4">
            <a class="box">
                <button class="delete is-pulled-right"></button>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                <br><time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </a>
          </div>
          <div class="column is-4">
            <div class="card">
              <div class="card-content">
                <div class="content">
                    <textarea class="textarea" placeholder="Write your memo!">Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit</textarea>
                </div>
              </div>
              <footer class="card-footer">
                <a href="#" class="card-footer-item">Save</a>
                <a href="#" class="card-footer-item">Cancel</a>
              </footer>
            </div>
          </div>
        </div>

        <div class="columns">
          <div class="column is-4">
            <a class="box">
                <button class="delete is-pulled-right"></button>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                <br><time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </a>
          </div>
          <div class="column is-4">
            <a class="box">
                <button class="delete is-pulled-right"></button>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                <br><time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </a>
          </div>
          <div class="column is-4">
              <a class="box">
                  <button class="delete is-pulled-right"></button>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                  <br><time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
              </a>
            </div>
        </div>

        <div class="columns">
          <div class="column is-4">
            <a class="box">
                <button class="delete is-pulled-right"></button>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                <br><time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </a>
          </div>
          <div class="column is-4">
            <a class="box">
                <button class="delete is-pulled-right"></button>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                <br><time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </a>
          </div>
          <div class="column is-4">
              <a class="box">
                  <button class="delete is-pulled-right"></button>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
                  <br><time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
              </a>
            </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Main',
  data () {
    return {
      username: ''
    }
  },
  mounted () {
    this.username = firebase.auth().currentUser.displayName
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
