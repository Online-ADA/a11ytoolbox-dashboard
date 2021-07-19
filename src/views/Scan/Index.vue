<template>
    <router-view></router-view>
</template>

<script>

import scan from '../../store/modules/scan'

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
      if(this.$store.state.scan === undefined){
        this.$store.registerModule('scan', scan)
      }
    },
    beforeDestroy(){
      this.$store.dispatch("scan/resetState")
    },
    mounted() {
    },
    components: {
    },
}
</script>