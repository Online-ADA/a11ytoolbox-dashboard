<template>
  <div class="text-center mt-32 container mx-auto">
    <Card class="max-w-md ml-auto mr-auto">
      <h5>The logged in user is {{user.first_name}} {{user.last_name}}</h5>
      <h6>Your role is: </h6>
      
      <span>{{role}}</span>
    </Card>
    <router-view/>
  </div>
</template>

<script>
import admin from '../../store/modules/admin'
import Card from '../../components/Card'

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
      // this.$store.unregisterModule("admin")
      this.$store.dispatch("admin/resetState")
    },
    mounted() {
    },
    components: { Card },
}
</script>