<template>
    <div class="text-center mt-32">
        <Loader v-if="loading"></Loader>
        <template v-if="clients.length">
            <h2>Your Clients:</h2>
            <ul>
                <li v-for="(client, id) in clients" :key="id">
                    <A type="router-link" :to="{path: `${client.id}`}">{{client.name}}</A>
                </li>
            </ul>
        </template>
        <template v-if="!loading && !clients.length">
            <h2>You have no clients</h2>
        </template>
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
    },
    mounted() {
      this.$store.dispatch("clients/getClients", {router: this.$router})
    },
    components: {
      Loader,
      A
    },
}
</script>