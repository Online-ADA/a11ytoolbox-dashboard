<template>
    <div class="container mx-auto">
        <Loader v-if="loading"></Loader>
        
        <div class="w-full flex flex-col justify-center items-center mt-10" v-if="scans && scans.length">
            <h2>Automated Audits Report</h2>
            <DT :searchableProps="['title', 'url']" :items="scans" :headers="headers">
                <template v-slot:cells-main>
                    <div class="hidden"></div>
                </template>
                <template v-slot:cells-extra="row">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{row.data.title}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{row.data.issues_total}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            {{row.data.domain.url}}<template v-if="row.data.domain.root">/{{row.data.domain.root}}</template>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="capitalize text-sm text-gray-900">{{row.data.pages.length}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            <Button class="ml-2" color="delete" @click.native.prevent="openModal(row.data.id)" >delete</Button>
                        </div>
                    </td>
                </template>
            </DT>
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
import Label from '../../components/Label.vue'
import Loader from '../../components/Loader.vue'
import Button from '../../components/Button.vue'
import Modal from '../../components/Modal.vue'
import DT from '../../components/DynamicTable.vue'

export default {
    data: () => ({
        modalOpen: false,
        deleteID: false,
        headers: ["Title", "Number of issues", "Domain", "Number of pages", "Delete Scan"]
    }),
    computed: {
        loading(){
            return this.$store.state.scan.loading
        },
        scans() {
            return this.$store.state.scan.all
        },
    },
    props: [],
    watch: {
        "$store.state.projects.project": function(newVal){
            if( newVal ){
                this.$store.dispatch("scan/getProjectScans", {project_id: newVal.id})
            }
        },
    },
    methods: {
        openModal(id){
            this.deleteID = id
            this.modalOpen = true
        },
        deleteScan(){
            this.modalOpen = false
            this.$store.dispatch("scan/deleteScan", {scan_id: this.deleteID})
        },
        closeModal(){
            this.modalOpen = false
        }
    },
    created() {
    },
    mounted() {
    },
    components: {
        Label,
        Loader,
        Button,
        Modal,
        DT
    },
}
</script>