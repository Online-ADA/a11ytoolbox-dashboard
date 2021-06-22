import Vue from 'vue'

const getDefaultState = () => {
	return {
		all: [],
		audit: false,
		auditors: [],
		project: false,
		projects: [],
		loading: false,
		auditorsLoading: false,
		structured_sample: false,
		sitemap: false,
		assistive_tech: [],
		software_used: [],
		articles: [],
		techniques: [],
		recommendations: []
	}
}

const generateUniqueID = (existing) => {
	let id = Math.random().toString(36).substring(5)
	
	if( existing.includes(id) ){
		return generateUniqueID(existing)
	}

	return id
}

export default {
		namespaced:true,
		state: {
			all: [],
			audit: false,
			auditors: [],
			project: false,
			projects: [],
			loading: false,
			auditorsLoading: false,
			structured_sample: false,
			sitemap: false,
			assistive_tech: [],
			software_used: [],
			articles: [],
			techniques: [],
			recommendations: []
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
			uploadIssuesCSV({rootState}, args){
				let form_data = new FormData()
				form_data.append('upload', args.file)
				let myHeaders = {...Vue.prototype.$http.defaults.headers.common, 'Content-Type': 'multipart/form-data'}
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/uploadCSV`, {params: form_data, headers: myHeaders})
				.then( re=>{
					Vue.notify({
						title: "Success",
						text: "A temporary audit has been created",
						type: "success"
					})
					
					let newTemp = {
						id: generateUniqueID(args.vm.audits.map(a=>a.id)),
						title: "Temp CSV upload #" + (args.vm.tempAudits.length+1),
						issues: re.data.details
					}
					args.vm.tempAudits.push(newTemp)
				})
				.catch()
				.then()
			},
			completeAudit({state, rootState}, args){
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/${args.audit_id}/complete`)
				.then( re=>{
					Vue.notify({
						title: "Success",
						text: "Audit has been marked complete and is now locked",
						type: "success"
					})

					state.audit = re.data.details
				})
				.catch()
				.then()
			},
			createNextAudit({rootState}, args){
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/${args.audit_id}/next`)
				.then( re=>{
					Vue.notify({
						title: "Audit created",
						text: "Redirecting to new audit...",
						type: "success"
					})
					window.location.href = `https://${rootState.auth.site}/audits/${re.data.details}/import`
				})
				.catch()
				.then()
			},
			getProject({state, rootState}, args){
				state.loading = true
				Request.get(`${rootState.auth.userAPI}/${rootState.auth.account}/projects/${args.project_id}`, {
					onSuccess: {
						title:'Success',
						text:'Project retrieved',
						callback: function(response){
							state.loading = false
							state.project = response.data.details
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
				let url = `${rootState.auth.userAPI}/${rootState.auth.account}/projects`
				if( rootGetters["auth/isManager"] ){
					url = `${rootState.auth.adminAPI}/${rootState.auth.account}/projects`
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
			getAudit({state, rootState}, args = {withIssues: false}){
				state.loading = true
				
				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/${args.id}`, {params: {withIssues: args.withIssues}})
				.then( re=>{
					state.audit = re.data.details
					if( args.vm ){
						args.vm.audit = state.audit
						args.vm.audit.tech_requirements = state.audit.tech_requirements.map( o=>{ return {name: o} } )
						args.vm.audit.software_used = state.audit.software_used.map( o=>{ return {name: o} } )
						args.vm.audit.assistive_tech = state.audit.assistive_tech.map( o=>{ return {name: o} } )
						args.vm.assigned = state.audit.assignees.map( o=>o.id)
					}
				})
				.catch( re=>{
					console.log(re);
				})
				.then( ()=> state.loading = false)
			},
			createAudit({state, rootState}, args){
				state.loading = true;
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits`, { params: { audit: args.audit } })
				.then( re=>{
					if( !Request.muted() ){
						Vue.notify({
							title:"Success",
							text: "Audit was create successfully. Redirecting to the audit...",
							type: "success"
						})
					}
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
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: "There was an error when trying to create the audit. Please see the dev console for more information",
							type:"error"
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			},
			getAudits({state, rootState}){
				state.loading = true
				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits`)
				.then( re => {
					state.all = re.data.details
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Audits retrieved",
							type: "success"
						})
					}
				})
				.catch( re => {
					console.log(re);
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: re.error,
							type: "error"
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			},
			getAuditors({state, rootState}){
				state.auditorsLoading = true
				
				Request.getPromise(`${rootState.auth.adminAPI}/${rootState.auth.account}/audits/auditors`)
				.then( re=>{
					state.auditors = re.data.details
				})
				.catch( re=>{
					console.log(re)
				})
				.then( ()=>{
					state.auditorsLoading = false
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
				Request.post(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/${args.id}`, requestArgs)
			},
			getStructuredSample({state, rootState}){
				state.loading = true

				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/${state.audit.domain_id}/structuredSample`)
				.then( re=>state.structured_sample = re.data.details)
				.catch( re=>console.log(re))
				.then( ()=>state.loading = false)
			},
			getSitemap({state, rootState}){
				state.loading = true

				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/${state.audit.domain_id}/sitemap`)
				.then( re=>state.sitemap = re.data.details)
				.catch( re=>console.log(re))
				.then( ()=>state.loading = false)
			},
			getArticlesTechniquesRecommendations({state, rootState}){
				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/extras`)
				.then( re=>{
					state.techniques = re.data.details.techniques
					state.recommendations = re.data.details.recommendations
					state.articles = re.data.details.articles
				})
				.catch()
			},
			createIssue({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/${args.issue.audit_id}/issues/store`, {params: args.issue})
				.then( re=>{
					state.audit.issues = re.data.details
				})
				.catch( re=>{
					console.log(re)
				})
				.then( ()=>{
					state.loading = false
				})
			},
			deleteIssues({state, rootState}, args){
				state.loading = true
				Request.patchPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/${args.audit_id}/issues`, {params: { issues: args.issues }})
				.then( re=>{
					state.audit.issues = re.data.details
				})
				.catch( re=>{
					console.log(re)
				})
				.then( ()=>{
					state.loading = false
				})
			},
			updateIssue({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/${args.audit_id}/issues/${args.issue.id}`, { params: args.issue })
				.then( re=>{
					state.audit.issues = re.data.details
				})
				.catch( re=>{
					console.log(re)
				})
				.then( ()=>{
					state.loading = false
				})
			},
			importIssues({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/audits/${args.audit_id}/import`, {params: { issues: args.issues }})
				.then( ()=>{
					args.router.push({name: 'AuditShow', params: {id: args.audit_id}})
				})
				.catch()
				.then( ()=>{
					state.loading = false
				})
			},
			getAssistiveTech({state, rootState}){
				state.loading = true
				Request.getPromise(`${rootState.auth.adminAPI}/${rootState.auth.account}/audits/technologies`)
				.then( re => {
					state.assistive_tech = re.data.details
				})
				.catch( re => {
					console.log(re);
					if( !Request.muted() ){
						Vue.notify({
							title: "Error retrieving assistive technologies",
							text: re.error,
							type: "error"
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			},
			getSoftwareUsed({state, rootState}){
				state.loading = true
				Request.getPromise(`${rootState.auth.adminAPI}/${rootState.auth.account}/audits/software`)
				.then( re => {
					state.software_used = re.data.details
				})
				.catch( re => {
					console.log(re);
					if( !Request.muted() ){
						Vue.notify({
							title: "Error retrieving software used",
							text: re.error,
							type: "error"
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			}
		},
		getters: { 
			
		},
	}
	