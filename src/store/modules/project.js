import Vue from 'vue'

export default {
    namespaced:true,
    state: {
      all: [],
      project: false,
      API: "https://apitoolbox.ngrok.io/api/user/",
      loading: false
    },
    mutations: {
      setState(state,payload) {
        Vue.set(state,payload.key,payload.value)
      },
    },
    actions: {
      getProject({state}, args){
        state.loading = true
        Request.get(state.API + args.account_id + `/projects/${args.id}`, {
          onSuccess: {
            title:'Success',
            text:'Project retrieved',
            callback: function(response){
              state.loading = false
              state.project = response.data.project
            }
          },
          onError: {
            title:'Error',
            text:'Creating this project caused an error',
            callback: function(){
              state.loading = false
            }
          },
          onWarn: {
            title: "Warning",
            text: "There was a problem creating the project",
            callback: function(){
              state.loading = false
            }
          }
        })
      },
        createProject({state, rootGetters}, args){
          state.loading = true;
          Request.post(state.API + args.project.account_id + "/projects", {
            params: {
              project: args.project
            },
            onSuccess: {
              title:'Success',
              text:'Project Created. Redirecting to Projects List...',
              callback: function(){
                state.loading = false
                setTimeout(()=>{
                  if( rootGetters["auth/isManager"] ){
                    args.router.push({path: "/manage/projects"})
                    return
                  }
                  args.router.push({path: "/projects/list"})
                }, 2000)
              }
            },
            onError: {
              title:'Error',
              text:'Creating this project caused an error',
            },
            onWarn: {
              title: "Warning",
              text: "There was a problem creating the project"
            }
          })
        },
        getProjects({state, rootState}){
          state.loading = true
          Request.get(state.API + rootState.auth.account + "/projects", {
            params: {
              params: {
                user_id: rootState.auth.user.id
              }
            },
            onSuccess: {
              title: "Success",
              text: "Projects retrieved",
              callback: function(response){
                state.loading = false
                state.all = response.data.details
              }
            },
            onWarn:{
              callback: function(){
                state.loading = false
              }
            },
            onError: {
              title: "Error",
              text: "Failed getting projects",
              callback: function(){
                state.loading = false
              }
            }
          })
        }
    },
    getters: { 
      
    },
  }
  