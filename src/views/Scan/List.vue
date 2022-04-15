<template>
    <div class="mt-[-30px]">
        <Loader v-if="loading"></Loader>
        
        <div class="w-full flex flex-col" v-if="scans && scans.length">
            <h2 class="headline">Automated Audit Logs</h2>
            <button v-show="filtering" @click.prevent="filtering=false" class="w-[125px] text-xs flex bg-white rounded-full items-center leading-relaxed">
                <div class="rounded-full bg-[#a3a3a3] w-3 h-3 text-[9px] flex relative mx-[5px]" >
                    <span class="absolute left-1 bottom-0.5 leading-none">x</span>
                </div>
                Remove Filtering
            </button>
            <DT width="500px" :fixed="true" :searchableProps="['title', 'url']" :items="filtering ? filtered : scans" :headers="headers">
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
                    <td class="px-6 py-4 break-all">
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
        
        <Modal class="adjust-with-sidebars" :open="deleteModalOpen">
			<button @click="deleteModalOpen = false" type="button" class="standard absolute top-4 right-4">X</button>
			<div class="bg-white">
				<delete-confirm-icon></delete-confirm-icon>
						
				<h3 class="subheadline" id="modal-title">Delete Scan</h3>
				<div class="mt-2">
					<p>
						Are you sure you want to delete this scan? This will delete all associated scan issues. This action cannot be undone.
					</p>
				</div>
			</div>
			
			<button @click="deleteScan" type="button" class="standard alert mt-2">Delete</button>
		</Modal>

        <Modal :open="logModalOpen">
            <div class="p-4">
                <h2 class="subheadline">Failed Url Log</h2>
                <ul class="max-h-[600px] overflow-y-auto">
                    <li v-for="(failure, index) in failData" :key="`failure-${index}`">
                        <h3 class="subheadline">{{failure.page}}</h3>
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
import DeleteConfirmIcon from '../../components/DeleteConfirmIcon.vue'

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
        logModalOpen: false,
        filtering: false
    }),
    computed: {
        loading(){
            return this.$store.state.scan.loading
        },
        scans(){
            return this.$store.state.scan.all
        },
        audits(){
            return this.$store.state.projects.project.audits
        },
        filtered(){
            let ids = this.$route.params.automations.map((a)=>{ return a.id })
            
            return this.scans.filter((scan)=>{ return ids.includes(scan.id) })
        }
    },
    props: [],
    watch: {},
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
        totalPages(data){
            if( data.queued == undefined ){
                return data.length
            }
            return Object.keys(data.queued).length + Object.keys(data.completed).length
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
        this.$store.dispatch("scan/getClientScans", {client_id: this.$store.state.clients.client.id})
        
        if( this.$route.params.automations && this.$route.params.automations.length ){
            this.filtering = true
        }
    },
    components: {
        Label,
        Loader,
        Button,
        Modal,
        DT,
        DeleteConfirmIcon
    },
}
</script>