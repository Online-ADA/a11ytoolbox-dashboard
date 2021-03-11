import Vue from 'vue'
import Vuex from 'vuex'
import authModule from './modules/auth.js'
import adminModule from './modules/admin.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth: authModule,
        admin: adminModule
    }
})