
const getDefaultState = () => {
	return {
		loading: false,
		all: [],
		swatch: false
	}
}

export default {
	namespaced:true,
	state: {
		loading: false,
		all: [],
		swatch: false
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
		createSwatch({state, rootState}, args){
			state.loading = true;
			Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/swatch`, {
				params: args.swatch
			})
			.then( re=>{
				rootState.projects.project.swatches.push(re.data.details)
				state.all.push(re.data.details)
				
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
		saveSwatch({state, rootState}, args){
			state.loading = true

			Request.postPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/swatch/${args.swatch.id}`, {
				params: args.swatch
			})
			.then( re => {
				if( args.callback ){
					args.callback(re.data.details)
				}
			})
			.catch( re => {
				console.log(re)
			})
			.then( ()=> state.loading = false)
		},
		getAllSwatches({state, rootState}, args){
			state.loading = true
			Request.getPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/swatch` )
			.then( re => {
				state.all = re.data.details
				if( args.callback ){
					args.callback(re.data.details)
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
		getSwatch({state, rootState}, args){
			state.loading = true
			Request.getPromise( `${rootState.auth.API}/l/${rootState.auth.license.id}/swatch/${args.id}` )
			.then( re => {
				state.swatch = re.data.details
				if( args.callback ){
					args.callback(re.data.details)
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
		destroySwatch({state, rootState}, args){
			state.loading = true
			Request.destroyPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/swatch/${args.id}`)
			.then( re => {
				state.all = re.data.details
				let index = rootState.projects.project.swatches.findIndex( s=>s.id === args.id )
				rootState.projects.project.swatches.splice( index, 1 )
				args.vm.$router.push( {path: `/projects/${rootState.projects.project.id}`} )
			})
			.catch( re => {
				console.log( re );
				
			} )
			.then( ()=> state.loading = false)
		},
	},
	getters: { 
		
	},
}