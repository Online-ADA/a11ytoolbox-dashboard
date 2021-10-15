<template>
  <div class="container mx-auto">
    <h1>This is the Users management page</h1>

    <div class="w-full flex flex-col justify-center items-center" v-if="users.length">
      <h2>Users on this account:</h2>
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
              {{role(row.data.role_id)}}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              <router-link :to="{path: `user/${row.data.user_id}`}">Edit</router-link>
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
        "Edit"
      ],
      searchableProps: [ "role", "first_name", "last_name", "email", "phone" ],
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
        return this.$store.state.admin.users.loading
      },
      users() {
          return this.$store.state.admin.users
      },
    },
    props: [],
    watch: {
      users(){
        var x=0,l=this.users.length
        while (x < l) {
          this.users[x].role = this.role(this.users[x].role_id)
          ++x;
        }
      }
    },
    methods: {
      role(id){
        return this.$store.state.admin.roles[id].charAt(0).toUpperCase() + this.$store.state.admin.roles[id].slice(1)
      }
    },
    created() {
      this.$store.dispatch("admin/getUsers", this.$router)
    },
    mounted() {
    },
    components: {
      DT
    },
}
</script>