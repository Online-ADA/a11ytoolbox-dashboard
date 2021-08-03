<template>
    <div class="text-center mt-32 container mx-auto">
        <Loader v-if="loading"></Loader>
        <div class="w-full flex flex-col justify-center items-center" v-if="projects.length">
            <h2>Your Projects:</h2>
            <DT :searchableProps="['name', 'status' ]" :headers="headers" :items="projects">
                <template v-slot:cells-main>
                    <div class="hidden"></div>
                </template>
                <template v-slot:cells-extra="row">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{row.data.name}}</div>
                    </td>
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
export default {
    name: 'ProjectsList',
    data: () => ({
        headers: ["Name", "Status", "View", "Edit", "Create New Audit"],
    }),
    computed: {
        loading(){
            return this.$store.state.projects.loading
        },
        projects() {
            return this.$store.state.projects.all
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
    },
    mounted() {
        this.$store.dispatch("projects/getProjects")
    },
    components: {
      Loader,
      A,
      DT
    },
}
</script>