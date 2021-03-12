<template>
  <div class="users">
    <h1>This is the Users management page</h1>
    <h2>Users on this account:</h2>
    <ul class="list-group">
      <li v-for="(user, id) in users" :key="id">
        <router-link :to="{path: `user/${user.id}`}">{{user.first_name}} {{user.last_name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
    name: 'ManageUsers',
    data: () => ({
    }),
    computed: {
        users() {
            return this.$store.state.admin.users
        },
    },
    props: [],
    watch: {
    },
    methods: {
    },
    created() {
      this.$store.dispatch("admin/getUsers", this.$router)
    },
    mounted() {
    },
    components: {},
}
</script>