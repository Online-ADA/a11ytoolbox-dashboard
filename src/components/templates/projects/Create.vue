<template>
  <div class="text-center mt-20">
    <Loader v-if="loading"></Loader>
    <h1>Create new Project</h1>
      
      <Label for="name">Name</Label>
      <TextInput id="name" name="name" v-model="project.name" />
      <Label for="status">Status</Label>
      
      <Select class="mx-auto" :options="statusSrc" v-model="project.status"></Select>

      <Label for="status">Client</Label>
      <!-- <Select class="mx-auto" :options="clientList" v-model="project.client_id"></Select> -->
      <select v-model="project.client_id" class="mx-auto block border cursor-pointer focus:ring-1 outline-none ring-pallette-blue-light p-2 rounded shadow">
        <option :value="option.id" v-for="option in $store.state.clients.all" :key="'client-' + option.id">{{option.name}}</option>
      </select>

      <template v-if="isManager">
        <div class="flex my-3">
          <Card class="w-1/2">
            <h3>Users</h3>
            <ul v-if="unassigned.length">
              <li class="my-2" v-for="(id, index) in unassigned" :key="`unAssignedKey-${index}`">
                <span>{{displayUser(id)}}</span><Button hover="true" class="text-lg leading-4 ml-2" @click.native.prevent="assign(id)">&gt;</Button>
              </li>
            </ul>
          </Card>
          <Card class="w-1/2">
            <h3>Assignees</h3>
            <ul v-if="assigned.length">
              <li class="my-2" v-for="(id, index) in assigned" :key="`AssignedKey-${index}`">
                <Button hover="true" class="text-lg leading-4 mr-2" @click.native.prevent="unassign(id)">&lt;</Button><span>{{displayUser(id)}}</span>
              </li>
            </ul>
          </Card>
        </div>
        
      </template>

      <Button hover="true" @click.native.prevent="createProject">Create</Button>
      
  </div>
</template>

<script>
import Loader from '../../../components/Loader'
import TextInput from '../../../components/TextInput'
import Label from '../../../components/Label'
import Select from '../../../components/Select'
import Button from '../../../components/Button'
import Card from '../../../components/Card'

export default {
    name: 'ProjectCreate',
    props: {
      independent: {
        type: Boolean,
        default: true
      },
    },
    data: () => ({
      statusSrc: [
        {name: 'Active', value:'active'},
        {name:'Inactive', value:'inactive'},
      ],
      unassigned: [],
      assigned: [],
      project: {
        name: "",
        status: "active",
        created_by: "",
        account_id: "",
        client_id: "",
      },
      selectedClient: "",
      complete: false
    }),
    computed: {
      users(){
        console.log("IN USERS COMPUTED", this.$store.state.user.all);
        return this.$store.state.user.all
      },
      loading(){
        if( this.$store.state.projects ){
          return this.$store.state.projects.loading
        }
        return false
      },
      isManager(){
        return this.$store.getters["auth/isManager"]
      },
    },
    watch: {
      complete(newVal){
        if( newVal ){
          this.$emit("complete", {sheet: 'sheet0', key: 'project', data: this.$store.state.projects.project.id, sheetIndex: this.$parent.index})
          this.project.complete = false
        }
      },
      "$store.state.clients.client": function(newVal){
        if( newVal ){
          this.project.client_id = parseInt(this.$store.state.clients.client.id)
        }
      }
    },
    methods: {
      getUsers(){
        if( !this.users.length ){
          this.$store.dispatch("user/getAllAccountUsers", {vm: this})
        }
      },
      displayUser(id){
        console.log("IN DISPLAYUSER", this.users);
        let user = this.users.find( u => u.id == id )
        console.log(user);
        return user != undefined ? `${user.first_name} ${user.last_name}` : false
      },
      assign(id){
        let index = this.unassigned.findIndex( v => v == id )
        let user = this.unassigned.splice(index, 1)[0]
        
        this.assigned.push(user)
      },
      unassign(id){
        let index = this.assigned.findIndex( v => v == id)
        let user = this.assigned.splice(index, 1)[0]
        
        this.unassigned.push(user)
      },
      createProject(){
        this.project.assigned = this.assigned;
        this.$store.dispatch("projects/createProject", {project: this.project, router: this.$router, vm: this})
      }
    },
    created() {},
    mounted() {
      this.project.created_by = this.$store.state.auth.user.id
      this.project.account_id = this.$store.state.auth.account
      this.project.client_id = this.$store.state.clients.client.id
      if( !this.assigned.length ){
        if( !this.$store.state.projects.project ){
          this.getUsers()
        }else{
          this.unassigned = this.$store.state.user.all
        }
      }

      if( !this.independent ){
        this.$emit("initialized", {key: "ProjectCreate", instance: this})
      }
    },
    components: {
      Loader,
      TextInput,
      Label,
      Select,
      Button,
      Card
    },
}
</script>