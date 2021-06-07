<template>
  <div class="text-center mt-32">
    <Loader v-if="loading"></Loader>
    <h1 class="mb-3">Import Issues for {{primaryAudit.title}}</h1>
    <div class="mb-5 w-full flex">
        <div class="w-1/4"></div>
        <div class="w-1/2 flex flex-wrap justify-center">
            <h3 class="text-base font-bold w-full">Choose which audits to compare</h3>
            <Btn v-for="(audit, index) in audits" :key="'showAudit-'+index" @click.native.prevent="showing.includes(audit.id) ? showing.splice(showing.indexOf(audit.id), 1) : showing.push(audit.id)" class="mx-2" :color="showing.includes(audit.id) ? 'orange' : 'white'" :hover="true">{{audit.title}}</Btn>
        </div>
        <div class="w-1/4"></div>
    </div>

    <div class="w-full flex flex-wrap justify-center items-center mb-10">
        <div v-for="(audit, index) in filteredAudits" :key="'audit-'+index" class="bg-white" :class="[fullscreen === audit.id ? 'fixed inset-0 h-screen z-50 w-full' : 'w-1/2 my-3']" >
            <div :class="[fullscreen === audit.id ? 'fixed left-0 right-0 shadow-lg top-1.5' : '']" class="border border-pallette-grey h-auto p-4 rounded text-center mx-1.5">
                <div class="flex pr-2 items-center justify-center">
                    <h2 class="text-medium font-bold flex-1">{{audit.title}}</h2>
                    <Btn v-if="fullscreen !== audit.id" aria-label="Expand this audit to full screen" @click.native.prevent="setFullscreen(audit.id)" hover="true" color="white"><i class="fas fa-expand"></i></Btn>
                    <Btn v-if="fullscreen === audit.id" aria-label="Compress this audit back down" @click.native.prevent="setFullscreen(false)" hover="true" color="white"><i class="fas fa-compress"></i></Btn>
                </div>
                <Table v-if="audit.id !== primaryAudit.id" :class="[ fullscreen === audit.id ? 'max-height-800' : 'max-height-615' ]" :compact="true" ref="issuesTable" :selected="selectedRows" @deselectAll="deselectAll" @selectAll="selectAll" @rowClick="selectRow" :rowsData="audit.issues" :headersData="headers"></Table>
                <Table v-else :class="[ fullscreen === audit.id ? 'max-height-800' : 'max-height-615' ]" :compact="true" ref="issuesTable" :rowsData="primaryAuditIssues" @deselectAll="primaryDeselectAll" @selectAll="primarySelectAll" :headersData="headers" @rowClick="selectImportRow" :selected="selectedImportRows"></Table>
                <Btn v-if="selectedImportRows.length > 0 && audit.id === primaryAudit.id" @click.native.prevent="removeFromImport(selectedImportRows)" class="mx-2" color="orange" hover="true">Remove selected</Btn>
            </div>
        </div>
    </div>
    <div class="w-full justify-between flex fixed bottom-0 left-0 right-0 px-3 py-3 bg-white border-t" style="z-index:25;">
        <div>
            <Btn v-if="selectedRows.length > 1" @click.native.prevent="compareIssuesModalOpen = true" class="mx-2" color="orange" hover="true">Compare issues</Btn>
            <Btn v-if="selectedRows.length > 0" @click.native.prevent="addToAudit(selectedRows)" class="mx-2" color="orange" hover="true">Import selected</Btn>
        </div>
        <div>
            <Btn @click.native.prevent="finishImport" class="mx-2" color="orange" hover="true">Finish and go to audit</Btn>
        </div>
    </div>
    <Modal size="full" class="z-50" :open="compareIssuesModalOpen">
        <div class="bg-white px-4 pt-5 pb-4 p-6">
            <Btn aria-label="Close compare issues modal" @click.native.prevent="compareIssuesModalOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Btn>
            <h2 class="text-center">What should this header say?</h2>
            <Table :compact="true" ref="compareTable" :selected="selectedCompareRows" @rowClick="selectCompareRow" :rowsData="issuesCompare" :headersData="headers"></Table>
        </div>
        <div class="bg-gray-50 px-4 py-3 flex">
            <button @click.prevent="addToAudit(selectedCompareRows)" type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-orange hover:text-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto">
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
// import A from '../../components/Link'
import Table from '../../components/Table'
// import Card from '../../components/Card'
import Btn from '../../components/Button'
import Modal from '../../components/Modal'
import projects from '../../store/modules/project'
export default {
    data: ()=>({
        selectedCompareRows: [],
        selectedImportRows: [],
        showing: [],
        selectedRows: [],
        updatedFirstIndex: false,
        fullscreen: false,
        compareIssuesModalOpen: false,
        issuesToImport: []
    }),
    computed: {
        loading(){
            return this.$store.state.audits ? this.$store.state.audits.loading : false
        },
        primaryAudit(){
            return this.$store.state.audits ? this.$store.state.audits.audit : false
        },
        audits(){
            return this.$store.state.projects ? this.$store.state.projects.audits : []
        },
        filteredAudits(){
            let self = this
            return this.audits.filter( a => self.showing.includes(a.id) )
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
                    width: "150px",
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
                    header: "recommendations",
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
                    header: "first audit notes",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: false
                },
                {
                    header: "second audit notes",
                    show: false,
                    sticky: false,
                    style: {},
                    width: "150px",
                    hidePermanent: this.primaryAudit.number == 2 || this.primaryAudit.number == 3
                },
                {
                    header: "third audit notes",
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
            return this.audits.map( a => a.issues).flat()
        },
        issuesCompare(){
            let self = this
            return this.allIssues.filter( i => self.selectedRows.includes(i.id))
        },
        primaryAuditIssues(){
            return [ ...this.allIssues.filter( i => this.issuesToImport.includes(i.id) ), ...this.primaryAudit.issues ]
        }
    },
    props: [],
    watch: {
        primaryAudit(newVal){
            if( newVal ){
                this.$store.dispatch("projects/getAuditsForProject", {project_id: newVal.project_id})
            }
        },
        audits(newVal){
            if( newVal.length ){
                // this.showing = newVal.map( a => a.id)
                if( !this.updatedFirstIndex ){
                    let ids = newVal.map( a=>a.id)
                    let firstIndex = ids.indexOf( parseInt(this.$route.params.id) )
                    let firstItem = newVal.splice(firstIndex, 1)[0]
                    newVal.splice( 0, 0, firstItem)
                    this.updatedFirstIndex = true
                }
            }
        }
    },
    methods: {
        selectAll(ids){
            let self = this
            this.selectedRows = [ ...this.selectedRows, ...ids.filter( id=>!self.selectedRows.includes(id) ) ]
        },
        primarySelectAll(ids){
            let self = this
            this.selectedImportRows = [ ...this.selectedImportRows, ...ids.filter( id=>!self.selectedImportRows.includes(id) ) ]
        },
        primaryDeselectAll(ids){
            this.selectedImportRows = this.selectedImportRows.filter( id=>!ids.includes(id) )
        },
        deselectAll(ids){
            this.selectedRows = this.selectedRows.filter( id=>!ids.includes(id) )
        },
        selectImportRow(issue){
            if( this.selectedImportRows.includes( issue.id ) ){
				let index = this.selectedImportRows.indexOf( issue.id )
				this.selectedImportRows.splice(index, 1)
			}else{
				this.selectedImportRows.push( issue.id )
			}
        },
        removeFromImport(issues){
            this.issuesToImport = this.issuesToImport.filter( i => !issues.includes(i))
            this.selectedImportRows = []
        },
        finishImport(){
            this.$store.dispatch("audits/importIssues", {issues: this.issuesToImport, audit_id: this.$route.params.id, router: this.$router})
        },
        selectCompareRow(issue){
            if( this.selectedCompareRows.includes( issue.id ) ){
				let index = this.selectedCompareRows.indexOf( issue.id )
				this.selectedCompareRows.splice(index, 1)
			}else{
				this.selectedCompareRows.push( issue.id )
			}
        },
        addToAudit(issues){
            this.issuesToImport = [ ...this.issuesToImport, ...issues ]
            this.compareIssuesModalOpen = false
            this.selectedRows = []
            this.selectedCompareRows = []
        },
        setFullscreen(value){
            this.fullscreen = value
        },
        selectRow(issue){
            if( this.selectedRows.includes( issue.id ) ){
				let index = this.selectedRows.indexOf( issue.id )
				this.selectedRows.splice(index, 1)
			}else{
				this.selectedRows.push( issue.id )
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
      Modal
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