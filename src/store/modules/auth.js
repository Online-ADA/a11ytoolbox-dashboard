import axios from 'axios'
import Cookies from '../../services/cookies'
import Vue from 'vue'
//The only cookie that dictates whether the user should be logged in or not is the oada_UID. This is saved as the Token and it's lifetime is what is checked against 
//for whether the user should be redirected

export default {
  namespaced:true,
  state: {
    redirect: "/",
    site: "",
    accapi: "",
    toolboxapi: "",
    dashboard: "",
    user: false,
    API: "",
    token: Cookies.get('oada_UID') || false,
    token_expire: Cookies.get('oada_UID_expire') || false,
    token_check_every: 600000, //2 minutes = 120000, 600000 = 10 minutes
    account: parseInt(Cookies.get('toolboxAccount')) || false,
    license: false,
    authMessage: "",
    authMessages: {
      incorrect_role: "You do not have the required role",
      incorrect_permissions: "You do not have the required permissions"
    },
    timeCheckInterval:false,
    dispatch: false,
    checkTokenExpire: function(){
      //Check the total minutes remaining until expire
      let minutesLeft = this.getTimeLeft()
      console.log("Checking for token expire. Minutes left is: ", minutesLeft);

      //If more than 10 minutes remaining, check every 10 minutes
      if( minutesLeft > 10 ){
        if( this.token_check_every != 600000 && this.timeCheckInterval !== false ){
          clearInterval(state.timeCheckInterval)
          this.timeCheckInterval = false
        }

        if(this.timeCheckInterval === false){
          console.log("Setting time check interval to 10 minutes");
          this.timeCheckInterval = setInterval((state) => {
            state.checkTokenExpire()
          }, this.token_check_every, this)
        }
      }
      else if( minutesLeft <= 10 && minutesLeft > 0 ){
        console.log("Session will log out in less than 10 minutes");
        if( this.token_check_every != 60000 && this.timeCheckInterval !== false ){
          clearInterval(this.timeCheckInterval)
          this.timeCheckInterval = false
        }
        //Set interval timer to 1 minute instead of 10
        this.token_check_every = 60000
        if(this.timeCheckInterval === false){
          this.timeCheckInterval = setInterval((state) => {
            state.checkTokenExpire(state)
          }, this.token_check_every, this)
        }
        
      }
      else{ //We are less than 0 seconds. Logout
        clearInterval(this.timeCheckInterval)
        this.timeCheckInterval = false
        this.dispatch("logout")
      }
    },
    getTimeLeft: function(){
      var current_date = Date.now()
      var seconds_remaining = Number( (this.token_expire - current_date) / 1000 )
      return (seconds_remaining / 3600) * 60

      //Returns the minutes and seconds within the timeframe of an hour
      // let minutesLeftTwo = Math.floor(seconds_remaining % 3600 / 60)
      // let secondsLeft = Math.floor(seconds_remaining % 3600 % 60)
    }
  },
  mutations: {
    setState(state,payload) {
      if(payload.key == 'account'){
        Cookies.set('toolboxAccount', payload.value, 365)
        axios.defaults.headers.common['oadatbaccount'] = payload.value
      }
      if(payload.key == 'license') {
        Cookies.set('toolboxLicense',payload.value.id,365)
      }
      Vue.set(state,payload.key,payload.value)
    },
    setAuthState(state,payload) {
      state[payload.key] = payload.value
    },
  },
  actions: {
    check({state, rootState,commit}) {
      console.log("Running Auth Check");
      let license_id = state.license ? state.license.id : window.location.pathname.split('/')[1]
      Request.getPromise(`${state.API}/state/init`,{params: {license:license_id}})
      .then( response => {
        state.user = response.data.details.user
        state.license = response.data.details.license
        state.account = parseInt(response.data.details.license.account.id)

        //If the toolbox client cookie IS set and there are clients in the global vuex store, then set the current client to the one from the cookie
        if( Cookies.get("toolboxClient") && rootState.clients.all.length ){
          rootState.clients.client = rootState.clients.all.find(cl=>cl.id == Cookies.get("toolboxClient"))
        }
        //If the toolbox client cookie is NOT set but there are clients, set the cookie and the global client to the first client
        if( !Cookies.get("toolboxClient") && rootState.clients.all.length){
          rootState.clients.client = rootState.clients.all[0]
          Cookies.set("toolboxClient", rootState.clients.all[0].id)
        }
        //If the toolbox client cookie is not set but there aren't any clients in the global store, go get the clients from the API and set them like above from what is returned
        if( !Cookies.get("toolboxClient") && !rootState.clients.all.length ){
          Request.getPromise(`${state.API}/l/${rootState.auth.license.id}/clients`)
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
        if( !state.user && !Cookies.get('oada_UID')){
          window.location = state.accapi + "/signin"
        }
      })
    },
    login({state}, redirect){
      console.log("Running login...");
      if( redirect ){
        state.redirect = redirect
      }
      Cookies.set("loggingIn", true)
      window.location = state.accapi + "/signin/?oada_redirect=" + state.redirect + "&oada_site=" + state.site + "&oada_auth_route=/auth"
    },
    setToken({state, dispatch}, payload){
      state.dispatch = dispatch
      console.log("Setting token", payload)
      Cookies.set('oada_UID', payload.token, { expires: 365 })

      //Confusingly storing the expire value for 365 days. It is the value itself we check against though, not the existence of the value
      Cookies.set('oada_UID_expire', payload.token_expire * 1000, { expires: 365 }) 
      state.token = payload.token
      state.token_expire = payload.token_expire * 1000
      state.checkTokenExpire(state)

      axios.defaults.headers.common['Authorization'] = "Bearer "+payload.token
      dispatch("check")
      if(payload.redirect) {
        payload.router.push({path: payload.redirect})
      }else{
        payload.router.push({path: state.redirect})
      }
    },
    logout({state, dispatch}){
      state.token = false
      state.token_expire = false
      state.account = false
      state.user = false
      state.token_check_interval = 600000

      Cookies.remove('oada_UID')
      Cookies.remove('oada_UID_expire')
      //TODO: clean up everything on logout? New Cookies class adds prefixes
      Cookies.remove('toolboxAccount')
      Cookies.remove('toolboxClient')

      dispatch("audits/resetState", null, {root: true})
      dispatch("clients/resetState", null, {root: true})
      dispatch("domains/resetState", null, {root: true})
      dispatch("projects/resetState", null, {root: true})
      dispatch("scan/resetState", null, {root: true})

      window.location = state.dashboard
    },
  },
  getters: {
    isAuthenticated: state => {
      return !!state.token && !!state.user
    },
    isExecutive:(state, getters) => {
      if( getters.isAuthenticated && getters.account ){
        if( getters.account.pivot.team_id === 1 ){
          return true
        }
      }
      return false
    },
    isManager: (state, getters) => {
      //Manager =  true if member of executive team or role of owner or manager (1 or 2) on current team
      
      //User role/team info is now stored on the account
      //Teams: 1 = Executive, 2 = Development, 3 = Design, 4 = Customer Service
      //The auth.account getter houses the current users's team and role
      if( getters.isAuthenticated && getters.account ){
        if( getters.account.pivot.team_id === 1 ){
          return true
        }
        
        return getters.account.pivot.role_id === 1 || getters.account.pivot.role_id === 2
        
      }
      return false
    },
    account: (state)=> {
      if( state.license && state.license.account ){
        return state.license.account
      }
      // if( !account && state.accounts.length ){
      //   Cookies.set('toolboxAccount', state.accounts[0])
      //   state.account = state.accounts[0]
      //   return state.accounts[0]
      // }
      return false
    }
  },
}
