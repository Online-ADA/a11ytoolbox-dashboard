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
    path:'/user/profile',
    name:"UserProfile",
    component: () => import(/* webpackChunkName: "user" */ '../views/User/Profile.vue')
  },
  {
    path:'/scan',
    name: "Scan",
    component: () => import(/* webpackChunkName: "scan" */ '../views/Scan/Index.vue'),
    children: [
      {
        path: "history",
        name: "ScanHistory",
        component: () => import(/* webpackChunkName: "scan" */ '../views/Scan/List.vue')
      },
      {
        path: ":id/new",
        name: "NewScan",
        component: () => import(/* webpackChunkName: "scan" */ '../views/Scan/New.vue')
      },
    ]
  },
  {
    path: "/domains",
    component: () => import(/* webpackChunkName: "domains" */ '../views/Domains/Index.vue'),
    children:[
      {
        path: "/",
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
    path: "/clients",
    component:() =>  import(/* webpackChunkName: "clients" */ '../views/Clients/Index.vue'),
    children: [
      {
        path:"/",
        name:"ClientsList",
        component:() =>  import(/* webpackChunkName: "clients" */ '../views/Clients/List.vue'),
        // meta: {
        //   permissions: {
        //     entity: "clients",
        //     action: "view"
        //   }
        // },
      },
      {
        path:":id",
        name:"ClientShow",
        component:() =>  import(/* webpackChunkName: "clients" */ '../views/Clients/Show.vue'),
        meta: {
          role: 2
          // permissions: {
          //   entity: "clients",
          //   action: "view"
          // }
        },
      },
      {
        path:":id/edit",
        name:"ClientEdit",
        component:() =>  import(/* webpackChunkName: "clients" */ '../views/Clients/Edit.vue'),
        // meta: {
        //   permissions: {
        //     entity: "clients",
        //     action: "write"
        //   }
        // },
      },
      {
        path:"create",
        name:"ClientCreate",
        component:() =>  import(/* webpackChunkName: "clients" */ '../views/Clients/Create.vue'),
        // meta: {
        //   permissions: {
        //     entity: "clients",
        //     action: "write"
        //   }
        // },
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
        // meta: {
        //   permissions: {
        //     entity: "projects",
        //     action: "write"
        //   }
        // },
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
        path: "create/:id?",
        name: "AuditCreate",
        // meta: {
        //   permissions: {
        //     entity: "audits",
        //     action: "write"
        //   }
        // },
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
      {
        path: ":id/overview",
        name: "AuditOverview",
        component: () => import(/* webpackChunkName: "audits" */ '../views/Audits/Overview.vue')
      },
      {
        path: ":id/import",
        name: "AuditImport",
        component: () => import(/* webpackChunkName: "audits" */ '../views/Audits/Import.vue')
      },
    ]
  },
  {
    path: "/media-audits", //Just this user's audits
    name: "MediaAudits",
    component: () => import(/* webpackChunkName: "mediaaudits" */ '../views/MediaAudits/Index.vue'),
    children:[
      {
        path: "list",
        name: "AuditList",
        component: () => import(/* webpackChunkName: "mediaaudits" */ '../views/MediaAudits/List.vue')
      },
      // {
      //   path: ":id/edit",
      //   name: "AuditEdit",
      //   component: () => import(/* webpackChunkName: "mediaaudits" */ '../views/MediaAudits/Edit.vue')
      // },
      {
        path: ":id",
        name: "MediaAuditShow",
        component: () => import(/* webpackChunkName: "mediaaudits" */ '../views/MediaAudits/Show.vue')
      },
      // {
      //   path: ":id/overview",
      //   name: "AuditOverview",
      //   component: () => import(/* webpackChunkName: "mediaaudits" */ '../views/MediaAudits/Overview.vue')
      // },
      // {
      //   path: ":id/import",
      //   name: "AuditImport",
      //   component: () => import(/* webpackChunkName: "mediaaudits" */ '../views/MediaAudits/Import.vue')
      // },
      // {
      //   path: "/:catchAll(.*)",
      //   name: "MediaAuditNotFound",
      //   component: () => import(/* webpackChunkName: "mediaaudits" */ '../views/MediaAudits/NotFound.vue')
      // },
    ]
  },
  {
    path: '/manage',
    name: 'Manage',
    meta: {
      role: 2
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Dashboard.vue'),
    children:[
      {
        path: "users",
        name: "ManageUsers",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Users/List.vue'),
        meta: {
          role: 2,
        }
      },
      {
        path: "user/:id",
        name: "ManageUserEdit",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Users/Edit.vue'),
        meta: {
          role: 2,
        }
      },
      {
        path: "articles",
        name: "ManageArticles",
        component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Articles/Dashboard.vue'),
        meta: {
          role: 2,
        }
      },
      // {
      //   path: "projects",
      //   name: "ManageProjects",
      //   component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Projects/List.vue'),
      //   meta: {
      //     role: 2,
      //     // permissions: {
      //     //   entity: "projects",
      //     //   action: "read"
      //     // }
      //   }
      // },
      
      

      // {
      //   path: "audits",
      //   name: "ManageAudits",
      //   component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Audits/List.vue'),
      //   meta: {
      //     role: 2,
      //     // permissions: {
      //     //   entity: "audits",
      //     //   action: "read"
      //     // }
      //   }
      // },
      // {
      //   path: "domains",
      //   name: "ManageDomains",
      //   component: () => import(/* webpackChunkName: "manage" */ '../views/Management/Domains/List.vue'),
      //   meta: {
      //     role: 2,
      //   }
      // },
      
    ]
  },
  {
    path: "/auth",
    name: "auth",
    component: () => import(/* webpackChunkName: "auth" */ '../views/Auth.vue')
  },
  {
    path: "/account",
    name: "ChangeAccount",
    component: () => import(/* webpackChunkName: "account" */ '../views/ChangeAccount.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
