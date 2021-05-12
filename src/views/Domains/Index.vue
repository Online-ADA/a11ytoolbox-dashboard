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
      if( !this.$store.state.domains){
        this.$store.registerModule('domains', domains)
      }
    },
    beforeDestroy(){
      // this.$store.unregisterModule("domains")
      this.$store.dispatch("domains/resetState")
    },
    mounted() {
    },
    components: {
    },
}
</script>