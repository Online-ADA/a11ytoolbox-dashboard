import Vue from 'vue'

const getDefaultState = () => {
	return {
		loading: false
	}
}

export default {
	namespaced:true,
	state: {
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
        
		// getDomainsForLicense({state, rootState}, args){
		// 	state.loading = true
			
		// 	Request.getPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/projects/${args.project_id}/scans` )
		// 	.then( re => state.all = re.data.details )
		// 	.catch( re => {
		// 		console.log(re)
		// 	})
		// 	.then( ()=> state.loading = false)
		// },
		// getSoftwareForLicense({state, rootState}, args){
		// 	state.loading = true
			
		// 	Request.getPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/projects/${args.project_id}/scans` )
		// 	.then( re => state.all = re.data.details )
		// 	.catch( re => {
		// 		console.log(re)
		// 	})
		// 	.then( ()=> state.loading = false)
		// },
		//Just does getDomainsForLicense and getSoftwareForLicense in 1 call
		getAllPropertiesForLicense({state, rootState}, args){
			state.loading = true
			
			Request.getPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/properties` )
			.then( re => {
				if( args.callbacks && args.callbacks.success ){
					args.callbacks.success(re.data.details)
				}
			})
			.catch( re => {
				console.log(re)
				if( args.callbacks && args.callbacks.fail ){
					args.callbacks.fail()
				}
			})
			.then( ()=> state.loading = false)
		},
		getAllAuditsForLicense({state, rootState}, args){
			state.loading = true
			
			Request.getPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/properties/audits` )
			.then( re => {
				if( args.callbacks && args.callbacks.success ){
					args.callbacks.success(re.data.details)
				}
			})
			.catch( re => {
				console.log(re)
				if( args.callbacks && args.callbacks.fail ){
					args.callbacks.fail()
				}
			})
			.then( ()=> state.loading = false)
		},
		getSoftware({state, rootState}, args){
			state.loading = true
			Request.getPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/properties/${args.id}` )
			.then( re => {
				// if( args.callbacks && args.callbacks.success ){
				// 	args.callbacks.success(re.data.details)
				// }
			})
			.catch( re => {
				console.log(re)
				// if( args.callbacks && args.callbacks.fail ){
				// 	args.callbacks.fail()
				// }
			})
			.then( ()=> state.loading = false)
		},
		destroySoftware({state, rootState}, args){
			state.loading = true
			Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/properties/${args.id}`)
			.then( re => {
				if( args.successCallback ){
					args.successCallback(re.data.details)
				}
			})
			.catch( re => {
				console.log( re );
				if( args.failCallback ){
					args.failCallback(re)
				}
			} )
			.then( ()=> state.loading.articles = false)
		}
	},
	getters: { 
		
	},
}