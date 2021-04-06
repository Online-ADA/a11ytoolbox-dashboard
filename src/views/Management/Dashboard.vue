<template>
  <div class="text-center mt-32">
    <h5>The logged in user is {{user.first_name}} {{user.last_name}}</h5>
    <h6>Your role is: </h6>
    
    <span>{{role}}</span>
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
            return this.$store.state.auth.accountsRoles[this.$store.state.auth.account][0]
        },
    },
    props: [],
    watch: {
    },
    methods: {
    },
    created() {
      this.$store.registerModule('admin', admin)
    },
    beforeDestroy(){
      this.$store.unregisterModule("admin")
    },
    mounted() {
    },
    components: {},
}
</script>