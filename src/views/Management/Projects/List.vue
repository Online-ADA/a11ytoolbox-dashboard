<template>
  <div class="container mx-auto">
    <Loader v-if="loading"></Loader>
    <h1>This is the Projects management page</h1>
    <div v-if="projects.length">
      <Card class="mt-8 mr-auto ml-auto max-w-lg">
        <h2>Projects on this account:</h2>
        <ul class="list-group">
          <li v-for="(project, id) in projects" :key="id">
            <span class="text-lg">{{project.name}} <span class="capitalize text-xs">({{project.status}})</span></span>
            <span class="px-3">-</span>
            <A class="pr-2" type="router-link" :to="{path: `/projects/${project.id}`}">view</A>
            <A type="router-link" :to="{path: `/projects/${project.id}/edit`}">edit</A>
            <Button class="ml-2" color="delete" @click.native.prevent="openModal(project.id)" >delete</Button>
          </li>
        </ul>
      </Card>
    </div>
    <div v-if="!loading && !projects.length">
      <h2>There are no projects on this account</h2>
    </div>
    <Modal :open="modalOpen">
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
							<!-- Heroicon name: outline/exclamation -->
							<svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
						</div>
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
							Delete Project
							</h3>
							<div class="mt-2">
								<p class="text-sm text-gray-500">
									Are you sure you want to delete this project? This will delete all associated audits as well. This action cannot be undone.
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<button @click="deleteProject" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
					Delete
					</button>
					<button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
					Cancel
					</button>
				</div>
    </Modal>
  </div>
</template>

<script>
import Loader from '../../../components/Loader'
import A from '../../../components/Link'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import Card from '../../../components/Card'

export default {
    data: () => ({
      modalOpen: false,
      deleteID: false
    }),
    computed: {
        loading(){
          if( this.$store.state.admin ){
            return this.$store.state.admin.loading.projects
          }
          return false
        },
        projects() {
          if( this.$store.state.admin ){
            return this.$store.state.admin.projects
          }
          return []
        },
    },
    props: [],
    watch: {
    },
    methods: {
      closeModal(){
        this.modalOpen = false
      },
      openModal(id){
        this.deleteID = id
        this.modalOpen = true
      },
      deleteProject(){
        this.modalOpen = false
        this.$store.dispatch("admin/deleteProject", {project_id: this.deleteID})
      },
    },
    created() {
      this.$store.dispatch("admin/getProjects", this.$router)
    },
    mounted() {
    },
    components: {
      Loader,
      A,
      Button,
      Modal,
      Card
    },
}
</script>