<template>
  <div class="p-5">
    <Loader v-if="$store.state.clients.loading || !$store.getters['auth/isAuthenticated']"></Loader>

    <div v-if="message" class="text-red-600">{{message}}</div>
    <h1 class="mb-5">Account Overview</h1>
    <div class="flex">
      <div class="w-1/2 flex flex-col mr-5">
        <Card class="mb-5" :center="false" :gutters="false">
          <h2 class="uppercase">Stats</h2>
          <div class="text-lg">7 Clients</div>
          <div class="text-lg">8 Projects</div>
          <div class="text-lg">16 WCAG Audits</div>
          <div class="text-lg">12 Developer Team Members</div>
          <div class="text-lg">7 Design Team Members</div>
          <div class="text-lg">3 Customer Service Team Members</div>
        </Card>

        <Card :center="false" :gutters="false">
          <h2 class="uppercase">Alerts</h2>
          <div class="text-lg">I'm not entirely sure what is supposed to go here</div>
        </Card>
      </div>
      <div class="w-1/2 flex flex-col">
        <Card :center="false" :gutters="false">
          <h2 class="uppercase">Recommendations</h2>
          <div class="text-lg">3 of your domains do not have a sitemap yet</div>
          <div class="mt-2"><button @click.prevent class="standard">Create</button> sitemap for Online ADA</div>
          <div class="mt-2"><button @click.prevent class="standard">Create</button> sitemap for MaxAccess</div>
          <div class="mt-2"><button @click.prevent class="standard">Create</button> sitemap for https://example.com</div>
        </Card>
      </div>
    </div>
    
  </div>
</template>

<script>
import Button from '../components/Button'
import Card from '../components/Card'
import Loader from '../components/Loader'
import A from '../components/Link'

export default {
  name: 'Home',
  data(){
    return {
      message: "",
    }
  },
  components: {
    Button,
    Card,
    Loader,
    A
  },
  methods:{
  },
  mounted(){
    this.$store.state.projects.project = false
  },
  computed: {
    total(){
      return this.$store.state.auth.token_total_minutes_remaining
    },
    getClients() {
      return this.$store.state.clients.all || [];
    }
  },
  watch:{
    "$store.state.auth.authMessage": {
      handler: function(newVal){
        if( newVal ){
          this.message = newVal
          this.$store.state.auth.authMessage = ""
          setTimeout(()=>{
            this.message = ""
          }, 3000)
        }
      }
    },
  }
}
</script>
