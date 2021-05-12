<template>
    <router-view></router-view>
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
      if(this.$store.state.projects === undefined){
        this.$store.registerModule('projects', projects)
      }
    },
    beforeDestroy(){
      // this.$store.unregisterModule("projects")
      this.$store.dispatch("projects/resetState")
    },
    mounted() {
    },
    components: {
    },
}
</script>