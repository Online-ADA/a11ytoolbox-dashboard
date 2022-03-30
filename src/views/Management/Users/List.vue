<template>
  <div class="container flex">
    <div class="w-full flex flex-col" v-if="users.length">
      <h1 class="headline">Users on this License:</h1>
      <div v-if="isExecutive" >
        <button @click="MaybeAddUsers" class="ml-1 text-sm standard" :hover="true">Add Users</button>
        <p>License is using {{users.length}} of it's {{$store.state.user.user_limit}} user<span v-if="$store.state.user.user_limit > 1">s</span> limit</p>
      </div>
      <DT 
      :searchOverride="searchOverride" 
      :searchableProps="searchableProps"
      :items="users" 
      :headers="headers">
        <template v-slot:cells-main>
          <td class="hidden"></td>
        </template>
        <template v-slot:cells-extra="row">
          <td :class="[{'me':row.data.id == $store.state.auth.user.id}]" class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 font-bold">
              {{row.data.first_name}}
            </div>
          </td>
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
          <td v-if="isExecutive" class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 flex justify-center">
              <button @click="RemoveUser(row.data)">Remove</button>
            </div>
          </td>
        </template>
      </DT>
    </div>
    <template v-if="!loading && !users.length">
      <h2>There are no users</h2>
      <div v-if="isExecutive" >
        <button @click="EventBus.openModal('AddUsersToLicenseModal', $event)" class="ml-1 text-sm standard" :hover="true">Add Users</button>
      </div>
    </template>
  </div>
</template>

<script>
import DT from '../../../components/DynamicTable.vue'
import {EventBus} from '../../../services/eventBus'
export default {
    name: 'ManageUsers',
    data: () => ({
      EventBus: EventBus,
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
        "Edit",
      ],
      searchableProps: [ "role", "team", "first_name", "last_name", "email", "phone" ],
      searchOverride: {
      }
    }),
    computed: {
      isExecutive() {
        return this.$store.getters['auth/account'].pivot.team_id == 1
      },
      loading(){
        return this.$store.state.user.loading
      },
      users() {
        if( !this.account ){
          return []
        }
        if( this.account.pivot.team_id === 1 ){
          return this.$store.state.user.all
        }
        let users = []
        for (let x = 0; x < this.$store.state.user.byTeam[this.account.pivot.team_id].length; x++) {
          const user_id = this.$store.state.user.byTeam[this.account.pivot.team_id][x]
          let user = this.$store.state.user.all.find( u=>u.id == user_id)
          users.push(user)
        }
        return users
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
      MaybeAddUsers(evt) {
        if(this.$store.state.user.user_limit == this.users.length) {
            this.$store.commit("upgrade/setState",{key:'trigger',value: 'AddUsers'})
            let plural = this.$store.state.user.user_limit > 1 ? 's' : ''
            this.$store.commit("upgrade/setState",{key:'message',value: `You have reached the maximum of ${this.$store.state.user.user_limit} user${plural} for this license.`})
            this.EventBus.openModal('UpgradeLicenseModal',evt)
        }else{
          this.EventBus.openModal('AddUsersToLicenseModal', evt)
        }
      },
      RemoveUser(user) {
        this.$store.dispatch('admin/removeUser',{user:user,Success:this.UserRemoved})
      },
      UserRemoved() {
        this.$store.dispatch("user/getUsers")
      },
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
    created() {
      if(this.isExecutive) this.headers.push("Remove Access From License")
    },
    mounted() {
      this.$store.dispatch("user/getUsers")
      document.title = "Users Management"
    },
    components: {
      DT
    },
}
</script>