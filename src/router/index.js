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
        path: "list",
        name: "ProjectList",
        component: () => import(/* webpackChunkName: "projects" */ '../views/Projects/List.vue')
      },
      {
        path: "create",
        name: "ProjectCreate",
        meta: {
          permissions: {
            entity: "projects",
            action: "write"
          }
        },
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
    path: "/clients", //Just this user's clients
    name: "Clients",
    component: () => import(/* webpackChunkName: "clients" */ '../views/Clients/Index.vue'),
    children:[
      {
        path: "list",
        name: "ClientList",
        component: () => import(/* webpackChunkName: "clients" */ '../views/Clients/List.vue')
      },
      {
        path: "create",
        name: "ClientCreate",
        meta: {
          permissions: {
            entity: "clients",
            action: "write"
          }
        },
        component: () => import(/* webpackChunkName: "clients" */ '../views/Clients/Create.vue')
      },
      {
        path: ":id",
        name: "ClientShow",
        component: () => import(/* webpackChunkName: "clients" */ '../views/Clients/Show.vue')
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
          permissions: {
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
      },
      {
        path: "clients",
        name: "ManageClients",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Clients/List.vue'),
        meta: {
          role: "manager",
          permissions: {
            entity: "clients",
            action: "read"
          }
        }
      },
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
