<template>
  <div class="container mx-auto">
    <div class="w-full flex flex-col justify-center items-center" v-if="users.length">
      <h1>Users on this account:</h1>
      <DT 
      :searchOverride="searchOverride" 
      :searchableProps="searchableProps"
      :items="users" 
      :headers="headers">
        <template v-slot:cells-main>
          <td class="hidden"></td>
        </template>
        <template v-slot:cells-extra="row">
          <th class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{row.data.first_name}}
            </div>
          </th>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{row.data.last_name}}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{row.data.email}}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{row.data.phone}}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="capitalize text-sm text-gray-900">
              {{row.data.role}}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="capitalize text-sm text-gray-900">
              {{row.data.team}}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              <router-link :to="{path: `user/${row.data.id}`}">Edit</router-link>
            </div>
          </td>
        </template>
      </DT>
    </div>
    <template v-if="!loading && !users.length">
      <h2>There are no users</h2>
    </template>
  </div>
</template>

<script>
import DT from '../../../components/DynamicTable.vue'
export default {
    name: 'ManageUsers',
    data: () => ({
      // headers:["First Name", "Last Name", "Email", "Phone", "Role", "Edit"],
      headers:[
        {
          display: "First Name",
          link: "first_name",
          sort: true
        },
        {
          display: "Last Name",
          link: "last_name",
          sort: true
        },
        {
          display: "Email",
          link: "email",
          sort: true
        },
        {
          display: "Phone",
          link: "phone",
          sort: true
        },
        {
          display: "Role",
          link: "role",
          sort: true
        },
        {
          display: "Team",
          link: "team",
          sort: true
        },
        "Edit"
      ],
      searchableProps: [ "role", "team", "first_name", "last_name", "email", "phone" ],
      searchOverride: {
        // role_id: function(context, term, prop, caseSensitive){
        //   if( !caseSensitive ){
        //     return context.$parent.role(prop).toLowerCase().includes( term.toLowerCase() )
        //   }
        //   return context.$parent.role(prop).includes( term )
        // },
      }
    }),
    computed: {
      loading(){
        return this.$store.state.user.loading
      },
      users() {
        if( this.account.pivot.team_id === 1 ){
          return this.$store.state.user.all
        }
        return this.$store.state.user.team_members
      },
      account(){
        return this.$store.getters["auth/account"]
      },
    },
    props: [],
    watch: {
      users:function(newVal){
        if( newVal && newVal.length ){
          for (let x = 0; x < newVal.length; x++) {
            let user = newVal[x];
            
            user.role = this.role(user.roleInfo.role_id)
            user.team = this.team(user.roleInfo.team_id)
          }
        }
      }
    },
    methods: {
      role(id){
        switch(id){
          case 1:
            return "Owner/Manager"
          case 2:
            return "Manager"
          case 3:
            return "Standard"
          case 4:
            return "Limited"
        }
      },
      team(id){
        switch(id){
          case 1:
            return "Executive"
          case 2:
            return "Development"
          case 3:
            return "Design"
          case 4:
            return "Customer Service"
        }
      }
    },
    created() {},
    mounted() {
      if( this.account && this.account.pivot.team_id === 1 ){
        this.$store.dispatch("user/getAllAccountUsers")
      }
      else{
        this.$store.dispatch("user/getTeamMembers", {team: this.account.pivot.team_id})
      }
    },
    components: {
      DT
    },
}
</script>