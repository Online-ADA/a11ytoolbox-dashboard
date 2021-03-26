<template>
  <div class="text-center mt-32">
    <h5>The logged in user is {{user.first_name}} {{user.last_name}}</h5>
    <h6>Your roles are: </h6>
    
    <ul class="list-group">
      <li v-for="role in roles" :key="role.id">{{role}}</li>
    </ul>
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
        roles() {
            return this.$store.state.auth.accountsRoles[this.$store.state.auth.account]
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