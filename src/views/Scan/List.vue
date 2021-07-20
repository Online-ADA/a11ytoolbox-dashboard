<template>
    <div class="container mx-auto">
        <Loader v-if="loading"></Loader>
        
        <h1 class="text-center mt-5">Scan History</h1>
        <Label class="text-center" for="projects">Select a project</Label>
        <select class="mx-auto" v-model="project_id" id="projects" name="projects">
            <option :value="project.id" v-for="project in projects" :key="project.id">{{project.name}}</option>
        </select>
        <div v-if="scans && scans.length">
            <h2 class="text-center">Scans run for this project:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Number of issues</th>
                        <th>Domain</th>
                        <th>Number of pages</th>
                        <th>Delete Scan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(scan, id) in scans" :key="id">
                        <td>{{ scan.title }}</td>
                        <td>{{ scan.issues.length }}</td>
                        <td>{{ scan.domain.url }}</td>
                        <td>{{ scan.pages.length }}</td>
                        <td><Button class="ml-2" color="delete" @click.native.prevent="openModal(scan.id)" >delete</Button></td>
                    </tr>
                </tbody>
            </table>
            <ul class="text-center">
                <li v-for="(scan, id) in scans" :key="id">
                    <span class="text-lg">{{scan.title}}</span>
                    <span class="px-3">-</span>
                    <span class="px-3">{{ scan.issues.length }} issues found</span>
                    <!-- <A class="pr-2" type="router-link" :to="{path: `/audits/${audit.id}`}">view</A>
                    <A type="router-link" :to="{path: `/audits/${audit.id}/edit`}">edit</A> -->
                    
                </li>
            </ul>
        </div>
        <div class="text-center" v-if="!loading && !scans.length">
            <h2>There are no scans for this project</h2>
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
                        Delete Scan
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                Are you sure you want to delete this scan? This will delete all associated scan issues. This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button @click="deleteScan" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
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
import projects from '../../store/modules/project'
import Label from '../../components/Label.vue'
import Loader from '../../components/Loader.vue'
import Button from '../../components/Button.vue'
import Modal from '../../components/Modal.vue'

export default {
    data: () => ({
        modalOpen: false,
        deleteID: false,
        project_id: false
    }),
    computed: {
        loading(){
            if( this.$store.state.scan ){
                return this.$store.state.scan.loading
            }
            return false
        },
        scans() {
            if( this.$store.state.scan ){
                // if( this.$store.state.scan.project ){
                //     return this.$store.state.scan.project.scans || []
                // }
                return this.$store.state.scan.all || []
            }
            return []
        },
        projects(){
            return this.$store.state.projects.all || []
        }
    },
    props: [],
    watch: {
        "$store.state.projects.all": function(){
            if( this.$store.state.projects.all.length ){
                this.project_id = this.$store.state.projects.all[0].id
                this.$store.dispatch("scan/getProjectScans", {project_id: this.project_id})
            }
        }
    },
    methods: {
        openModal(id){
            this.deleteID = id
            this.modalOpen = true
        },
        deleteScan(){
            this.modalOpen = false
            this.$store.dispatch("scan/deleteScan", {id: this.deleteID})
        },
        closeModal(){
            this.modalOpen = false
        }
    },
    created() {
        if(this.$store.state.projects === undefined){
            this.$store.registerModule('projects', projects)
        }
        
        this.$store.dispatch("projects/getProjects")
    },
    mounted() {
    },
    components: {
        Label,
        Loader,
        Button,
        Modal
    },
}
</script>