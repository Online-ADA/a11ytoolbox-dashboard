<template>
    <div class="text-center container mx-auto">
        <Loader v-if="loading"></Loader>
        <div class="w-full flex flex-col justify-center items-center" v-if="projects.length">
            <h2>Your Projects:</h2>
            <DT :searchableProps="['name', 'status' ]" :headers="headers" :items="projects">
                <template v-slot:cells-main>
                    <div class="hidden"></div>
                </template>
                <template v-slot:cells-extra="row">
                    <th class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{row.data.name}}</div>
                    </th>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="capitalize text-sm text-gray-900">{{row.data.status}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            <A class="pr-2" type="router-link" :to="{path: `/projects/${row.data.id}`}">view</A>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            <A type="router-link" :to="{path: `/projects/${row.data.id}/edit`}">edit</A>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            <A title="Create an audit" aria-label="Create an audit" type="router-link" :to="{path: `/audits/create/${row.data.id}`}"><i class="fas fa-clipboard-list"></i></A>
                        </div>
                    </td>
                </template>
            </DT>
        </div>
        <template v-if="!loading && !projects.length">
            <h2>You have no projects</h2>
        </template>
    </div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
import DT from '../../components/DynamicTable'
import clients from '../../store/modules/clients'
export default {
    name: 'ProjectsList',
    data: () => ({
        headers: ["Name", "Status", "View", "Edit", "Create New Audit"],
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
        document.title = "Projects Assigned to User"
    },
    components: {
      Loader,
      A,
      DT
    },
}
</script>