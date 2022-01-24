import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import Cookies from 'js-cookie'
import Notifications from 'vue-notification'
import request from './services/request'
import VueLodash from 'vue-lodash'
import orderBy from 'lodash/orderBy'
import cloneDeep from 'lodash/cloneDeep'
import VueDragscroll from 'vue-dragscroll'

Vue.use(VueDragscroll)
Vue.use(VueLodash, { lodash: { orderBy, cloneDeep } })

Vue.use(Notifications)
window.Request = request

Vue.config.productionTip = false
Vue.prototype.$http = Axios;
const token = Cookies.get('oada_UID')

var apiHost = "https://apitoolbox.ngrok.io"
var accountHost = "https://oadaaccounts.ngrok.io"
var site = "toolboxdashboard.ngrok.io"
var dashboard = "https://oadadashboard.ngrok.io"
Vue.prototype.$http.defaults.headers.common['Accept'] = "application/json"

if( Cookies.get("loggingIn") == undefined ){
  Cookies.set("loggingIn", false)
}

const params = new URLSearchParams(window.location.search)

if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = "Bearer "+token
}

if( window.location.hostname == "auditortools.onlineada.com" ){
  apiHost = "https://auditortoolsapi.onlineada.com"
  accountHost = "https://accounts.onlineada.com"
  site = "auditortools.onlineada.com"
  dashboard = "https://dashboard.onlineada.com"
}
if( window.location.hostname == "dashboardtoolbox.ngrok.io" ){
  apiHost = "https://toolboxapi.ngrok.io"
  accountHost = "https://accountstoolbox.ngrok.io"
  site = "dashboardtoolbox.ngrok.io"
}
if( window.location.hostname == "toolboxdashboardd.ngrok.io" ){
  apiHost = "https://toolboxapii.ngrok.io"
  accountHost = "https://oadaaccountss.ngrok.io"
  site = "toolboxdashboardd.ngrok.io"
}

store.state.auth.site = site
store.state.auth.accapi = accountHost
store.state.auth.toolboxapi = apiHost
store.state.auth.API = `${apiHost}/api`
store.state.auth.dashboard = dashboard

window.App = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

function run(){
  Request.getPromise(store.state.auth.API+'/state/init')
    .then( response => { 
      //If we are logged into the accounts dashboard
      store.state.auth.user = response.data.details.user
      store.state.auth.accounts = response.data.details.accounts

      //If there is no cookie set for the current account, set it to the first stored vuex accounts
      if( Cookies.get("toolboxAccount") === undefined ){
        Cookies.set("toolboxAccount", parseInt(store.state.auth.accounts[0].id))
      }

      //If the stored vuex account is not set, set it to the toolboxAccount cookie
      if( store.state.auth.account === false ){
        store.state.auth.account = Cookies.get("toolboxAccount")
      }
      
      let accountID = Cookies.get("toolboxAccount")
      if( accountID ){
        //If the account ID is set, then go get all the clients on the account
        Request.getPromise(store.state.auth.API+`/${accountID}/clients`)
        .then( response => {
          
          store.state.clients.all = response.data.details
          let clientID = parseInt(Cookies.get("toolboxClient"))
          
          if( clientID ){
            //If the clientID cookie was set, set the vuex client store to that value
            store.state.clients.client = store.state.clients.all.find( c=>c.id === clientID )
            //Refresh the cookie expire time to 365 days
            if(store.state.clients.client){
              Cookies.set('toolboxClient', store.state.clients.client.id, 365)
            }
            
          }
          if( !clientID && store.state.clients.all.length){
            //If the toolboxClient cookie was not set but there are clients in the vuex store, set the global selected client and the toolboxClient cookie to the first client
            store.state.clients.client = store.state.clients.all[0]
            Cookies.set('toolboxClient', store.state.clients.client.id, 365)
          }
          store.state.auth.checkTokenExpire()
          runBeforeEach()
        })
        .catch()
      }else{
        runBeforeEach()
      }
      
    })
    .catch(re => {
      if( !params.get('oada_auth') ){
        if( Cookies.get("loggingIn") === "false" && re.response.data.message == "Unauthenticated." ){
          store.dispatch("auth/login")
        }
      }
    })
}
run()

function runBeforeEach(){
  router.beforeEach( (to, from, next) => {
    //Route Heirarchy:check account has been selected, check roles and permissions, then check roles, then check permissions, then check logged in
    if( !store.getters["auth/account"] && to.path != "/" ){
      next("/")
      return
    }

    // let account = store.state.auth.accounts.find(acc=>acc.id == store.state.auth.account)
    let teamCheck = store.getters["auth/account"].pivot.team_id === to.meta.team || store.getters["auth/account"].pivot.team_id === 1
    let roleCheck = store.getters["auth/account"].pivot.role_id <= to.meta.role
    
    if( to.meta.role != undefined && to.meta.team != undefined ){
      //check for role and teams
      
      if( roleCheck && teamCheck ){
        next()
        return
      }else{
        store.state.auth.authMessage = "Incorrect role and team"
        next("/")
        return
      }
    }
    
    if( to.meta.role != undefined ){
      console.log("This should be checking for role");
      //check roles
      if( roleCheck ){
        next()
        return
      }else{
        store.state.auth.authMessage = store.state.auth.authMessages.incorrect_role
        next("/")
        return
      }
    }

    if( to.meta.team != undefined ){
      //check for permissions or redirect to login
      
      if( teamCheck ){
        next()
        return
      }else{
        store.state.auth.authMessage = "Incorrect team"
        next("/")
        return
      }
    }

    if( store.getters['auth/isAuthenticated'] ){
      next()
      return
    }
    
    if( to.path != "/" ){
      next("/")
      return
    }
    next()
  })
}
