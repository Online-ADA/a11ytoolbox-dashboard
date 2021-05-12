<template>
  <div class="text-center mt-32 container mx-auto">
    <Loader v-if="loading"></Loader>
    <h1>All Audits assigned to {{fullName}}</h1>
    <div class="w-full flex flex-col justify-center items-center" v-if="audits.length">
      <ul>
        <li v-for="(audit, id) in audits" :key="id">
          <span class="text-lg">{{audit.title}} <span class="capitalize text-xs">({{statusMap[audit.status]}})</span></span>
          <span class="px-3">-</span>
          <A class="pr-2" type="router-link" :to="{path: `/audits/${audit.id}`}">view</A>
          <A type="router-link" :to="{path: `/audits/${audit.id}/edit`}">edit</A>
        </li>
      </ul>
    </div>
    <div v-if="!loading && !audits.length">
      <h2>There are no audits assigned to {{fullName}}</h2>
    </div>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
export default {
    data: ()=>({
        statusMap : {
            in_progress: "In Progress",
            complete: "Completed",
            archived: "Archived"
        },
    }),
    computed: {
        loading(){
            if( this.$store.state.audits ){
                return this.$store.state.audits.loading
            }
            return false
        },
        audits() {
            if( this.$store.state.audits ){
                return this.$store.state.audits.all
            }
            return []
        },
        fullName(){
            return this.$store.state.auth.user.first_name + " " + this.$store.state.auth.user.last_name
        }
    },
    props: [],
    watch: {
        audits: function(newVal){
            if( !this.audits.length && newVal ){
                this.$store.dispatch("audits/getAudits", this.$router)
            }
        }
    },
    methods: {
        
    },
    created() {
        if( this.$store.state.audits ){
            this.$store.dispatch("audits/getAudits", this.$router)
        }
    },
    mounted() {
    },
    components: {
      Loader,
      A
    },
}
</script>