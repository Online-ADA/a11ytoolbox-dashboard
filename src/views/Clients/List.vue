<template>
    <div class="clients text-center">
        <Loader v-if="loading"></Loader>
        <h1>This is the Clients management page</h1>
        <div v-if="clients.length">
            <h2>Clients on this account:</h2>
            <ul>
                <li v-for="(client, id) in clients" :key="id">
                <A type="router-link" :to="{path: `/manage/clients/${client.id}`}">{{client.name}}</A>
                </li>
            </ul>
        </div>
        <div v-if="!loading && !clients.length">
            <h2>There are no clients on this account</h2>
        </div>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
export default {
    data: () => ({
    }),
    computed: {
        loading(){
          return this.$store.state.clients.loading
        },
        clients() {
          return this.$store.state.clients.all
        },
    },
    props: [],
    watch: {
    },
    methods: {
    },
    created() {
      // this.$store.dispatch("admin/getClients", this.$router)
    },
    mounted() {
      document.title = "Clients Management"
    },
    components: {
      Loader,
      A
    },
}
</script>