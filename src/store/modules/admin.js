import Vue from 'vue'

export default {
	namespaced:true,
	state: {
		users: [],
		user : false,
		projects: [],
		clients: [],
		adminAPI: "https://apitoolbox.ngrok.io/api/admin",
		roles: {1:'manager', 2:'auditor', 3:'client', 4:'partner agency'},
		loading:{
			users: false,
			projects: false,
			audits: false,
			clients: false
		}
	},
	mutations: {
		setState(state,payload) {
			Vue.set(state,payload.key,payload.value)
		},
	},
	actions: {
		modifyRole({state, rootState}, args){
			state.loading.users = true
			Request.post(`${state.adminAPI}/${rootState.auth.account}/users/setRole`, {
				params: {
					"user_id": args.user_id,
					"role" : args.role
				},
				onSuccess: {
					text: "Role updated",
					title: "Success",
					callback: function(response){
						state.loading.users = false
						state.user = response.data.user
						args.vm.userData.permissions = state.user.permissions
					}
				},
				onError: {
					callback: function(){
						state.loading.users = false
					}
				}
			})
		},
		saveUserPermissions({state, rootState}, args){
			Request.post(`${state.adminAPI}/${rootState.auth.account}/users/setPermissions`, {
				params: {
					'permissions': args.permissions,
					'user_id': args.user_id
				},
				onSuccess: {
					text: "Permissions updated",
					callback: function(response){
						state.loading.users = false
						state.user = response.data.user
					}
				},
				onError: {
					text: "Permissions update caused an error",
					callback: function(){
						state.loading.users = false
					}
				}
			})
		},
		getUsers({state, rootState}, router){
			state.loading.users = true
			Request.get(`${state.adminAPI}/${rootState.auth.account}/users`, {
				onSuccess: {
					silent: true,
					callback: function(response){
						state.loading.users = false
						state.users = response.data.details
					}
				},
				onWarns: {
					silent: true,
					callback: function(response){
						rootState.auth.authMessage = rootState.auth.authMessages[response.data.details]
						router.push({path: "/"})
					}
				},
				onError: {
					silent: true,
					callback: function(){
						state.loading.users = false
					}
				}
			})
		},
		getUser({state, rootState}, args){
			state.loading.users = true
			Request.get(`${state.adminAPI}/${rootState.auth.account}/users/${args.user_id}`, {
				onSuccess: {
					silent: true,
					callback: function(response){
						state.loading.users = false
						state.user = response.data.details.user
						state.user["role"] = response.data.details.role
						state.user["permissions"] = response.data.details.permissions
					}
				},
				onWarns: {
					silent: true,
					callback: function(response){
						rootState.auth.authMessage = rootState.auth.authMessages[response.data.details]
						args.router.push({path: "/"})
					}
				},
				onError: {
					silent: true,
					callback: function(){
						state.loading.users = false
					}
				}
			})
		},
		getProjects({state, rootState}, router){
			state.loading.projects = true
			Request.get( `${state.adminAPI}/${rootState.auth.account}/projects`, {
				onSuccess: {
					silent: true,
					callback: function(response){
						state.loading.projects = false
						state.projects = response.data.details
					}
				},
				onWarns: {
					silent: true,
					callback: function(response){
						rootState.auth.authMessage = rootState.auth.authMessages[response.data.details]
						router.push({path: "/"})
					}
				},
				onError: {
					silent: true,
					callback: function(){
						state.loading.projects = false
					}
				}
			})
		},
		getClients({state, rootState}, router){
			state.loading.clients = true
			Request.get(`${state.adminAPI}/${rootState.auth.account}/clients`, {
				onSuccess: {
					silent: true,
					callback: function(response){
						state.loading.clients = false
						state.clients = response.data.details
					}
				},
				onWarns: {
					silent: true,
					callback: function(response){
						rootState.auth.authMessage = rootState.auth.authMessages[response.data.details]
						router.push({path: "/"})
					}
				},
				onError: {
					silent: true,
					callback: function(){
						state.loading.clients = false
					}
				}
			})
		}
	},
	getters: { 
		
	},
}
	