const getDefaultState = () => ({
  refresh: {
    account: {
      audits: false,
      users: false,
      domains: false,
      projects: false,
    },
  },
});

export default {
  namespaced: true,
  state: {
    refresh: {
      account: {
        audits: false,
        users: false,
        domains: false,
        projects: false,
      },
    },
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
  },
};
