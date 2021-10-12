<template>
  <ProjectCreate :independent="true"></ProjectCreate>
</template>

<script>
import ProjectCreate from '../../components/templates/projects/Create'
export default {
    data: () => ({
      
    }),
    computed: {
        
    },
    props: [],
    watch: {
      
    },
    methods: {
    },
    mounted() {
      console.log("HELLO WORLD");
    },
    components: {
      ProjectCreate
    },
}
</script>