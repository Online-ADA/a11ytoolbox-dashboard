import Vue from 'vue'

const getDefaultState = () => {
	return {
		users: [],
		user : false,
		projects: [],
		domains: [],
		audits: [],
		articles: [],
		techniques: [],
		recommendations: [],
		clients: [],
		API: "https://apitoolbox.ngrok.io/api/user",
		adminAPI: "https://apitoolbox.ngrok.io/api/admin",
		roles: {1:'manager', 2:'auditor', 3:'client', 4:'partner agency'},
		loading:{
			articles: false,
			users: false,
			projects: false,
			audits: false,
			clients: false,
			domains: false
		}
	}
}

export default {
	namespaced:true,
	state: {
		users: [],
		user : false,
		projects: [],
		domains: [],
		audits: [],
		articles: [],
		techniques: [],
		recommendations: [],
		clients: [],
		API: "https://apitoolbox.ngrok.io/api/user",
		adminAPI: "https://apitoolbox.ngrok.io/api/admin",
		roles: {1:'manager', 2:'auditor', 3:'client', 4:'partner agency'},
		loading:{
			articles: false,
			users: false,
			projects: false,
			audits: false,
			clients: false,
			domains: false
		}
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
		getArticles({state, dispatch, rootState}){
			state.loading.articles = true
			Request.getPromise(`${state.API}/${rootState.auth.account}/articles`)
			.then( res => {
				state.articles = res.data.details
				dispatch("getTechniques")
				dispatch("getRecommendations")
			})
			.catch(res => {
				console.log(res.error)
				if( !Request.muted() ){
					Vue.notify({
						title: 'Error',
						text: res.error,
						type: 'error'
					})
				}
				
				state.loading.articles = false
			})
		},
		getTechniques({state, rootState}){
			Request.getPromise(`${state.API}/${rootState.auth.account}/techniques`)
			.then( res => {
				state.techniques = res.data.details
			})
			.catch(res => {
				console.log(res.error)
				if( !Request.muted() ){
					Vue.notify({
						title: 'Error',
						text: res.error,
						type: 'error'
					})
				}
				state.loading.articles = false
			})
		},
		getRecommendations({state, rootState}){
			Request.getPromise(`${state.API}/${rootState.auth.account}/recommendations`)
			.then( res => {
				state.recommendations = res.data.details
				state.loading.articles = false
				if( !Request.muted() ){
					Vue.notify({
						title: 'Success',
						text: 'articles retrieved',
						type: 'success'
					})
				}
			})
			.catch(res => {
				console.log(res.error)
				if( !Request.muted() ){
					Vue.notify({
						title: 'Error',
						text: res.error,
						type: 'error'
					})
				}
				state.loading.articles = false
			})
		},
		createArticleObject({state, rootState}, args){
			state.loading.articles = true
			Request.postPromise(`${state.adminAPI}/${rootState.auth.account}/${args.object.identifier}s`, {
				params: args.object
			})
			.then( re=> {
				state[`${args.object.identifier}s`] = re.data.details
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: `${args.object.identifier} saved`,
						type: "success"
					})
				}
			})
			.catch( re=> {
				console.log( re );
				if( !Request.muted() ){
					Vue.notify({
						title: "Error",
						text: re,
						type: "error"
					})
				}
			})
			.then( () => {
				state.loading.articles = false
			})
		},
		updateArticleObject({state, rootState}, args){ 
			state.loading.articles = true
			Request.postPromise(`${state.adminAPI}/${rootState.auth.account}/${args.object.identifier}s/${args.object.id}`, {
				params: args.object
			})
			.then( re=> {
				state[`${args.object.identifier}s`] = re.data.details
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: `${args.object.identifier} updated`,
						type: "success"
					})
				}
			})
			.catch( re=> {
				console.log( re );
				if( !Request.muted() ){
					Vue.notify({
						title: "Error",
						text: re,
						type: "error"
					})
				}
			})
			.then( () => {
				state.loading.articles = false
			})
		},
		deleteArticle({state, rootState}, args){
			state.loading.articles = false
			Request.destroyPromise(`${state.adminAPI}/${rootState.auth.account}/articles/${args.id}`)
			.then( re => {
				state.loading.articles = false
				state.articles = re.data.details
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: "Article deleted",
						type: "success"
					})
				}
			})
			.catch( re => {
				console.log( re );
				state.loading.articles = false
				if( !Request.muted() ){
					Vue.notify({
						title: "Error",
						text: re.error,
						type: "error"
					})
				}
			} )
		},
		deleteTechnique({state, rootState}, args){
			state.loading.articles = false
			Request.destroyPromise(`${state.adminAPI}/${rootState.auth.account}/techniques/${args.id}`)
			.then( re => {
				state.loading.articles = false
				state.techniques = re.data.details
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: "Technique deleted",
						type: "success"
					})
				}
			})
			.catch( re => {
				console.log( re );
				state.loading.articles = false
				if( !Request.muted() ){
					Vue.notify({
						title: "Error",
						text: re.error,
						type: "error"
					})
				}
			} )
		},
		deleteRecommendation({state, rootState}, args){
			state.loading.articles = false
			Request.destroyPromise(`${state.adminAPI}/${rootState.auth.account}/recommendations/${args.id}`)
			.then( re => {
				state.loading.articles = false
				state.recommendations = re.data.details
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: "Recommendation deleted",
						type: "success"
					})
				}
			})
			.catch( re => {
				console.log( re );
				state.loading.articles = false
				if( !Request.muted() ){
					Vue.notify({
						title: "Error",
						text: re.error,
						type: "error"
					})
				}
			} )
		},
		deleteProject({state, rootState}, args){
			state.loading.projects = true
			Request.destroyPromise(`${state.adminAPI}/${rootState.auth.account}/projects/${args.project_id}`)
			.then( re => {
				state.loading.projects = false
				state.projects = re.data.details
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: "Project deleted",
						type: "success"
					})
				}
			})
			.catch( re => {
				console.log( re );
				state.loading.projects = false
				if( !Request.muted() ){
					Vue.notify({
						title: "Error",
						text: re.error,
						type: "error"
					})
				}
			} )
		},
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
		getUsers({state, rootState}){
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
				},
				onError: {
					silent: true,
					callback: function(){
						state.loading.users = false
					}
				}
			})
		},
		getProjects({state, rootState}){
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
				},
				onError: {
					silent: true,
					callback: function(){
						state.loading.projects = false
					}
				}
			})
		},
		getAudits({state, rootState}){
			state.loading.projects = true
			Request.get( `${state.adminAPI}/${rootState.auth.account}/audits`, {
				onSuccess: {
					silent: true,
					callback: function(response){
						state.loading.audits = false
						state.audits = response.data.details
					}
				},
				onWarns: {
					silent: true,
				},
				onError: {
					silent: true,
					callback: function(){
						state.loading.projects = false
					}
				}
			})
		},
		getClients({state, rootState}){
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
				},
				onError: {
					silent: true,
					callback: function(){
						state.loading.clients = false
					}
				}
			})
		},
		getAllDomains({state, rootState}){
			state.loading.domains = true
			Request.get(`${state.adminAPI}/${rootState.auth.account}/domains`, {
				onSuccess: {
					silent: true,
					callback: function(response){
						state.loading.domains = false
						state.domains = response.data.details
					}
				},
				onWarns: {
					silent: true,
				},
				onError: {
					silent: true,
					callback: function(){
						state.loading.domains = false
					}
				}
			})
		}
	},
	getters: { 
		
	},
}
	