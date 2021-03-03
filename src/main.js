import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid';

let agent_id = Cookies.get('oada_AID')
if(agent_id) {
  agent_id = uuidv4()
  Cookies.set('oada_AID', agent_id, { expires: 365 })
}
store.commit('auth/setState',{
  key: 'agent_id',
  value: agent_id,
})

Vue.config.productionTip = false
Vue.prototype.$http = Axios;
const token = Cookies.get('oada_UID')
Vue.prototype.$http.defaults.headers.common['Accept'] = "application/json"
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = "Bearer "+token
}
Vue.prototype.$http.defaults.headers.common['OADAAID'] = agent_id
//Vue.prototype.$http.defaults.headers.common['OADAACT'] = Cookies.get('oada_ACT')
Vue.prototype.$http.defaults.headers.common['OADAACT'] = 1

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.auth)) {
    if (!store.getters['auth/isAuthenticated']){
      store.dispatch('auth/login')
    } else {
      store.dispatch('auth/check')
      next()
    }
  }else{
    next()
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
