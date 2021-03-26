<template>
  <div class="users">
    <Loader v-if="loading"></Loader>
    <h1>This is the Projects management page</h1>
    <div v-if="projects.length">
      <h2>Projects on this account:</h2>
      <ul class="list-group">
        <li v-for="(project, id) in projects" :key="id">
          <A type="router-link" :to="{path: `/projects/${project.id}`}">{{project.name}}</A>
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
import A from '../../../components/Link'
export default {
    data: () => ({
    }),
    computed: {
        loading(){
          if( this.$store.state.admin ){
            return this.$store.state.admin.loading.projects
          }
          return false
        },
        projects() {
          if( this.$store.state.admin ){
            return this.$store.state.admin.projects
          }
          return []
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
      Loader,
      A
    },
}
</script>