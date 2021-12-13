import Vue from 'vue'
import { EventBus } from '../../services/eventBus'

const CheckAuditState = (state,id,api,account) => {
	Request.getPromise(`${api}/${account}/audits/${id}/status`)
	.then( re=>{
		if(re.data.success == '1') {
			if(re.data.details != 'running_automation') {
				if(state.intervals[id]) clearInterval(state.intervals[id])
				EventBus.$emit('Audit/Automation/Complete', {data: id})
			}
		}else{
			if(state.intervals[id]) clearInterval(state.intervals[id])
		}
	})
	.catch(re=>{
		console.log(re)
		if(state.intervals[id]) clearInterval(state.intervals[id])
	})
}

const getDefaultState = () => {
	return {
		all: [],
		audit: false,
		team_members: [],
		loading: false,
		audit_states: [],
		structured_sample: false,
		sitemap: false,
		assistive_tech: [],
		software_used: [],
		articles: [],
		techniques: [],
		recommendations: [],
		intervals: {},
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
			team_members: [],
			loading: false,
			audit_states: [],
			structured_sample: false,
			sitemap: false,
			assistive_tech: [],
			software_used: [],
			articles: [],
			techniques: [],
			recommendations: [],
			intervals: {},
		},
		mutations: {
			setState(state,payload) {
				Vue.set(state,payload.key,payload.value)
			},
			resetState (state) {
				let all = state.all
				Object.assign(state, getDefaultState())
				Object.assign(state.all, all)
			},
		},
		actions: {
			resetState({commit}) {
				commit('resetState')
			},
			getIssuesOffset({state, rootState}, args){
				state.loading = true
				Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/${args.audit_id}/issues/page`, {params: {page: args.page}})
				.then( re=>{
					if( args.importing ){
						if( args.isPrimary ){
							rootState.audits.audit.issues = re.data.details
						}else{
							//All of these lines are here to trigger the watcher on Import.vue
							let index = rootState.projects.project.audits.findIndex(a=>a.id == args.audit_id)
							let copy = rootState.projects.project.audits[index]
							copy.issues = re.data.details
							rootState.projects.project.audits[index] = copy
						}
					}else{
						rootState.audits.audit.issues = re.data.details
					}
				})
				.catch( re=>{
					console.log(re);
				})
				.then( ()=> state.loading = false)
			},
			uploadIssuesCSV({rootState}, args){
				let form_data = new FormData()
				form_data.append('upload', args.file)
				let myHeaders = {...Vue.prototype.$http.defaults.headers.common, 'Content-Type': 'multipart/form-data'}
				Request.postPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/uploadCSV`, {params: form_data, headers: myHeaders})
				.then( re=>{
					Vue.notify({
						title: "Success",
						text: "A temporary audit has been created",
						type: "success",
						position: 'bottom right'
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
				Request.postPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/${args.audit_id}/complete`)
				.then( re=>{
					Vue.notify({
						title: "Success",
						text: "Audit has been marked complete and is now locked",
						type: "success",
						position: 'bottom right'
					})

					state.audit = re.data.details
				})
				.catch()
				.then()
			},
			createNextAudit({rootState}, args){
				Request.postPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/${args.audit_id}/next`)
				.then( re=>{
					Vue.notify({
						title: "Audit created",
						text: "Redirecting to new audit...",
						type: "success",
						position: 'bottom right'
					})
					window.location.href = `https://${rootState.auth.site}/audits/${re.data.details}/import`
				})
				.catch()
				.then()
			},
			getAudit({state, rootState}, args = {withIssues: false}){
				state.loading = true
				
				Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/${args.id}`, {params: {withIssues: args.withIssues}})
				.then( re=>{
					state.audit = re.data.details
					if(!state.intervals[state.audit.id] && state.audit.status == 'running_automation') {
						state.intervals[state.audit.id] = setInterval(
							CheckAuditState,
							5000,
							state,
							state.audit.id,
							rootState.auth.API,
							rootState.auth.account
						)
					}
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
				Request.postPromise(`${rootState.auth.API}/${rootState.auth.account}/audits`, { params: { audit: args.audit, createScan: args.createScan } })
				.then( re=>{
					if( !Request.muted() ){
						Vue.notify({
							title:"Success",
							text: "Audit was create successfully",
							type: "success",
							position: 'bottom right'
						})
					}

					rootState.audits.all.push(re.data.details)
					rootState.projects.project.audits.push(re.data.details)
					rootState.overview.refresh.account.audits = true
					
					if( args.vm ){
						args.vm.complete = true
					}
					
				})
				.catch(re=>{
					console.log(re)
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: "There was an error when trying to create the audit. Please see the dev console for more information",
							type:"error",
							position: 'bottom right'
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			},
			getAuditStates({state, rootState}){
				state.loading = true
				Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/states`)
				.then( res => {
					state.audit_states = res.data.details
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
					
					state.loading = false
				})
			},
			getAudits({state, rootState}, args){
				state.loading = true
				let withIssues = false
				if( args.withIssues ){
					withIssues = args.withIssues
				}
				Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/audits`, {
					params: {
						clientID: rootState.clients.client.id,
						projectID: args.project_id,
						withIssues: withIssues
					}
				})
				.then( re => {
					if( !withIssues ){
						state.all = re.data.details
					}else{
						rootState.projects.project.audits = re.data.details
					}

					for(let i in state.all) {
						if(!state.intervals[state.all[i].id] && state.all[i].status == 'running_automation') {
							state.intervals[state.all[i].id] = setInterval(
								CheckAuditState,
								5000,
								state,
								state.all[i].id,
								rootState.auth.API,
								rootState.auth.account
							)
						}
					}
					if( !Request.muted() ){
						// Vue.notify({
						// 	title: "Success",
						// 	text: "Audits retrieved",
						// 	type: "success",
						// 	position: 'bottom right'
						// })
					}
				})
				.catch( re => {
					console.log(re);
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: re.error,
							type: "error",
							position: 'bottom right'
						})
					}
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
							args.router.push({path: `/audits/${args.id}`})
						},
						position: 'bottom right'
					},
					onWarn:{
						callback: function(){
							state.loading = false
						},
						position: 'bottom right'
					},
					onError: {
						title: "Error",
						text: "Failed updating audit",
						callback: function(){
							state.loading = false
						},
						position: 'bottom right'
					}
				};
				Request.post(`${rootState.auth.API}/${rootState.auth.account}/audits/${args.id}`, requestArgs)
			},
			getStructuredSample({state, rootState}){
				state.loading = true

				Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/${state.audit.domain_id}/structuredSample`)
				.then( re=>state.structured_sample = re.data.details)
				.catch( re=>console.log(re))
				.then( ()=>state.loading = false)
			},
			getSitemap({state, rootState}){
				state.loading = true

				Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/${state.audit.domain_id}/sitemap`)
				.then( re=>state.sitemap = re.data.details)
				.catch( re=>console.log(re))
				.then( ()=>state.loading = false)
			},
			getArticlesTechniquesRecommendations({state, rootState}){
				Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/extras`)
				.then( re=>{
					state.techniques = re.data.details.techniques
					state.recommendations = re.data.details.recommendations
					state.articles = re.data.details.articles
				})
				.catch()
			},
			createIssue({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/${args.issue.audit_id}/issues/store`, {params: args.issue})
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
				Request.patchPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/${args.audit_id}/issues`, {params: { issues: args.issues }})
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
				Request.postPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/${args.audit_id}/issues/${args.issue.id}`, { params: args.issue })
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
				Request.postPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/${args.audit_id}/import`, {params: { issues: args.issues }})
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
				Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/technologies`)
				.then( re => {
					state.assistive_tech = re.data.details
				})
				.catch( re => {
					console.log(re);
					if( !Request.muted() ){
						Vue.notify({
							title: "Error retrieving assistive technologies",
							text: re.error,
							type: "error",
							position: 'bottom right'
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			},
			getSoftwareUsed({state, rootState}){
				state.loading = true
				Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/software`)
				.then( re => {
					state.software_used = re.data.details
				})
				.catch( re => {
					console.log(re);
					if( !Request.muted() ){
						Vue.notify({
							title: "Error retrieving software used",
							text: re.error,
							type: "error",
							position: 'bottom right'
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			},
			deleteAudit({state, rootState}, args){
				state.loading = true
				Request.destroyPromise(`${rootState.auth.API}/${rootState.auth.account}/audits/${args.audit_id}`)
				.then( re => {
					state.loading = false
					rootState.projects.project.audits = re.data.details
					
				})
				.catch( re => {
					console.log( re );
					state.loading = false
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: re.error,
							type: "error"
						})
					}
				} )
			},
		},
		getters: { 
			
		},
	}
	