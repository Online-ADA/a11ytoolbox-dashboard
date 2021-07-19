<template>
  <div class="text-center mt-32">
    <Loader v-if="loading"></Loader>
    <h1 class="mb-3">Import Issues for {{primaryAudit.title}}</h1>
    <div class="mb-5 w-full flex">
        <div class="w-1/4"></div>
        <div class="w-1/2 flex flex-wrap justify-center">
            <h3 class="text-base font-bold w-full">Choose which audits to compare</h3>
            <Btn v-for="(audit, index) in audits" :key="'showAudit-'+index" @click.native.prevent="showingAudits.includes(audit.id) ? showingAudits.splice(showingAudits.indexOf(audit.id), 1) : showingAudits.push(audit.id)" class="mx-2" :color="showingAudits.includes(audit.id) ? 'orange' : 'white'" :hover="true">{{audit.title}}</Btn>
        </div>
        <div class="w-1/4"></div>
    </div>
    <div class="mb-5 w-full flex">
        <div class="w-1/4"></div>
        <div class="w-1/2 flex flex-wrap justify-center">
            <h3 class="text-base font-bold w-full">Choose which scans to compare</h3>
            <Btn v-for="(scan, index) in scans" :key="'showAudit-'+index" @click.native.prevent="showingScans.includes(scan.id) ? showingScans.splice(showingScans.indexOf(scan.id), 1) : showingScans.push(scan.id)" class="mx-2" :color="showingScans.includes(scan.id) ? 'orange' : 'white'" :hover="true">{{scan.title}}</Btn>
        </div>
        <div class="w-1/4"></div>
    </div>

    <div class="w-full flex flex-wrap justify-center items-center mb-14">
        <div v-for="(audit, index) in filteredAudits" :key="'audit-'+index" class="bg-white" :class="[auditFullscreen === audit.id ? 'fixed inset-0 h-screen z-50 w-full' : 'w-1/2 my-3']" >
            <div :class="[auditFullscreen === audit.id ? 'fixed left-0 right-0 shadow-lg top-1.5' : '']" class="border border-pallette-grey h-auto p-4 rounded text-center mx-1.5">
                <div class="flex pr-2 items-center justify-center">
                    <h2 class="text-medium font-bold flex-1">{{audit.title}}</h2>
                    <Btn v-if="auditFullscreen !== audit.id" aria-label="Expand this audit to full screen" @click.native.prevent="setFullscreen(audit.id, 'audit')" hover="true" color="white"><i class="fas fa-expand"></i></Btn>
                    <Btn v-if="auditFullscreen === audit.id" aria-label="Compress this audit back down" @click.native.prevent="setFullscreen(false, 'audit')" hover="true" color="white"><i class="fas fa-compress"></i></Btn>
                </div>
                <Table v-if="audit.id !== primaryAudit.id" :class="[ auditFullscreen === audit.id ? 'max-height-800' : 'max-height-615' ]" :condense="true" ref="issuesTable" :selected="selectedAuditRows" @deselectAll="deselectAll" @selectAll="selectAll" @rowClick="selectAuditRow" :rowsData="audit.issues" :headersData="headers"></Table>
                <Table :specialRows="primaryAuditIssues.filter( i=> !issuesToImport.includes(i.issue_number)).map( i=>i.issue_number)" class="primary-audit-table" v-else :class="[ auditFullscreen === audit.id ? 'max-height-800' : 'max-height-615' ]" :condense="true" ref="issuesTable" :rowsData="primaryAuditIssues" @deselectAll="primaryDeselectAll" @selectAll="primarySelectAll" :headersData="headers" @rowClick="selectImportRow" :selected="selectedImportRows"></Table>
                <Btn v-if="selectedImportRows.length > 0 && audit.id === primaryAudit.id" @click.native.prevent="removeFromImport(selectedImportRows)" class="mx-2" color="orange" hover="true">Remove selected</Btn>
            </div>
        </div>
        <!-- ############################################### -->
        <div v-for="(scan, index) in filteredScans" :key="'scan-'+index" class="bg-white" :class="[scanFullscreen === scan.id ? 'fixed inset-0 h-screen z-50 w-full' : 'w-1/2 my-3']" >
            <div :class="[scanFullscreen === scan.id ? 'fixed left-0 right-0 shadow-lg top-1.5' : '']" class="border border-pallette-grey h-auto p-4 rounded text-center mx-1.5">
                <div class="flex pr-2 items-center justify-center">
                    <h2 class="text-medium font-bold flex-1">{{scan.title}}</h2>
                    <Btn v-if="scanFullscreen !== scan.id" aria-label="Expand this scan to full screen" @click.native.prevent="setFullscreen(scan.id, 'scan')" hover="true" color="white"><i class="fas fa-expand"></i></Btn>
                    <Btn v-if="scanFullscreen === scan.id" aria-label="Compress this scan back down" @click.native.prevent="setFullscreen(false, 'scan')" hover="true" color="white"><i class="fas fa-compress"></i></Btn>
                </div>
                <Table :class="[ scanFullscreen === scan.id ? 'max-height-800' : 'max-height-615' ]" :condense="true" ref="issuesTable" :selected="selectedScanRows" @deselectAll="deselectAll" @selectAll="selectAll" @rowClick="selectScanRow" :rowsData="scan.issues" :headersData="headers"></Table>
            </div>
        </div>
    </div>
    <div class="w-full flex fixed bottom-0 left-0 right-0 px-3 py-3 bg-white border-t" style="z-index:25;">
        <div class="w-1/3">
            <Btn v-if="selectedAuditRows.length > 1 || selectedScanRows.length > 1 || (selectedAuditRows.length >= 1 && selectedScanRows.length >= 1)" @click.native.prevent="compareIssuesModalOpen = true" class="mx-2" color="orange" hover="true">Compare issues</Btn>
            <Btn v-if="selectedAuditRows.length > 0 || selectedScanRows.length > 0" @click.native.prevent="addSelectedToAudit()" class="mx-2" color="orange" hover="true">Import selected</Btn>
        </div>
        <div class="w-1/3">
            <Btn @click.native.prevent="uploadCSVModalOpen = true" class="mx-2" color="orange" hover="true">Upload CSV</Btn>
        </div>
        <div class="w-1/3">
            <Btn @click.native.prevent="finishImport" class="mx-2" color="orange" hover="true">Finish and go to audit</Btn>
        </div>
    </div>
    <Modal class="z-50" :open="uploadCSVModalOpen">
        <div class="bg-white px-4 pt-5 pb-4 p-6">
            <Btn aria-label="Close upload CSV modal" @click.native.prevent="uploadCSVModalOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Btn>
            <h2 class="text-center pb-3">Choose a CSV of issues to load</h2>
            <FileInput @input="handleUploadFile" class="block w-auto mx-auto pb-3" accept=".csv"></FileInput>
        </div>
        <div class="bg-gray-50 px-4 py-3 flex">
            <button @click.prevent="uploadCSV" type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-orange hover:text-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto">
                Upload
            </button>
            <button @click.prevent="compareIssuesModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto">
                Cancel
            </button>
        </div>
    </Modal>
    <Modal size="full" class="z-50" :open="compareIssuesModalOpen">
        <div class="bg-white px-4 pt-5 pb-4 p-6">
            <Btn aria-label="Close compare issues modal" @click.native.prevent="compareIssuesModalOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Btn>
            <h2 class="text-center">Compare Issues for Importing</h2>
            <Table :condense="true" ref="compareTable" :selected="selectedCompareRows" @rowClick="selectCompareRow" :rowsData="issuesCompare" :headersData="headers"></Table>
        </div>
        <div class="bg-gray-50 px-4 py-3 flex">
            <button @click.prevent="addSelectedToAudit()" type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-orange hover:text-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto">
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
import Table from '../../components/Table'
import Btn from '../../components/Button'
import Modal from '../../components/Modal'
import FileInput from '../../components/FileInput'
import projects from '../../store/modules/project'
export default {
    data: ()=>({
        selectedCompareRows: [], //Rows selected whilst comparing issues
        selectedImportRows: [], //Rows to actually be imported into the audit
        selectedAuditRows: [], // Rows selected from an audit
        selectedScanRows: [], // Rows selected from a scan
        updatedFirstIndex: false,
        auditFullscreen: false,
        scanFullscreen: false,
        compareIssuesModalOpen: false,
        issuesToImport: [],
        CSVFile: false,
        uploadCSVModalOpen: false,
        tempAudits: [],
        tempScans: [],
        showingAudits: [],
        showingScans: [],
    }),
    computed: {
        loading(){
            return this.$store.state.audits ? this.$store.state.audits.loading : false
        },
        primaryAudit(){
            return this.$store.state.audits ? this.$store.state.audits.audit : false
        },
        audits(){
            if( this.$store.state.projects ){
                return [ ...this.$store.state.projects.audits, ...this.tempAudits ]
            }

            return this.tempAudits
        },
        scans(){
            if( this.$store.state.projects ){
                return [ ...this.$store.state.projects.scans, ...this.tempScans ]
            }

            return this.tempScans
        },
        filteredAudits(){
            let self = this
            return this.audits.filter( a => self.showingAudits.includes(a.id) )
        },
        filteredScans(){
            let self = this
            return this.scans.filter( s => self.showingScans.includes(s.id) )
        },
        headers(){
            let parsed = [
                {
                    header: "id",
                    show: false,
                    sticky: true,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    header: "issue number",
                    show: true,
                    sticky: true,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    header: "group id",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: true
                },
                {
                    header: "pages",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "250px",
                    hidePermanent: false
                },
                {
                    header: "status",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    header: "target",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "300px",
                    hidePermanent: false
                },
                {
                    header: "levels",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    header: "success criteria",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "200px",
                    hidePermanent: false
                },
                {
                    header: "techniques",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    header: "descriptions",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "400px",
                    hidePermanent: false
                },
                {
                    header: "audit 1 recommendations",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "400px",
                    hidePermanent: false
                },
                {
                    header: "audit states",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    header: "priority",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    header: "effort",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "300px",
                    hidePermanent: false
                },
                {
                    header: "how discovered",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    header: "screenshots",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "250px",
                    hidePermanent: false
                },
                {
                    header: "resources",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "250px",
                    hidePermanent: false
                },
                {
                    header: "browser combos",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "300px",
                    hidePermanent: false
                },
                {
                    header: "essential functionality",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "300px",
                    hidePermanent: false
                },
                {
                    header: "actrs",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "250px",
                    hidePermanent: false
                },
                {
                    header: "created by",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "250px",
                    hidePermanent: false
                },
                {
                    header: "audit id",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    header: "auditor notes",
                    show: true,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    header: "second audit comments",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: this.primaryAudit.number == 2 || this.primaryAudit.number == 3
                },
                {
                    header: "third audit comments",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: this.primaryAudit.number == 3
                },
            ]
            
            return parsed
        },
        allIssues(){
            return [...this.audits.map( a => a.issues).flat(), ...this.scans.map( s => s.issues).flat()]
        },
        issuesCompare(){
            let self = this
            return this.allIssues.filter( i => self.selectedAuditRows.includes(i.issue_number))
            //return this.allIssues.filter( i => self.selectedAuditRows.includes(i.id))
        },
        primaryAuditIssues(){
            return [...this.allIssues.filter( i => this.issuesToImport.includes(i.issue_number) ), ...this.primaryAudit.issues]
            // return [ ...this.allIssues.filter( i => this.issuesToImport.includes(i.id) ), ...this.primaryAudit.issues ]
        }
    },
    props: [],
    watch: {
        primaryAudit(newVal){
            if( newVal ){
                this.$store.dispatch("projects/getAuditsForProject", {project_id: newVal.project_id})
                this.$store.dispatch("projects/getScansForProject", {project_id: newVal.project_id})
            }
        },
        audits(newVal){
            if( newVal.length ){
                let self = this
                
                if( !this.updatedFirstIndex ){
                    let ids = self.$store.state.projects.audits.map( a=>a.id)
                    let firstIndex = ids.indexOf( parseInt(self.$route.params.id) )
                    let firstItem = self.$store.state.projects.audits.splice(firstIndex, 1)[0]
                    self.$store.state.projects.audits.splice( 0, 0, firstItem)
                    this.updatedFirstIndex = true
                }
            }
        }
    },
    methods: {
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
        selectAll(ids){
            let self = this
            this.selectedAuditRows = [ ...this.selectedAuditRows, ...issue_numbers.filter( issue_number=>!self.selectedAuditRows.includes(issue_number) ) ]
        },
        primarySelectAll(ids){
            let self = this
            this.selectedImportRows = [ ...this.selectedImportRows, ...issue_numbers.filter( issue_number=>!self.selectedImportRows.includes(issue_number) ) ]
        },
        primaryDeselectAll(ids){
            this.selectedImportRows = this.selectedImportRows.filter( issue_number=>!issue_numbers.includes(issue_number) )
        },
        deselectAll(issue_numbers){
            this.selectedAuditRows = this.selectedAuditRows.filter( issue_number=>!issue_numbers.includes(issue_number) )
        },
        selectImportRow(issue){
            if( this.selectedImportRows.includes( issue.issue_number ) ){
				let index = this.selectedImportRows.indexOf( issue.issue_number )
				this.selectedImportRows.splice(index, 1)
			}else{
				this.selectedImportRows.push( issue.issue_number )
			}
        },
        removeFromImport(issues){
            this.issuesToImport = this.issuesToImport.filter( i => !issues.includes(i))
            this.selectedImportRows = []
        },
        finishImport(){
            this.$store.dispatch("audits/importIssues", {issues: this.allIssues.filter( i => this.issuesToImport.includes(i.issue_number) ), audit_id: this.$route.params.id, router: this.$router})
        },
        selectCompareRow(issue){
            if( this.selectedCompareRows.includes( issue.issue_number ) ){
				let index = this.selectedCompareRows.indexOf( issue.issue_number )
				this.selectedCompareRows.splice(index, 1)
			}else{
				this.selectedCompareRows.push( issue.issue_number )
			}
        },
        addSelectedToAudit(){
            this.issuesToImport = [ ...this.issuesToImport, ...this.selectedAuditRows ]
            this.issuesToImport = [ ...this.issuesToImport, ...this.selectedScanRows ]
            this.issuesToImport = [ ...this.issuesToImport, ...this.selectedCompareRows ]

            this.compareIssuesModalOpen = false
            this.selectedAuditRows = []
            this.selectedScanRows = []
            this.selectedCompareRows = []
        },
        setFullscreen(value, type){
            if( type == 'audit' ){
                this.auditFullscreen = value
            }else{
                this.scanFullscreen = value
            }
        },
        selectAuditRow(issue){
            if( this.selectedAuditRows.includes( issue.issue_number ) ){
				let index = this.selectedAuditRows.indexOf( issue.issue_number )
				this.selectedAuditRows.splice(index, 1)
			}else{
				this.selectedAuditRows.push( issue.issue_number )
			}
        },
        selectScanRow(issue){
            if( this.selectedScanRows.includes( issue.issue_number ) ){
				let index = this.selectedScanRows.indexOf( issue.issue_number )
				this.selectedScanRows.splice(index, 1)
			}else{
				this.selectedScanRows.push( issue.issue_number )
			}
        },
    },
    created() {
        this.$store.dispatch("audits/getAudit", {id: this.$route.params.id, withIssues: true})
        if(this.$store.state.projects === undefined){
			this.$store.registerModule('projects', projects)
		}
    },
    mounted() {
        
    },
    components: {
      Loader,
      Table,
      Btn,
      Modal,
      FileInput
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
</style>