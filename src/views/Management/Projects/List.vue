<template>
  <div class="users">
    <Loader v-if="loading"></Loader>
    <h1>This is the Projects management page</h1>
    <div v-if="projects.length">
      <h2>Projects on this account:</h2>
      <ul class="list-group">
        <li v-for="(project, id) in projects" :key="id">
          <router-link :to="{path: `/projects/${project.id}`}">{{project.name}}</router-link>
        </li>
      </ul>
    </div>
    <div v-if="!loading && !projects.length">
      <h2>There are no projects on this account</h2>
    </div>
  </div>
</template>

<script>
import Loader from '../../../components/Loader'
export default {
    name: 'ManageProjects',
    data: () => ({
    }),
    computed: {
        loading(){
          return this.$store.state.admin.loading.projects
        },
        projects() {
          return this.$store.state.admin.projects
        },
    },
    props: [],
    watch: {
    },
    methods: {
    },
    created() {
      this.$store.dispatch("admin/getProjects", this.$router)
    },
    mounted() {
    },
    components: {
      Loader
    },
}
</script>