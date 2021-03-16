<template>
  <div class="projects">
    <router-view></router-view>
  </div>
</template>

<script>

import projects from '../../store/modules/project'
export default {
    name: 'ProjectsIndex',
    data: () => ({
    }),
    computed: {
    },
    props: [],
    watch: {
    },
    methods: {
    },
    created() {
      this.$store.registerModule('projects', projects)
      this.$store.dispatch("projects/getProjects", this.$router)
    },
    beforeDestroy(){
      this.$store.unregisterModule("projects")
    },
    mounted() {
    },
    components: {
    },
}
</script>