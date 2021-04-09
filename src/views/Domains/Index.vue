<template>
    <router-view></router-view>
</template>

<script>

import domains from '../../store/modules/domains'
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
      this.$store.registerModule('domains', domains)
    },
    beforeDestroy(){
      this.$store.unregisterModule("domains")
    },
    mounted() {
    },
    components: {
    },
}
</script>