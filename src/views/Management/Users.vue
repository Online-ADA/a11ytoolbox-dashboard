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
        user() {
            return this.$store.state.auth.user
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