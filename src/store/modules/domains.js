import Vue from 'vue'

const getDefaultState = () => {
	return {
		all: [],
		domain: false,
		loading: false
	}
}

export default {
		namespaced:true,
		state: {
			all: [],
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
			// getProject({state, rootState}, args){
			// 	state.loading = true
				
			// 	Request.getPromise(`${rootState.auth.API}/${args.account_id}/projects/${args.id}`)
			// 	.then( re => {
			// 		state.project = re.data.project[0]
			// 	})
			// 	.catch( re=> {
			// 		console.log(re);
			// 	})
			// 	.then( ()=>{
			// 		state.loading = false
			// 	})
			// },
			deleteDomain({state, rootState}, args){
				state.loading = true
				Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.domain_id}`)
				.then( re => {
					state.loading = false
					state.all = re.data.details
					rootState.projects.project.domains = re.data.details
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Domain deleted",
							type: "success"
						})
					}
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
			createDomain({state, rootState}, args){
				state.loading = true;
				Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains`, {
					params: {
						domain: args.domain
					}
				})
				.then( re=>{
					//Add the new domain to the selected project, NOT THE GLOBAL PROJECT
					// rootState.projects.all.find(p=>p.id == args.domain.project_id).domains.push(re.data.details)
					// rootState.projects.project.domains = [];
					// rootState.projects.project.domains.push(re.data.details);
					
					if( args.callback ){
						args.callback(re.data.details)
					}
				})
				.catch( re=>{
					console.log(re);
				})
				.then( ()=>{
					state.loading = false;
				})
			},
			saveRoot({state, rootState}, args){
				state.loading = true;
				Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.id}/root`, {
					params: {
						root: args.root
					}
				})
				.then( re=>{
					state.domain = re.data.details
				})
				.catch( re=>{
					console.log(re);
				})
				.then( ()=>{
					state.loading = false;
				})
			},
			
			getDomains({state, rootState}, args){
				state.loading = true
				Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/`, {
					params: {
						project_id: args.project_id
					}
				})
				.then( re=>{
					state.all = re.data.details
				})
				.catch( re=> console.log(re))
				.finally( ()=>state.loading = false)
			},
			generateSample({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.domain_id}/items`, {params: {items: args.items}})
				.then( re=>{
					state.domain.sample = re.data.details
				})
				.catch( re=> console.log(re))
				.finally( ()=>state.loading = false)
			},
			updateStructuredSampleItem({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.item.domain_id}/item/${args.item.id}`, {params: args.item})
				.then( re=>{
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Sample item updated",
							type: "success",
							position: 'bottom right'
						})
					}
				})
				.catch( re=>{
					console.log(re)
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: "Problem updating the sample item. Please see the console for more information",
							type: "error",
							position: 'bottom right'
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
						text: "Failed getting projects",
						callback: function(){
							state.loading = false
						},
						position: 'bottom right'
					}
				};
				Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.id}`, requestArgs)
			},
			addPageToSitemap({state, rootState}, args){
				state.loading = true
				let requestArgs = {
					params: {
						page: args.page
					}
				}
				Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.page.domain_id}/page`, requestArgs)
				.then( (response) => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "page saved successfully",
							type: "success",
							position: 'bottom right'
						})
					}
					state.domain = response.data.details
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error",
							position: 'bottom right'
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
				Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.domain_id}/item/${args.item_id}`)
				.then( (response) => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Item deleted",
							type: "success",
							position: 'bottom right'
						})
					}
					state.domain = response.data.details
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error",
							position: 'bottom right'
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			},
			removePageFromSitemap({state, rootState}, args){
				state.loading = true
				Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.domain_id}/page/${args.page_id}`)
				.then( (response) => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Page deleted",
							type: "success",
							position: 'bottom right'
						})
					}
					state.domain = response.data.details
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error",
							position: 'bottom right'
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

				Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.id}/sample`, requestArgs)
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
			generateSitemap({rootState,state},args) {
				state.loading = true 
				Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.id}/sitemapGenerate`)
				.then( (response) => {
					if( !Request.muted() ){
						if(response.data.success == '1') {
							Vue.notify({
								title: "Success",
								text: "Sitemap generation queued",
								type: "success",
								position: 'bottom right'
							})
						}else {
							Vue.notify({
								title: "Error",
								text: response.data.details,
								type: "error",
								position: 'bottom right'
							})
						}
					}
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error",
							position: 'bottom right'
						})
					}
				})
				.then( () => {
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
						text: "Failed saving sitemap",
						callback: function(){
							state.loading = false
						},
						position: 'bottom right'
					}
				};
				Request.post(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.id}/sitemap`, requestArgs)
			},
			emptySitemap({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.id}/sitemapEmpty`)
				.then( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Sitemap deleted",
							type: "success",
							position: 'bottom right'
						})
					}
					state.domain = response.data.details
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error",
							position: 'bottom right'
						})
					}
				})
				.then( () => {
					state.loading = false
				})
			},
			emptySample({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.id}/sampleEmpty`)
				.then( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Structured sample deleted",
							type: "success",
							position: 'bottom right'
						})
					}
					state.domain = response.data.details
				})
				.catch( response => {
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: response.error,
							type: "error",
							position: 'bottom right'
						})
					}
				})
				.then( () => {
					state.loading = false
				})
			},
			saveDomain({state, rootState}, args){
				state.loading = true
				Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/domains/${args.id}`, {params: {domain: args.domain}})
				.then( re=>{
					state.domain = re.data.details
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Domain updated",
							type: "success",
							position: 'bottom right'
						})
					}
				})
				.catch( re=>{
					console.log(re)
					if( !Request.muted() ){
						Vue.notify({
							title: "Error",
							text: re,
							type: "error",
							position: 'bottom right'
						})
					}
				})
				.then( ()=>{
					state.loading = false
				})
			},
			// getAudits({state, rootState}, args){
			// 	state.loading = true
			// 	Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/domains/${args.id}/sampleEmpty`)
			// 	.then( response => {
			// 		if( !Request.muted() ){
			// 			Vue.notify({
			// 				title: "Success",
			// 				text: "Structured sample deleted",
			// 				type: "success",
			// 				position: 'bottom right'
			// 			})
			// 		}
			// 		state.domain = response.data.details
			// 	})
			// 	.catch( response => {
			// 		if( !Request.muted() ){
			// 			Vue.notify({
			// 				title: "Error",
			// 				text: response.error,
			// 				type: "error",
			// 				position: 'bottom right'
			// 			})
			// 		}
			// 	})
			// 	.then( () => {
			// 		state.loading = false
			// 	})
			// },
		},
		getters: { 
			
		},
	}
	