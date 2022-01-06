<template>
  <div class="text-center mt-32 container mx-auto">
    <Loader v-if="loading"></Loader>
    <h1>All Audits assigned to {{fullName}}</h1>
    <div class="w-full flex flex-col justify-center items-center" v-if="audits.length">
      
      <!-- Customizing the entire row by leaving the cells-main empty and using the cells-extra slot-->
      <DT :searchableProps="['title', 'status' ]" :headers="headers" :items="audits">
        <template v-slot:cells-main>
          <div class="hidden"></div>
        </template>
        <template v-slot:cells-extra="row">
          <th class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{row.data.title}}</div>
          </th>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="capitalize text-sm text-gray-900">{{statusMap[row.data.status]}}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              <A class="pr-2" type="router-link" :to="{path: `/audits/${row.data.id}`}">view</A>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              <A v-if="!row.data.locked || isManager" type="router-link" :to="{path: `/audits/${row.data.id}/edit`}">edit</A>
              <span v-else><i class="fas fa-lock"></i><span class="sr-only">This audit is locked and cannot be edited except by a manager</span></span>
            </div>
          </td>
        </template>
      </DT>
    </div>
    <div v-if="!loading && !audits.length">
      <h2>There are no audits assigned to {{fullName}}</h2>
    </div>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
import DT from '../../components/DynamicTable'

export default {
    data: ()=>({
        statusMap : {
            in_progress: "In Progress",
            complete: "Completed",
            archived: "Archived"
        },
        headers: [
          "Title", "Status", "View", "Edit"
        ],
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
        },
        isManager(){
          return this.$store.getters["auth/isManager"]
        }
    },
    props: [],
    watch: {
    },
    methods: {
        
    },
    created() {
        if( this.$store.state.audits ){
            this.$store.dispatch("audits/getAudits", this.$router)
        }
    },
    mounted() {
      document.title = "All Audits Assigned to User"
    },
    components: {
      Loader,
      A,
      DT,
    },
}
</script>