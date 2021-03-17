<template>
  <div class="projects">
    <Loader v-if="loading"></Loader>
    <h1>Create new Project</h1>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <form class="mt-3 mx-auto" @submit.prevent action="#">
            <div class="row">
              <div class="col-12 text-start">
                <label class="form-label fs-3 fw-bold" for="name">Name</label>
                <input class="form-control" type="text" id="name" v-model="project.name">
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-12 text-start">
                <label class="form-label fs-3 fw-bold" for="status">Status</label>
                <select id="status" class="form-select" aria-label="Select project status" v-model="project.status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <button @click.prevent="createProject" class="btn btn-secondary mt-3">Create</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
export default {
    name: 'ProjectCreate',
    data: () => ({
      project: {
        name: "",
        status: "active",
        created_by: "",
        account_id: ""
      }
    }),
    computed: {
        loading(){
          return this.$store.state.projects.loading
        }
    },
    props: [],
    watch: {
    },
    methods: {
      createProject(){
        this.$store.dispatch("projects/createProject", this.project, this.$router, this)
      }
    },
    created() {
    },
    mounted() {
      this.project.created_by = this.$store.state.auth.user.id
      this.project.account_id = this.$store.state.auth.account
    },
    components: {
      Loader
    },
}
</script>

<style scoped>
  form{
    width:100%;
    max-width:700px;
  }
</style>