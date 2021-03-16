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
    path: "/projects", //Just this user's projects
    name: "Projects",
    component: () => import(/* webpackChunkName: "projects" */ '../views/Projects/Index.vue'),
    children:[
      {
        path: "create",
        name: "ProjectCreate",
        component: () => import(/* webpackChunkName: "projects" */ '../views/Projects/Create.vue')
      },
      {
        path: ":id",
        name: "ProjectShow",
        component: () => import(/* webpackChunkName: "projects" */ '../views/Projects/Show.vue')
      },
    ]
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
        path: "projects",
        name: "ManageProjects",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Projects/List.vue'),
        meta: {
          role: "manager",
          permission: {
            entity: "projects",
            action: "read"
          }
        }
      },
      {
        path: "projects/:id",
        name: "ManageProjectsEdit",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Projects/Edit.vue'),
        meta: {
          role: "manager",
          permission: {
            entity: "projects",
            action: "write"
          }
        }
      },
      {
        path: "users",
        name: "ManageUsers",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Users/List.vue'),
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
