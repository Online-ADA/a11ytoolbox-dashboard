import Vue from 'vue';
import { EventBus } from '../../services/eventBus';

const CheckAuditState = (state, id, api, license) => {
  Request.getPromise(`${api}/l/${license}/media-audits/${id}/status`)
    .then((re) => {
      if (parseInt(re.data.success, 10) === 1) {
        if (re.data.details === 'Complete') {
          if (state.intervals[id]) clearInterval(state.intervals[id]);
          EventBus.$emit('MediaAudit/Complete', { data: id });
        }
      } else if (state.intervals[id]) clearInterval(state.intervals[id]);
    })
    .catch((re) => {
      console.log(re);
      if (state.intervals[id]) clearInterval(state.intervals[id]);
    });
};

const getDefaultState = () => ({
  all: [],
  audit: false,
  intervals: {},
});

const generateUniqueID = (existing) => {
  const id = Math.random().toString(36).substring(5);

  if (existing.includes(id)) {
    return generateUniqueID(existing);
  }

  return id;
};

export default {
  namespaced: true,
  state: {
    all: [],
    audit: false,
    intervals: {},
  },
  mutations: {
    setState(state, payload) {
      Vue.set(state, payload.key, payload.value);
    },
    resetState(state) {
      const { all } = state;
      Object.assign(state, getDefaultState());
      Object.assign(state.all, all);
    },
  },
  actions: {
    resetState({ commit }) {
      commit('resetState');
    },
    getAudit({ state, rootState }, args = { withIssues: false }) {
      state.loading = true;
      Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/media-audits/${args.id}`, { params: { withIssues: args.withIssues } })
        .then((re) => {
          state.audit = re.data.details;
          if (args.vm) {
            args.vm.assigned = state.audit.assignees.map((o) => o.id);
          }
        })
        .catch((re) => {
          console.log(re);
        })
        .then(() => state.loading = false);
    },
    getIssuesOffset({ state, rootState }, args) {
      state.loading = true;
      Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/media-audits/${args.audit_id}/issues/page`, { params: { page: args.page } })
        .then((re) => {
          if (args.importing) {
            if (args.isPrimary) {
              state.audit.issues = re.data.details;
            } else {
              // All of these lines are here to trigger the watcher on Import.vue
              const index = state.all.findIndex((a) => a.id === args.audit_id);
              const copy = state.all[index];
              copy.issues = re.data.details;
              state.all[index] = copy;
            }
          } else {
            state.audit.issues = re.data.details;
          }
        })
        .catch((re) => {
          console.log(re);
        })
        .then(() => state.loading = false);
    },
    getAudits({ state, rootState }, args, withIssues = false) {
      state.loading = true;
      Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/media-audits`, {
        params: {
          clientID: rootState.clients.client.id,
          projectID: args.project_id,
          withIssues,
        },
      })
        .then((re) => {
          if (parseInt(re.data.success, 10) === 0) {
            if (!Request.muted()) {
              Vue.notify({
                title: 'Error',
                text: re.data.details,
                type: 'error',
                position: 'bottom right',
              });
            }
          } else {
            state.all = re.data.details;
            for (const i in state.all) {
              if (state.all[i].status === 'in_progress') {
                state.intervals[state.all[i].id] = setInterval(
                  CheckAuditState,
                  5000,
                  state,
                  state.all[i].id,
                  rootState.auth.API,
                  rootState.auth.license.id,
                );
              }
            }
            if (!Request.muted()) {
              Vue.notify({
                title: 'Success',
                text: 'Audits retrieved',
                type: 'success',
                position: 'bottom right',
              });
            }
          }
        })
        .catch((re) => {
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: re.error,
              type: 'error',
              position: 'bottom right',
            });
          }
        })
        .then(() => {
          state.loading = false;
        });
    },
    InitAudit({ state, rootState }, args) {
      state.loading = true;
      Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/media-audits/${args.audit_id}/init`)
        .then((re) => {
          if (parseInt(re.data.success, 10) !== 1) {
            if (!Request.muted()) {
              Vue.notify({
                title: 'Error',
                text: re.data.details,
                type: 'error',
                position: 'bottom right',
              });
            }
          } else {
            // TODO: No good way to handle this globally seeing as the media audits store is reset
            // let audit = state.all.find((item)=> {return item.id == args.audit_id})
            // if(audit) audit.status = 'in_progress'
            if (state.audit) state.audit.status = 'in_progress';
            state.intervals[args.audit_id] = setInterval(
              CheckAuditState,
              5000,
              state,
              args.audit_id,
              rootState.auth.API,
              rootState.auth.license.id,
            );
            if (!Request.muted()) {
              Vue.notify({
                title: 'Success',
                text: 'Automated media audit was initiated',
                type: 'success',
                position: 'bottom right',
              });
            }
          }
        })
        .catch((re) => {
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: 'There was an error when trying to create the audit. Please see the dev console for more information',
              type: 'error',
              position: 'bottom right',
            });
          }
        })
        .then(() => {
          state.loading = false;
        });
    },
    createAudit({ state, rootState }, args) {
      state.loading = true;
      Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/media-audits`, { params: { audit: args.audit } })
        .then((re) => {
          if (parseInt(re.data.success, 10) !== 1) {
            if (!Request.muted()) {
              Vue.notify({
                title: 'Error',
                text: re.data.details,
                type: 'error',
                position: 'bottom right',
              });
            }
          } else {
            if (!Request.muted()) {
              Vue.notify({
                title: 'Success',
                text: 'Audit was create successfully',
                type: 'success',
                position: 'bottom right',
              });
            }

            state.all.push(re.data.details);
            if (args.vm) {
              args.vm.complete = true;
            }
          }
        })
        .catch((re) => {
          if (!Request.muted()) {
            Vue.notify({
              title: 'Error',
              text: 'There was an error when trying to create the audit. Please see the dev console for more information',
              type: 'error',
              position: 'bottom right',
            });
          }
        })
        .then(() => {
          state.loading = false;
        });
    },
  },
  getters: {

  },
};
