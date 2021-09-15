<template>
    <div class="text-center mt-32">
        <Loader v-if="loading"></Loader>
        
        <template v-if="projects.length">
            <h2>Your Projects:</h2>
            <ul>
                <li v-for="(project, id) in projects" :key="id">
                    <span class="text-lg">{{project.name}}</span>
                    <span class="px-3">-</span>
                    <A class="pr-2" type="router-link" :to="{path: `${project.id}`}">view</A>
                    <A v-if="can" type="router-link" :to="{path: `/projects/${project.id}/edit`}">edit</A>
                    <A class="pl-2" title="Create an audit" aria-label="Create an audit" type="router-link" :to="{path: `/audits/create/${project.id}`}"><i class="fas fa-clipboard-list"></i></A>
                </li>
            </ul>
        </template>
        <template v-if="!loading && !projects.length">
            <h2>You have no projects</h2>
        </template>
    </div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
import clients from '../../store/modules/clients'

export default {
    name: 'ProjectsList',
    data: () => ({
        client: {}
    }),
    computed: {
        loading(){
            if ( this.$store.state.projects.loading )
                return true;
            else if ( this.$store.state.clients.loading )
                return true;
            else
                return false;
        },
        currentClient() {
            if ( this.$store.state.clients.client )
            {
                this.$store.dispatch("projects/getProjects");
                return this.$store.state.clients.client;
            }
            else
                return {}
        },
        projects() {
            if ( this.currentClient )
                return this.$store.state.projects.all
            else
                return {}
        },
        can(){
            return this.$store.state.auth.accountsPermissions[this.$store.state.auth.account].projects.write || this.$store.getters["auth/isManager"]
        }
    },
    props: [],
    watch: {
    },
    methods: {
    },
    created() {
        if(this.$store.state.clients === undefined){
            this.$store.registerModule('clients', clients)
        }
    },
    mounted() {
    },
    components: {
      Loader,
      A
    },
}
</script>