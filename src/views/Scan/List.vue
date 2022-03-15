<template>
    <div class="">
        <Loader v-if="loading"></Loader>
        
        <div class="w-full flex flex-col mt-10" v-if="scans && scans.length">
            <h2 class="headline">Automated Audit Logs</h2>
            <DT width="500px" :fixed="true" :searchableProps="['title', 'url']" :items="scans" :headers="headers">
                <template v-slot:cells-main>
                    <div class="hidden"></div>
                </template>
                <template v-slot:cells-extra="row">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{row.data.title}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{row.data.total_issues}}</div>
                    </td>
                    <td class="px-6 py-4 break-all">
                        <div class="text-sm text-gray-900">
                            <template v-if="row.data.domain && row.data.domain.url">
                                {{row.data.domain.url}}<template v-if="row.data.domain.root">/{{row.data.domain.root}}</template>
                            </template>
                            <template v-else>Domain Deleted</template>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="capitalize text-sm text-gray-900">{{totalPages(row.data.pages)}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            {{appendedOrNew(row.data)}}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            <template v-if="row.data.appends == 0">N/A</template>
                            <template v-else-if="associatedAudit(row.data.appends)">
                                <router-link :to="`/audits/${row.data.appends}`">{{associatedAudit(row.data.appends).title}}</router-link>
                            </template>
                            <template v-else>Audit Deleted</template>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            {{row.data.process_complete ? "True" : "False"}}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            <button @click.prevent="showLog($event, row.data.failed_urls )" class="standard">View Log</button>
                        </div>
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                            <button class="ml-2 standard alert" @click.prevent="openModal(row.data.id)" >delete</button>
                        </div>
                    </td>
                </template>
            </DT>
        </div>
        <div class="text-center" v-if="!loading && !scans.length">
            <h2>There are no automated audits for this license</h2>
        </div>
        
        <Modal :open="deleteModalOpen">
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

        <Modal :open="logModalOpen">
            <div class="p-4">
                <h2 class="subheadline">Failed Url Log</h2>
                <ul class="max-h-[600px] overflow-y-auto">
                    <li v-for="(failure, index) in failData" :key="`failure-${index}`">
                        <h3 class="headline-2">{{failure.page}}</h3>
                        <ul class="pl-4">
                            <li style="list-style-type: square;" class="text-sm" v-for="(item, subIndex) in failure.log" :key="`failureData-${subIndex}`">
                                {{item}}
                            </li>
                        </ul>
                    </li>
                </ul>
                <button @click="closeLog" class="standard mt-4">Close</button>
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
import { EventBus } from "../../services/eventBus"

export default {
    data: () => ({
        deleteModalOpen: false,
        deleteID: false,
        headers: [
            {display: "Title", width:"200px"}, 
            {display:"Number of issues", width:"100px"}, 
            {display:"Domain", width:"300px"}, 
            {display:"Number of Pages", width:"100px"}, 
            "Appended or New", 
            "Associated Audit", 
            "Finished", 
            "Errors", 
            "Delete Automation"
        ],
        failData: false,
        logModalOpen: false
    }),
    computed: {
        loading(){
            return this.$store.state.scan.loading
        },
        scans() {
            return this.$store.state.scan.all
        },
        audits(){
            return this.$store.state.projects.project.audits
        }
    },
    props: [],
    watch: {
        // "$store.state.projects.project": function(newVal){
        //     if( newVal ){
        //         this.$store.dispatch("scan/getProjectScans", {project_id: newVal.id})
        //     }
        // },
    },
    methods: {
        showLog($ev, data){
            EventBus.openModal(false, $ev.target, ()=>{
                this.logModalOpen = true
                this.failData = data
            })
        },
        closeLog(){
            EventBus.closeModal(()=>{
                this.logModalOpen = false
                this.failData = false
            })
        },
        openModal(id){
            this.deleteID = id
            this.deleteModalOpen = true
        },
        deleteScan(){
            this.deleteModalOpen = false
            this.$store.dispatch("scan/deleteScan", {scan_id: this.deleteID})
        },
        closeModal(){
            this.deleteModalOpen = false
        },
        totalPages(data){
            if( data.queued == undefined ){
                return data.length
            }
            return Object.keys(data.queued).length + Object.keys(data.completed).length;
        },
        associatedAudit(id){
            let audit = this.audits.find(a=>a.id == id)
            if( audit ){
                return audit
            }

            return false
        },
        appendedOrNew(data){
            if( data.appends == 0 ){
                return "New"
            }

            return "Appended"
        },
    },
    created() {
    },
    mounted() {
        document.title = "Automated Audits Management"
        this.$store.dispatch("scan/getAccountScans")
        // if( this.$store.state.projects.project ){
        //     this.$store.dispatch("scan/getProjectScans", {project_id: this.$store.state.projects.project.id})
        // }
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