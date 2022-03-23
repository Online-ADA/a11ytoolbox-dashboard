import Vue from 'vue'

const getDefaultState = () => {
	return {
		loading: false,
        trigger: false,
        message: '',
        license: false,
        tier: false,
        tier_data: false,
        payments: [],
        authdotnet: {},
	}
}
export default {
	namespaced:true,
	state: {
		loading: false,
        trigger: false,
        message: '',
        license: false,
        tier: false,
        tier_data: false,
        payments: [],
        authdotnet: {},
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
        GetPayments({state,rootState},args) {
            state.loading = true
            Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/upgrade/payment`)
            .then( re=>{
                if(re.data.success =='1') {
                    state.payments = re.data.details.payments
                    if(args.Success) args.Success(re.data)
                }else if(re.data.success == '0' && ( re.data.details == 'incorrect_team' || re.data.details == 'incorrect_role' )) {
                    state.message = "You do not have proper permissions to upgrade this license."
                }
            })
            .catch( re=>{
                console.log(re);
            })
            .then( ()=> state.loading = false)
        },
        GetLicense({state,rootState}) {
            state.loading = true
            Request.getPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/upgrade/license`)
            .then( re=>{
                if(re.data.success =='1') {
                    state.license = re.data.license_data.license
                    state.tier = re.data.license_data.tier
                    state.tier_data = re.data.license_data.tier_data
                }else if(re.data.success == '0' && ( re.data.details == 'incorrect_team' || re.data.details == 'incorrect_role' )) {
                    state.message = "You do not have proper permissions to upgrade this license."
                }
            })
            .catch( re=>{
                console.log(re);
            })
            .then( ()=> state.loading = false)
        },
        UpgradeLicense({state,rootState},args) {
            state.loading = true
            Request.postPromise(`${rootState.auth.API}/l/${rootState.auth.license.id}/upgrade/license`,{params:{
                upgrade: args.upgrade
            }})
            .then( re=>{
                if(re.data.success =='1') {
                    if(args.Success) args.Success(re.data)
                }else if(re.data.success == '0' && ( re.data.details == 'incorrect_role' || re.data.details == 'incorrect_team' ) ) {
                    if(args.Failure) args.Failure(re)
                    Vue.notify({
                        title: "ERROR",
                        text: "You are not allowed to do perform this action.",
                        type: "error",
                        position: 'bottom right'
                    })
                }else{
                    if(args.Failure) args.Failure(re)
                    Vue.notify({
                        title: "ERROR",
                        text: re.data.message,
                        type: "error",
                        position: 'bottom right'
                    })
                }
            })
            .catch( re=>{
                if(args.Failure) args.Failure(re)
                Vue.notify({
                    title: "ERROR",
                    text: re,
                    type: "error",
                    position: 'bottom right'
                })
            })
            .then( ()=> state.loading = false)
        },
        AuthDotNet({state,commit,rootState}) {
            Request.getPromise(`${rootState.auth.accapi}/api/authdotnet`)
            .then( re=>{
                if(re.data.success == '1'){                  
                    commit('setState',{
                        key: 'authdotnet',
                        value: {
                            clientKey: re.data.client_key,
                            apiLoginID: re.data.api_login,
                    }})
                }
            })
            .catch( re=>{
                console.log(re);
            })
            .then( ()=> state.loading = false)
        },
        CreatePaymentMethod({state,commit,rootState}) {
            Request.postPromise(`${rootState.auth.accapi}/api/methods/create`,{
                params: {

                },
            })
            .then( re=>{
                if(re.data.success == '1'){                  

                }
            })
            .catch( re=>{
                console.log(re);
            })
            .then( ()=> state.loading = false)
        },
	},
	getters: { 
		
	},
}