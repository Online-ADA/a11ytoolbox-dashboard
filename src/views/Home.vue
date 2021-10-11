<template>
  <div class="flex flex-col items-center justify-center mt-32 container mx-auto">
    <Loader v-if="$store.state.clients.loading || !$store.getters['auth/isAuthenticated']"></Loader>

    <div v-if="message" class="text-red">{{message}}</div>

    <Card class="w-1/2">

      <h1>Welcome to the OnlineADA Toolbox</h1>
      {{$store.state.auth.accounts.find(acc=>acc.id == $store.state.auth.account)}}
    </Card>
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
