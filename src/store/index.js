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
import overviewModule from './modules/overview.js'
import mediaAuditsModule from './modules/mediaAudits.js'
import propertiesModule from './modules/properties.js'
import upgradeModule from './modules/upgrade.js'
import swatchModule from './modules/swatch.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth: authModule,
        clients: clientsModule,
        audits: auditsModule,
        mediaAudits: mediaAuditsModule,
        projects: projectsModule,
        domains: domainsModule,
        scan: scanModule,
        admin: adminModule,
        user: userModule,
        overview: overviewModule,
        properties: propertiesModule,
        upgrade: upgradeModule,
        swatch: swatchModule
    }
})