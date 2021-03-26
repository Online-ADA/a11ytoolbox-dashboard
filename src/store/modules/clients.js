import Vue from 'vue'

export default {
	namespaced:true,
	state: {
		all: [],
		projects: [],
		client: false,
		API: "https://apitoolbox.ngrok.io/api/user",
		loading: false
	},
	mutations: {
		setState(state,payload) {
			Vue.set(state,payload.key,payload.value)
		},
	},
	actions: {
		getProjects({state, rootState}){
			state.loading = true
			
			Request.get(`${state.API}/${rootState.auth.account}/projects`, {
				params: {
					params: {
						user_id: rootState.auth.user.id
					},
				},
				onSuccess: {
					title: "Success",
					text: "Projects retrieved",
					callback: function(response){
						state.loading = false
						state.projects = response.data.details
					}
				},
				onWarn:{
					callback: function(){
						state.loading = false
					}
				},
				onError: {
					title: "Error",
					text: "Failed getting projects",
					callback: function(){
						state.loading = false
					}
				}
			})
		},
		getClient({state}, args){
			state.loading = true
			Request.get(`${state.API}/${args.account_id}/clients/${args.id}`, {
				onSuccess: {
					title:'Success',
					text:'Client retrieved',
					callback: function(response){
						state.loading = false
						state.client = response.data.client
					}
				},
				onError: {
					title:'Error',
					text:'Creating this client caused an error',
					callback: function(){
						state.loading = false
					}
				},
				onWarn: {
					title: "Warning",
					text: "There was a problem creating the client",
					callback: function(){
						state.loading = false
					}
				}
			})
		},
		createClient({state, rootGetters}, args){
			state.loading = true;
			Request.post(`${state.API}/${args.client.account_id}/clients`, {
				params: {
					client: args.client
				},
				onSuccess: {
					title:'Success',
					text:'Client created. Redirecting to Clients List...',
					callback: function(){
						state.loading = false
						setTimeout(()=>{
							if( rootGetters["auth/isManager"] ){
								args.router.push({path: "/manage/clients"})
								return
							}
							args.router.push({path: "/clients/list"})
						}, 2000)
					}
				},
				onError: {
					title:'Error',
					text:'Creating this client caused an error',
					callback: function(){
						state.loading = false
					}
				},
				onWarn: {
					title: "Warning",
					text: "There was a problem creating the client",
					callback: function(){
						state.loading = false
					}
				}
			})
		},
		getClients({state, rootState}){
			state.loading = true
			Request.get(`${state.API}/${rootState.auth.account}/clients`, {
				params: {
					params: {
						user_id: rootState.auth.user.id
					}
				},
				onSuccess: {
					title: "Success",
					text: "Clients retrieved",
					callback: function(response){
						state.loading = false
						state.all = response.data.details
					}
				},
				onWarn:{
					callback: function(){
						state.loading = false
					}
				},
				onError: {
					title: "Error",
					text: "Failed getting clients",
					callback: function(){
						state.loading = false
					}
				}
			})
		}
	},
	getters: { 
		
	},
}
	