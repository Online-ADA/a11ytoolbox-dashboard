import axios from 'axios'
import Cookies from 'js-cookie'
import Vue from 'vue'

export default {
  namespaced:true,
  state: {
    redirect: "/",
    site: "toolboxdashboard.ngrok.io",
    accapi: 'https://oadaaccounts.ngrok.io',
    toolboxapi: "https://apitoolbox.ngrok.io",
    user: false,
    accountsRoles: [],
    accountsPermissions: [],
    token: Cookies.get('oada_UID') || false,
    account: false,
    accounts: [],
    authMessage: ""
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
      check({state}) {
        axios.get(state.accapi+'/api/users/check')
        .then(function (response) {
            if(response.data.success == '1'){
                state.user = response.data.user
                axios.get(state.toolboxapi+'/api/state/init', {
                  params: {
                    user: state.user.id
                  }
                }).then( (response)=>{
                  state.accountsRoles = response.data.details.roles.accounts
                  state.accountsPermissions = response.data.details.permissions.accounts
                  state.accounts = response.data.details.accounts
                }).catch( (error)=>{
                  console.log(error)
                })
            }
        })
        .catch(function (error) {
          console.log(error)
        });
    },
    login({state}, redirect){
      if( redirect ){
        state.redirect = redirect
      }
      
      window.location = state.accapi + "/signin/?oada_redirect=" + state.redirect + "&oada_site=" + state.site + "&oada_auth_route=/auth"
    },
    setToken({state, dispatch}, payload){
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

      dispatch("check")
    },
    logout({state}, router){
      state.token = false
      state.account = false
      state.accounts = []
      state.accountsRoles = []
      state.accountsPermissions = []
      state.user = false
      Cookies.remove('oada_UID')
      if( router.app._route.path != "/" ){
        router.push({path: "/"})
      }
  },
  },
  getters: {
    isAuthenticated: state => {
        return !!state.token && !!state.user
    },
    isManager: (state, getters) => {
      if( state.account && getters.isAuthenticated ){
        return state.accountsRoles[state.account].includes("manager")
      }
      return false
    },
    account: state=> {
      let account = state.accounts.find( acc => acc.id == state.account)
      return account ? account.name : false
    }
  },
}
