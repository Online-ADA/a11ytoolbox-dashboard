import Vue from 'vue'

export default {
		namespaced:true,
		state: {
			all: [],
			audit: false,
			auditors: [],
			project: false,
			projects: [],
			API: "https://apitoolbox.ngrok.io/api/user",
			adminAPI: "https://apitoolbox.ngrok.io/api/admin",
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
				Request.get(`${state.API}/${args.account_id}/projects/${args.project_id}`, {
					onSuccess: {
						title:'Success',
						text:'Project retrieved',
						callback: function(response){
							state.loading = false
							state.project = response.data.project[0]
						}
					},
					onError: {
						title:'Error',
						text:'Retrieving this project caused an error',
						callback: function(){
							state.loading = false
						}
					},
					onWarn: {
						title: "Warning",
						text: "There was a problem retrieving the project",
						callback: function(){
							state.loading = false
						}
					}
				})
			},
			getProjects({state, rootGetters}, args){
				state.loading = true
				let url = `${state.API}/${args.account_id}/projects`
				if( rootGetters["auth/isManager"] ){
					url = `${state.adminAPI}/${args.account_id}/projects`
				}
				Request.get(url, {
					onSuccess: {
						silent:true,
						callback: function(response){
							state.loading = false
							state.projects = response.data.details
						}
					},
					onError: {
						title:'Error',
						text:'Retrieving this projects caused an error',
						callback: function(){
							state.loading = false
						}
					},
					onWarn: {
						title: "Warning",
						text: "There was a problem retrieving the projects",
						callback: function(){
							state.loading = false
						}
					}
				})
			},
			getAudit({state, dispatch, rootGetters}, args){
				state.loading = true
				Request.getPromise(`${state.API}/${args.account_id}/audits/${args.id}`)
				.then( re=>{
					state.audit = re.data.audit[0]
					if( args.vm ){
						args.vm.audit = state.audit
						args.vm.audit.tech_requirements = state.audit.tech_requirements.map( o=>{ return {name: o} } )
						args.vm.audit.software_used = state.audit.software_used.map( o=>{ return {name: o} } )
						args.vm.audit.assistive_tech = state.audit.assistive_tech.map( o=>{ return {name: o} } )
						args.vm.assigned = state.audit.assignees.map( o=>o.id)
					}
					if( rootGetters["auth/isManager"] ){
						dispatch("getAuditors", {vm: args.vm})
					}else{
						state.loading = false
					}
				})
				.catch( re=>{
					console.log(re);
					state.loading = false
				})
			},
			createAudit({state, rootState, rootGetters}, args){
				state.loading = true;
				Request.post(`${state.API}/${rootState.auth.account}/audits`, {
					params: {
						audit: args.audit
					},
					onSuccess: {
						title:'Success',
						text:'Audits Created. Redirecting to Audits List...',
						callback: function(){
							state.loading = false
							setTimeout(()=>{
								if( rootGetters["auth/isManager"] ){
									args.router.push({path: "/manage/audits"})
									return
								}
								args.router.push({path: "/audits/list"})
							}, 2000)
						}
					},
					onError: {
						title:'Error',
						text:'Creating this audit caused an error',
					},
					onWarn: {
						title: "Warning",
						text: "There was a problem creating the audit" //push back to homepage with incorrect permissions/role
					}
				})
			},
			getAudits({state, rootState}){
				state.loading = true
				let args = {
					params: {
						params: {
							user_id: rootState.auth.user.id
						}
					},
					onSuccess: {
						title: "Success",
						text: "Audits retrieved",
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
						text: "Failed getting audits",
						callback: function(){
							state.loading = false
						}
					}
				};
				Request.get(`${state.API}/${rootState.auth.account}/audits`, args)
			},
			getAuditors({state, rootState}, args){
				state.loading = true
				let resquestArgs = {
					onSuccess: {
						title: "Success",
						text: "Auditors retrieved",
						callback: function(response){
							state.loading = false
							if( args.vm ){
								state.auditors = response.data.details
								args.vm.unassigned = response.data.details.filter( o=>!args.vm.assigned.includes(o.id)).map( o=>o.id )
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
						text: "Failed getting auditorss",
						callback: function(){
							state.loading = false
						}
					}
				};
				Request.get(`${state.adminAPI}/${rootState.auth.account}/audits/auditors`, resquestArgs)
			},
			updateAudit({state, rootState, rootGetters}, args){
				state.loading = true
				let requestArgs = {
					params: {
						audit_id: args.id,
						data: args.audit
					},
					onSuccess: {
						title: "Success",
						text: "Audit updated",
						callback: function(){
							state.loading = false
							if( rootGetters["auth/isManager"] ){
								args.router.push({path: "/manage/audits"})
								return
							}
							args.router.push({path: "/audits/list"})
						}
					},
					onWarn:{
						callback: function(){
							state.loading = false
						}
					},
					onError: {
						title: "Error",
						text: "Failed updating audit",
						callback: function(){
							state.loading = false
						}
					}
				};
				Request.post(`${state.API}/${rootState.auth.account}/audits/${args.id}`, requestArgs)
			},
		},
		getters: { 
			
		},
	}
	