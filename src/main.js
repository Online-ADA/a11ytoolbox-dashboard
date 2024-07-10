import Vue from 'vue';
import Axios from 'axios';
import Notifications from 'vue-notification';
import VueLodash from 'vue-lodash';
import orderBy from 'lodash/orderBy';
import cloneDeep from 'lodash/cloneDeep';
import VueDragscroll from 'vue-dragscroll';
import VueCompositionAPI from '@vue/composition-api';
import Rollbar from 'rollbar';
import Cookies from './services/cookies';
import request from './services/request';
import store from './store';
import router from './router';
import App from './App.vue';

Vue.prototype.$rollbar = new Rollbar({
  accessToken: 'cf58f53ab52a400cbc8739034ed0ec74',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

Vue.config.errorHandler = (err, vm, info) => {
  vm.$rollbar.error(err);
  throw err; // rethrow
};

Vue.use(VueDragscroll);
Vue.use(VueLodash, { lodash: { orderBy, cloneDeep } });
Vue.use(VueCompositionAPI);

Vue.use(Notifications);
window.Request = request;

Vue.config.productionTip = false;
Vue.prototype.$http = Axios;
const token = Cookies.get('oada_UID');

let apiHost = 'https://api.a11ytoolbox.io';
let accountHost = 'https://accounts.onlineada.com';
// let ssoHost = 'http://localhost:5173';
let ssoHost = 'https://sso.onlineada.com';
let site = 'app.a11ytoolbox.io';
let dashboard = 'https://dashboard.onlineada.com';

Vue.prototype.$http.defaults.headers.common.Accept = 'application/json';

if (Cookies.get('loggingIn') === undefined) {
  Cookies.set('loggingIn', false);
}

const params = new URLSearchParams(window.location.search);
const licenseID = params.get('license') ? params.get('license') : Cookies.get('toolboxLicense');
Cookies.set('toolboxLicense', licenseID);

if (Cookies.get('toolboxAccount')) {
  Vue.prototype.$http.defaults.headers.common.oadatbaccount = Cookies.get('toolboxAccount');
}
if (token) {
  Vue.prototype.$http.defaults.headers.common.Authorization = `Bearer ${token}`;
}

if (window.location.hostname === 'toolbox-alex.devproxy.onlineada.com') {
  apiHost = 'https://toolboxapi-alex.devproxy.onlineada.com';
  accountHost = 'https://accounts-alex.devproxy.onlineada.com';
  site = 'toolbox-alex.devproxy.onlineada.com';
  dashboard = 'https://dashboard-alex.devproxy.onlineada.com';
} else if (window.location.hostname === 'toolbox-ross.devproxy.onlineada.com') {
  apiHost = 'https://toolboxapi-ross.devproxy.onlineada.com';
  accountHost = 'https://accounts-ross.devproxy.onlineada.com';
  site = 'toolbox-ross.devproxy.onlineada.com';
  dashboard = 'https://dashboard-ross.devproxy.onlineada.com';
} else if (window.location.hostname === 'toolbox3.devproxy.onlineada.com') {
  apiHost = 'https://toolboxapi3.devproxy.onlineada.com';
  accountHost = 'accounts3.devproxy.onlineada.com';
  site = 'toolbox3.devproxy.onlineada.com';
  dashboard = 'https://dashboard3.devproxy.onlineada.com';
}

store.state.auth.site = site;
store.state.auth.accapi = accountHost;
store.state.auth.toolboxapi = apiHost;
store.state.auth.API = `${apiHost}/api`;
store.state.auth.dashboard = dashboard;
store.state.auth.sso = ssoHost;

store.state.auth.dispatch = store.dispatch;

async function run() {
  if (params.get('oada_auth') && params.get('oada_auth') !== '') {
    let theRedirect = params.get('oada_redirect');
    if (!theRedirect || theRedirect === '' || theRedirect === '?') theRedirect = '/';

    await store.dispatch('auth/setToken', {
      token: params.get('oada_auth'),
      token_expire: params.get('oada_token_expire'),
      redirect: theRedirect,
      router,
    });
  }

  const stateResponse = await Vue.prototype.$http.get(`${store.state.auth.API}/state/init`, { license: licenseID }).catch((re) => {
    if (parseInt(re.response.status, 10) === 401) {
      store.dispatch('auth/login');
    }
  });

  store.commit('auth/setState', { key: 'user', value: stateResponse.data.details.user });
  store.commit('auth/setState', { key: 'license', value: stateResponse.data.details.license });
  store.commit('auth/setState', { key: 'account', value: parseInt(stateResponse.data.details.license.account.id, 10) });

  const clientsResponse = await Vue.prototype.$http.get(`${store.state.auth.API}/l/${store.state.auth.license.id}/clients`).catch((re) => {});

  store.state.clients.all = clientsResponse.data.details;
  const clientID = parseInt(Cookies.get('toolboxClient'), 10);
  if (clientID) {
    // If the clientID cookie was set, set the vuex client store to that value
    store.state.clients.client = store.state.clients.all.find((c) => c.id === clientID);
    // Refresh the cookie expire time to 365 days
    if (store.state.clients.client) {
      Cookies.set('toolboxClient', store.state.clients.client.id, 365);
    } else {
      // Client id is leftover from another license that was previously loaded. Let's set it now to the first client.
      store.state.clients.clientID = store.state.clients.all[0].id;
      // eslint-disable-next-line
      store.state.clients.client = store.state.clients.all[0];
      Cookies.set('toolboxClient', store.state.clients.client.id, 365);
    }
  }
  if (!clientID && store.state.clients.all.length) {
    // If the toolboxClient cookie was not set but there are clients in the vuex store, set the global selected client and the toolboxClient cookie to the first client
    // eslint-disable-next-line
    store.state.clients.client = store.state.clients.all[0];
    Cookies.set('toolboxClient', store.state.clients.client.id, 365);
  }
  store.state.audits.all = [];
  store.state.projects.project = false;
  store.dispatch('projects/getProjects');

  store.state.auth.checkTokenExpire();

  // eslint-disable-next-line
  if (store.state.auth.license && params.get('oada_auth')) {
    // eslint-disable-next-line
    history.replaceState(null, '', '/');
  }

  window.App = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');

  router.beforeEach((to, from, next) => {
    // Let's do nothing if it's hitting the authentication route. Everything is handled within and will run us back through here once authentication attempt is completed
    // if(to.name == 'auth') {
    //   next()
    //   return
    // }
    // Route Heirarchy:check account has been selected, check roles and permissions, then check roles, then check permissions, then check logged in
    if (!store.getters['auth/account'] && to.path !== '/') {
      next('/');
      return;
    }
    // let account = store.state.auth.accounts.find(acc=>acc.id == store.state.auth.account)
    const teamCheck = store.getters['auth/account'].pivot.team_id === to.meta.team || store.getters['auth/account'].pivot.team_id === 1;
    const roleCheck = store.getters['auth/account'].pivot.role_id <= to.meta.role;

    if (to.meta.role !== undefined && to.meta.team !== undefined) {
      // check for role and teams
      if (roleCheck && teamCheck) {
        next();
        return;
      }
      store.state.auth.authMessage = 'Incorrect role and team';
      next('/');
      return;
    }
    if (to.meta.role !== undefined) {
      console.log('This should be checking for role');
      // check roles
      if (roleCheck) {
        next();
        return;
      }
      store.state.auth.authMessage = store.state.auth.authMessages.incorrect_role;
      next('/');
      return;
    }
    if (to.meta.team !== undefined) {
      // check for permissions or redirect to login
      if (teamCheck) {
        next();
        return;
      }
      store.state.auth.authMessage = 'Incorrect team';
      next('/');
      return;
    }
    if (store.getters['auth/isAuthenticated']) {
      next();
      return;
    }
    if (to.path !== '/') {
      next('/');
      return;
    }
    next();
  });
}
run();
