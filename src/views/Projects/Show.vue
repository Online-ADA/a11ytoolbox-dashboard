<template>
  <div class="projects">
    <Loader v-if="loading"></Loader>
    <template v-if="project">
      <h2>{{project.name}}</h2>
    </template>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
export default {
    name: 'ProjectsIndex',
    data: () => ({
    }),
    computed: {
      project() {
        let repo = this.$store.state.projects.all;
        if(this.$store.getters['auth/isManager']){
          repo = this.$store.state.admin.projects
        }
        if(repo.length){
          return repo.find(p => {
            return p.id == this.$route.params["id"]
          })
        }
        return false
      },
      loading(){
        return this.$store.state.projects.loading
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