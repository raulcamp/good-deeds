import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('./views/Main.vue')
    },
    {
      path: '/account',
      name: 'Account',
      component: () => import('./views/Account.vue')
    },
    {
      path: "/profile/:username?",
      name: 'Profile',
      component: () => import('./views/Profile.vue'),
    },
    {
      path: '/rewards', 
      name: 'Reward',
      component: () => import('./views/Reward.vue')
    },
    {
      path: '*',
      name: 'ErrorPage',
      component: () => import('./views/ErrorPage.vue'),
    },
  ]
})
