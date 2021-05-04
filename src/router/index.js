import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Test from '../views/Test.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/test/:id?',
    name: 'Test',
    component: Test
  },
  {
    path: "/domains",
    name: "Domains",
    component: () => import(/* webpackChunkName: "domains" */ '../views/Domains/Index.vue'),
    children:[
      {
        path: "list",
        name: "DomainsList",
        component: () => import(/* webpackChunkName: "domains" */ '../views/Domains/List.vue')
      },
      {
        path: "create",
        name: "DomainsCreate",
        component: () => import(/* webpackChunkName: "domains" */ '../views/Domains/Create.vue')
      },
      {
        path: ":id/edit",
        name: "DomainsEdit",
        component: () => import(/* webpackChunkName: "domains" */ '../views/Domains/Edit.vue')
      },
      {
        path: ":id",
        name: "DomainsShow",
        component: () => import(/* webpackChunkName: "domains" */ '../views/Domains/Show.vue')
      },
    ]
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
        path: ":id/edit",
        name: "ProjectEdit",
        component: () => import(/* webpackChunkName: "projects" */ '../views/Projects/Edit.vue')
      },
      {
        path: ":id",
        name: "ProjectShow",
        component: () => import(/* webpackChunkName: "projects" */ '../views/Projects/Show.vue')
      },
    ]
  },
  {
    path: "/audits", //Just this user's audits
    name: "Audits",
    component: () => import(/* webpackChunkName: "audits" */ '../views/Audits/Index.vue'),
    children:[
      {
        path: "list",
        name: "AuditList",
        component: () => import(/* webpackChunkName: "audits" */ '../views/Audits/List.vue')
      },
      {
        path: "create",
        name: "AuditCreate",
        meta: {
          permissions: {
            entity: "audits",
            action: "write"
          }
        },
        component: () => import(/* webpackChunkName: "audits" */ '../views/Audits/Create.vue')
      },
      {
        path: ":id/edit",
        name: "AuditEdit",
        component: () => import(/* webpackChunkName: "audits" */ '../views/Audits/Edit.vue')
      },
      {
        path: ":id",
        name: "AuditShow",
        component: () => import(/* webpackChunkName: "audits" */ '../views/Audits/Show.vue')
      },
    ]
  },
  // {
  //   path: "/clients",
  //   name: "Clients",
  //   component: () => import(/* webpackChunkName: "clients" */ '../views/Clients/Index.vue'),
  //   children:[
  //     {
  //       path: "list",
  //       name: "ClientList",
  //       component: () => import(/* webpackChunkName: "clients" */ '../views/Clients/List.vue')
  //     },
  //     {
  //       path: "create",
  //       name: "ClientCreate",
  //       meta: {
  //         permissions: {
  //           entity: "clients",
  //           action: "write"
  //         }
  //       },
  //       component: () => import(/* webpackChunkName: "clients" */ '../views/Clients/Create.vue')
  //     },
  //     {
  //       path: ":id/edit",
  //       name: "ClientEdit",
  //       component: () => import(/* webpackChunkName: "clients" */ '../views/Clients/Edit.vue')
  //     },
  //     {
  //       path: ":id",
  //       name: "ClientShow",
  //       component: () => import(/* webpackChunkName: "clients" */ '../views/Clients/Show.vue')
  //     },
  //   ]
  // },
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
      {
        path: "audits",
        name: "ManageAudits",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Audits/List.vue'),
        meta: {
          role: "manager",
          permissions: {
            entity: "audits",
            action: "read"
          }
        }
      },
      {
        path: "domains",
        name: "ManageDomains",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Domains/List.vue'),
        meta: {
          role: "manager",
        }
      },
      {
        path: "articles",
        name: "ManageArticles",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Articles/Dashboard.vue'),
        meta: {
          role: "manager",
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
