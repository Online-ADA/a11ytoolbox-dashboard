import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced:true,
    state: {
      users: [],
      adminAPI: "https://apitoolbox.ngrok.io/api/admin/",
      roles: {1:'manager', 2:'auditor', 3:'client', 4:'partner agency'}
    },
    mutations: {
      setState(state,payload) {
        Vue.set(state,payload.key,payload.value)
      },
    },
    actions: {
        getUsers({state, commit, rootState}, router){
          axios.get(state.adminAPI + "/users")
          .then((re)=>{
            if( !re.data.success ){
              rootState.auth.authMessage = rootState.auth.authMessages[re.data.details]
              router.push({path: "/"})
              return
            }

            state.users = re.data.details
          }).catch((error) => {console.log(error)})
        }
    },
    getters: { 
      
    },
  }
  