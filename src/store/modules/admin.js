import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced:true,
    state: {
      users: [],
      projects: [],
      userPermissions: [],
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
        modifyRole({state}, args){
          state.loading.users = true
          axios.post(state.adminAPI + "/users/setRole", {
              "user_id": args.user_id,
              "role" : args.role
          }).then(re => {
              if( re.data.success ){
                  state.loading.users = false
                  state.users = re.data.users
                  args.vm.$vs.notify({
                    title:'Success',
                    text:'Role updated successfully',
                    color:"success",
                    position: 'top-right'
                  })
              }else{
                args.vm.$vs.notify({
                  title:'Failed',
                  text:'Role update failed',
                  color:"danger"
                })
              }
          }).catch(error => {
              console.log(error);
              state.loading.users = false
              args.vm.$vs.notify({
                title:'Failed',
                text:'There was a problem updating the role',
                color:"danger",
                position: 'top-right'
              })
          })
        },
        saveUserPermissions({state}, args){
          axios.post( state.adminAPI + "/users/setPermissions", {
            permissions: args.permissions,
            user_id: args.user_id
          }).then( re=>{
            if( re.data.success ){
              args.vm.$vs.notify({
                title:'Success',
                text:'Permissions updated',
                color:"success"
              })
            }
            else{
              args.vm.$vs.notify({
                title:'Failed',
                text:'Permissions update failed',
                color:"danger"
              })
            }
          }).catch(error => {
            console.log(error)
            args.vm.$vs.notify({
              title:'Failed',
              text:'Permissions update failed',
              color:"danger"
            })
          })
        },
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
  