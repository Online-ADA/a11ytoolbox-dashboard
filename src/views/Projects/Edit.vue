<template>
  <div class="text-center mt-3">
    <Loader v-if="loading || usersLoading"></Loader>
    <h1>{{project.name}}</h1>
      <Form @submit.native.prevent>
        <Label for="name">Name</Label>
        <TextInput id="name" name="name" v-model="project.name" />
        <Label for="status">Status</Label>
        
        <Select class="mx-auto" :options="statusSrc" v-model="project.status"></Select>

        <template v-if="$store.getters['auth/isManager']">
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

        <Button hover="true" @click.native.prevent="saveProject">Save</Button>
      </Form>
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
export default {
    data: () => ({
      statusSrc: [
        {name: 'Active', value:'active'},
        {name:'Inactive', value:'inactive'},
      ],
      users: [],
      unassigned: [],
      assigned: [],
      project: {
        name: "",
        status: "",
        created_by: "",
        account_id: ""
      }
    }),
    computed: {
        loading(){
          return (this.$store.state.projects && this.$store.state.projects.loading) || false
        },
        usersLoading(){
          return (this.$store.state.projects && this.$store.state.projects.usersLoading) || false
        },
        assignees(){
          if( this.$store.state.project.assignees ){
            return this.$store.state.project.assignees
          }
          return []
        }
    },
    props: [],
    watch: {
      "$store.state.projects.project":function(){
        this.$store.dispatch("projects/getUsers", {vm: this})
      }
    },
    methods: {
      displayUser(id){
        let user = this.users.find( u => u.user_id == id )
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
    created() {
    },
    mounted() {
      this.project.created_by = this.$store.state.auth.user.id
      this.$store.dispatch("projects/getProject", {id: this.$route.params.id, vm: this})
    },
    components: {
      Loader,
      TextInput,
      Label,
      Form,
      Select,
      Button,
      Card
    },
}
</script>