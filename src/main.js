import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import Cookies from 'js-cookie'

Vue.config.productionTip = false
Vue.prototype.$http = Axios;
const token = Cookies.get('oada_UID')
Vue.prototype.$http.defaults.headers.common['Accept'] = "application/json"
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = "Bearer "+token
}


router.beforeEach( (to, from, next) => {
  if( !!to.meta.auth || !!to.meta.role || !!to.meta.permission){ //if meta requirement exists, check each one
    
    let next = true;
    if( !!to.meta.auth ){
      store.dispatch("auth/check", "auth", {})
      console.log("finished checking auth");
    }
    // if( !!to.meta.role ){
    //   store.dispatch("auth/check", "role", {
    //     role: to.meta.role
    //   })
    // }
    // if( !!to.meta.permission ){
    //   store.dispatch("auth/check", "permission", {
    //     entity: "",
    //     action: ""
    //   })
    // }
    console.log("checking if routeIsValid", store.getters["auth/routeIsValid"], store.state.auth.routeValidation);
    if( store.getters["auth/routeIsValid"] ){
      next()
    }
  }else{
    next()
  }




  // if( to.meta.auth != undefined && to.meta.role ){
  //   if( store.getters['auth/isAuthenticated'] && !!store.state.auth.user ){
  //     next()
  //   }
  //   else if( !store.getters['auth/isAuthenticated'] ){
  //     store.dispatch('auth/login', to.path)
  //     store.dispatch('auth/check')
  //   }else if( !store.state.auth.user ){
  //     store.dispatch('auth/check')
  //     next()
  //   }
  //   else{
  //     store.dispatch('auth/check')
  //     next()
  //   }
  // }
  // else{
  //   next()
  // }
})


// router.beforeEach((to, from, next) => {
//   if(to.matched.some(record => record.meta.auth)) {
//     if (!store.getters['auth/isAuthenticated']){
//       store.dispatch('auth/login', to.path)
//     } else {
//       store.dispatch('auth/check')
//       next()
//     }
//   }else{
//     next()
//   }
// })
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
