import Vue from 'vue';
import store from '../store';
import Cookies from './cookies';
import { EventBus } from './eventBus';

class Request {
  /* Args to pass:
        - params ~ Object: additional data to be sent with the request
        - onError ~ Object or Boolean:
            - Object: Contains information on how to handle notifications and callbacks.
            Properties:
                - silent - Boolean: If true, will not display a notification
                - callback - function
                * All properties available at https://github.com/euvl/vue-notification#component-props
            - True: Uses the default values to notify. No default callback
            - False: Does not notify the user
        - onSuccess ~ Object or Boolean: Same as onError
        - onInfo ~ Object or Boolean: Same as onError
        - onWarn ~ Object or Boolean: Same as onError
        - router ~ The router object for redirecting a user

        **Example:
        args = {
            params: { user_id: id },
            onSuccess: {
                silent: true
            },
            onError: {
                title: 'Error',
                text: 'There was an error updating your project',
                type: 'error',
                callback: ()=>{
                    router.push({path: '/'})
                }
            },
            router: this.$router
        }
    */

  mute = false;

  constructor() {
    this.defaultError = {
      title: 'Error',
      type: 'error',
      position: 'bottom right',
    };
    this.defaultSuccess = {
      title: 'Success',
      type: 'success',
      position: 'bottom right',
    };
    this.defaultInfo = {
      title: 'Info',
      type: 'info',
      position: 'bottom right',
    };
    this.defaultWarn = {
      title: 'Warning',
      type: 'warn',
      position: 'bottom right',
    };
  }

  async getPromise(url, args = {}) {
    if (args.async && args.async === false) {
      // eslint-disable-next-line
      return await new Promise((resolve, reject) => {
        Vue.prototype.$http.get(url, args.params || {}).then((response) => {
          this.checkForRedirect(response);
          resolve(response);
        }).catch((response) => {
          this.checkForRedirect(response);
          reject(response);
        });
      });
    }

    return new Promise((resolve, reject) => {
      Vue.prototype.$http.get(url, { params: args.params || {} }).then((response) => {
        this.checkForRedirect(response);
        resolve(response);
      }).catch((response) => {
        this.checkForRedirect(response);
        reject(response);
      });
    });
  }

  async postPromise(url, args = { params: {} }) {
    store.dispatch('auth/resetTokenExpire');
    if (args.async === false) {
      // eslint-disable-next-line
      return await new Promise((resolve, reject) => {
        Vue.prototype.$http.post(url, args.params || {}).then((response) => {
          this.checkForRedirect(response);
          if (args.onSuccess) {
            this.parseArgs(args.onSuccess, response);
          }
          resolve(response);
        }).catch((response) => {
          this.checkForRedirect(response);
          reject(response);
        });
      });
    }

    return new Promise((resolve, reject) => {
      Vue.prototype.$http.post(url, args.params || {}).then((response) => {
        this.checkForRedirect(response);
        if (args.onSuccess) {
          this.parseArgs(args.onSuccess, response);
        }
        resolve(response);
      }).catch((response) => {
        this.checkForRedirect(response);
        reject(response);
      });
    });
  }

  async destroyPromise(url, args = { params: {} }) {
    store.dispatch('auth/resetTokenExpire');
    if (args.async === false) {
      // eslint-disable-next-line
      return await new Promise((resolve, reject) => {
        Vue.prototype.$http.delete(url, args.params || {}).then((response) => {
          this.checkForRedirect(response);
          resolve(response);
        }).catch((response) => {
          this.checkForRedirect(response);
          reject(response);
        });
      });
    }

    return new Promise((resolve, reject) => {
      Vue.prototype.$http.delete(url, args.params || {}).then((response) => {
        this.checkForRedirect(response);
        resolve(response);
      }).catch((response) => {
        this.checkForRedirect(response);
        reject(response);
      });
    });
  }

  async patchPromise(url, args = { params: {} }) {
    store.dispatch('auth/resetTokenExpire');
    if (args.async === false) {
      // eslint-disable-next-line
      return await new Promise((resolve, reject) => {
        Vue.prototype.$http.patch(url, args.params || {}).then((response) => {
          this.checkForRedirect(response);
          resolve(response);
        }).catch((response) => {
          this.checkForRedirect(response);
          reject(response);
        });
      });
    }

    return new Promise((resolve, reject) => {
      Vue.prototype.$http.patch(url, args.params || {}).then((response) => {
        this.checkForRedirect(response);
        resolve(response);
      }).catch((response) => {
        this.checkForRedirect(response);
        reject(response);
      });
    });
  }

  get(url, args = {
    onSuccess: true, onError: true, onInfo: true, onWarn: true,
  }) {
    const params = args.params || {};

    Vue.prototype.$http.get(url, params)
      .then((response) => {
        this.checkForRedirect(response);
        if (response.data.success && args.onSuccess) {
          if (args.onSuccess.type === undefined) {
            args.onSuccess.type = 'success';
            args.onSuccess.position = 'bottom right';
          }
          this.parseArgs(args.onSuccess, response);
          return;
        }
        if (!response.data.success && args.onWarn) {
          if (args.onWarn.type === undefined) {
            args.onWarn.type = 'warn';
            args.onWarn.position = 'bottom right';
          }
          this.parseArgs(args.onWarn, response);
        }
      }).catch((error) => {
        this.checkForRedirect(error);
        console.log(error);
        if (args.onError) {
          if (args.onError.type === undefined) {
            args.onError.type = 'error';
            args.onError.position = 'bottom right';
          }
          this.parseArgs(args.onError, error);
        }
      });
  }

