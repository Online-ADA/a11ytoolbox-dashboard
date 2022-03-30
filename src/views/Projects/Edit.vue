<template>
  <div>
    <Loader v-if="loading"></Loader>
    
    <div class="flex justify-between items-center">
      <h1 class="headline">{{$store.state.projects.project.name}}</h1>
      <button v-if="$store.getters['auth/isManager']" @click.prevent="confirmModalOpen = true" title="Delete Project" class="standard alert mt-3" >
        Delete
      </button>
    </div>
    
    <form>
      <Label for="name">Name</Label>
      <TextInput id="name" name="name" v-model="project.name" />

      <Label for="status">Status</Label>
      <Select :options="statusSrc" v-model="project.status"></Select>
      
        <template v-if="$store.getters['auth/isManager']">
          <Label for="status">Client</Label>
          <Select :options="clientList" v-model="project.client_id"></Select>
        </template>

      <template v-if="$store.getters['auth/isManager']">
        <div class="flex my-3">
          <Card :gutters="false" class="w-1/2 mr-2">

            <h3 class="subheadline">Users</h3>
            <ul v-if="unassigned.length">
              <li class="my-2" v-for="(id, index) in unassigned" :key="`unAssignedKey-${index}`">
                <span>{{displayUser(id)}}</span><Button :title="`Assign ${displayUser(id)}`" hover="true" class="text-lg leading-4 ml-2" @click.prevent="assign(id)">&gt;</Button>
              </li>
            </ul>
          </Card>
          <Card :gutters="false" class="w-1/2 ml-2">
            <h3 class="subheadline">Assignees</h3>
            <ul v-if="assigned.length">
              <li class="my-2" v-for="(id, index) in assigned" :key="`AssignedKey-${index}`">
                <Button hover="true" :title="`Unassign ${displayUser(id)}`" class="text-lg leading-4 mr-2" @click.prevent="unassign(id)">&lt;</Button><span>{{displayUser(id)}}</span>
              </li>
            </ul>
          </Card>
        </div>
        
      </template>

      <button class="standard mt-2" hover="true" @click.prevent.stop="saveProject">Save</button>
    </form>

    <Modal class="adjust-with-sidebars" :open="confirmModalOpen">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <!-- Heroicon name: outline/exclamation -->
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 subheadline" id="modal-title">
                  Delete Project
                  </h3>
                  <div class="mt-2">
                      <p class="text-sm text-gray-500">
                          Are you sure you want to delete this project? This will delete all associated domains and tools as well. This action cannot be undone.
                      </p>
                  </div>
              </div>
          </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 px-6 flex flex-row-reverse">
          <button @click="deleteProject" type="button" class="standard alert mr-3.5">
          Delete
          </button>
          <button @click="confirmModalOpen = false" type="button" class="standard">
          Cancel
          </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
import Card from '../../components/Card'
import TextInput from '../../components/TextInput'
import Label from '../../components/Label'
import Select from '../../components/Select'
import Form from '../../components/Form'
import Button from '../../components/Button'
import Modal from '../../components/Modal'

export default {
    data: () => ({
      statusSrc: [
        {name: 'Active', value:'active'},
        {name:'Inactive', value:'inactive'},
      ],
      unassigned: [],
      assigned: [],
      project: {
        name: "",
        status: "",
        created_by: "",
        account_id: "",
        client_id: ""
      },
      confirmModalOpen: false
    }),
    computed: {
        users(){
          return this.$store.state.user.all
        },
        loading(){
          if( this.$store.state.projects ){
            return this.$store.state.projects.loading
          }
          return false
        },
        assignees(){
          if( this.$store.state.project.assignees ){
            return this.$store.state.project.assignees.map(u=>u.id)
          }
          return []
        },
        clientList() {
          var clients = this.$store.state.clients.all;
          var clientList = [];
          for ( var i = 0; i < clients.length; i++ )
          {
            clientList.push({name: clients[i].name, value: clients[i].id});
          }
          return clientList;
        }
    },
    props: [],
    watch: {
      "$store.state.projects.all":function (newVal) {
        if( newVal && newVal.length ){
          this.setProject()
        }
      }
    },
    methods: {
      deleteProject(){
        this.$store.dispatch("projects/deleteProject", {project_id: this.$route.params.id})
        this.$router.push({path: `/`})
      },
      setProject(){
        let that = this
        this.project = this.$store.state.projects.all.find(p=>p.id == that.$route.params.id)
        this.assigned = this.project.assignees.map(u=>u.id)
        this.unassigned = this.users.filter(u=> !that.assigned.includes(u.id)).map(u=>u.id)
      },
      getUsers(){
        if( !this.users.length ){
          this.$store.dispatch("user/getUsers", {vm: this})
        }
      },
      displayUser(id){
        let user = this.users.find( u => u.id == id )
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
      saveProject(){
        this.project["assigned"] = this.assigned
        this.$store.dispatch("projects/updateProject", {project: this.project, router: this.$router, id: this.$route.params.id})
      }
    },
    created() {},
    mounted() {
      this.project.created_by = this.$store.state.auth.user.id
      this.project.account_id = this.$store.state.auth.account
      this.project.client_id = this.$store.state.clients.client.id

      
      if( !this.$store.state.user.all.length ){
        this.getUsers()
      }else{
        this.unassigned = this.$store.state.user.all.map(u=>u.id)
      }
      

      if( this.$store.state.projects.all.length ){
        this.setProject()
      }
      document.title = "Edit Project"
    },
    components: {
      Loader,
      TextInput,
      Label,
      Form,
      Select,
      Button,
      Card,
      Modal
    },
}
</script>