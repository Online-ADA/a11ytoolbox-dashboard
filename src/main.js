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
import VueDragscroll from 'vue-dragscroll'

Vue.use(VueDragscroll)
Vue.use(VueLodash, { lodash: { orderBy } })

Vue.use(Notifications)
window.Request = request

Vue.config.productionTip = false
Vue.prototype.$http = Axios;
const token = Cookies.get('oada_UID')

var apiHost = "https://apitoolbox.ngrok.io"
var accountHost = "https://oadaaccounts.ngrok.io"
var site = "toolboxdashboard.ngrok.io"
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

window.App = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

function run(){
  store.state.auth.site = site
  store.state.auth.accapi = accountHost
  store.state.auth.toolboxapi = apiHost
  store.state.auth.userAPI = `${apiHost}/api/user`
  store.state.auth.adminAPI = `${apiHost}/api/admin`
  
  Request.getPromise(store.state.auth.toolboxapi+'/api/state/init')
    .then( response => {
      store.state.auth.user = response.data.details.user
      store.state.auth.accountsRoles = response.data.details.roles.accounts
      store.state.auth.accountsPermissions = response.data.details.permissions.accounts
      store.state.auth.accounts = response.data.details.accounts

      if( Cookies.get("toolboxAccount") === undefined ){
        Cookies.set("toolboxAccount", parseInt(store.state.auth.accounts[0].id))
      }

      if( store.state.auth.account === false ){
        store.state.auth.account = Cookies.get("toolboxAccount")
      }
      
      let accountID = Cookies.get("toolboxAccount")
      if( accountID ){
        Request.getPromise(store.state.auth.toolboxapi+`/api/user/${accountID}/clients`)
        .then( response => {
          store.state.clients.all = response.data.details
          let clientID = parseInt(Cookies.get("toolboxClient"))
          
          if( clientID ){
            store.state.clients.client = store.state.clients.all.find( c=>c.id === clientID )
            //Resets the cookie
            if(store.state.clients.client){
              Cookies.set('toolboxClient', store.state.clients.client.id, 365)
            }
            
          }
          if( !clientID && store.state.clients.all.length){
            store.state.clients.client = store.state.clients.all[0]
            Cookies.set('toolboxClient', store.state.clients.client.id, 365)
          }
          
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
          console.log("THIS IS FIRING");
          store.dispatch("auth/login")
        }
      }
    })
}
run()

function runBeforeEach(){
  router.beforeEach( (to, from, next) => {
    
    //Route Heirarchy:check account has been selected, check roles and permissions, then check roles, then check permissions, then check logged in
    if( !store.state.auth.account && to.path != "/" ){
      next("/")
      return
    }
    
    if( to.meta.role != undefined && to.meta.permissions != undefined ){
      //check for role and permissions
      let hasRole = store.state.auth.accountsRoles[store.state.auth.account].includes(to.meta.role)
      let hasPermission = store.state.auth.accountsPermissions[store.state.auth.account][to.meta.permissions.entity][to.meta.permissions.action] === 1
      
      if( hasRole && hasPermission ){
        next()
        return
      }else{
        next("/")
        return
      }
    }
    
    if( to.meta.role != undefined ){
      //check roles
      if( store.state.auth.accountsRoles[store.state.auth.account].includes(to.meta.role) ){
        next()
        return
      }else{
        store.state.auth.authMessage = store.state.auth.authMessages.incorrect_role
        next("/")
        return
      }
    }

    if(to.meta.permissions != undefined){
      //check for permissions or redirect to login
      let hasPermission = store.state.auth.accountsPermissions[store.state.auth.account][to.meta.permissions.entity][to.meta.permissions.action] === 1
      if( hasPermission ){
        next()
        return
      }else{
        store.state.auth.authMessage = store.state.auth.authMessages.incorrect_permissions
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
