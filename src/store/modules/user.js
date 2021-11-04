import Vue from 'vue'

const getDefaultState = () => {
	return {
		team_members: [],
		all:[],
		loading: false
	}
}

export default {
	namespaced:true,
	state: {
		team_members: [],
		all:[],
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
		uploadAvatar({rootState}, args){
			let form_data = new FormData()
			form_data.append('avatar', args.file)
			Request.postPromise(`${rootState.auth.API}/${rootState.auth.account}/user/avatar`, {params: form_data, headers:{ 'Content-Type': 'multipart/form-data' }})
			.then( re=>{
				Vue.notify({
					title: "Success",
					text: "Avatar has been stored",
					type: "success",
					position: 'bottom right'
				})
				rootState.auth.user = re.data.details
			})
			.catch( re=>console.log(re))
			.then()
		},
		getAllAccountUsers({state, rootState}, args){
			state.loading = true
			Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/users`)
			.then( re=>{
				state.all = Object.values(re.data.details)
				args.vm.unassigned = state.all.filter( u => !args.vm.assigned.includes(u.id) ).map(u => u.id)
			})
			.catch( re=> console.log(re))
			.then( ()=> state.loading = false)
		},
		getTeamMembers({state, rootState}, args){
			state.loading = true
			
			Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/users/members`, {params: {team: args.team}})
			.then( re=>{
				state.team_members = re.data.details
			})
			.catch( re=>{
				console.log(re)
			})
			.then( ()=>{
				state.loading = false
			})
		},
	},
	getters: { 
		
	},
}