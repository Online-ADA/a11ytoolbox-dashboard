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
		audit_states: [],
		software_used: [],
		assistive_techs: [],
		clients: [],
		client: false,
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
		audit_states: [],
		software_used: [],
		assistive_techs: [],
		clients: [],
		client: false,
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
		getClient({state, rootState}, args){
			state.loading.clients = true
			
			Request.get(`${rootState.auth.API}/${rootState.auth.account}/clients/${args.id}`, {
				onSuccess: {
					title:'Success',
					text:'Client retrieved',
					callback: function(response){
						state.loading.clients = false
						state.client = response.data.details
					}
				},
				onError: {
					title:'Error',
					text:'Getting this client caused an error',
					callback: function(){
						state.loading.clients = false
					}
				},
				onWarn: {
					title: "Warning",
					text: "There was a problem getting the client",
					callback: function(){
						state.loading.clients= false
					}
				}
			})
		},
		
		getAsstTechnologies({state, rootState}){
			state.loading.articles = true
			Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/technologies`)
			.then( res => {
				state.assistive_techs = res.data.details
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
		getSoftwareUsed({state, rootState}){
			state.loading.articles = true
			Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/software`)
			.then( res => {
				state.software_used = res.data.details
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
		getArticles({state, dispatch, rootState}){
			state.loading.articles = true
			Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/articles`)
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
			Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/techniques`)
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
			Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/recommendations`)
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
			let path, obj, text = ""
			switch( args.object.identifier ){
				case "software_used":
					path = "audits/software"
					obj = "software_used"
					text = "Software"
					break;
				case "article":
					path = "articles"
					obj = "articles"
					text = "Article"
					break;
				case "technique":
					path = "techniques"
					obj = "techniques"
					text = "Technique"
					break;
				case "recommendation":
					path = "recommendations"
					obj = "recommendations"
					text = "Recommendation"
					break;
				case "audit_state":
					path = "audits/states"
					obj = "audit_states"
					text = "Audit State"
					break;
				case "failure":
					path = "failures"
					obj = "failure"
					text = "Failure"
					break;
				case "assistive_tech":
					path = "audits/technologies"
					obj = "assistive_techs"
					text = "Assistive Technology"
					break;
			}
			Request.postPromise(`${rootState.auth.API}/${rootState.auth.account}/${path}`, {
				params: args.object
			})
			.then( re=> {
				if( args.object.identifier == "audit_state" ){
					rootState.audits.audit_states = re.data.details
				}
				else{
					state[`${obj}`] = re.data.details
				}
				
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: `${text} saved`,
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
			let path, obj, text = ""
			switch( args.object.identifier ){
				case "software_used":
					path = "audits/software"
					obj = "software_used"
					text = "Software"
					break;
				case "article":
					path = "articles"
					obj = "articles"
					text = "Article"
					break;
				case "technique":
					path = "techniques"
					obj = "techniques"
					text = "Technique"
					break;
				case "recommendation":
					path = "recommendations"
					obj = "recommendations"
					text = "Recommendation"
					break;
				case "audit_state":
					path = "audits/states"
					obj = "audit_states"
					text = "Audit State"
					break;
				case "failure":
					path = "failures"
					obj = "failure"
					text = "Failure"
					break;
				case "assistive_tech":
					path = "audits/technologies"
					obj = "assistive_techs"
					text = "Assistive Technology"
					break;
			}

			Request.postPromise(`${rootState.auth.API}/${rootState.auth.account}/${path}/${args.object.id}`, {
				params: args.object
			})
			.then( re=> {
				if( args.object.identifier == "audit_state" ){
					rootState.audits.audit_states = re.data.details
				}else{
					state[`${obj}`] = re.data.details
				}
				
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: `${text} updated`,
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
		deleteAuditState({state, rootState}, args){
			state.loading.articles = false
			Request.destroyPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/states/${args.id}`)
			.then( re => {
				rootState.audits.audit_states = re.data.details
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: "State deleted",
						type: "success"
					})
				}
			})
			.catch( re => {
				console.log( re );
				if( !Request.muted() ){
					Vue.notify({
						title: "Error",
						text: re.error,
						type: "error"
					})
				}
			} )
			.then( ()=> state.loading.articles = false)
		},
		deleteSoftwareUsed({state, rootState}, args){
			state.loading.articles = false
			Request.destroyPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/software/${args.id}`)
			.then( re => {
				state.software_used = re.data.details
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: "Software deleted",
						type: "success"
					})
				}
			})
			.catch( re => {
				console.log( re );
				if( !Request.muted() ){
					Vue.notify({
						title: "Error",
						text: re.error,
						type: "error"
					})
				}
			} )
			.then( ()=> state.loading.articles = false)
		},
		deleteTechnology({state, rootState}, args){
			state.loading.articles = false
			Request.destroyPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/technologies/${args.id}`)
			.then( re => {
				state.assistive_techs = re.data.details
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: "Assistive technology deleted",
						type: "success"
					})
				}
			})
			.catch( re => {
				console.log( re );
				if( !Request.muted() ){
					Vue.notify({
						title: "Error",
						text: re.error,
						type: "error"
					})
				}
			} )
			.then( ()=> state.loading.articles = false)
		},
		deleteArticle({state, rootState}, args){
			state.loading.articles = false
			Request.destroyPromise(`${rootState.auth.API}/${rootState.auth.account}/articles/${args.id}`)
			.then( re => {
				state.loading.articles = false
				state.articles = re.data.details
				if( !Request.muted() ){
					Vue.notify({
						title: "Success",
						text: "Success Criteria deleted",
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
			Request.destroyPromise(`${rootState.auth.API}/${rootState.auth.account}/techniques/${args.id}`)
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
			Request.destroyPromise(`${rootState.auth.API}/${rootState.auth.account}/recommendations/${args.id}`)
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
			Request.destroyPromise(`${rootState.auth.API}/${rootState.auth.account}/projects/${args.project_id}`)
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
			Request.post(`${rootState.auth.API}/${rootState.auth.account}/manage/users/setRole`, {
				params: {
					"user_id": rootState.user.user.id,
					"role" : args.role
				},
				onSuccess: {
					text: "Role updated",
					title: "Success",
					callback: function(response){
						state.loading.users = false
						state.user = response.data.details
						Vue.notify({
							title: "Success",
							text: "User role updated",
							type: "success"
						})
					}
				},
				onError: {
					callback: function(){
						state.loading.users = false
					}
				}
			})
		},
		modifyTeam({state, rootState}, args){
			state.loading.users = true
			Request.post(`${rootState.auth.API}/${rootState.auth.account}/manage/users/setTeam`, {
				params: {
					"user_id": rootState.user.user.id,
					"team" : args.team
				},
				onSuccess: {
					text: "Team updated",
					title: "Success",
					callback: function(response){
						state.loading.users = false
						state.user = response.data.details
						Vue.notify({
							title: "Success",
							text: "User team updated",
							type: "success"
						})
					}
				},
				onError: {
					callback: function(){
						state.loading.users = false
					}
				}
			})
		},
		getUsers({state, rootState}){
			state.loading.users = true
			Request.get(`${rootState.auth.API}/${rootState.auth.account}/users`, {
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
		getProjects({state, rootState}){
			state.loading.projects = true
			Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/projects`, {
				params: {
					client_id: rootState.clients.client.id,
				} 
			})
			.then(response=>{
				state.projects = response.data.details
				Vue.notify({
					title: "Success",
					text: "Projects retrieved",
					type:"success"
				})
			})
			.catch( re=>{
				console.log(re)
				Vue.notify({
					title: "Error",
					text: "Failed getting projects",
					type:"error"
				})
			})
			.finally(()=>{state.loading.projects = false})

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
		getAudits({state, rootState}){
			state.loading.projects = true
			Request.get( `${rootState.auth.API}/${rootState.auth.account}/audits`, {
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
			Request.get(`${rootState.auth.API}/${rootState.auth.account}/clients`, {
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
			Request.get(`${rootState.auth.API}/${rootState.auth.account}/domains`, {
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
		},
		createClient({state, rootState}, args){
			state.loading.clients = true;
			Request.post(`${rootState.auth.API}/${args.client.account_id}/clients`, {
				params: {
					client: args.client
				},
				onSuccess: {
					title:'Success',
					text:'Client created. Redirecting to Clients List...',
					callback: function(response){
						state.loading.clients = false
						console.log(response.data.details);
						rootState.clients.all = response.data.details
						setTimeout(()=>{
							args.router.push({path: "/manage/clients"})
						}, 2000)
					}
				},
				onError: {
					title:'Error',
					text:'Creating this client caused an error',
					callback: function(){
						state.loading.clients = false
					}
				},
				onWarn: {
					title: "Warning",
					text: "There was a problem creating the client",
					callback: function(response){
						state.loading.clients = false
					}
				}
			})
		},
		updateClient({state, rootState}, args){
			state.loading.clients = true;
			Request.post(`${rootState.auth.API}/${args.client.account_id}/clients/${args.client.id}`, {
				params: {
					client: args.client
				},
				onSuccess: {
					title:'Success',
					text:'Client created. Redirecting to Clients List...',
					callback: function(response){
						state.loading.clients = false
						rootState.clients.all = response.data.details
						setTimeout(()=>{
							args.router.push({path: "/manage/clients"})
						}, 2000)
					}
				},
				onError: {
					title:'Error',
					text:'Creating this client caused an error',
					callback: function(){
						state.loading.clients = false
					}
				},
				onWarn: {
					title: "Warning",
					text: "There was a problem creating the client",
					callback: function(response){
						state.loading.clients = false
					}
				}
			})
		},
	},
	getters: { 
		
	},
}
	