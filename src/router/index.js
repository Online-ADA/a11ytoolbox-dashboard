import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/manage',
    name: 'Manage',
    meta: {
      role: "manager"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Dashboard.vue'),
    children:[
      {
        path: "users",
        name: "ManageUsers",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Users/Index.vue'),
        meta: {
          role: "manager",
          permission: {
            entity: "users",
            action: "read"
          }
        }
      },
      {
        path: "user/:id",
        name: "ManageUserEdit",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Users/Edit.vue'),
        meta: {
          role: "manager",
          permission: {
            entity: "users",
            action: "write"
          }
        }
      }
    ]
  },
  {
    path: "/auth",
    name: "auth",
    component: () => import(/* webpackChunkName: "auth" */ '../views/Auth.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
