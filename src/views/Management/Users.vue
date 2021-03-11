<template>
  <div class="users">
    <h1>This is the Users management page</h1>
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