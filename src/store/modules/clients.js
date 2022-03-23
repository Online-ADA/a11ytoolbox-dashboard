import Vue from 'vue'
import Cookies from '../../services/cookies'

const getDefaultState = () => {
	return {
		all: [],
		projects: [],
		client: false,
		clientID: Cookies.get('toolboxClient'),
		loading: false
	}
}

export default {
	namespaced:true,
	state: {
		all: [],
		projects: [],
		client: false,
		clientID: Cookies.get('toolboxClient'),
		loading: false
	},
	mutations: {
		setState(state,payload) {
			Vue.set(state,payload.key,payload.value)
		},
	},
	actions: {
		resetState (state) {
			Object.assign(state, getDefaultState())
		},
		getProjects({state, rootState}){
			state.loading = true
			
			Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/projects`, {
				params: {
					params: {
						user_id: rootState.auth.user.id
					},
				},
				onSuccess: {
					title: "Success",
					text: "Projects retrieved",
					callback: function(response){
						state.loading = false
						state.projects = response.data.details
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
			})
		},
		getClient({state, rootState}, args){
			state.loading = true
			if ( args.id == -1 )
			{
				state.client = false;
				state.clientID = false;
				state.loading = false;
				Cookies.remove('toolboxClient')
			}
			else {
				Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/clients/${args.id}`, {
					onSuccess: {
						title:'Success',
						text:'Client retrieved',
						callback: function(response){
							state.loading = false
							state.client = response.data.details
							Cookies.set('toolboxClient', state.client.id, 365)
							if( args.callback ){
								args.callback()
							}
						}
					},
					onError: {
						title:'Error',
						text:'Getting this client caused an error',
						callback: function(){
							state.loading = false
						}
					},
					onWarn: {
						title: "Warning",
						text: "There was a problem getting the client",
						callback: function(){
							state.loading = false
						}
					}
				})
			}
		},
		createClient({state, rootState}, args){
			state.loading = true;
			Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/clients`, {
				params:{
					client: args.client
				}
			})
			.then(re=>{
				state.loading = false
				if(re.data.success == '1') {
					state.client = re.data.created
					state.all = re.data.details
					if( args.callback ){
						args.callback()
					}
				}
				if(re.data.success == 'error') {
					Vue.notify({
						title: 'Warning',
						text: re.data.error,
						type: 'warning'
					})
				}
			})
			.catch(re=>{
				console.log(re);
			})
			.finally(()=>{
				state.loading = false
			})
		},
		getClients({state, rootState}){
			state.loading = true
			Request.get(`${rootState.auth.API}/l/${rootState.auth.license.id}/clients`, {
				params: {
					params: {
						user_id: rootState.auth.user.id
					}
				},
				onSuccess: {
					title: "Success",
					text: "Clients retrieved",
					callback: function(response){
						state.loading = false
						state.all = response.data.details
						
						if( state.all.length ){
							if( state.clientID ){
								state.client = state.all.find( (ob) => ob.id == parseInt(state.clientID) )
							}else{
								state.client = state.all[0]
								state.clientID = state.client.id
							}
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
					text: "Failed getting clients",
					callback: function(){
						state.loading = false
					}
				}
			})
		},
		updateClient({state, rootState}, args){
			state.loading = true
			let requestArgs = {
				params: {
					client_id: args.id,
					data: args.client
				},
				onSuccess: {
					title: "Success",
					type: 'success',
					text: "Client updated",
					position: 'bottom right',
					callback: function(){
						state.loading = false
						args.router.push({path: `/clients/${args.id}`})
					}
				},
				onWarn:{
					callback: function(){
						state.loading = false
					}
				},
				onError: {
					title: "Error",
					text: "Failed updating client",
					callback: function(){
						state.loading = false
					}
				}
			};
			Request.post(`${rootState.auth.API}/l/${rootState.auth.license.id}/clients/${args.id}`, requestArgs)
		},
	},
	getters: { 
		
	},
}
	