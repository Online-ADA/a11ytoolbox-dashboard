import Vue from 'vue'

const getDefaultState = () => {
	return {
		all: [],
		audits: [],
		scans: [],
		project: false,
		loading: false,
		usersLoading: false,
		domainsLoading: false
	}
}

export default {
		namespaced:true,
		state: {
			all: [],
			audits: [],
			scans: [],
			project: false,
			loading: false,
			usersLoading: false,
			domainsLoading: false
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
			getAssignable({state, rootState}, args){
				state.usersLoading = true
				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/projects/assignable`)
				.then( re=>{
					args.vm.users = Object.values(re.data.details)
					args.vm.unassigned = args.vm.users.filter( u => !args.vm.assigned.includes(u.id) ).map(u => u.id)
				})
				.catch( re=> console.log(re))
				.then( ()=> state.usersLoading = false)
			},
			getProject({state, rootState}, args){
				state.loading = true
				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/projects/${args.id}`)
				.then( re => {
					state.project = re.data.details
					if( args.vm ){
						args.vm.project = state.project
						args.vm.assigned = state.project.assignees.map( u => u.id )
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
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/projects`, {
					params: {
						project: args.project
					}
				})
				.then( re=>{
					Vue.notify({
						title:"Success",
						text:"Project created. Redirecting back to list...",
						type: "success"
					})
					args.vm.project = re.data.details
					args.vm.complete = true

					if( args.redirect ){
						setTimeout(()=>{
							if( rootGetters["auth/isManager"] ){
								args.router.push({path: "/manage/projects"})
								return
							}
							args.router.push({path: "/projects/list"})
						}, 2000)
					}
				})
				.catch( re=>{
					console.log(re);
				})
				.then( ()=>{
					state.loading = false;
				})
			},
			getProjects({state, rootState, rootGetters}, notify=true){
				state.loading = true
				
				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/projects`, {
					params: {
						user_id: rootState.auth.user.id, 
						clientID: rootState.clients.client.id,
						isManager: rootGetters["auth/isManager"]
					} 
				})
				.then( re => {
					if ( notify )
					{
						Vue.notify({
							title: "Success",
							text: "Projects retrieved",
							type:"success"
						})
					}
					state.all = re.data.details
				})
				.catch( re => {
					console.log(re)
					Vue.notify({
						title: "Error",
						text: "Failed getting projects",
						type:"error"
					})
				})
				.then( ()=> state.loading = false)
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
				Request.post(`${rootState.auth.userAPI}/${rootState.auth.account}/projects/${args.id}`, requestArgs)
			},
			getProjectDomains({state, rootState}, args){
				state.domainsLoading = true
				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/projects/${args.id}/domains`)
				.then( re=>args.vm.domains = re.data.details)
				.catch( re=> console.log(re))
				.then( ()=>state.domainsLoading = false)
			},
			getAuditsForProject({state, rootState}, args){
				state.loading = true

				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/projects/${args.project_id}/audits`)
				.then( re=>state.audits = re.data.details)
				.catch( re=>console.log(re))
				.then( ()=>state.loading = false)
			},
			getScansForProject({state, rootState}, args){
				state.loading = true

				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/projects/${args.project_id}/scans`)
				.then( re=>state.scans = re.data.details)
				.catch( re=>console.log(re))
				.then( ()=>state.loading = false)
			},
		},
		getters: { 
			
		},
	}
	