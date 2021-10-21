import Vue from 'vue'
import Vuex from 'vuex'
import authModule from './modules/auth.js'
import adminModule from './modules/admin.js'
import clientsModule from './modules/clients.js'
import auditsModule from './modules/audits.js'
import projectsModule from './modules/project.js'
import domainsModule from './modules/domains.js'
import scanModule from './modules/scan.js'
import userModule from './modules/user.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth: authModule,
        clients: clientsModule,
        audits: auditsModule,
        projects: projectsModule,
        domains: domainsModule,
        scan: scanModule,
        admin: adminModule,
        user: userModule,
    }
})