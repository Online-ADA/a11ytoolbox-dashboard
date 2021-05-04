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
			getProject({state, rootState}, args){
				state.loading = true
				Request.get(`${state.API}/${rootState.auth.account}/projects/${args.project_id}`, {
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
			getProjects({state, rootGetters, rootState}){
				state.loading = true
				let url = `${state.API}/${rootState.auth.account}/projects`
				if( rootGetters["auth/isManager"] ){
					url = `${state.adminAPI}/${rootState.auth.account}/projects`
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
			getAudit({state, dispatch, rootState, rootGetters}, args = {withIssues: false}){
				state.loading = true
				
				Request.getPromise(`${state.API}/${rootState.auth.account}/audits/${args.id}`, {params: {withIssues: args.withIssues}})
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
			createAudit({state, rootState}, args){
				state.loading = true;
				Request.postPromise(`${state.API}/${rootState.auth.account}/audits`, { params: { audit: args.audit } })
				.then( re=>{
					Vue.notify({
						title:"Success",
						text: "Audit was create successfully. Redirecting to the audit...",
						type: "success"
					})
					setTimeout(()=>{
						// if( rootGetters["auth/isManager"] ){
						// 	args.router.push({path: "/manage/audits"})
						// 	return
						// }
						args.router.push({path: `/audits/${re.data.details}`})
					}, 2000)
				})
				.catch(re=>{
					console.log(re)
					Vue.notify({
						title: "Error",
						text: "There was an error when trying to create the audit. Please see the dev console for more information",
						type:"error"
					})
				})
				.then( ()=>{
					state.loading = false
				})
			},
			getAudits({state, rootState}){
				state.loading = true
				Request.getPromise(`${state.API}/${rootState.auth.account}/audits`)
				.then( re => {
					state.all = re.data.details
					Vue.notify({
						title: "Success",
						text: "Audits retrieved",
						type: "success"
					})
				})
				.catch( re => {
					console.log(re);
					Vue.notify({
						title: "Error",
						text: re.error,
						type: "error"
					})
				})
				.then( ()=>{
					state.loading = false
				})
			},
			getAuditors({state, rootState}, args){
				state.loading = true
				
				Request.getPromise(`${state.adminAPI}/${rootState.auth.account}/audits/auditors`)
				.then( re=>{
					if( args.vm ){
						state.auditors = re.data.details
						args.vm.unassigned = re.data.details.filter( o=>!args.vm.assigned.includes(o.id)).map( o=>o.id )
					}
				})
				.catch( re=>{
					console.log(re)
				})
				.then( ()=>{
					state.loading = false
				})
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
	