<template>
  <div class="flex justify-center mt-32">
    <Card v-if="client" class="w-1/2">

      <h1>Client Overview Page for {{client.name}}</h1>
      
    </Card>
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