<template>
    <router-view></router-view>
</template>

<script>

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
    created() {
    },
    beforeDestroy(){
      this.$store.dispatch("audits/resetState")
    },
    mounted() {
      this.$store.state.projects.tool.type = 'audit'
    },
    components: {
    },
}
</script>