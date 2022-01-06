<template>
	<div class="media-audit text-center mx-auto">
		<Loader v-if="loading"></Loader>
		
		<template v-if="audit">	
			<template v-if="audit.status == 'in_progress'">
				<div class="mr-2"><i class="fas fa-circle-notch fa-spin"></i></div>Audit is currently running and could take a couple of minutes. Data will be refreshed on audit completion.
			</template>
			<Table :issuesTable="true" :condense="shouldCondense" :locked="false" @selectAll="selectAll" @deselectAll="deselectAll" ref="issuesTable" :selected="selectedRows" @rowClick="selectRow" v-else-if="issues && issues.length" :rowsData="issues" :headersData="headers"></Table>
			<template v-else>
				There are no issues currently.
			</template>
		</template>
		<Modal style="z-index:73;" :open="open.add_issue">
			<div class="bg-white px-4 pt-5 pb-4 p-6">
				<button aria-label="Close select descriptions modal" @click.prevent="confirmDeleteModalOpen = false" class="absolute top-4 right-4 standard">X</button>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex">
				<button class="standard mr-3">
					Add
				</button>
				<button class="standard mr-3">
					Cancel
				</button>
			</div>
			
		</Modal>
	</div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
import Button from '../../components/Button'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import Card from '../../components/Card'
import Label from '../../components/Label'
import TextInput from '../../components/TextInput'
import TextArea from '../../components/TextArea'
import { EventBus } from '../../services/eventBus'

export default {
	data: () => ({
		open: {
			add_issue: false,
		},
		shouldCondense: false,
		selectedRows: [],
		statuses: [
			"New",
			"Resolved",
			"Partly Resolved",
			"Remains",
			"Regression",
			"Best Practice",
			"Third party problem",
			"Resolved by removal",
			"Usability Problem",
			"Duplicate",
		],
		darkMode: false,
		selectedReference: { audit: null, issue: null, issues: [], linkText: "" },
		issueDefaults: {},
		issue:false,
		failedValidation: [],
		validationMessages: {
			audit_states: "The states field is required",
			descriptions: "The descriptions field is required",
			pages: "The pages field is required",
			recommendations: "The recommendations field is required",
			articles: "The success criteria field is required",
			target: "The target field is required",
			status: "The status field is required",
			effort: "The effort field is required",
			priority: "The priority field is required",
		},
	}),
	computed: {
		isManager(){
			return this.$store.getters["auth/isManager"]
		},
		issues(){
			return this.audit ? this.audit.issues : []
		},
		issue_numbers(){
			return this.audit.issues.map( i => i.issue_number)
		},
		loading(){
			if( this.$store.state.audits ){
				return this.$store.state.audits.loading
			}
			return false
		},
		headers(){
			let arr = []
			if( !this.issues.length ){
				return arr
			}
			let widthMap = {
				id: "150px",
				issue_number: "150px",
				title: "150px",
				status: "150px",
				media_audit_id: '150px',
				pages: "250px",
				media_type: "150px",
				html: "300px",
				effort: "150px",
				priority: "150px",
				how_discovered: "150px",
				screenshots: "250px",
				notes: "300px",
				created_by: "150px",
				created_at: "150px",
				updated_at: "150px",
			}
			let hideByDefault = [
				"id",
				"title",
				"media_audit_id",
				"how_discovered",
				"effort",
				"priority",
				"notes",
				"screenshots",
				"created_by",
				"created_at",
				"updated_at",
			]
			for( let key of Object.keys(this.audit.issues[0]) ){
				let header_item = {
					header: this.parseHeader(key),
					show: !hideByDefault.includes(key),
					sticky: key == "issue_number" || key == "id" ? true : false,
					style: {},
					width: widthMap[key],
					hidePermanent: false,
				}
				arr.push(header_item)
			}
			return arr
		},
		audit(){
			return this.$store.state.mediaAudits.audit || false
		},
		project(){
			return this.$store.state.projects.project || false
		}
	},
	props: [],
	watch: {
		"$route.params.id": function(){
			this.$store.dispatch("mediaAudits/getAudit", {id: this.$route.params.id, withIssues: true})
		},
		"$store.state.mediaAudits.audit": function(newVal){
			this.$store.dispatch("projects/getProject", {id: newVal.project_id})
		},
	},
	methods: {
		selectAll(ids){
			this.selectedRows = ids
		},
		deselectAll(){
			this.selectedRows = []
			EventBus.$emit('auditSelectedRowsUpdated', this.selectedRows.length)
		},
		selectRow(issue){
			if( this.selectedRows.includes( issue.id ) ){
				let index = this.selectedRows.indexOf( issue.id )
				this.selectedRows.splice(index, 1)
			}else{
				this.selectedRows.push( issue.id )
			}

			if( this.selectedRows.length === 1 ){
				let row = this.issues.find( i=> i.id === this.selectedRows[0])
				EventBus.$emit('auditRowSelected', row.status)
			}
			EventBus.$emit('auditSelectedRowsUpdated', this.selectedRows.length)
		},
		htmlDecode(input) {
			var doc = new DOMParser().parseFromString(input, "text/html");
			return doc.documentElement.textContent;
		},
		parseHeader(string){
			return string.replace(/[-_.]/gm, " ");
		},
		generateUniqueID(){
			let id = Math.random().toString(36).substring(5)
			
			if( this.issue_numbers.includes(id) ){
				return this.generateUniqueID()
			}

			return id
		}
	},
	created() {
		if( this.$store.state.mediaAudits ){
			this.$store.dispatch("mediaAudits/getAudit", {id: this.$route.params.id, withIssues: true})
		}
		let that = this
		EventBus.$on('toolbarEmit', (payload)=>{
			if( payload.action == 'audit-condense' ){
				that.shouldCondense = !that.shouldCondense
				return
			}
		})
		
	},
	mounted() {
	},
	components: {
		Loader,
		A,
		Table,
		Button,
		Modal,
		Card,
		Label,
		TextInput,
		TextArea
	},
}

</script>
<style>
.media-audit table.issues-table {
	min-width: 0 !important; 
}
</style>
<style scoped>
	#no-issues-import:hover{
		color:white !important;
	}
	.sidebarOpen #bottom-bar{ 
		padding-left:212px;
		left:0;
	}
	.sidebarOpen.subSidebarExpanded #bottom-bar{ 
		padding-left:412px;
		left:0;
	}
</style>