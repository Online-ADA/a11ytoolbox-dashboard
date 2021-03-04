import axios from 'axios'
import Cookies from 'js-cookie'
import Vue from 'vue'

export default {
  namespaced:true,
  state: {
    redirect: "/",
    site: "toolboxdashboard.ngrok.io",
    api: 'https://oadaaccounts.ngrok.io',
    user: false,
    roles: false,
    token: Cookies.get('oada_UID') || false,
    routeValidation: {
      auth: true,
      role: true,
      permission: true
    }
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
      resolveAuth({state}){
        axios.get(state.api+'/api/users/check')
        .then(function (response) {
            if(response.data.success == '1'){
                console.log("everything came back bonny");
                state.user = response.data.user
                state.routeValidation.auth = true
            }
            // else{
            //     state.redirect = window.location.pathname
            //     dispatch('login')
            // }
        })
        // .catch(function (error) {
        //     if(error.response && error.response.status === 401){
        //           state.redirect = window.location.pathname
        //           dispatch('login')
        //     }
        // });
        console.log("finished resolving");
      },
      check({state,dispatch},key, payload) {

        switch (key) {
          case "auth":
            
            if( !this.getters["auth/isAuthenticated"] || !state.user ){
              state.routeValidation.auth = false
              dispatch("resolveAuth")
            }
            break;
          case "role":
            
            break;
          case "permission":

            break;
          default:

            break;
        }
        // axios.get(state.api+'/api/users/check')
        // .then(function (response) {
        //     if(response.data.success == '1'){
        //         console.log("setting user: "+response.data.user);
        //         state.user = response.data.user
        //         state.roles = response.data.roles
        //     }
        //     else{
        //         state.redirect = window.location.pathname
        //         dispatch('login',router)
        //     }
        // })
        // .catch(function (error) {
        //     if(error.response && error.response.status === 401){
        //          state.redirect = window.location.pathname
        //          dispatch('login',router)
        //     }
        // });
    },
    login({state}, redirect){
      if( redirect ){
        state.redirect = redirect
      }
      
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
    logout({state}, router){
      state.token = false
      Cookies.remove('oada_UID')
      router.push({path: "/"})
  },
  },
  getters: {
    isAuthenticated: state => {
        return !!state.token
    },
    routeIsValid: state => {
      console.log(state.routeValidation, state.routeValidation.auth, state.routeValidation.role, state.routeValidation.permission, state.routeValidation.auth && state.routeValidation.role && state.routeValidation.permission);
      return state.routeValidation.auth && state.routeValidation.role && state.routeValidation.permission
    }
},
}
