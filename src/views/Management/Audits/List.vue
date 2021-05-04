<template>
  <div class="container mx-auto">
    <Loader v-if="loading"></Loader>
    <h1>This is the Audits management page</h1>
    <div v-if="audits.length">
      <h2>Audits on this account:</h2>
      <ul class="list-group">
        <li v-for="(audit, id) in audits" :key="id">
          <span class="text-lg">{{audit.title}} <span class="capitalize text-xs">({{statusMap[audit.status]}})</span></span>
          <span class="px-3">-</span>
          <A class="pr-2" type="router-link" :to="{path: `/audits/${audit.id}`}">view</A>
          <A type="router-link" :to="{path: `/audits/${audit.id}/edit`}">edit</A>
        </li>
      </ul>
    </div>
    <div v-if="!loading && !audits.length">
      <h2>There are no audits on this account</h2>
    </div>
  </div>
</template>

<script>
import Loader from '../../../components/Loader'
import A from '../../../components/Link'
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
            if( this.$store.state.admin ){
                return this.$store.state.admin.loading.audits
            }
            return false
        },
        audits() {
            if( this.$store.state.admin ){
                return this.$store.state.admin.audits
            }
            return []
        },
    },
    props: [],
    watch: {
    },
    methods: {
        
    },
    created() {
        this.$store.dispatch("admin/getAudits", this.$router)
    },
    mounted() {
    },
    components: {
      Loader,
      A
    },
}
</script>