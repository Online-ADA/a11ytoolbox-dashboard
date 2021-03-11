import axios from 'axios'
import Vue from 'vue'
import store from '..'

export default {
    namespaced:true,
    state: {
      users: []
    },
    mutations: {
      setState(state,payload) {
        Vue.set(state,payload.key,payload.value)
      },
    },
    actions: {
        getUsers({state}, router){
          axios.get(store.state.auth.toolboxapi + "/api/admin/" + store.state.auth.account + "/users")
          .then((re)=>{
            console.log(re);
            if( !re.data.success && re.data.details == "incorrect_role" ){
              store.state.auth.authMessage = "You do not have the required role";
              router.push({path: "/"})
            }

            state.users = re.details.users
          }).catch((error) => {console.log(error)})
        }
    },
    getters: {
      
    },
  }
  