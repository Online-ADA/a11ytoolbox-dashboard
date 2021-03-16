import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced:true,
    state: {
      users: [],
      projects: [],
      adminAPI: "https://apitoolbox.ngrok.io/api/admin/",
      roles: {1:'manager', 2:'auditor', 3:'client', 4:'partner agency'},
      loading:{
        users: false,
        projects: false,
        audits: false,
        clients: false
      }
    },
    mutations: {
      setState(state,payload) {
        Vue.set(state,payload.key,payload.value)
      },
    },
    actions: {
        getUsers({state, rootState}, router){
          state.loading.users = true
          axios.get(state.adminAPI + "/users")
          .then((re)=>{
            state.loading.users = false
            if( !re.data.success ){
              rootState.auth.authMessage = rootState.auth.authMessages[re.data.details]
              router.push({path: "/"})
              return
            }

            state.users = re.data.details
          }).catch((error) => {
            console.log(error)
            state.loading.users = false
          })
        },
        getProjects({state, rootState}, router){
          state.loading.projects = true
          axios.get(state.adminAPI + "/projects")
          .then((re)=>{
            state.loading.projects = false
            if( !re.data.success ){
              rootState.auth.authMessage = rootState.auth.authMessages[re.data.details]
              router.push({path: "/"})
              return
            }

            state.projects = re.data.details
          }).catch((error) => {
            console.log(error)
            state.loading.projects = false
          })
        }
    },
    getters: { 
      
    },
  }
  