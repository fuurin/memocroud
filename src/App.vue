<template>
  <div id="app" class="has-footer-fixed-bottom">

    <nav class="navbar is-fixed-top" style="background-color: #eeeeee">
      <div class="navbar-brand">
        <a class="navbar-item">
          <img src="http://bulma.io/images/bulma-logo.png" alt="site logo">
        </a>

        <!-- v-if login -->
        <div class="navbar-item">
          <div class="control has-icon">
            <input id="search-box" class="input" type="search" name="search" placeholder="keywords...">
            <span class="icon is-small">
              <i class="fa fa-search"></i>
            </span>
          </div>
        </div>

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="burgerContent">
          <span></span>
          <span></span>
          <span></span>
        </a>
        <!-- v-if login end-->

      </div>

      <!-- v-if login -->
      <div id="burgerContent" class="navbar-menu">
        <div class="navbar-end">
          <div class="navbar-item">
            <a href="#"><i class="fa fa-user-circle fa-2x"></i></a>
          </div>
          <div class="navbar-item">
            <a href="#" class="button is-primary">Sign out</a>
          </div>
        </div>
      </div>
      <!-- v-if login end  -->

    </nav>

    <router-view/>

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
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "../node_modules/bulma/bulma.sass";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 50px;
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
