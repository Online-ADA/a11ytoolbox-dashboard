<template>
  <div class="text-center mt-32">
    <Loader v-if="loading"></Loader>
    <template v-if="project">
      <A type='router-link' :to="{path: `/projects/${$route.params.id}/edit`}">Edit Project</A>
      <h2 class="mb-2">{{project.name}}</h2>
      <p class="text-base mb-3">Status: {{project.status}}</p>
      
      <div class="w-full flex">
        <!-- <div class="border border-pallette-grey h-auto p-4 rounded w-1/2 text-center mx-1.5">
          <h3>Clients</h3>
          <ul>
            <li v-for="client in clients" :key="client.id">
              <A type='router-link' :to="{path: `/clients/${client.id}`}">{{client.name}}</A>
            </li>
          </ul>
        </div> -->
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
      assigned: [],
      unassigned: [],
      users: []
    }),
    computed: {
      project() {
        return this.$store.state.projects.project
      },
      audits(){
        return this.$store.state.projects.project.audits
      },
      // clients(){
      //   return this.$store.state.projects.project.clients
      // },
      loading(){
        if( this.$store.state.projects ){
          return this.$store.state.projects.loading
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
      this.$store.dispatch("projects/getProject", {id: this.$route.params.id, account_id: this.$store.state.auth.account})
    },
    mounted() {
    },
    components: {
      Loader,
      A
    },
}
</script>