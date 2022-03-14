<template>
  <div class="">
    <router-view/>
  </div>
</template>

<script>

export default {
    data: () => ({
    }),
    computed: {
        user() {
            return this.$store.state.auth.user
        },
        role() {
          if( this.$store.state.auth.accountsRoles[this.$store.state.auth.account] ){
            return this.$store.state.auth.accountsRoles[this.$store.state.auth.account][0]
          }
          return false
        },
    },
    props: [],
    watch: {
    },
    methods: {
    },
    created() {
    },
    beforeDestroy(){
      this.$store.dispatch("admin/resetState")
    },
    mounted() {
    },
    components: {},
}
</script>