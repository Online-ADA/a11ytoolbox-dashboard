import Vue from 'vue'

const getDefaultState = () => {
	return {
		all: [],
		audits: [],
		projects: [],
		domain: false,
		loading: false
	}
}

export default {
		namespaced:true,
		state: {
			all: [],
			audits: [],
			projects: [],
			domain: false,
			loading: false
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
				
				Request.getPromise(`${rootState.auth.userAPI}/${args.account_id}/projects/${args.id}`)
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
			createDomain({state, rootState}, args){
				state.loading = true;
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/domains`, {
					params: {
						domain: args.domain
					}
				})
				.then( re=>{
					if( args.vm ){
						args.vm.domain = re.data.details
						args.vm.complete = true
					}
				})
				.catch( re=>{
					console.log(re);
				})
				.then( ()=>{
					state.loading = false;
				})
			},
			getProjects({state, dispatch, rootState, rootGetters}, args = {}){
				state.loading = true
				let url = `${rootState.auth.userAPI}/${rootState.auth.account}/projects`
				
				if( rootGetters["auth/isManager"] ){
					url = `${rootState.auth.adminAPI}/${rootState.auth.account}/projects`
				}
				
				Request.getPromise(url)
				.then( re => {
					state.projects = re.data.details
					if( args.project_id ){
						dispatch("getProjectDomains", {project_id: args.project_id, client_id: rootState.clients.client.id})
					}
					else{
						dispatch("getProjectDomains", {project_id: state.projects[0].id, client_id: rootState.clients.client.id})
					}
					
				})
				.catch( error => {
					state.loading = false
					console.log(error);
				})
			},
			getProjectDomains({state, rootState}, args){
				state.loading = true
				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.project_id}/projectDomains`)
				.then( re => {
					if( args.project ){
						args.project.domains = re.data.details
					}
					state.all = re.data.details
				})
				.catch( error => {
					state.loading = false
					console.log(error);
				})
				.then( ()=>{
					state.loading = false
				})
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
			updateStructuredSampleItem({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.item.domain_id}/item/${args.item.id}`, {params: args.item})
				.then( re=>{
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Sample item updated",
							type: "success"
						})
					}
				})
				.catch( re=>{
					console.log(re)
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: "Problem updating the sample item. Please see the console for more information",
							type: "error"
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
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
				Request.get(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.id}`, requestArgs)
			},
			addPageToSitemap({state, rootState}, args){
				state.loading = true
				let requestArgs = {
					params: {
						page: args.page
					}
				}
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.page.domain_id}/page`, requestArgs)
				.then( (response) => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "page saved successfully",
							type: "success"
						})
					}
					state.domain = response.data.details
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error"
						})
					}
				})
				.then( ()=>{
					state.loading = false
					args.vm.page.url = ""
					args.vm.page.description = ""
				})
			},
			removeItemFromSample({state, rootState}, args){
				state.loading = true
				Request.destroyPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.domain_id}/item/${args.item_id}`)
				.then( (response) => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Item deleted",
							type: "success"
						})
					}
					state.domain = response.data.details
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error"
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			},
			removePageFromSitemap({state, rootState}, args){
				state.loading = true
				Request.destroyPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.domain_id}/page/${args.page_id}`)
				.then( (response) => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Page deleted",
							type: "success"
						})
					}
					state.domain = response.data.details
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error"
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			},
			saveSample({state, rootState}, args){
				state.loading = true
				let requestArgs = {}
				if( args.file ){
					let form_data = new FormData()
					form_data.append('sample', args.file)
					form_data.append("domain", args.domain)
					requestArgs.headers = {
						'Content-Type': 'multipart/form-data'
					}
					requestArgs.params = form_data
				}

				if( args.sample ){
					requestArgs.params = {
						"sample": args.sample
					}
				}

				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.id}/sample`, requestArgs)
				.then( re=>{
					state.domain = re.data.details
				})
				.catch(re=>{
					console.log(re);
				})
				.then( ()=>{
					state.loading = false
				})
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
				Request.post(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.id}/sitemap`, requestArgs)
			},
			emptySitemap({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.id}/sitemapEmpty`)
				.then( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Sitemap deleted",
							type: "success"
						})
					}
					state.domain = response.data.details
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error"
						})
					}
				})
				.then( () => {
					state.loading = false
				})
			},
			emptySample({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.id}/sampleEmpty`)
				.then( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Structured sample deleted",
							type: "success"
						})
					}
					state.domain = response.data.details
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error"
						})
					}
				})
				.then( () => {
					state.loading = false
				})
			},
			saveDomain({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.id}`, {params: {domain: args.domain}})
				.then( re=>{
					state.domain = re.data.details
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Domain updated",
							type: "success"
						})
					}
				})
				.catch( re=>{
					console.log(re)
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: re,
							type: "error"
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			},
			getAudits({state, rootState}, args){
				state.loading = true
				Request.getPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/domains/${args.id}/sampleEmpty`)
				.then( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Structured sample deleted",
							type: "success"
						})
					}
					state.domain = response.data.details
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error"
						})
					}
				})
				.then( () => {
					state.loading = false
				})
			},
		},
		getters: { 
			
		},
	}
	