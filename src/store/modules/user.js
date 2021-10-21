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
		uploadAvatar({rootState}, args){
			let form_data = new FormData()
			form_data.append('avatar', args.file)
			Request.postPromise(`${rootState.auth.userAPI}/${rootState.auth.account}/user/avatar`, {params: form_data, headers:{ 'Content-Type': 'multipart/form-data' }})
			.then( re=>{
				Vue.notify({
					title: "Success",
					text: "Avatar has been stored",
					type: "success",
					position: 'bottom right'
				})
				rootState.auth.user = re.data.details
			})
			.catch( re=>console.log(re))
			.then()
		},
	},
	getters: { 
		
	},
}