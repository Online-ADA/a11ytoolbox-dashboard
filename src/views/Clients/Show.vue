<template>
  <div class="text-center mt-32">
    <Loader v-if="loading"></Loader>
    <template v-if="client">
      <A class="pr-3" type='router-link' :to="{path: `/manage/clients/${$route.params.id}/edit`}">Edit Client</A>
      <h2 class="mb-1">{{client.name}}</h2>
      <div class="mb-3">{{client.email}}</div>
      
      <div class="w-full flex">
        <div class="border border-pallette-grey h-auto p-4 rounded w-1/2 text-center mx-1.5">
          <h3>Audits</h3>
          <ul v-if="client.audits.length">
            <li v-for="audit in client.audits" :key="audit.id">
              <A type='router-link' :to="{path: `/audits/${audit.id}`}">{{audit.title}}</A>
            </li>
          </ul>
          <span v-else>There are no audits belonging to this client</span>
        </div>
        <div class="border border-pallette-grey h-auto p-4 rounded w-1/2 text-center mx-1.5">
          <h3>Projects</h3>
          <ul v-if="client.projects.length">
            <li v-for="project in client.projects" :key="project.id">
              <A type='router-link' :to="{path: `/projects/${project.id}`}">{{project.name}}</A>
            </li>
          </ul>
          <span v-else>There are no projects belonging to this client</span>
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
        return this.$store.state.clients.loading
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