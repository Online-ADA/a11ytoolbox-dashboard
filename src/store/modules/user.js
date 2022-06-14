import Vue from 'vue';

const getDefaultState = () => ({
  account_users: {
    all: [],
  },
  all: [],
  byTeam: {
    1: [],
    2: [],
    3: [],
    4: [],
  },
  user: false,
  loading: false,
  user_limit: 1,
});

export default {
  namespaced: true,
  state: {
    account_users: {
      all: [],
    },
    all: [],
    byTeam: {
      1: [],
      2: [],
      3: [],
      4: [],
    },
    user: false,
    loading: false,
    user_limit: 1,
  },
  mutations: {
    setState(state, payload) {
      Vue.set(state, payload.key, payload.value);
    },
    resetState(state) {
      Object.assign(state, getDefaultState());
    },
  },
  actions: {
    resetState({ commit }) {
      commit('resetState');
    },
    uploadAvatar({ state, rootState }, args) {
      state.loading = true;
      const form_data = new FormData();
      form_data.append('avatar', args.file);
      Request.postPromise(`${rootState.auth.API}/a/${rootState.auth.account}/user/avatar`, { params: form_data, headers: { 'Content-Type': 'multipart/form-data' } })
        .then((re) => {
          Vue.notify({
            title: 'Success',
            text: 'Avatar has been stored',
            type: 'success',
            position: 'bottom right',
          });
          rootState.auth.user = re.data.details;
        })
        .catch((re) => console.log(re))
        .then(() => {
          state.loading = false;
        });
    },
    getUsers({ state, rootState, rootGetters }, args = {}) {
      // prevent this method from being called multiple times while still loading previous request
      if (state.loading) return;
      state.loading = true;
      state.all = [];
      state.byTeam = {
        1: [],
        2: [],
        3: [],
        4: [],
      },
      Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/users`)
        .then((re) => {
          state.all = Object.values(re.data.details);
          state.user_limit = re.data.limit;
          for (let i = 0; i < re.data.details.length; i++) {
            const user = re.data.details[i];
            if (user.roleInfo != null && user.roleInfo.team_id != null) {
              state.byTeam[user.roleInfo.team_id].push(user.id);
            }
          }
          if (args.vm) {
            const myTeam = rootGetters['auth/account'].pivot.team_id;
            args.vm.unassigned = state.all.filter((u) => {
              if (rootGetters['auth/isExecutive']) {
                return !args.vm.assigned.includes(u.id);
              }
              // Check that they haven't been added to Assigned list and check that they are on your team
              return !args.vm.assigned.includes(u.id) && state.byTeam[myTeam].includes(u.id);
            }).map((u) => u.id);
          }
        })
        .catch((re) => console.log(re))
        .then(() => state.loading = false);
    },
    getUser({ state, rootState }, args) {
      state.loading = true;
      Request.get(`${rootState.auth.API}/a/${rootState.auth.account}/manage/users/${args.user_id}`, {
        onSuccess: {
          silent: true,
          callback(response) {
            state.loading = false;
            state.user = response.data.details;
          },
        },
        onWarns: {
          silent: true,
        },
        onError: {
          silent: true,
          callback() {
            state.loading = false;
          },
        },
      });
    },
    storeUserMeta({ rootState }, args) {
      Request.postPromise(`${rootState.auth.API}/a/${rootState.auth.account}/user/meta`, {
        params: {
          meta: {
            key: args.key,
            value: args.value,
            subKeys: args.subKeys,
          },
        },
      })
        .then((re) => {
          rootState.auth.user.meta = re.data.details;
        })
        .catch((re) => {
          console.log(re);
        });
    },
  },
  getters: {

  },
};
