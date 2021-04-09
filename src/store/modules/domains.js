import Vue from 'vue'

export default {
		namespaced:true,
		state: {
			all: [],
			projects: [],
			domain: false,
			adminAPI: "https://apitoolbox.ngrok.io/api/admin",
			API: "https://apitoolbox.ngrok.io/api/user",
			loading: false
		},
		mutations: {
			setState(state,payload) {
				Vue.set(state,payload.key,payload.value)
			},
		},
		actions: {
			getProject({state}, args){
				state.loading = true
				
				Request.getPromise(`${state.API}/${args.account_id}/projects/${args.id}`)
				.then( re => {
					state.project = re.data.project[0]
				})
				.catch( re=> {
					console.log(re);
				})
				.then( ()=>{
					state.loading = false
				})
			},
			createDomain({state, rootState, rootGetters}, args){
				state.loading = true;
				Request.post(`${state.API}/${rootState.auth.account}/domains`, {
					params: {
						domain: args.domain
					},
					onSuccess: {
						title:'Success',
						text:'Domain Created. Redirecting to Domains List...',
						callback: function(){
							state.loading = false
							setTimeout(()=>{
								if( rootGetters["auth/isManager"] ){
									args.router.push({path: "/manage/domains"})
									return
								}
								args.router.push({path: "/domains/list"})
							}, 2000)
						}
					},
					onError: {
						title:'Error',
						text:'Creating this domain caused an error',
					},
					onWarn: {
						title: "Warning",
						text: "There was a problem creating the domain"
					}
				})
			},
			getProjects({state, rootState}){
				state.loading = true
				let args = {
					onSuccess: {
						silent: true,
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
				};
				Request.get(`${state.API}/${rootState.auth.account}/projects`, args)
			},
			updateProject({state, rootState, rootGetters}, args){
				state.loading = true
				let requestArgs = {
					params: {
						project_id: args.id,
						data: args.project
					},
					onSuccess: {
						title: "Success",
						text: "Project updated",
						callback: function(){
							state.loading = false
							if( rootGetters["auth/isManager"] ){
								args.router.push({path: "/manage/projects"})
								return
							}
							args.router.push({path: "/projects/list"})
						}
					},
					onWarn:{
						callback: function(){
							state.loading = false
						}
					},
					onError: {
						title: "Error",
						text: "Failed updating project",
						callback: function(){
							state.loading = false
						}
					}
				};
				Request.post(`${state.API}/${rootState.auth.account}/projects/${args.id}`, requestArgs)
			},
			getDomain({state, rootState}, args){
				state.loading = true
				let requestArgs = {
					onSuccess: {
						title: "Success",
						text: "Retrieved domain",
						callback: function(response){
							state.loading = false
							state.domain = response.data.details
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
				};
				Request.get(`${state.API}/${rootState.auth.account}/domains/${args.id}`, requestArgs)
			},
			saveSitemap({state, rootState}, args){
				state.loading = true
				let form_data = new FormData()
				form_data.append('sitemap', args.file)
				form_data.append("domain", args.domain)
				let requestArgs = {
					headers: {
						'Content-Type': 'multipart/form-data'
					},
					params: form_data,
					onSuccess: {
						title: "Success",
						text: "Sitemap saved",
						callback: function(response){
							state.loading = false
							state.domain = response.data.details
						}
					},
					onWarn:{
						callback: function(){
							state.loading = false
						}
					},
					onError: {
						title: "Error",
						text: "Failed saving sitemap",
						callback: function(){
							state.loading = false
						}
					}
				};
				Request.post(`${state.API}/${rootState.auth.account}/domains/${args.id}/sitemap`, requestArgs)
			}
		},
		getters: { 
			
		},
	}
	