  post(url, args = {
    onSuccess: true, onError: true, onInfo: true, onWarn: true,
  }) {
    store.dispatch('auth/resetTokenExpire');
    const requestArgs = {};
    requestArgs.params = args.params || {};
    requestArgs.config = {};
    requestArgs.config.headers = { ...Vue.prototype.$http.defaults.headers.common, ...args.headers || {} };

    Vue.prototype.$http.post(url, requestArgs.params, requestArgs.config)
      .then((response) => {
        this.checkForRedirect(response);
        if (response.data.success && args.onSuccess) {
          if (args.onSuccess.type === undefined) {
            args.onSuccess.type = 'success';
            args.onSuccess.position = 'bottom right';
          }
          this.parseArgs(args.onSuccess, response);
        }
        if (!response.data.success && args.onWarn) {
          if (args.onWarn.type === undefined) {
            args.onWarn.type = 'warn';
            args.onWarn.position = 'bottom right';
          }
          this.parseArgs(args.onWarn, response);
        }
      }).catch((error) => {
        this.checkForRedirect(error);
        console.log(error);
        if (args.onError) {
          if (args.onError.type === undefined) {
            args.onError.type = 'error';
            args.onError.position = 'bottom right';
          }
          this.parseArgs(args.onError, error);
        }
      });
  }

  patch(url, args = {
    onSuccess: true, onError: true, onInfo: true, onWarn: true,
  }) {
    store.dispatch('auth/resetTokenExpire');
    const requestArgs = {};
    requestArgs.params = args.params || {};
    requestArgs.config = {};
    requestArgs.config.headers = { ...Vue.prototype.$http.defaults.headers.common, ...args.headers || {} };

    Vue.prototype.$http.patch(url, requestArgs.params, requestArgs.config)
      .then((response) => {
        this.checkForRedirect(response);
        if (response.data.success && args.onSuccess) {
          if (args.onSuccess.type === undefined) {
            args.onSuccess.type = 'success';
            args.onSuccess.position = 'bottom right';
          }
          this.parseArgs(args.onSuccess, response);
        }
        if (!response.data.success && args.onWarn) {
          if (args.onWarn.type === undefined) {
            args.onWarn.type = 'warn';
            args.onWarn.position = 'bottom right';
          }
          this.parseArgs(args.onWarn, response);
        }
      }).catch((error) => {
        this.checkForRedirect(error);
        console.log(error);
        if (args.onError) {
          if (args.onError.type === undefined) {
            args.onError.type = 'error';
            args.onError.position = 'bottom right';
          }
          this.parseArgs(args.onError, error);
        }
      });
  }

  parseArgs(args, response) {
    let callback = false;
    if (args.callback) {
      callback = args.callback;
      delete args.callback;
    }
    const notifyArgs = args;
    if (notifyArgs && !notifyArgs.silent && !this.mute) {
      Vue.notify(notifyArgs);
    }

    if (callback) {
      callback(response);
    }
  }

  // eslint-disable-next-line
  checkForRedirect(response) {
    if (response.response !== undefined && response.response.data.message === 'Unauthenticated.') {
      // TODO: Need to retest this scenario. This condition was randomly giving me trouble again.
      store.dispatch('auth/login');
      return;
    }
    if (response.response !== undefined && response.response.data.message === 'No Account Access') {
      window.location = `${window.App.$store.state.auth.accapi}/signin/?oada_redirect=/`;
    }
    if (response.data !== undefined && response.data.message === 'No Account Access') {
      window.location = `${window.App.$store.state.auth.accapi}/signin/?oada_redirect=/`;
    }
    if (response.data !== undefined && response.data.success === 'upgrade') {
      store.commit('upgrade/setState', { key: 'trigger', value: response.data.trigger });
      store.commit('upgrade/setState', { key: 'message', value: response.data.message });
      EventBus.openModal('UpgradeLicenseModal', false);
      return;
    }
    if (response.data !== undefined && response.data.success === 'error') {
      return;
    }
    if (response.data !== undefined && response.data.success === 'alert') {
      // eslint-disable-next-line
      alert(response.data.message);
    }
    if (response.data.details === 'incorrect_permissions' || response.data.details === 'incorrect_role') {
      // window.App.$store.dispatch("auth/logout")
      // if( window.App.$router.currentRoute.path != "/" ){
      //     this.mute = true
      //     window.App.$store.state.auth.authMessage = window.App.$store.state.auth.authMessages[response.data.details]
      //     window.App.$router.push({path: "/"})
      // }

    }
  }

  unmute() {
    this.mute = false;
  }

  muted() {
    return this.mute;
  }
}

export default new Request();
