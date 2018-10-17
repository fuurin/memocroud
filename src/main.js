// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css'
import '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css'
import '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css'
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css'

Vue.config.productionTip = false

const config = {
  apiKey: 'AIzaSyCvEkFWjlFf9Zg3haPRQhD2bb_p7u1k_zQ',
  authDomain: 'memocloud-3268c.firebaseapp.com',
  databaseURL: 'https://memocloud-3268c.firebaseio.com',
  projectId: 'memocloud-3268c',
  storageBucket: 'memocloud-3268c.appspot.com',
  messagingSenderId: '343471971784'
}
firebase.initializeApp(config)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
