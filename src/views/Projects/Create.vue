<template>
  <div class="projects">
    <Loader v-if="loading"></Loader>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
export default {
    name: 'ProjectCreate',
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
    },
    mounted() {
    },
    components: {
      Loader
    },
}
</script>