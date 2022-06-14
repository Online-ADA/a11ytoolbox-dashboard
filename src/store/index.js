import Vue from 'vue';
import Vuex from 'vuex';
import authModule from './modules/auth';
import adminModule from './modules/admin';
import clientsModule from './modules/clients';
import auditsModule from './modules/audits';
import projectsModule from './modules/project';
import domainsModule from './modules/domains';
import scanModule from './modules/scan';
import userModule from './modules/user';
import overviewModule from './modules/overview';
import mediaAuditsModule from './modules/mediaAudits';
import propertiesModule from './modules/properties';
import upgradeModule from './modules/upgrade';
import swatchModule from './modules/swatch';

Vue.use(Vuex);

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
    swatch: swatchModule,
  },
});
