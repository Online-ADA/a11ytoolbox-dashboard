<template>
  <div class="text-center mt-32">
    <Loader v-if="loading"></Loader>
    <template v-if="project">
      <A type='router-link' :to="{path: `/projects/${$route.params.id}/edit`}">Edit Project</A>
      <h2 class="mb-2">{{project.name}}</h2>
      <p class="text-base mb-3">Status: {{project.status}}</p>
      
      <div class="w-full flex">
        
        <Card class="flex-1">
          <h3>Audits</h3>
          <ul>
            <li v-for="audit in audits" :key="audit.id">
              <A type='router-link' :to="{path: `/audits/${audit.id}`}">{{audit.title}}</A>
            </li>
          </ul>
        </Card>
        <Card class="flex-1">
          <h3>Domains</h3>
          <ul>
            <li v-for="domain in domains" :key="domain.id">
              <A type='router-link' :to="{path: `/domains/${domain.id}`}">{{domain.url}}</A>
            </li>
          </ul>
        </Card>
      </div>
    </template>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
import Card from '../../components/Card'
export default {
    data: () => ({
      assigned: [],
      unassigned: [],
      users: [],
    }),
    computed: {
      project() {
        return this.$store.state.projects.project
      },
      audits(){
        return this.$store.state.audits.all
      },
      domains(){
        return this.$store.state.domains.all
      },
      // clients(){
      //   return this.$store.state.projects.project.clients
      // },
      loading(){
        return this.$store.state.domains.loading || this.$store.state.projects.loading || this.$store.state.audits.loading
      },
    },
    props: [],
    watch: {
      "$store.state.projects.project": function(newVal){
        if(newVal){
          this.$store.dispatch("domains/getDomains", {project_id: this.$route.params.id, vm: this})
        }
      }
    },
    methods: {
    },
    created() {
      this.$store.dispatch("projects/getProject", {id: this.$route.params.id})
      
    },
    mounted() {
    },
    components: {
      Loader,
      A,
      Card
    },
}
</script>