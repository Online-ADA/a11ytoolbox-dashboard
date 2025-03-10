<template>
  <div style="position: relative;">
    <Loader v-if="loading"></Loader>

    <div class="mb-6" style="display: flex; align-items: center;">
        <h1 class="headline" style="width:fit-content;display:inline-block">Import Issues</h1>
        <span class="" style="margin-left:35px">
            <button @click.prevent="uploadCSVModalOpen = true" class="standard mx-2">Upload CSV</button>
        </span>
    </div>

    <div class="mb-5 w-full flex">
        <div class="w-full flex flex-wrap">
            <h2 class="subheadline pb-3 w-full">Import From Previous Audit</h2>
            <Btn @click.native.prevent="showingAudits.includes(primaryAudit.id) ? showingAudits.splice(showingAudits.indexOf(primaryAudit.id), 1) : showingAudits.push(primaryAudit.id)" class="font-semibold mr-2" :color="showingAudits.includes(primaryAudit.id) ? 'yellow' : 'white'" :hover="true">{{primaryAudit.title}}</Btn>
            <Btn v-for="(audit, index) in audits" :key="'showAudit-'+index" @click.native.prevent="showingAudits.includes(audit.id) ? showingAudits.splice(showingAudits.indexOf(audit.id), 1) : showingAudits.push(audit.id)" class="font-semibold mx-2" :color="showingAudits.includes(audit.id) ? 'yellow' : 'white'" :hover="true">{{audit.title}}</Btn>
        </div>
    </div>
    <div class="mb-5 w-full flex">
        <div class="w-full flex flex-wrap">
            <h3 v-if="temporary_audits.length > 0" class="subheadline pb-3 w-full">Import from CSV</h3>
            <Btn v-for="(audit, index) in temporary_audits" :key="'showTempAudit-'+index" @click.native.prevent="showingAudits.includes(audit.id) ? showingAudits.splice(showingAudits.indexOf(audit.id), 1) : showingAudits.push(audit.id)" class="mx-2" :color="showingAudits.includes(audit.id) ? 'yellow' : 'white'" :hover="true">{{audit.title}}</Btn>
        </div>
    </div>
    <div class="w-full flex flex-wrap items-center mb-14">
        <div
        class="audit-window"
        v-for="(audit, index) in filteredAudits" 
        :key="'audit-'+index" 
        :class="[auditFullscreen === audit.id ? 'fullscreen' : 'w-1/2 my-3']" >
            <div class="bg-white border border-pallette-grey h-auto p-4 text-center mx-1.5 overflow-auto">
                <div class="flex px-5 items-center mb-6 sticky-top">
                    <!-- <h2 class="text-medium font-bold flex-1">{{audit.title}}</h2> -->
                    <Btn v-if="auditFullscreen !== audit.id" aria-label="Expand this audit to full screen" @click.native.prevent="setFullscreen(audit.id)" :hover="true" color="white"><i class="fas fa-expand"></i></Btn>
                    <Btn v-if="auditFullscreen === audit.id" aria-label="Compress this audit back down" @click.native.prevent="setFullscreen(false)" :hover="true" color="white"><i class="fas fa-compress"></i></Btn>
                    <Btn @click.native.prevent="selectAllIssues($event)" class="standard mx-2">Select All</Btn>
                    <Btn @click.native.prevent="deselectAllIssues($event)" class="standard mx-2">Deselect All</Btn>
                </div>

                <Table 
                v-if="audit.id !== primaryAudit.id"
                :importing="true" 
                :issuesTable="true"
                :audit_id="audit.id"
                :defaultSortData='{
                    columns: ["id"],
                    orders: ["asc"],
                    reference: ["id"]
                }'
                :class="[ auditFullscreen === audit.id ? 'max-height-800' : 'max-height-615' ]" 
                :condense="true" ref="issuesTable" 
                :selected="selectedAuditRows" 
                @deselectAll="deselectAll" 
                @selectAll="selectAll" 
                @rowClick="selectAuditRow" 
                :rowsData="audit.issues" 
                :headersData="headers"
                :importedIssues="importedIssues"
                ></Table>
            
                <Table 
                v-else
                :importing="true" 
                :issuesTable="true"
                :audit_id="primaryAudit.id"
                :defaultSortData='{
                    columns: ["id"],
                    orders: ["asc"],
                    reference: ["id"]
                }'
                :specialRows="primaryAuditIssues.filter( i=> !issuesToImport.includes(i.issue_number)).map( i=>i.issue_number)" 
                class="primary-audit-table"
                :class="[ auditFullscreen === audit.id ? 'max-height-800' : 'max-height-615' ]" 
                :condense="true" ref="issuesTable" 
                :rowsData="primaryAuditIssues" 
                @deselectAll="primaryDeselectAll" 
                @selectAll="primarySelectAll" 
                :headersData="headers" 
                @rowClick="selectImportRow" 
                :selected="selectedImportRows"
                ></Table>

                <button v-if="selectedImportRows.length > 0 && audit.id === primaryAudit.id" @click.prevent="removeFromImport(selectedImportRows)" class="alert standard mx-2" >Remove selected</button>
            </div>
        </div>
    </div>
    <div class="w-full flex fixed bottom-0 left-0 right-0 px-3 py-3 bg-white border-t" style="z-index:25;max-width:calc(100% - 400px);margin-left:auto;">
        <div class="w-1/2">
            <button v-if="selectedAuditRows.length > 0" @click.prevent="addSelectedToAudit()" class="standard mx-2">Select Issues</button>
        </div>
        <div v-if="importedIssues.length > 0" class="w-1/2">
            <button @click.prevent="finishImport" class="standard mx-2">Import and Go To Audit</button>
        </div>
    </div>
    <Modal class="z-50" :open="uploadCSVModalOpen">
        <div class="bg-white px-4 pt-5 pb-4 p-6">
            <button aria-label="Close upload CSV modal" @click.prevent="uploadCSVModalOpen = false" class="absolute top-4 right-4 standard">X</button>
            <h2 class="subheadline pb-3">Choose a CSV of issues to load</h2>
            <FileInput @input="handleUploadFile" class="block w-auto pb-3" accept=".csv"></FileInput>
        </div>
        <div class="px-4 py-3 flex">
            <button @click.prevent="uploadCSV" type="button" class="mr-2 standard">
                Upload
            </button>
            <button @click.prevent="uploadCSVModalOpen = false" type="button" class="standard alert">
                Cancel
            </button>
        </div>
    </Modal>
    <Modal size="full" class="z-50" :open="compareIssuesModalOpen">
        <div class="bg-white px-4 pt-5 pb-4 p-6">
            <button aria-label="Close compare issues modal" @click.prevent="compareIssuesModalOpen = false" class="standard absolute top-4 right-4">X</button>
            <h2 class="text-center">Compare Issues for Importing</h2>
            <!-- <Table :issuesTable="true" :importing="true" :condense="true" ref="compareTable" :selected="selectedCompareRows" @rowClick="selectCompareRow" :rowsData="issuesCompare" :headersData="headers"></Table> -->
        </div>
        <div class="bg-gray-50 px-4 py-3 flex">
            <button @click.prevent="addSelectedComparesToAudit()" type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-orange hover:text-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto">
                Import Selected
            </button>
            <button @click.prevent="compareIssuesModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto">
                Cancel
            </button>
        </div>
    </Modal>
  </div>
