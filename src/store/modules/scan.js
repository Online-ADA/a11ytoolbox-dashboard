import Vue from 'vue'

const getDefaultState = () => {
	return {
		all: [],
		issues: [],
		loading: false
	}
}

export default {
	namespaced:true,
	state: {
		all: [],
		issues: [],
		loading: false
	},
	mutations: {
		setState(state,payload) {
            Vue.set(state,payload.key,payload.value)
        },
        resetState (state) {
            Object.assign(state, getDefaultState())
        },
	},
	actions: {
		resetState({commit}) {
            commit('resetState')
        },
        initiateScan({rootState}, args){
            Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/scan/init`, {params: { scan_options: args.config, pages: args.pages, domain: args.domain, id: args.id, relationship: args.relationship }})
				.then( re=>{
					Vue.notify({
						title: "Success",
						text: "A scan has been initiated.",
						type: "success"
					})
				})
				.catch()
				.then()
        }
	},
	getters: { 
		
	},
}