import Vue from 'vue';
import { EventBus } from '../../services/eventBus';

const getDefaultState = () => ({
  users: [],
  user: false,
  projects: [],
  domains: [],
  audits: [],
  articles: [],
  techniques: [],
  recommendations: [],
  audit_states: [],
  software_used: [],
  assistive_techs: [],
  clients: [],
  client: false,
  roles: {
    1: 'manager', 2: 'auditor', 3: 'client', 4: 'partner agency',
  },
  loading: {
    articles: false,
    users: false,
    projects: false,
    audits: false,
    clients: false,
    domains: false,
    import_criteria: false,
  },
});

export default {
  namespaced: true,
  state: {
    users: [],
    user: false,
    projects: [],
    domains: [],
    audits: [],
    articles: [],
    techniques: [],
    recommendations: [],
    audit_states: [],
    software_used: [],
    assistive_techs: [],
    clients: [],
    client: false,
    roles: {
      1: 'manager', 2: 'auditor', 3: 'client', 4: 'partner agency',
    },
    loading: {
      articles: false,
      users: false,
      projects: false,
      audits: false,
      clients: false,
      domains: false,
      import_criteria: false,
    },
  },
  mutations: {
    setState(state, payload) {
      Vue.set(state, payload.key, payload.value);
    },
    setUserKey(state, payload) {
      if (payload.index > -1) {
        state.users[payload.index][payload.key] = payload.value;
      }
    },
    resetState(state) {
      Object.assign(state, getDefaultState());
    },
  },
  actions: {
    resetState({ commit }) {
      commit('resetState');
    },
    importSuccessCriteria({ state, rootState }, args) {
      state.loading.import_criteria = true;
      Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/success-criteria/import`, {
        onSuccess: {
          title: 'Success',
          text: 'Criteria Imported',
          callback(response) {
            state.loading.import_criteria = false;
            if (args.Success) args.Success();
          },
        },
        onError: {
          title: 'Error',
          text: 'There was a problem while importing criteria',
          callback() {
            state.loading.import_criteria = false;
          },
        },
        onWarn: {
          title: 'Warning',
          text: 'There was a problem while importing criteria',
          callback() {
            state.loading.import_criteria = false;
          },
        },
      });
    },
    getClient({ state, rootState }, args) {
      state.loading.clients = true;

      Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/clients/${args.id}`, {
        onSuccess: {
          title: 'Success',
          text: 'Client retrieved',
          callback(response) {
            state.loading.clients = false;
            state.client = response.data.details;
          },
        },
        onError: {
          title: 'Error',
          text: 'Getting this client caused an error',
          callback() {
            state.loading.clients = false;
          },
        },
        onWarn: {
          title: 'Warning',
          text: 'There was a problem getting the client',
          callback() {
            state.loading.clients = false;
          },
        },
      });
    },
    getAsstTechnologies({ state, rootState }) {
      state.loading.articles = true;
      Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/audits/technologies`)
        .then((res) => {
          state.assistive_techs = res.data.details;
        })
        .catch((res) => {
          console.log(res.error);
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: res.error,
              type: 'error',
            });
          }

          state.loading.articles = false;
        });
    },
    getSoftwareUsed({ state, rootState }) {
      state.loading.articles = true;
      Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/audits/software`)
        .then((res) => {
          state.software_used = res.data.details;
        })
        .catch((res) => {
          console.log(res.error);
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: res.error,
              type: 'error',
            });
          }

          state.loading.articles = false;
        });
    },
    getArticles({ state, dispatch, rootState }) {
      state.loading.articles = true;
      Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/articles`)
        .then((res) => {
          state.articles = res.data.details;
          dispatch('getTechniques');
          dispatch('getRecommendations');
        })
        .catch((res) => {
          console.log(res.error);
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: res.error,
              type: 'error',
            });
          }

          state.loading.articles = false;
        });
    },
    getTechniques({ state, rootState }) {
      Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/techniques`)
        .then((res) => {
          state.techniques = res.data.details;
        })
        .catch((res) => {
          console.log(res.error);
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: res.error,
              type: 'error',
            });
          }
          state.loading.articles = false;
        });
    },
    getRecommendations({ state, rootState }) {
      Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/recommendations`)
        .then((res) => {
          state.recommendations = res.data.details;
          state.loading.articles = false;
          if (!Request.muted()) {
            Vue.notify({
              title: 'Success',
              text: 'articles retrieved',
              type: 'success',
            });
          }
        })
        .catch((res) => {
          console.log(res.error);
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: res.error,
              type: 'error',
            });
          }
          state.loading.articles = false;
        });
    },
    createArticleObject({ state, rootState }, args) {
      state.loading.articles = true;
      let path; let obj; let
        text = '';
      switch (args.object.identifier) {
        case 'software_used':
          path = 'audits/software';
          obj = 'software_used';
          text = 'Software';
          break;
        case 'article':
          path = 'articles';
          obj = 'articles';
          text = 'Article';
          break;
        case 'technique':
          path = 'techniques';
          obj = 'techniques';
          text = 'Technique';
          break;
        case 'recommendation':
          path = 'recommendations';
          obj = 'recommendations';
          text = 'Recommendation';
          break;
        case 'audit_state':
          path = 'audits/states';
          obj = 'audit_states';
          text = 'Audit State';
          break;
        case 'failure':
          path = 'failures';
          obj = 'failure';
          text = 'Failure';
          break;
        case 'assistive_tech':
          path = 'audits/technologies';
          obj = 'assistive_techs';
          text = 'Assistive Technology';
          break;
        default:
      }
      Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/${path}`, {
        params: args.object,
      })
        .then((re) => {
          if (args.object.identifier === 'audit_state') {
            rootState.audits.audit_states = re.data.details;
          } else {
            state[`${obj}`] = re.data.details;
          }

          if (!Request.muted()) {
            Vue.notify({
              title: 'Success',
              text: `${text} saved`,
              type: 'success',
            });
          }
        })
        .catch((re) => {
          console.log(re);
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: re,
              type: 'error',
            });
          }
        })
        .then(() => {
          state.loading.articles = false;
        });
    },
    updateArticleObject({ state, rootState }, args) {
      state.loading.articles = true;
      let path; let obj; let
        text = '';
      switch (args.object.identifier) {
        case 'software_used':
          path = 'audits/software';
          obj = 'software_used';
          text = 'Software';
          break;
        case 'article':
          path = 'articles';
          obj = 'articles';
          text = 'Article';
          break;
        case 'technique':
          path = 'techniques';
          obj = 'techniques';
          text = 'Technique';
          break;
        case 'recommendation':
          path = 'recommendations';
          obj = 'recommendations';
          text = 'Recommendation';
          break;
        case 'audit_state':
          path = 'audits/states';
          obj = 'audit_states';
          text = 'Audit State';
          break;
        case 'failure':
          path = 'failures';
          obj = 'failure';
          text = 'Failure';
          break;
        case 'assistive_tech':
          path = 'audits/technologies';
          obj = 'assistive_techs';
          text = 'Assistive Technology';
          break;
        default:
      }

      Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/${path}/${args.object.id}`, {
        params: args.object,
      })
        .then((re) => {
          if (args.object.identifier === 'audit_state') {
            rootState.audits.audit_states = re.data.details;
          } else {
            state[`${obj}`] = re.data.details;
          }

          if (!Request.muted()) {
            Vue.notify({
              title: 'Success',
              text: `${text} updated`,
              type: 'success',
            });
          }
        })
        .catch((re) => {
          console.log(re);
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: re,
              type: 'error',
            });
          }
        })
        .then(() => {
          state.loading.articles = false;
        });
    },
    deleteAuditState({ state, rootState }, args) {
      state.loading.articles = false;
      Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/audits/states/${args.id}`)
        .then((re) => {
          rootState.audits.audit_states = re.data.details;
          if (!Request.muted()) {
            Vue.notify({
              title: 'Success',
              text: 'State deleted',
              type: 'success',
            });
          }
        })
        .catch((re) => {
          console.log(re);
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: re.error,
              type: 'error',
            });
          }
        })
        .then(() => state.loading.articles = false);
    },
    deleteSoftwareUsed({ state, rootState }, args) {
      state.loading.articles = false;
      Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/audits/software/${args.id}`)
        .then((re) => {
          state.software_used = re.data.details;
          if (!Request.muted()) {
            Vue.notify({
              title: 'Success',
              text: 'Software deleted',
              type: 'success',
            });
          }
        })
        .catch((re) => {
          console.log(re);
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: re.error,
              type: 'error',
            });
          }
        })
        .then(() => state.loading.articles = false);
    },
    deleteTechnology({ state, rootState }, args) {
      state.loading.articles = false;
      Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/audits/technologies/${args.id}`)
        .then((re) => {
          state.assistive_techs = re.data.details;
          if (!Request.muted()) {
            Vue.notify({
              title: 'Success',
              text: 'Assistive technology deleted',
              type: 'success',
            });
          }
        })
        .catch((re) => {
          console.log(re);
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: re.error,
              type: 'error',
            });
          }
        })
        .then(() => state.loading.articles = false);
    },
    deleteArticle({ state, rootState }, args) {
      state.loading.articles = false;
      Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/articles/${args.id}`)
        .then((re) => {
          state.loading.articles = false;
          state.articles = re.data.details;
          if (!Request.muted()) {
            Vue.notify({
              title: 'Success',
              text: 'Success Criteria deleted',
              type: 'success',
            });
          }
        })
        .catch((re) => {
          console.log(re);
          state.loading.articles = false;
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: re.error,
              type: 'error',
            });
          }
        });
    },
    deleteTechnique({ state, rootState }, args) {
      state.loading.articles = false;
      Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/techniques/${args.id}`)
        .then((re) => {
          state.loading.articles = false;
          state.techniques = re.data.details;
          if (!Request.muted()) {
            Vue.notify({
              title: 'Success',
              text: 'Technique deleted',
              type: 'success',
            });
          }
        })
        .catch((re) => {
          console.log(re);
          state.loading.articles = false;
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: re.error,
              type: 'error',
            });
          }
        });
    },
    deleteRecommendation({ state, rootState }, args) {
      state.loading.articles = false;
      Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/recommendations/${args.id}`)
        .then((re) => {
          state.loading.articles = false;
          state.recommendations = re.data.details;
          if (!Request.muted()) {
            Vue.notify({
              title: 'Success',
              text: 'Recommendation deleted',
              type: 'success',
            });
          }
        })
        .catch((re) => {
          console.log(re);
          state.loading.articles = false;
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: re.error,
              type: 'error',
            });
          }
        });
    },
    modifyRole({ state, rootState }, args) {
      state.loading.users = true;
      Request.post(`${rootState.auth.API}/a/${rootState.auth.account}/manage/users/setRole`, {
        params: {
          user_id: rootState.user.user.id,
          role: args.role,
        },
        onSuccess: {
          text: 'Role updated',
          title: 'Success',
          callback(response) {
            state.loading.users = false;
            state.user = response.data.details;
            Vue.notify({
              title: 'Success',
              text: 'User role updated',
              type: 'success',
            });
          },
        },
        onError: {
          callback() {
            state.loading.users = false;
          },
        },
      });
    },
    modifyTeam({ state, rootState }, args) {
      state.loading.users = true;
      Request.post(`${rootState.auth.API}/a/${rootState.auth.account}/manage/users/setTeam`, {
        params: {
          user_id: rootState.user.user.id,
          team: args.team,
        },
        onSuccess: {
          text: 'Team updated',
          title: 'Success',
          callback(response) {
            state.loading.users = false;
            state.user = response.data.details;
            Vue.notify({
              title: 'Success',
              text: 'User team updated',
              type: 'success',
            });
          },
        },
        onError: {
          callback() {
            state.loading.users = false;
          },
        },
      });
    },
    getUsers({ state, rootState }) {
      state.loading.users = true;
      Request.get(`${rootState.auth.API}/a/${rootState.auth.account}/users`, {
        onSuccess: {
          silent: true,
          callback(response) {
            state.loading.users = false;
            state.users = response.data.details;
          },
        },
        onWarns: {
          silent: true,
        },
        onError: {
          silent: true,
          callback() {
            state.loading.users = false;
          },
        },
      });
    },
    removeUser({ state, rootState }, args) {
      state.loading.users = true;
      Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/users/${args.user.id}/remove`, {
        onSuccess: {
          silent: true,
          callback() {
            state.loading.users = false;
            args.Success();
          },
        },
        onWarns: {
          silent: true,
        },
        onError: {
          silent: true,
          callback() {
            state.loading.users = false;
          },
        },
      });
    },
    inviteUsers({ state, rootState, commit }, args) {
      if (rootState.user.user_limit >= rootState.user.all.length) {
        commit('upgrade/setState', { key: 'trigger', value: 'AddUsers' }, { root: true });
        const plural = rootState.user.user_limit > 1 ? 's' : '';
        commit('upgrade/setState', { key: 'message', value: `You have reached the maximum of ${rootState.user.user_limit} user${plural} for this license.` }, { root: true });
        EventBus.openModal('UpgradeLicenseModal', false);
        return;
      }
      state.loading.users = true;
      Request.post(`${rootState.auth.accapi}/api/accounts/users/invite`, {
        params: {
          account_id: rootState.auth.account,
          emails: [
            {
              email: args.invite.email,
              team: args.invite.team,
              role: args.invite.role,
            },
          ],
          details: {
            access: {
              licenses: [rootState.auth.license.id],
            },
          },
        },
        onSuccess: {
          title: 'Success',
          text: 'Users have been given access to this license',
          callback(response) {
            state.loading.users = false;
            args.Success();
          },
        },
        onError: {
          title: 'Error',
          text: 'Inviting user casued an error',
          callback() {
            state.loading.users = false;
          },
        },
        onWarn: {
          title: 'Warning',
          text: 'There was a problem inviting the user',
          callback(response) {
            state.loading.users = false;
          },
        },
      });
    },
    addUsers({ state, rootState, commit }, args) {
      if (rootState.user.all.length >= rootState.user.user_limit) {
        commit('upgrade/setState', { key: 'trigger', value: 'AddUsers' }, { root: true });
        const plural = rootState.user.user_limit > 1 ? 's' : '';
        commit('upgrade/setState', { key: 'message', value: `You have reached the maximum of ${rootState.user.user_limit} user${plural} for this license.` }, { root: true });
        EventBus.openModal('UpgradeLicenseModal', false);
        return;
      }
      state.loading.users = true;
      Request.post(`${rootState.auth.API}/l/${rootState.auth.license.id}/users/add`, {
        params: {
          users: args.users,
        },
        onSuccess: {
          title: 'Success',
          text: 'Users have been given access to this license',
          callback(response) {
            state.loading.users = false;
            args.Success();
          },
        },
        onError: {
          title: 'Error',
          text: 'Adding users casued an error',
          callback() {
            state.loading.users = false;
          },
        },
        onWarn: {
          title: 'Warning',
          text: 'There was a problem adding the users',
          callback(response) {
            state.loading.users = false;
          },
        },
      });
    },
    getProjects({ state, rootState }) {
      state.loading.projects = true;
      Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/projects`, {
        params: {
          client_id: rootState.clients.client.id,
        },
      })
        .then((response) => {
          state.projects = response.data.details;
          Vue.notify({
            title: 'Success',
            text: 'Projects retrieved',
            type: 'success',
          });
        })
        .catch((re) => {
          console.log(re);
          Vue.notify({
            title: 'Error',
            text: 'Failed getting projects',
            type: 'error',
          });
        })
        .finally(() => { state.loading.projects = false; });

      // Request.get( `${rootState.auth.API}/${rootState.auth.account}/projects`, {
      // 	onSuccess: {
      // 		silent: true,
      // 		callback: function(response){
      // 			state.loading.projects = false
      // 			state.projects = response.data.details
      // 		}
      // 	},
      // 	onWarns: {
      // 		silent: true,
      // 	},
      // 	onError: {
      // 		silent: true,
      // 		callback: function(){
      // 			state.loading.projects = false
      // 		}
      // 	}
      // })
    },
    getAudits({ state, rootState }) {
      state.loading.projects = true;
      Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/audits`, {
        onSuccess: {
          silent: true,
          callback(response) {
            state.loading.audits = false;
            state.audits = response.data.details;
          },
        },
        onWarns: {
          silent: true,
        },
        onError: {
          silent: true,
          callback() {
            state.loading.projects = false;
          },
        },
      });
    },
    getClients({ state, rootState }) {
      state.loading.clients = true;
      Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/clients`, {
        onSuccess: {
          silent: true,
          callback(response) {
            state.loading.clients = false;
            state.clients = response.data.details;
          },
        },
        onWarns: {
          silent: true,
        },
        onError: {
          silent: true,
          callback() {
            state.loading.clients = false;
          },
        },
      });
    },
    getAllDomains({ state, rootState }) {
      state.loading.domains = true;
      Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains`, {
        onSuccess: {
          silent: true,
          callback(response) {
            state.loading.domains = false;
            state.domains = response.data.details;
          },
        },
        onWarns: {
          silent: true,
        },
        onError: {
          silent: true,
          callback() {
            state.loading.domains = false;
          },
        },
      });
    },
    createClient({ state, rootState }, args) {
      state.loading.clients = true;
      Request.post(`${rootState.auth.API}/l/${args.client.license.id}/clients`, {
        params: {
          client: args.client,
        },
        onSuccess: {
          title: 'Success',
          text: 'Client created. Redirecting to Clients List...',
          callback(response) {
            state.loading.clients = false;
            console.log(response.data.details);
            rootState.clients.all = response.data.details;
            setTimeout(() => {
              args.router.push({ path: '/manage/clients' });
            }, 2000);
          },
        },
        onError: {
          title: 'Error',
          text: 'Creating this client caused an error',
          callback() {
            state.loading.clients = false;
          },
        },
        onWarn: {
          title: 'Warning',
          text: 'There was a problem creating the client',
          callback(response) {
            state.loading.clients = false;
          },
        },
      });
    },
    updateClient({ state, rootState }, args) {
      state.loading.clients = true;
      Request.post(`${rootState.auth.API}/l/${args.client.license.id}/clients/${args.client.id}`, {
        params: {
          client: args.client,
        },
        onSuccess: {
          title: 'Success',
          text: 'Client created. Redirecting to Clients List...',
          callback(response) {
            state.loading.clients = false;
            rootState.clients.all = response.data.details;
            setTimeout(() => {
              args.router.push({ path: '/manage/clients' });
            }, 2000);
          },
        },
        onError: {
          title: 'Error',
          text: 'Creating this client caused an error',
          callback() {
            state.loading.clients = false;
          },
        },
        onWarn: {
          title: 'Warning',
          text: 'There was a problem creating the client',
          callback(response) {
            state.loading.clients = false;
          },
        },
      });
    },
  },
  getters: {

  },
};
