import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Rose from '../views/Rose'
import Optional from '../views/Optional'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/rose',
    children: [
      {
        path: '/rose',
        component: Rose
      }, {
        path: '/optional',
        component: Optional
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
