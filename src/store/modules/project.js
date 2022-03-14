import Vue from 'vue'

const getDefaultState = () => {
	return {
		all: [],
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
			getProject({state, rootState}, args){
				state.loading = true
				Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/projects/${args.id}`)
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
				Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/projects`, {
					params: {
						project: args.project
					}
				})
				.then( re=>{
					if(re.data.success == 'error') {
						Vue.notify({
							title:"Warning",
							text:re.data.error,
							type: "warning",
							position: 'bottom right'
						})
					}
					if(re.data.success == '1') {
						Vue.notify({
							title:"Success",
							text:"Project created",
							type: "success",
							position: 'bottom right'
						})
						if( !args.vm.independent ){
							args.vm.assigned = []
							args.vm.unassigned = rootState.user.all
							args.vm.project = {
								name: "",
								status: "active",
								created_by: rootState.auth.user.id,
								account_id: rootState.auth.account,
								client_id: rootState.clients.client.id,
							}
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
						
						state.project = re.data.details
					}
				})
				.catch( re=>{
					console.log(re);
				})
				.then( ()=>{
					state.loading = false;
				})
			},
			getProjects({state, rootState}, notify=true){
				state.loading = true
				
				Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/projects`, {
					params: {
						clientID: rootState.clients.client.id
					} 
				})
				.then( re => {
					if ( notify )
					{
						Vue.notify({
							title: "Success",
							text: "Projects retrieved",
							type:"success",
							position: 'bottom right'
						})
					}
					state.all = re.data.details
				})
				.catch( re => {
					console.log(re)
					Vue.notify({
						title: "Error",
						text: "Failed getting projects",
						type:"error",
						position: 'bottom right'
					})
				})
				.then( ()=> state.loading = false)
			},
			updateProject({state, rootState}, args){
				state.loading = true
				// let requestArgs = {
				// 	params: {
				// 		project_id: args.id,
				// 		data: args.project
				// 	},
				// 	onSuccess: {
				// 		title: "Success",
				// 		text: "Project updated",
				// 		callback: function(re){
				// 			state.loading = false
				// 			if( rootState.clients.client.id !== re.data.details.client_id ){
				// 				rootState.clients.client = rootState.clients.all.find( c=>c.id == re.data.details.client_id)
				// 				rootState.clients.clientID = rootState.clients.client.id
				// 			}
				// 		}
				// 	},
				// 	onWarn:{
				// 		callback: function(){
				// 			state.loading = false
				// 		}
				// 	},
				// 	onError: {
				// 		title: "Error",
				// 		text: "Failed updating project",
				// 		callback: function(){
				// 			state.loading = false
				// 		}
				// 	}
				// };
				Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/projects/${args.id}`, {
					params: {
						project_id: args.id,
						data: args.project
					}
				})
				.then( re=>{
					if( rootState.clients.client.id !== re.data.details.client_id ){
						rootState.clients.client = rootState.clients.all.find( c=>c.id == re.data.details.client_id)
						rootState.clients.clientID = rootState.clients.client.id
					}
				})
				.catch( re => {
					console.log(re)
				})
				.finally( ()=>{ state.loading = false })
			},
			getScansForProject({state, rootState}, args){
				state.loading = true

				Request.getPromise(`${rootState.auth.API}/scans/project/${args.project_id}`)
				.then( re=>state.scans = re.data.details)
				.catch( re=>console.log(re))
				.then( ()=>state.loading = false)
			},
			deleteProject({state, rootState}, args){
				state.loading = true
				let index = state.all.findIndex(p=>p.id == args.project_id)
				Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/projects/${args.project_id}`)
				.then( re => {
					state.loading = false
					state.all = re.data.details
					
					if( state.all.length && index > 0 ){
						state.project = state.all[index]
					}
					// if( !Request.muted() ){
					// 	Vue.notify({
					// 		title: "Success",
					// 		text: "Project deleted",
					// 		type: "success"
					// 	})
					// }
				})
				.catch( re => {
					console.log( re );
					state.loading = false
					// if( !Request.muted() ){
					// 	Vue.notify({
					// 		title: "Error",
					// 		text: re.error,
					// 		type: "error"
					// 	})
					// }
				} )
			},
		},
		getters: { 
			
		},
	}
	