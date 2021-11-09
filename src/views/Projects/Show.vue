<template>
  <div class="p-5">
    <Loader v-if="loading"></Loader>
    <template v-if="project">
      <h1 class="mb-5">Project Overview</h1>
      <div class="flex">
        <div class="w-1/2 flex flex-col mr-5">
          <Card class="mb-5" :center="false" :gutters="false">
            <h2 class="uppercase">Stats</h2>
            <div class="text-lg">16 WCAG Audits</div>
            <div class="text-lg">18 Tools Deployed</div>
            <div class="text-lg">4 Domains</div>
            <div class="text-lg">2 Sitemaps</div>
          </Card>

          <Card :center="false" :gutters="false">
            <h2 class="uppercase">Alerts</h2>
            <div class="text-lg">I'm not entirely sure what is supposed to go here</div>
          </Card>
        </div>
        <div class="w-1/2 flex flex-col">
          <Card :center="false" :gutters="false">
            <h2 class="uppercase">Recommendations</h2>
            <div class="mt-2"><button role="link" @click="$router.push({path: `/projects/${project.id}/edit`})" class="standard">Edit</button> {{project.name}}</div>
          </Card>
        </div>
      </div>
      
    </template>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
import Card from '../../components/Card'
export default {
    data: () => ({}),
    computed: {
      project() {
        let that = this
        if( this.$store.state.projects.all.length ){
          return this.$store.state.projects.all.find(p=>p.id == that.$route.params.id)
        }
        return false
      },
      audits(){
        return this.$store.state.audits.all
      },
      loading(){
        return this.$store.state.domains.loading || this.$store.state.projects.loading || this.$store.state.audits.loading
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
      let that = this
  
      if( this.$store.state.projects.project.id !== this.$route.params.id ){
        this.$store.state.projects.project = this.$store.state.projects.all.find(p=>p.id == that.$route.params.id)
      }
    },
    components: {
      Loader,
      A,
      Card
    },
}
</script>