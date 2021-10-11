<template>
  <div class="text-center container mx-auto">
    <router-view/>
  </div>
</template>

<script>
import admin from '../../store/modules/admin'

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
      if( this.$store.state.admin == undefined ){
        this.$store.registerModule('admin', admin)
      }
    },
    beforeDestroy(){
      this.$store.dispatch("admin/resetState")
    },
    mounted() {
    },
    components: {},
}
</script>