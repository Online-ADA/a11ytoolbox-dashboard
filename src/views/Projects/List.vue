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
export default {
    name: 'ProjectsList',
    data: () => ({
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
        this.$store.dispatch("projects/getProjects", {router: this.$router})
    },
    components: {
      Loader,
      A
    },
}
</script>