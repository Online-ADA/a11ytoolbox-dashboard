<template>
  <div>
    <Loader v-if="loading"></Loader>
    <template v-if="project">
      <h1 class="mb-5 headline">Project Overview</h1>
      <div class="flex">
        <div class="w-1/2 flex flex-col mr-5">
          <Card class="mb-5" :center="false" :gutters="false">
            <h2 class="headline-2">Stats</h2>
            <div class="text-lg">{{audits.length}} WCAG Audit<template v-if="audits.length !== 1">s</template></div>
            <div class="text-lg">{{totalToolsDeployed}} Tool<template v-if="totalToolsDeployed !== 1">s</template> Deployed</div>
            <div class="text-lg">{{totalDomains}} Domain<template v-if="totalDomains !== 1">s</template></div>
            <div class="text-lg">{{totalSitemaps}} Sitemap<template v-if="totalSitemaps !== 1">s</template></div>
          </Card>

          <Card :center="false" :gutters="false">
            <h2 class="headline-2">Alerts</h2>
            <div class="text-lg">There are no alerts at this time</div>
          </Card>
        </div>
        <div class="w-1/2 flex flex-col">
          <Card :center="false" :gutters="false">
            <h2 class="headline-2">Recommendations</h2>
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
        return this.$store.state.projects.project.audits
      },
      loading(){
        return this.$store.state.domains.loading || this.$store.state.projects.loading || this.$store.state.audits.loading
      },
      totalToolsDeployed(){
        //When more tools arrive, audits + those
        return this.audits.length
      },
      totalDomains(){
        return this.project.domains.length
      },
      totalSitemaps(){
        let total = 0
        for (let x = 0; x < this.project.domains.length; x++) {
          let domain = this.project.domains[x];
          if( domain.pages.length ){
            total++
          }
        }

        return total
      }
    },
    props: [],
    watch: {
    },
    methods: {
    },
    created() {
    },
    mounted() {
      document.title = "Project Overview"
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