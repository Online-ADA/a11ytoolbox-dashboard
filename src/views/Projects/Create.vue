<template>
  <div class="text-center mt-3">
    <Loader v-if="loading"></Loader>
    <h1>Create new Project</h1>
      <Form @submit.native.prevent>
        <Label for="name">Name</Label>
        <TextInput id="name" name="name" v-model="project.name" />
        <Label for="status">Status</Label>
        
        <Select class="mx-auto" :options="statusSrc" v-model="project.status"></Select>

        <Button hover="true" @click.native.prevent="createProject">Create</Button>
      </Form>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
import TextInput from '../../components/TextInput'
import Label from '../../components/Label'
import Select from '../../components/Select'
import Form from '../../components/Form'
import Button from '../../components/Button'
export default {
    name: 'ProjectCreate',
    data: () => ({
      statusSrc: [
        {name: 'Active', value:'active'},
        {name:'Inactive', value:'inactive'},
      ],
      project: {
        name: "",
        status: "active",
        created_by: "",
        account_id: ""
      }
    }),
    computed: {
        loading(){
          if( this.$store.state.projects ){
            return this.$store.state.projects.loading
          }
          return false
        }
    },
    props: [],
    watch: {
    },
    methods: {
      createProject(){
        this.$store.dispatch("projects/createProject", {project: this.project, router: this.$router, vm: this})
      }
    },
    created() {
    },
    mounted() {
      this.project.created_by = this.$store.state.auth.user.id
      this.project.account_id = this.$store.state.auth.account
    },
    components: {
      Loader,
      TextInput,
      Label,
      Form,
      Select,
      Button
    },
}
</script>