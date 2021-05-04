<template>
    <router-view></router-view>
</template>

<script>

import audits from '../../store/modules/audits'

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
      if(this.$store.state.audits === undefined){
        this.$store.registerModule('audits', audits)
      }
    },
    beforeDestroy(){
      this.$store.unregisterModule("audits")
    },
    mounted() {
    },
    components: {
    },
}
</script>