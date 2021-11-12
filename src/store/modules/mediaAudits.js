import Vue from 'vue'

const getDefaultState = () => {
	return {
		all: [],
		audit: false,
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
			getAudits({state, rootState}, args, withIssues=false){
				state.loading = true
				Request.getPromise(`${rootState.auth.API}/${rootState.auth.account}/media-audits`, {
					params: {
						clientID: rootState.clients.client.id,
						projectID: args.project_id,
						withIssues: withIssues
					}
				})
				.then( re => {
					state.all = re.data.details
					if( !Request.muted() ){
						Vue.notify({
							title: "Success",
							text: "Audits retrieved",
							type: "success",
							position: 'bottom right'
						})
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
			createAudit({state, rootState}, args){
				state.loading = true;
				Request.postPromise(`${rootState.auth.API}/${rootState.auth.account}/media-audits`, { params: { audit: args.audit } })
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
					if( args.vm ){
						args.vm.complete = true
					}
				})
				.catch(re=>{
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
		},
		getters: { 
			
		},
	}
	