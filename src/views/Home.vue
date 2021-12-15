<template>
  <div class="p-5">
    <Loader v-if="$store.state.clients.loading || !$store.getters['auth/isAuthenticated']"></Loader>

    <div v-if="message" class="text-red-600">{{message}}</div>
    <h1 class="mb-5 headline">Account Overview</h1>
    <div class="flex">
      <div class="w-1/2 flex flex-col mr-5">
        <Card class="mb-5" :center="false" :gutters="false">
          <h2 class="headline-2">Stats</h2>
          <div class="text-lg">{{totalClients}} Client<template v-if="totalClients !== 1">s</template></div>
          <div class="text-lg">{{totalProjects}} Project<template v-if="totalProjects !== 1">s</template></div>
          <div class="text-lg">{{totalWCAGAudits}} WCAG Audit<template v-if="totalWCAGAudits !== 1">s</template></div>
          <div class="text-lg">{{usersData.executive.length}} Executive Team Member<template v-if="usersData.executive.length !== 1">s</template></div>
          <div class="text-lg">{{usersData.development.length}} Developer Team Member<template v-if="usersData.development.length !== 1">s</template></div>
          <div class="text-lg">{{usersData.design.length}} Design Team Member<template v-if="usersData.design.length !== 1">s</template></div>
          <div class="text-lg">{{usersData.customer_service.length}} Customer Service Team Member<template v-if="usersData.customer_service.length !== 1">s</template></div>
        </Card>

        <Card :center="false" :gutters="false">
          <h2 class="headline-2">Alerts</h2>
          <div class="text-lg">There are no alerts at this time</div>
        </Card>
      </div>
      <div class="w-1/2 flex flex-col">
        <Card :center="false" :gutters="false">
          <h2 class="headline-2">Recommendations</h2>
          <template v-if="domainRecommendations.length">
            <div class="text-lg">
              {{domainRecommendations.length}} of your domains <template v-if="domainRecommendations.length !== 1">do</template><template v-else>does</template> not have a sitemap yet
            </div>
            <div v-for="domain in domainRecommendations" :key="`domain-rec-${domain.id}`" class="mt-2">
              <button role="link" @click="$router.push({path: `/domains/${domain.id}/edit`})" class="standard">Create</button> sitemap for {{domain.url}}
            </div>
          </template>
          <template v-else>There are no recommendations at this time</template>
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
      totalWCAGAudits: 0
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
    this.$store.state.overview.refresh.account.audits = true
  },
  computed: {
    usersData(){
      let data = {
        "executive": [],
        "development": [],
        "design":[],
        "customer_service":[]
      }

      if( !this.$store.state.user.all.length ){
        this.$store.dispatch("user/getUsers")
        return data
      }

      for (let x = 0; x < this.$store.state.user.all.length; x++) {
        let user = this.$store.state.user.all[x];
        switch(user.roleInfo.team_id){
          case 1:
            data.executive.push(user)
            break
          case 2:
            data.development.push(user)
            break
          case 3:
            data.design.push(user)
            break
          case 4:
            data.customer_service.push(user)
            break
        }
      }

      return data
    },
    // total(){
    //   return this.$store.state.auth.token_total_minutes_remaining
    // },
    account(){
      return this.$store.getters["auth/account"]
    },
    domainRecommendations(){
      let domainsWithoutSitemap = []
      for (let x = 0; x < this.$store.state.projects.all.length; x++) {
        let project = this.$store.state.projects.all[x];
        if( project.domains == undefined ){
          project.domains = []
        }
        
        for (let y = 0; y < project.domains.length; y++) {
          let domain = project.domains[y];
          if( domain.pages.length < 1 ){
            domainsWithoutSitemap.push(domain)
          }
        }
      }

      return domainsWithoutSitemap
    },
    getClients() {
      return this.$store.state.clients.all.length || [];
    },
    totalClients(){
      return this.$store.state.clients.all.length
    },
    totalProjects(){
      return this.$store.state.projects.all.length
    },
  },
  watch:{
    account:function(){
      if( !this.gettingUsers ){
        this.$store.dispatch("user/getUsers")
        this.gettingUsers = true
      }
    },
    "$store.state.projects.all":function(){
      this.$store.state.overview.refresh.account.audits = true
    },
    // "$store.state.overview.refresh.account.projects":function() {
    //   console.log("firing", this.$store.state.projects.project.audits);
    // },
    "$store.state.overview.refresh.account.audits":function(newVal) {
      //Refreshes the number of audits on the account when the overview refresh property is triggered true
      if( newVal ){
        this.totalWCAGAudits = 0
        for (let x = 0; x < this.$store.state.projects.all.length; x++) {
          let project = this.$store.state.projects.all[x]
          if( project.audits != undefined ){
            this.totalWCAGAudits += project.audits.length
          }else{
            this.totalWCAGAudits += 0
          }
          
        }

        this.$store.state.overview.refresh.account.audits = false
      }
    },
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
