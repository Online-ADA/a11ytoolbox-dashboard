import Vue from 'vue'
import router from 'vue-router'

export default {
		namespaced:true,
		state: {
			all: [],
			project: false,
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
			getUsers({state, rootState}, args){
				state.loading = true
				Request.get(`${state.adminAPI}/${rootState.auth.account}/users`, {
					onSuccess: {
						silent: true,
						callback: function(response){
							state.loading = false
							args.vm.users = Object.values(response.data.details)
							args.vm.unassigned = args.vm.users.filter( u => !args.vm.assigned.includes(u.user_id) ).map(u => u.user_id)
						}
					},
					onWarns: {
						silent: true,
						// callback: function(response){
						// 	rootState.auth.authMessage = rootState.auth.authMessages[response.data.details]
						// 	router.push({path: "/"})
						// }
					},
					onError: {
						silent: true,
						callback: function(){
							state.loading = false
						}
					}
				})
			},
			getProject({state, dispatch, rootGetters, rootState}, args){
				state.loading = true
				
				Request.getPromise(`${state.API}/${rootState.auth.account}/projects/${args.id}`)
				.then( re => {
					state.project = re.data.details[0]
					if( args.vm ){
						args.vm.project = state.project
						args.vm.assigned = state.project.assignees.map( u => u.id )
					}
					if( rootGetters["auth/isManager"] ){
						dispatch("getUsers", {vm: args.vm})
					}
				})
				.catch( re=> {
					console.log(re);
				})
				.then( ()=>{
					state.loading = false
				})
			},
			createProject({state, rootState, rootGetters}, args){
				state.loading = true;
				Request.postPromise(`${state.API}/${rootState.auth.account}/projects`, {
					params: {
						project: args.project
					}
				})
				.then( re=>{
					args.vm.project = re.data.details
					args.vm.complete = true

					if( args.redirect ){
						setTimeout(()=>{
							if( rootGetters["auth/isManager"] ){
								router.push({path: "/manage/projects"})
								return
							}
							router.push({path: "/projects/list"})
						}, 2000)
					}
				})
				.catch( re=>{
					console.log(re);
				})
				.then( ()=>{
					state.loading = false;
				})

				// Request.post(`${state.API}/${rootState.auth.account}/projects`, {
				// 	params: {
				// 		project: args.project
				// 	},
				// 	onSuccess: {
				// 		title:'Success',
				// 		text:'Project Created. Redirecting to Projects List...',
				// 		callback: function(){
				// 			state.loading = false
				// 			setTimeout(()=>{
				// 				if( rootGetters["auth/isManager"] ){
				// 					args.router.push({path: "/manage/projects"})
				// 					return
				// 				}
				// 				args.router.push({path: "/projects/list"})
				// 			}, 2000)
				// 		}
				// 	},
				// 	onError: {
				// 		title:'Error',
				// 		text:'Creating this project caused an error',
				// 	},
				// 	onWarn: {
				// 		title: "Warning",
				// 		text: "There was a problem creating the project"
				// 	}
				// })
			},
			getProjects({state, rootState}){
				state.loading = true
				let args = {
					params: {
						params: {
							user_id: rootState.auth.user.id
						}
					},
					onSuccess: {
						title: "Success",
						text: "Projects retrieved",
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
		},
		getters: { 
			
		},
	}
	