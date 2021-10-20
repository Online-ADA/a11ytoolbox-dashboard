import Vue from 'vue'

const getDefaultState = () => {
	return {
		all: [],
		audits: [],
		scans: [],
		project: false,
		loading: false,
		usersLoading: false,
		domainsLoading: false,
		tool: {
			type: false,
			info: ""
		}
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
			domainsLoading: false,
			tool: {
				type: false,
				info: ""
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
					
					if( rootState.clients.client.id !== re.data.details.client_id ){
						rootState.clients.client = rootState.clients.all.find( c=>c.id == re.data.details.client_id)
						rootState.clients.clientID = rootState.clients.client.id
					}
					if( args.vm ){
						// args.vm.project = state.project
						args.vm.project.name = state.project.name
						args.vm.project.account_id = state.project.account_id
						args.vm.project.client_id = state.project.client_id
						args.vm.project.status = state.project.status
						args.vm.project.created_by = state.project.created_by
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
			createProject({state, rootState, dispatch}, args){
				state.loading = true;
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/projects`, {
					params: {
						project: args.project
					}
				})
				.then( re=>{
					Vue.notify({
						title:"Success",
						text:"Project created",
						type: "success"
					})
					if( !args.vm.independent ){
						args.vm.complete = true
					}

					//If the client this project was created for is the same as the current global, trigger an update to the projects list in the sidebar
					if( rootState.clients.client.id === re.data.details.client_id ){
						dispatch("getProjects", false)
					}

					//If the client this project was created for was not the same as the current client, switch global client to new value
					//This will trigger an update of the projects because of the watcher on App.vue
					if( rootState.clients.client.id !== re.data.details.client_id ){
						rootState.projects.project = false
						rootState.clients.client = rootState.clients.all.find( c=>c.id == re.data.details.client_id)
						rootState.clients.clientID = rootState.clients.client.id
					}
					
					//Redirect to the homepage with the new project/client selected
					if(args.vm.independent){
						state.project = re.data.details
						args.router.push({path: "/"})
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
			updateProject({state, rootState}, args){
				state.loading = true
				let requestArgs = {
					params: {
						project_id: args.id,
						data: args.project
					},
					onSuccess: {
						title: "Success",
						text: "Project updated",
						callback: function(re){
							state.loading = false
							if( rootState.clients.client.id !== re.data.details.client_id ){
								rootState.clients.client = rootState.clients.all.find( c=>c.id == re.data.details.client_id)
								rootState.clients.clientID = rootState.clients.client.id
							}
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
			getAuditsForProject({state, rootState, rootGetters}, args, withIssues=false){
				state.loading = true

				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/projects/${args.project_id}/audits`, {
					params: {
						user_id: rootState.auth.user.id, 
						clientID: rootState.clients.client.id,
						isManager: rootGetters["auth/isManager"],
						withIssues: withIssues
					}
				})
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
	