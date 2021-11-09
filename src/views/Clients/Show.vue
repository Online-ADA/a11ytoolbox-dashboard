<template>
  <div class="p-5">
    <h1 class="mb-5">Client Overview</h1>
    <div class="flex">
      <div class="w-1/2 flex flex-col mr-5">
        <Card class="mb-5" :center="false" :gutters="false">
          <h2 class="uppercase">Stats</h2>
          <div class="text-lg">8 Projects</div>
          <div class="text-lg">16 WCAG Audits</div>
          <div class="text-lg">4 Domains</div>
        </Card>

        <Card :center="false" :gutters="false">
          <h2 class="uppercase">Alerts</h2>
          <div class="text-lg">I'm not entirely sure what is supposed to go here</div>
        </Card>
      </div>
      <div class="w-1/2 flex flex-col">
        <Card :center="false" :gutters="false">
          <h2 class="uppercase">Recommendations</h2>
          <div class="mt-2"><button @click.prevent class="standard">Create</button> a new project</div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
import Card from '../../components/Card'
export default {
    data: () => ({
    }),
    computed: {
      client() {
        let that = this
        if( this.$store.state.clients.all.length ){
          return this.$store.state.clients.all.find(c=>c.id == that.$route.params.id )
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
    },
    mounted() {
      if( this.$store.state.clients.client.id != this.$route.params.id ){
        this.$store.state.clients.client = this.$store.state.clients.all.find(c=>c.id == this.$route.params.id)
        this.$store.state.clients.clientID = this.$route.params.id
      }
    },
    components: {
      Loader,
      A,
      Card
    },
}
</script>