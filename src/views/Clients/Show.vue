<template>
  <div>
    <h1 class="mb-5 headline">Client Overview</h1>
    <div class="flex">
      <div class="w-1/2 flex flex-col mr-5">
        <Card class="mb-5" :center="false" :gutters="false">
          <h2 class="subheadline">Stats</h2>
          <div class="text-lg">{{totalProjects}} Project<template v-if="totalProjects !== 1">s</template></div>
          <div class="text-lg">{{totalWCAGAudits}} WCAG Audit<template v-if="totalWCAGAudits !== 1">s</template></div>
          <div class="text-lg">{{totalDomains}} Domain<template v-if="totalDomains !== 1">s</template></div>
        </Card>

        <Card :center="false" :gutters="false">
          <h2 class="subheadline">Alerts</h2>
          <div class="text-lg">There are no alerts at this time</div>
        </Card>
      </div>
      <div class="w-1/2 flex flex-col">
        <Card :center="false" :gutters="false">
          <h2 class="subheadline">Recommendations</h2>
          <div class="mt-2"><button role="link" @click="EventBus.openModal('createProjectModal', $event)" @click.prevent class="standard">Create</button> a new project</div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
import Card from '../../components/Card'
import { EventBus } from "../../services/eventBus"

export default {
    data: () => ({
      EventBus: EventBus
    }),
    computed: {
      client() {
        let that = this
        if( this.$store.state.clients.all.length ){
          return this.$store.state.clients.all.find(c=>c.id == that.$route.params.id )
        }
        return false
      },
      totalProjects(){
        return this.$store.state.projects.all.length
      },
      totalDomains(){
        let total = 0
        for (let x = 0; x < this.$store.state.projects.all.length; x++) {
          let project = this.$store.state.projects.all[x]
          total += project.domains.length
        }

        return total
      },
      totalWCAGAudits(){
        return this.$store.state.audits.all.length || 0
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
      if( this.$store.state.clients.client.id != this.$route.params.id ){
        this.$store.state.clients.client = this.$store.state.clients.all.find(c=>c.id == this.$route.params.id)
        this.$store.state.clients.clientID = this.$route.params.id
      }
      document.title = "Client Overview"
    },
    components: {
      Loader,
      A,
      Card
    },
}
</script>