<template>
  <div class="manage">
    <h1>This is the management dashboard</h1>
    <h2>The logged in user is {{user.first_name}} {{user.last_name}}</h2>
    <h3>Your roles are: </h3>
    <ul>
      <li v-for="role in roles" :key="role.id"></li>
    </ul>
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
            return this.$store.state.auth.roles
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