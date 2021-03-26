<template>
    <router-view></router-view>
</template>

<script>

import clients from '../../store/modules/clients'
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
      this.$store.registerModule('clients', clients)
    },
    beforeDestroy(){
      this.$store.unregisterModule("clients")
    },
    mounted() {
    },
    components: {
    },
}
</script>