import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import Cookies from 'js-cookie'
import Notifications from 'vue-notification'
import request from './services/request'

Vue.use(Notifications)
window.Request = request

Vue.config.productionTip = false
Vue.prototype.$http = Axios;
const token = Cookies.get('oada_UID')
Vue.prototype.$http.defaults.headers.common['Accept'] = "application/json"
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = "Bearer "+token
}

async function run(){
  await Request.getPromise(`${store.state.auth.toolboxapi}/api/state/init`, {async: false})
  .then( response => {
      store.commit("auth/setState", {key: "user", value: response.data.details.user})
      store.commit("auth/setState", {key: "accountsRoles", value: response.data.details.roles.accounts})
      store.commit("auth/setState", {key: "accountsPermissions", value: response.data.details.permissions.accounts})
      store.commit("auth/setState", {key: "accounts", value: response.data.details.accounts})
      runBeforeEach()
  })
  .catch( () => {
    if( router.currentRoute.path != "/" ){
      router.push({path: "/"})
    }
  })

  window.App = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}
run()


function runBeforeEach(){
  router.beforeEach( (to, from, next) => {
    if( to.path == "/auth" || from.path == "/auth" ){
      next()
      return
    }
    
    //Route Heirarchy:check account has been selected, check roles and permissions, then check roles, then check permissions, then check logged in
    if( !store.state.auth.account && to.path != "/" ){
      next("/")
      return
    }

    if( !store.getters["auth/isAuthenticated"] && to.path != "/" ){
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
