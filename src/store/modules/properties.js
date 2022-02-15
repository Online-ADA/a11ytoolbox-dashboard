import Vue from 'vue'

const getDefaultState = () => {
	return {
		loading: false,
		all: {
			domains: [],
			software: []
		}
	}
}

export default {
	namespaced:true,
	state: {
		loading: false,
		all: {
			domains: [],
			software: [],
			wcag_audits: [],
			media_audits: []
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
		createSoftware({state, rootState}, args){
			state.loading = true;
			Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/properties`, {
				params: {
					software: args.software
				}
			})
			.then( re=>{
				rootState.projects.project.software.push(software)
				
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
      addScreen({state, rootState}, args){
			state.loading = true

			Request.postPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/properties/${args.software.id}/screen`, {
				params: {screen: args.screen}
			})
			.then( re => {
				if( args.successCallback ){
					args.successCallback(re.data.details)
				}
			})
			.catch( re => {
				console.log(re)
				if( args.failCallback ){
					args.failCallback()
				}
			})
			.then( ()=> state.loading = false)
		},
		saveSoftware({state, rootState}, args){
			state.loading = true

			Request.postPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/properties/${args.software.id}`, {
				params: {software: args.software}
			})
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
		getAllPropertiesForLicense({state, rootState}, args){
			state.loading = true
			
			Request.getPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/properties` )
			.then( re => {
				state.all.software = re.data.details.software
				state.all.domains = re.data.details.domains
			})
			.catch( re => {
				console.log(re)
			})
			.then( ()=> state.loading = false)
		},
		getAllAuditsForLicense({state, rootState}, args){
			state.loading = true
			
			Request.getPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/properties/audits` )
			.then( re => {
				state.all.wcag_audits = re.data.details.wcag
				state.all.media_audits = re.data.details.media
			})
			.catch( re => {
				console.log(re)
				
			})
			.then( ()=> state.loading = false)
		},
		getSoftware({state, rootState}, args){
			state.loading = true
			Request.getPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/properties/${args.id}` )
			.then( re => {
				if( args.successCallback ){
					args.successCallback(re.data.details)
				}
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
				state.all.software = re.data.details
				let index = rootState.projects.project.software.findIndex( s=>s.id === args.id )
				rootState.projects.project.software.splice( index, 1 )
			})
			.catch( re => {
				console.log( re );
				
			} )
			.then( ()=> state.loading = false)
		},
		destroyScreens({state, rootState}, args){
			state.loading = true
			Request.patchPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/properties/${args.software_id}/screens`, {params: {screens: args.screens}})
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
			.then( ()=> state.loading = false)
		}
	},
	getters: { 
		
	},
}