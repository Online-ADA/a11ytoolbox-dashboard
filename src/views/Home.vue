<template>
  <div class="flex flex-col items-center justify-center mt-32 container mx-auto">
    <Loader v-if="this.$store.state.clients.loading"></Loader>

    <div v-if="message" class="text-red">{{message}}</div>

    <Card class="w-1/2">

      <h1>Welcome to the OnlineADA Toolbox</h1>

      <div class="flex flex-col items-center" v-if="$store.state.auth.user  && !$store.state.auth.account">
        <h2 class="py-3">Choose an Account:</h2>
          <div v-for="account in accountsWithRole" :key="'acct-'+account.id">
            <Button :hover="true" class="my-1" color="white" @click.native.prevent="setAccount(account.id)">
              <div>{{account.name}}</div>
              <small class="pr-1">Roles:</small>
              <span v-for="(role, id) in $store.state.auth.accountsRoles[account.id]" :key="'role'+id">{{role}}<template v-if="id !== $store.state.auth.accountsRoles[account.id].length - 1">,</template></span>
            </Button>
        </div>
      </div>

      <div class="flex flex-col items-center" v-else-if="$store.state.auth.user  && $store.state.auth.account && !$store.state.clients.client">
        <h2 class="py-3">Choose a Client:</h2>
          <div v-for="client in getClients" :key="'client-'+client.id">
            <Button :hover="true" class="my-1" color="white" @click.native.prevent="setClient(client.id)">
              <div>{{client.name}}</div>
            </Button>
        </div>
      </div>

       <div class="flex flex-col items-center" v-else-if="$store.state.auth.user  && this.$store.state.auth.account && $store.state.clients.client">
        <h3>Account: {{ accountsWithRole.find( x => x.id == this.$store.state.auth.account).name }}</h3>
        <h3>Client: {{ $store.state.clients.client.name}}</h3>
      </div>
      

    </Card>
  </div>
</template>

<script>
import admin from '../store/modules/admin'
import Button from '../components/Button'
import Card from '../components/Card'
import Loader from '../components/Loader'

// import A from '../components/Link'
export default {
  name: 'Home',
  data(){
    return {
      message: "",
      date: false
    }
  },
  components: {
    Button,
    Card,
    Loader,
    // A
  },
  methods:{
    setAccount(id){
      this.$store.commit("auth/setState", {key: "account", value: id})
      if( this.$store.getters["auth/isManager"] ){
        if( this.$store.state.admin === undefined ){
          this.$store.registerModule('admin', admin)
        }
        this.$store.dispatch("admin/getProjects", this.$router)
      }else{
        this.$store.unregisterModule("admin")
      }
    },

    setClient(id){
        this.$store.dispatch("clients/getClient", {id: id, vm: this})
    }
  },
  mounted(){
  },
  computed: {
    accountsWithRole(){
      var that = this;
      
      return this.$store.state.auth.accounts.filter( (acc)=>{
        return Object.keys(that.$store.state.auth.accountsRoles).includes(acc.id.toString())
      } )
      
    },
    total(){
      return this.$store.state.auth.token_total_minutes_remaining
    },
    getClients() {
      return this.$store.state.clients.all;
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
