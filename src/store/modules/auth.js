import axios from 'axios'
import Cookies from 'js-cookie'
import Vue from 'vue'

export default {
  namespaced:true,
  state: {
    redirect: "/",
    site: "",
    accapi: "",
    toolboxapi: "",
    user: false,
    accountsRoles: [],
    accountsPermissions: [],
    token: Cookies.get('oada_UID') || false,
    token_expire: Cookies.get('oada_UID_expire') || false,
    token_check_interval: 600000, //2 minutes = 120000
    token_total_minutes_remaining: 0,
    token_time_left: {
      minutes: 0,
      seconds: 0
    },
    showLoginPromptOverride: false,
    token_expire_threshold: 10,
    token_timer: false,
    account: parseInt(Cookies.get('toolboxAccount')) || false,
    accounts: [],
    authMessage: "",
    authMessages: {
      incorrect_role: "You do not have the required role",
      incorrect_permissions: "You do not have the required permissions"
    },
    showLoginPrompt: false,
    // start_token_timer: function(state){
    //   state.stop_token_timer(state)
    //   state.token_timer = setTimeout(() => {
    //     state.checkForExpire(state)
    //   }, state.token_check_interval); 
    // },
    // stop_token_timer: function(state){
    //   clearTimeout(state.token_timer)
    // },
    // checkForExpire: function(state){
    //   if( !!state.token ){
    //     state.getTimeLeft(state)
    //     if( state.token_total_minutes_remaining > 0 && state.token_total_minutes_remaining <= state.token_expire_threshold ){
    //       state.showLoginPrompt = !state.showLoginPromptOverride ? true : false
    //       state.token_check_interval = 1000
    //       state.start_token_timer(state)
    //     }else if(state.token_total_minutes_remaining <= 0 ){
    //       state.stop_token_timer(state)
    //       window.App.$store.dispatch('auth/logout', window.App.$router)
    //     }else{
    //       state.start_token_timer(state)
    //     }
    //   }
    // },
    // getTimeLeft: function(state){
    //   var current_date = Date.now()
    //   var seconds_remaining = Number( (state.token_expire - current_date) / 1000 )

    //   state.token_total_minutes_remaining = (seconds_remaining / 3600) * 60
      
    //   state.token_time_left.minutes = Math.floor(seconds_remaining % 3600 / 60)
    //   state.token_time_left.seconds = Math.floor(seconds_remaining % 3600 % 60)
    // }
  },
  mutations: {
    setState(state,payload) {
      if(payload.key == 'account'){
        Cookies.set('toolboxAccount', payload.value, 365)
      }
      Vue.set(state,payload.key,payload.value)
    },
    setAuthState(state,payload) {
      state[payload.key] = payload.value
    },
  },
  actions: {
    check({state, rootState}) {
      Request.getPromise(state.toolboxapi+'/api/state/init')
      .then( response => {
        state.user = response.data.details.user
        state.accountsRoles = response.data.details.roles.accounts
        state.accountsPermissions = response.data.details.permissions.accounts
        state.accounts = response.data.details.accounts
        
        if( Cookies.get("toolboxAccount") === undefined ){
          Cookies.set("toolboxAccount", parseInt(state.accounts[0].id))
        }

        if( state.account === false ){
          state.account = Cookies.get("toolboxAccount")
        }

        if( Cookies.get("toolboxClient") && rootState.clients.all.length ){
          rootState.clients.client = rootState.clients.all.find(cl=>cl.id == Cookies.get("toolboxClient"))
        }
        if( !Cookies.get("toolboxClient") && rootState.clients.all.length){
          rootState.clients.client = rootState.clients.all[0]
          Cookies.set("toolboxClient", rootState.clients.all[0].id)
        }
        if( !Cookies.get("toolboxClient") && !rootState.clients.all.length ){
          Request.getPromise(`${state.toolboxapi}/api/admin/${rootState.auth.account}/clients`, {
            params: {
              user_id: rootState.auth.user.id
            }
          })
          .then(response=>{
            if( response.data.details.length ){
              rootState.clients.all = response.data.details
              rootState.clients.client = rootState.clients.all[0]
              Cookies.set("toolboxClient", rootState.clients.all[0].id)
            }
          })
          .catch()
        }

        Cookies.set("loggingIn", false)
      })
      .catch(re => console.log(re.response.data))
      .finally( ()=>{
        if( !state.user && ! Cookies.get('oada_UID')){
          window.location = state.accapi + "/signin"
        }
      })
    },
    login({state}, redirect){
      if( redirect ){
        state.redirect = redirect
      }
      Cookies.set("loggingIn", true)
      window.location = state.accapi + "/signin/?oada_redirect=" + state.redirect + "&oada_site=" + state.site + "&oada_auth_route=/auth"
    },
    // resetToken({state}){
    //   Request.postPromise(state.accapi + "/api/authenticate/reset")
    //   .then( re=>{
    //     if( !!re.data.details.token && !!re.data.details.token_expire ){
    //       state.token = re.data.details.token
    //       Cookies.set('oada_UID', state.token, { expires: 1 }) //1 day
    //       state.token_expire = re.data.details.token_expire * 1000
    //       Cookies.set('oada_UID_expire', state.token_expire * 1000, { expires: 1 })
    //       state.showLoginPrompt = false
    //       state.token_check_interval = 600000
    //       token_total_minutes_remaining = 0
    //       state.token_time_left.minutes = 0
    //       state.token_time_left.seconds = 0
    //       state.checkForExpire(state)
    //     }
    //   })
    //   .catch(re=>{
    //     console.log(re.data)
    //   })
    // },
    setToken({state, dispatch}, payload){
      Cookies.set('oada_UID', payload.token, { expires: 1 })
      Cookies.set('oada_UID_expire', payload.token_expire * 1000, { expires: 1 })
      state.token = payload.token
      state.token_expire = payload.token_expire * 1000
      // state.showLoginPrompt = false
      // state.checkForExpire(state)
      axios.defaults.headers.common['Authorization'] = "Bearer "+payload.token
      
      if(payload.redirect) {
        payload.router.push({path: payload.redirect})
      }else{
        payload.router.push({path: state.redirect})
      }
      
      dispatch("check")
    },
    logout({state, dispatch}, router, refresh = false){
      state.token = false
      state.token_expire = false
      state.showLoginPrompt = false
      state.account = false
      state.accounts = []
      state.accountsRoles = []
      state.accountsPermissions = []
      state.user = false
      state.token_check_interval = 600000
      state.token_time_left.minutes = 0
      state.token_time_left.seconds = 0
      state.token_total_minutes_remaining = 0
      
      Cookies.remove('oada_UID')
      Cookies.remove('oada_UID_expire')
      Cookies.remove('toolboxAccount')
      Cookies.remove('toolboxClient')

      dispatch("audits/resetState", null, {root: true})
      dispatch("clients/resetState", null, {root: true})
      dispatch("domains/resetState", null, {root: true})
      dispatch("projects/resetState", null, {root: true})
      dispatch("scan/resetState", null, {root: true})

      window.location = "https://dashboard.onlineada.com"
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
