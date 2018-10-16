import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Signup from '@/components/Signup'
import Signin from '@/components/Signin'
import Signedit from '@/components/Signedit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/signedit',
      name: 'Signedit',
      component: Signedit
    }
  ]
})
