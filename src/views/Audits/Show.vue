<template>
  <div class="text-center mt-32">
    <Loader v-if="loading"></Loader>
    <template v-if="client">
      <A class="pr-3" type='router-link' :to="{path: `/clients/${$route.params.id}/edit`}">Edit Client</A>
      <A type='router-link' :to="{path: `/projects/${client.project_id}`}">View Project</A>
      <h2 class="mb-3">{{client.name}}</h2>
      
      <div class="w-full flex">
        <div class="border border-pallette-grey h-auto p-4 rounded w-1/2 text-center mx-1.5">
          <h3>Audits</h3>
          <!-- <ul>
            <li v-for="audit in [{title: 'Audit 1', id: 1}, {title: 'Audit 2', id: 2}]" :key="audit.id">
              <A type='router-link' :to="{path: `/audits/:${id}`}">{{audit.title}}</A>
            </li>
          </ul> -->
        </div>
      </div>

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
      client() {
        return this.$store.state.clients.client
      },
      loading(){
        if( this.$store.state.clients ){
          return this.$store.state.clients.loading
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
      this.$store.dispatch("clients/getClient", {id: this.$route.params.id, account_id: this.$store.state.auth.account})
    },
    mounted() {
    },
    components: {
      Loader,
      A
    },
}
</script>