import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced:true,
    state: {
      all: [],
      API: "https://apitoolbox.ngrok.io/api/user/",
      loading: false
    },
    mutations: {
      setState(state,payload) {
        Vue.set(state,payload.key,payload.value)
      },
    },
    actions: {
        createProject({state}, project, router, vm){
          state.loading = true;
          axios.post(state.API + project.account_id + "/projects", {
            project: project
          }).then( re=>{
            state.loading = false
            if( re.data.success ){
              vm.$vs.notify({
                title:'Test',
                text:'Lorem ipsum dolor sit amet, consectetur',
                color:"success"
              })
              router.push({path: "/projects"})

            }
          }).catch( error => {
            console.log(error)
            state.loading = false
            vm.$vs.notify({
              title:'Failed',
              text:'Lorem ipsum dolor sit amet, consectetur',
              color:"danger"
            })
          })
        },
        getProjects({state, rootState}){
          state.loading = true
          axios.get(state.API + rootState.auth.account + "/projects", {
            params: {
              user_id: rootState.auth.user.id
            }
          })
          .then((re)=>{
            state.loading = false
            state.all = re.data.details
          }).catch((error) => {
            console.log(error)
            state.loading = false
          })
        }
    },
    getters: { 
      
    },
  }
  