<template>
    <div class="projects">
        <Loader v-if="loading"></Loader>
        <div v-if="projects.length">
            <h2>Your Projects:</h2>
            <ul class="list-group">
                <li v-for="(project, id) in projects" :key="id">
                <router-link :to="{path: `projects/${project.id}`}">{{project.name}}</router-link>
                </li>
            </ul>
        </div>
        <div v-if="!loading && !projects.length">
            <h2>You have no projects</h2>
        </div>
    </div>
</template>

<script>
import Loader from '../../components/Loader'
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
    },
    props: [],
    watch: {
    },
    methods: {
    },
    created() {
    },
    mounted() {
    },
    components: {
      Loader
    },
}
</script>