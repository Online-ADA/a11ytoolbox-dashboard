<template>
  <div class="manage">
    <router-link class="nav-link" to="/manage/users">Manage Users</router-link>
    <h1>This is the management dashboard</h1>
    <h2>The logged in user is {{user.first_name}} {{user.last_name}}</h2>
    <h3>Your roles are: </h3>
    
    <ul class="list-group">
      <li v-for="role in roles" :key="role.id">{{role}}</li>
    </ul>
    <router-view/>
  </div>
</template>

<script>

export default {
    name: 'Dashboard',
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
    },
    mounted() {
    },
    components: {},
}
</script>