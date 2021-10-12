<template>
    <router-view></router-view>
</template>

<script>

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
    },
    beforeDestroy(){
      this.$store.dispatch("projects/resetState")
    },
    mounted() {
    },
    components: {
    },
}
</script>