import Vue from 'vue';
import Cookies from '../../services/cookies';

const getDefaultState = () => ({
  all: [],
  projects: [],
  client: false,
  clientID: Cookies.get('toolboxClient'),
  loading: false,
});

export default {
  namespaced: true,
  state: {
    all: [],
    projects: [],
    client: false,
    clientID: Cookies.get('toolboxClient'),
    loading: false,
  },
  mutations: {
    setState(state, payload) {
      Vue.set(state, payload.key, payload.value);
    },
  },
  actions: {
    resetState(state) {
      Object.assign(state, getDefaultState());
    },
    getProjects({ state, rootState }) {
      state.loading = true;

      Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/projects`, {
        params: {
          params: {
            user_id: rootState.auth.user.id,
          },
        },
        onSuccess: {
          title: 'Success',
          text: 'Projects retrieved',
          callback(response) {
            state.loading = false;
            state.projects = response.data.details;
          },
        },
        onWarn: {
          callback() {
            state.loading = false;
          },
        },
        onError: {
          title: 'Error',
          text: 'Failed getting projects',
          callback() {
            state.loading = false;
          },
        },
      });
    },
    getClient({ state, rootState }, args) {
      state.loading = true;
      if (args.id === -1) {
        state.client = false;
        state.clientID = false;
        state.loading = false;
        Cookies.remove('toolboxClient');
      } else {
        Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/clients/${args.id}`, {
          onSuccess: {
            title: 'Success',
            text: 'Client retrieved',
            callback(response) {
              state.loading = false;
              state.client = response.data.details;
              Cookies.set('toolboxClient', state.client.id, 365);
              if (args.callback) {
                args.callback();
              }
            },
          },
          onError: {
            title: 'Error',
            text: 'Getting this client caused an error',
            callback() {
              state.loading = false;
            },
          },
          onWarn: {
            title: 'Warning',
            text: 'There was a problem getting the client',
            callback() {
              state.loading = false;
            },
          },
        });
      }
    },
    createClient({ state, rootState }, args) {
      state.loading = true;
      Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/clients`, {
        params: {
          client: args.client,
        },
      })
        .then((re) => {
          state.loading = false;
          if (parseInt(re.data.success, 10) === 1) {
            state.client = re.data.created;
            state.all = re.data.details;
            if (args.callback) {
              args.callback();
            }
          }
          if (re.data.success === 'error') {
            Vue.notify({
              title: 'Warning',
              text: re.data.error,
              type: 'warning',
            });
          }
        })
        .catch((re) => {
          console.log(re);
        })
        .finally(() => {
          state.loading = false;
        });
    },
    deleteClient({ state, rootState, dispatch }, args) {
      state.loading = true;
      Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/clients/delete`, {
        params:{
          client_id: args.client.id
        }
      })
          .then((re) => {
            if (parseInt(re.data.success, 10) === 1) {
              Cookies.remove('toolboxClient');

              Vue.notify({
                title: 'Success',
                text: 'Client successfully deleted',
                type: 'success',
              });

              dispatch('getClients');

              if ( state.all.length > 0 ) {
                state.client = state.all[0];
              } else {
                state.client = false;
              }

              args.eventBus.closeModal( ()=>{ args.eventBus.$emit('deleteClientModal', false)})
              args.router.push({path:'/'});
            } else {
              Vue.notify({
                title: 'Warning',
                text: re.data.error,
                type: 'warning',
              });
            }
          })
          .catch((re) => {
            console.log(re);
          })
          .finally(() => {
            state.loading = false;
          });
    },
    getClients({ state, rootState }) {
      state.loading = true;
      Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/clients`, {
        params: {
          params: {
            user_id: rootState.auth.user.id,
          },
        },
        onSuccess: {
          title: 'Success',
          text: 'Clients retrieved',
          callback(response) {
            state.loading = false;
            state.all = response.data.details;

            if (state.all.length) {
              if (state.clientID) {
                state.client = state.all.find((ob) => ob.id === parseInt(state.clientID, 10));
              } else {
                // eslint-disable-next-line
                state.client = state.all[0];
                state.clientID = state.client.id;
              }
            }
          },
        },
        onWarn: {
          callback() {
            state.loading = false;
          },
        },
        onError: {
          title: 'Error',
          text: 'Failed getting clients',
          callback() {
            state.loading = false;
          },
        },
      });
    },
    updateClient({ state, rootState }, args) {
      state.loading = true;
      const requestArgs = {
        params: {
          client_id: args.id,
          data: args.client,
        },
        onSuccess: {
          title: 'Success',
          type: 'success',
          text: 'Client updated',
          position: 'bottom right',
          callback() {
            state.loading = false;
            args.router.push({ path: `/clients/${args.id}` });
          },
        },
        onWarn: {
          callback() {
            state.loading = false;
          },
        },
        onError: {
          title: 'Error',
          text: 'Failed updating client',
          callback() {
            state.loading = false;
          },
        },
      };
      Request.patch(`${rootState.auth.API}/l/${rootState.auth.license.id}/clients/${args.id}`, requestArgs);
    },
  },
  getters: {

  },
};
