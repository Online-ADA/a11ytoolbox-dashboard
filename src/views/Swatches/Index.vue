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
      this.$store.dispatch("swatch/resetState")
    },
    mounted() {
    },
    components: {
    },
}
</script>