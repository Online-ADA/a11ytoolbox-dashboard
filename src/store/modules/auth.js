import axios from 'axios';
import Vue from 'vue';
import Cookies from '../../services/cookies';
// The only cookie that dictates whether the user should be logged in or not is the oada_UID. This is saved as the Token and it's lifetime is what is checked against
// for whether the user should be redirected

export default {
  namespaced: true,
  state: {
    redirect: '/',
    site: '',
    accapi: '',
    toolboxapi: '',
    dashboard: '',
    user: false,
    API: '',
    token: Cookies.get('oada_UID') || false,
    token_expire: Cookies.get('oada_UID_expire') || false,
    token_check_every: 600000, // 600000 = 10 minutes
    account: parseInt(Cookies.get('toolboxAccount'), 10) || false,
    license: false,
    authMessage: '',
    authMessages: {
      incorrect_role: 'You do not have the required role',
      incorrect_permissions: 'You do not have the required permissions',
    },
    timeCheckInterval: false,
    dispatch: false,
    checkTokenExpire() {
      // Check the total minutes remaining until expire
      const minutesLeft = this.getTimeLeft();
      console.log('Checking for token expire. Minutes left: ', minutesLeft);

      // If more than 10 minutes remaining, check every 10 minutes
      if (minutesLeft > 10) {
        if (this.token_check_every !== 600000 && this.timeCheckInterval !== false) {
          clearInterval(this.timeCheckInterval);
          this.timeCheckInterval = false;
        }

        if (this.timeCheckInterval === false) {
          this.timeCheckInterval = setInterval((state) => {
            state.checkTokenExpire();
          }, this.token_check_every, this);
        }
      } else if (minutesLeft <= 10 && minutesLeft > 0) {
        if (this.token_check_every !== 60000 && this.timeCheckInterval !== false) {
          clearInterval(this.timeCheckInterval);
          this.timeCheckInterval = false;
        }
        // Set interval timer to 1 minute instead of 10
        this.token_check_every = 60000;
        if (this.timeCheckInterval === false) {
          this.timeCheckInterval = setInterval((state) => {
            state.checkTokenExpire();
          }, this.token_check_every, this);
        }
      } else { // We are less than 0 seconds. Logout
        clearInterval(this.timeCheckInterval);
        this.timeCheckInterval = false;

        this.dispatch('auth/logout');
      }
    },
    getTimeLeft() {
      const currentDate = Date.now();
      const secondsRemaining = Number((this.token_expire - currentDate) / 1000);
      return (secondsRemaining / 3600) * 60;
      // Returns the minutes and seconds within the timeframe of an hour
      // let minutesLeftTwo = Math.floor(seconds_remaining % 3600 / 60)
      // let secondsLeft = Math.floor(seconds_remaining % 3600 % 60)
    },
  },
  mutations: {
    setState(state, payload) {
      if (payload.key === 'account') {
        Cookies.set('toolboxAccount', payload.value, 365);
        axios.defaults.headers.common.oadatbaccount = payload.value;
      }
      if (payload.key === 'license') {
        Cookies.set('toolboxLicense', payload.value.id, 365);
        axios.defaults.headers.common.oadatblicense = payload.value.id;
      }
      Vue.set(state, payload.key, payload.value);
    },
    setAuthState(state, payload) {
      state[payload.key] = payload.value;
    },
  },
  actions: {
    login({ state }) {
      const authRedirect = encodeURIComponent('/'); // To change to current route?
      window.location = `${state.accapi}/signin/?oada_redirect=${state.redirect}&oada_site=${state.site}&oada_auth_route=${authRedirect}`;
    },
    setToken({ state, dispatch }, payload) {
      state.dispatch = dispatch;
      const tokenExpire = payload.token_expire * 1000;
      // let token_expire =  Date.now() + 120000 // now plus 2 minutes for testing

      console.log('Setting token', payload, payload.token_expire);
      Cookies.set('oada_UID', payload.token, 365);

      // Confusingly storing the expire value for 365 days. It is the value itself we check against though, not the existence of the value
      Cookies.set('oada_UID_expire', tokenExpire, 365);
      state.token = payload.token;

      state.token_expire = tokenExpire;
      state.checkTokenExpire();

      axios.defaults.headers.common.Authorization = `Bearer ${payload.token}`;
    },
    resetTokenExpire({ state }) {
      state.token_expire = Date.now() + 86400000; // now + 24 hours
      Cookies.set('oada_UID_expire', state.token_expire, 365);
      state.checkTokenExpire();
    },
    logout({ state, dispatch }) {
      state.token = false;
      state.token_expire = false;
      state.account = false;
      state.user = false;
      state.token_check_interval = 600000;

      Cookies.remove('oada_UID');
      Cookies.remove('oada_UID_expire');
      // TODO: clean up everything on logout? New Cookies class adds prefixes
      Cookies.remove('toolboxAccount');
      Cookies.remove('toolboxClient');

      dispatch('audits/resetState', null, { root: true });
      dispatch('clients/resetState', null, { root: true });
      dispatch('domains/resetState', null, { root: true });
      dispatch('projects/resetState', null, { root: true });
      dispatch('scan/resetState', null, { root: true });

      window.location = state.dashboard;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isExecutive: (state, getters) => {
      if (getters.isAuthenticated && getters.account) {
        if (getters.account.pivot.team_id === 1) {
          return true;
        }
      }
      return false;
    },
    isManager: (state, getters) => {
      // Manager =  true if member of executive team or role of owner or manager (1 or 2) on current team

      // User role/team info is now stored on the account
      // Teams: 1 = Executive, 2 = Development, 3 = Design, 4 = Customer Service
      // The auth.account getter houses the current users's team and role
      if (getters.isAuthenticated && getters.account) {
        if (getters.account.pivot.team_id === 1) {
          return true;
        }

        return getters.account.pivot.role_id === 1 || getters.account.pivot.role_id === 2;
      }
      return false;
    },
    account: (state) => {
      if (state.license && state.license.account) {
        return state.license.account;
      }
      // if( !account && state.accounts.length ){
      //   Cookies.set('toolboxAccount', state.accounts[0])
      //   state.account = state.accounts[0]
      //   return state.accounts[0]
      // }
      return false;
    },
  },
};