</template>

<script>
import Loader from '../../components/Loader'
import DT from '../../components/DynamicTable'
import Table from '../../components/Table'
import Btn from '../../components/Button'
import Modal from '../../components/Modal'
import FileInput from '../../components/FileInput'
import { EventBus } from '../../services/eventBus'

export default {
    data: ()=>({
        selectedCompareRows: [], //Rows selected whilst comparing issues
        selectedImportRows: [], //Rows to actually be imported into the audit
        selectedAuditRows: [], // Rows selected from an audit
        updatedFirstIndex: false,
        auditFullscreen: false,
        compareIssuesModalOpen: false,
        issuesToImport: [],
        CSVFile: false,
        uploadCSVModalOpen: false,
        audits: [],
        showingAudits: [],
        primaryAuditIssues: [],
        allIssues: [],
        importing: [],
    }),
    computed: {
        loading(){
            return this.$store.state.audits ? this.$store.state.audits.loading : false
        },
        primaryAudit(){
            return this.$store.state.audits.audit
        },
        filteredAudits(){
            let self = this
            let all = [this.primaryAudit, ...this.audits,...this.temporary_audits]
            
            return all.filter( a => self.showingAudits.includes(a.id) )
        },
        temporary_audits() {
            return this.$store.state.audits.temporary_audits
        },
        headers(){
            let parsed = [
                {
                    key: "id",
                    display: "id",
                    show: false,
                    sticky: true,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    key: "issue_number",
                    display: "issue number",
                    show: true,
                    sticky: true,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                // {
                //     header: "group id",
                //     show: false,
                //     sticky: false,
                //     style: {},
                //     width: "150px",
                //     hidePermanent: true
                // },
                {
                    key: "pages",
                    display: "pages",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "250px",
                    hidePermanent: false
                },
                {
                    key: "status",
                    display: "status",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    key: "target",
                    display: "target",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "300px",
                    hidePermanent: false
                },
                {
                    key: "levels",
                    display: "levels",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    key: "articles",
                    display: "success criteria",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "200px",
                    hidePermanent: false
                },
                {
                    key: "techniques",
                    display: "techniques",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    key: "descriptions",
                    display: "descriptions",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "400px",
                    hidePermanent: false
                },
                {
                    key: "recommendations",
                    display: "audit 1 recommendations",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "400px",
                    hidePermanent: false
                },
                {
                    key: "audit_states",
                    display: "audit states",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    key: "priority",
                    display: "priority",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    key: "effort",
                    display: "effort",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "300px",
                    hidePermanent: false
                },
                {
                    key: "how_discovered",
                    display: "how discovered",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    key: "screenshots",
                    display: "screenshots",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "250px",
                    hidePermanent: false
                },
                {
                    key: "resources",
                    display: "resources",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "250px",
                    hidePermanent: false
                },
                {
                    key: "browser_combos",
                    display: "browser combos",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "300px",
                    hidePermanent: false
                },
                {
                    key: "essential_functionality",
                    display: "essential functionality",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "300px",
                    hidePermanent: false
                },
                {
                    key: "actrs",
                    display: "actrs",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "250px",
                    hidePermanent: false
                },
                {
                    key: "created_by",
                    display: "last saved by",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "250px",
                    hidePermanent: false
                },
                {
                    key: "audit_id",
                    display: "audit id",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    key: "issue_description",
                    display: "issue description",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    key: "auditor_notes",
                    display: "auditor notes",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    key: "second_audit_comments",
                    display: "second audit comments",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: this.primaryAudit.number == 2 || this.primaryAudit.number == 3
                },
                {
                    key: "third_audit_comments",
                    display: "third audit comments",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: this.primaryAudit.number == 3
                },
            ]
            
            return parsed
        },
        issuesCompare(){
            let self = this
            return this.allIssues.filter( i => self.selectedAuditRows.includes(i.unique) )
        },
        importedIssues(){
            return this.importing;
        }
    },
    props: [],
    watch: {
        "$store.state.audits.audit.issues":function(newVal){
            if( newVal ){
                this.setAllIssues()
                this.primaryAuditIssues = [...this.allIssues.filter( i => this.issuesToImport.includes(i.unique) ), ...newVal]
            }
        },
        "$store.state.projects.project.audits":{
            deep:true,
            handler(newVal){
                if( !newVal ){
                    return
                }
                
                if( newVal.length && newVal[0].issues == undefined ){
                    this.$store.dispatch("audits/getAudits", {project_id: newVal[0].project_id, withIssues: true})
                    return
                }

                let primaryIndex = this.$store.state.projects.project.audits.findIndex(a=>a.id == this.$route.params.id)
                if( primaryIndex !== -1 ){
                    this.$store.state.projects.project.audits.splice(primaryIndex, 1)
                }

                let auditsList = this._.cloneDeep(this.$store.state.projects.project.audits)
                this.audits = auditsList
                this.setAllIssues()
                
                // let importing = this.allIssues.filter( i => this.issuesToImport.includes(i.unique) )
                // this.primaryAuditIssues = [...importing, ...this.primaryAudit.issues]
            }
        },
        temporary_audits: {
            deep:true,
            handler(newVal) {
                if( !newVal ){
                    return
                }
                //Set all temp audits issues
                this.setAllIssues()
            },
        },
    },
    methods: {
        setAllIssues(){
            //This function is necessary to determine what is being added to the primary audit
            /**
             * TODO: Make sure we absolutely do not need this conditional
             * This check was breaking the import in the case where:
             * A: The primary audit had 0 issues
             * B: The project had only one audit which is the primary audit
             **/
            // if( !this.audits.length ){
            //     return []
            // }
            let all = [...this.audits.map( a =>  a.issues).flat(), ...this.temporary_audits.map(a => a.issues).flat()]

            var x = 0, l = all.length;
            while (x < l) {
                all[x].unique = all[x].id + all[x].issue_number + all[x].audit_id
                ++x;
            }
            
            this.allIssues = all
            //primaryAuditIssues is an amalgamation of the issues that came with the primary audit AND and issues being imported. IssuesToImport is an array of unique keys (generated in AllIssues) used to pinpoint which issues from AllIssues to include
            this.importing = this.allIssues.filter( i => this.issuesToImport.includes(i.unique) )
            this.primaryAuditIssues = [...this.importing, ...this.primaryAudit.issues]
        },
        handleUploadFile(e){
			this.CSVFile = e
		},
        uploadCSV(){
            if( this.CSVFile ){
				this.$store.dispatch("audits/uploadIssuesCSV", {file: this.CSVFile, vm: this})
                this.CSVFile = false
                this.uploadCSVModalOpen = false
			}
        },
        selectAll(uniques){
            let self = this
            this.selectedAuditRows = [ ...this.selectedAuditRows, ...uniques.filter( unique=>!self.selectedAuditRows.includes(unique) ) ]
        },
        primarySelectAll(uniques){
            let self = this
            this.selectedImportRows = [ ...this.selectedImportRows, ...uniques.filter( unique=>!self.selectedImportRows.includes(unique) ) ]
        },
        primaryDeselectAll(uniques){
            this.selectedImportRows = this.selectedImportRows.filter( unique=>!uniques.includes(unique) )
        },
        deselectAll(uniques){
            this.selectedAuditRows = this.selectedAuditRows.filter( unique=>!uniques.includes(unique) )
        },
        selectImportRow(issue){
            if( this.selectedImportRows.includes( issue.unique ) ){
				let index = this.selectedImportRows.indexOf( issue.unique )
				this.selectedImportRows.splice(index, 1)
			}else{
				this.selectedImportRows.push( issue.unique )
			}
        },
        removeFromImport(issues){
            this.issuesToImport = this.issuesToImport.filter( i => !issues.includes(i))
            this.setAllIssues()
            this.selectedImportRows = []
        },
        finishImport(){
            console.log('fired this')
            this.$store.dispatch("audits/importIssues", {issues: this.allIssues.filter( i => this.issuesToImport.includes(i.unique) ), audit_id: this.$route.params.id, router: this.$router})
        },
        selectCompareRow(issue){
            if( this.selectedCompareRows.includes( issue.unique ) ){
				let index = this.selectedCompareRows.indexOf( issue.unique )
				this.selectedCompareRows.splice(index, 1)
			}else{
				this.selectedCompareRows.push( issue.unique )
			}
        },
        addSelectedComparesToAudit(){
            let self = this
            this.issuesToImport = [...this.issuesToImport, ...this.selectedCompareRows.filter( u=>!self.issuesToImport.includes(u))]
            this.setAllIssues()
            this.compareIssuesModalOpen = false
            this.selectedCompareRows = []
            this.selectedAuditRows = []
        },
        addSelectedToAudit(){
            
            let self = this
            this.issuesToImport = [ ...this.issuesToImport, ...this.selectedAuditRows.filter( u=>!self.issuesToImport.includes(u) ) ]
            console.log("Firing", this.selectedAuditRows, this.issuesToImport);
            this.setAllIssues()
            
            this.selectedAuditRows = []
        },
        setFullscreen(value){
            this.auditFullscreen = value
        },
        selectAuditRow(issue){
            if( this.selectedAuditRows.includes( issue.unique ) ){
				let index = this.selectedAuditRows.indexOf( issue.unique )
				this.selectedAuditRows.splice(index, 1)
			}else{
				this.selectedAuditRows.push( issue.unique )
			}
        },
        selectAllIssues($event) {
            EventBus.$emit('toolbarEmit', {action: 'selectAll', data: null, $event: $event});
        },
        deselectAllIssues($event) {
            EventBus.$emit('toolbarEmit', {action: 'deselectAll', data: null, $event: $event});
        },
    },
    created() {
        
    },
    mounted() {
        this.$store.dispatch("audits/getAudit", {id: this.$route.params.id, withIssues: true})
        if( this.$store.state.projects.project ){
            this.$store.dispatch("audits/getAudits", {project_id: this.$store.state.projects.project.id, withIssues: true})
        }
        document.title = "Import Audit Issues"
    },
    components: {
      Loader,
      Table,
      Btn,
      Modal,
      FileInput,
      DT
    },
}
</script>
<style scoped>
.max-height-800{
    height:800px;
}
.max-height-615{
    height:615px;
}
.audit-window:not(.fullscreen){
    max-height:685px;
    height:685px;
    width:50%;
    margin-top: 12px;
    margin-bottom: 12px;
}
.audit-window:not(.fullscreen) > div{
    height:96%;
    max-height:96%;
}
.audit-window.fullscreen{
    position:fixed;
    z-index:50;
    width:100%;
    height: calc(100vh - 54px);
    top:65px;
}
.sidebarOpen.subSidebarExpanded ~ #content .audit-window.fullscreen{
    width:calc(100% - 420px);
}
.sidebarOpen ~ #content .audit-window.fullscreen{
    width:calc(100% - 220px);
}
</style>