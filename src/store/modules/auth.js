import axios from 'axios'
import Cookies from 'js-cookie'
import Vue from 'vue'

export default {
  namespaced:true,
  state: {
    agent_id: false,
    redirect: "/",
    site: "oadatoolboxx.ngrok.io",
    api: 'https://oadaaccountss.ngrok.io',
    user: false,
    roles: false,
    token: Cookies.get('oada_UID') || false,
  },
  mutations: {
    setState(state,payload) {
      Vue.set(state,payload.key,payload.value)
    },
    setAuthState(state,payload) {
        state[payload.key] = payload.value
    },
  },
  actions: {
      check({state,dispatch},router) {
        axios.get(state.api+'/api/users/check')
        .then(function (response) {
            if(response.data.success == '1'){
                state.user = response.data.user
                state.roles = response.data.roles
            }
            else{
                // state.redirect = window.location.pathname
                // dispatch('login',router)
            }
        })
        .catch(function (error) {
            if(error.response && error.response.status === 401){
                 state.redirect = window.location.pathname
                 dispatch('login',router)
            }
        });
    },
    login({state}){
      window.location = state.api + "/signin/?oada_redirect=" + state.redirect + "&oada_site=" + state.site + "&oada_auth_route=/auth" 
    },
    setToken({state}, payload){
      Cookies.set('oada_UID', payload.token, { expires: 365 })
      state.token = payload.token
      axios.defaults.headers.common['Authorization'] = "Bearer "+payload.token
      if(payload.user){
          state.user = payload.user
      }
      if(payload.roles){
          state.roles = payload.roles
      }
      if(payload.redirect) {
          payload.router.push({path: payload.redirect})
      }else{
          payload.router.push({path: state.redirect})
      }
    },
    logout({state}){
      state.token = false
      Cookies.remove('oada_UID')
  },
  },
  getters: {
    isAuthenticated: state => {
        return !!state.token
    },
},
}
