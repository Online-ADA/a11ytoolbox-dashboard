<template>
	<div class="container">
		<Loader v-if="loading"></Loader>
		<div class="flex justify-between items-center">
			<h1 class="headline">{{audit.title}}</h1>
			<button v-if="$store.getters['auth/isManager']" @click.prevent="confirmModalOpen = true" title="Delete Audit" class="mt-3 standard alert" >
				Delete
			</button>
		</div>
		
		<div class="flex flex-wrap">
			<div class="xs:w-full pr-2">
				<Label for="locked">Audit Locked</Label>
				<select v-model="audit.locked" id="locked" class="px-4 py-2 text-base" style="height:42px;" name="status">
					<option :value="false">False</option>
					<option :value="true">True</option>
				</select>
			</div>
			<div class="xs:w-full px-2">
				<Label for="start_date">Start Date</Label>
				<DatePicker name="start_date" id="start_date" class="" @input="changeStartDate" v-model="audit.start_date"></DatePicker>
			</div>
			<div class="xs:w-full px-2">
				<Label for="end_date">End Date</Label>
				<DatePicker name="end_date" id="end_date" class="" @input="changeEndDate" v-model="audit.end_date"></DatePicker>
			</div>

			<div class="w-full flex xs:flex-wrap">
				<div class="pr-2 xs:w-1/2">
					<Label for="status">Status</Label>
					<select v-model="audit.status" id="status" class="px-4 py-2 text-base" style="height:42px;" name="status">
						<option :value="status.value" v-for="(status, index) in statusSrc" :key="`status-${index}`">{{status.name}}</option>
					</select>
				</div>
				<div class="px-2 w-3/4">
					<Label for="title">Title</Label>
					<TextInput class="w-full" id="title" name="title" v-model="audit.title" />
				</div>
				<div class="px-2 xs:w-1/2">
					<Label class="whitespace-nowrap" for="audit_num">Audit #</Label>
					<select v-model="audit.number" id="audit_num" name="audit_num" class="px-4 py-2 text-base" style="height:42px;">
						<option :value="option" v-for="option in [1, 2, 3]" :key="'audit_num-'+option">{{option}}</option>
					</select>
				</div>
				<div class="px-2 xs:w-1/2">
					<Label for="ctarget">Conformance Target</Label>
					<TextInput class="w-full" id="ctarget" name="ctarget" v-model="audit.conformance_target" />
				</div>
			</div>

			<div class="xs:w-full w-1/2 text-left pr-2 h-[108px]">
				<Label for="scope">Scope of the Audit</Label>
				<Textarea style="min-height:67px;" class="w-full" id="scope" name="scope" v-model="audit.scope" rows="2"></Textarea>
			</div>

			<div class="xs:w-full w-1/2 text-left px-2">
				<Label for="essential_functionality">
					Essential Functionality
					<Card :gutters="false" :center="false" class="my-0 overflow-y-scroll w-full text-left max-h-80">
						<div class="flex mb-3" v-for="(input, i) in audit.essential_functionality" :key="`AT-select-${i}`">
							<TextInput class="mr-1 w-11/12" id="essential_functionality" name="essential_functionality" v-model="audit.essential_functionality[i]"></TextInput>
							<Button class="ml-1" :hover="true" @click.native.prevent="removeEssentialFunctionality(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>
						
						<Button :hover="true" @click.native.prevent="addNewEssentialFunctionality">Add New</Button>
					</Card>
				</Label>
			</div>

			<div class="xs:w-full w-1/2 text-left pr-2 h-[108px]">
				<Label for="additional_requirements">Additional Requirements</Label>
				<Textarea style="min-height:67px;" class="w-full" id="additional_requirements" name="additional_requirements" v-model="audit.additional_requirements" rows="2"></Textarea>
			</div>

			<div class="xs:w-full w-1/2 text-left px-2">
				<Label for="software">
					Software Used
					<Card :gutters="false" :center="false" class="my-0 overflow-y-scroll w-full text-left max-h-80">
						<div class="flex mb-3" v-for="(input, i) in audit.software_used" :key="`SU-select-${i}`">
							<select v-model="audit.software_used[i]" class="mr-1 w-11/12" id="software" name="software">
								<option :value="option" v-for="(option, index) in software_used_src" :key="`SU-${index}`">{{option}}</option>
							</select>
							<Button aria-label="remove this 'software used' from the audit" class="ml-1" :hover="true" @click.native.prevent="removeSoftwareUsed(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>
						
						<Button :hover="true" @click.native.prevent="addNewSoftwareUsed">Add New</Button>
					</Card>
				</Label>
			</div>

			<div class="xs:w-full w-1/2 text-left pr-2">
				<Label for="software">
					Assistive Tech
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80">
						<div class="flex mb-3" v-for="(input, i) in audit.assistive_tech" :key="`AT-select-${i}`">
							<select class="mr-1 w-11/12" id="assistive" name="assistive" v-model="audit.assistive_tech[i]">
								<option :value="option" :key="`AT-${index}`" v-for="(option, index) in assistive_tech_src">{{option}}</option>
							</select>
							<Button aria-label="remove this assistive technology from the audit" class="ml-1" :hover="true" @click.native.prevent="removeAssistiveTech(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>
						
						<Button :hover="true" @click.native.prevent="addNewAssistiveTech">Add New</Button>
					</Card>
				</Label>
			</div>

			<div class="xs:w-full w-1/2 text-left px-2">
				<Label for="software">
					Tech Requirements
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80">
						<div class="flex mb-3" v-for="(input, i) in audit.tech_requirements" :key="`TR-select-${i}`">
							<select class="mr-1 w-11/12" id="treqs" name="treqs" v-model="audit.tech_requirements[i]">
								<option :key="`TR-${index}`" v-for="(option, index) in tech_requirements_src">{{option}}</option>
							</select>
							<Button aria-label="remove this technology requirement from the audit" class="ml-1" :hover="true" @click.native.prevent="removeTechReq(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>
						
						<Button :hover="true" @click.native.prevent="addNewTechReq">Add New</Button>
					</Card>
				</Label>
				
			</div>
			
			<!-- <template v-if="$store.getters['auth/isManager']">
				<div class="flex my-3 w-full xs:flex-wrap">
					<Card :gutters="false" class="xs:w-full w-1/2 xs:mb-3 mr-2">
					<h3 class="subheadline" >Users</h3>
					<ul v-if="unassigned.length">
						<li class="my-2" v-for="(id, index) in unassigned" :key="`unAssignedKey-${index}`">
						<span>{{displayUser(id)}}</span>
						<Button :aria-label="`Assign ${displayUser(id)} to audit`" hover="true" class="text-lg leading-4 ml-2" @click.native.prevent="assign(id)">&gt;</Button>
						</li>
					</ul>
					</Card>
					<Card :gutters="false" class="xs:w-full w-1/2 ll-2 ml-2">
						<h3 class="subheadline">Assignees</h3>
						<ul v-if="assigned.length">
							<li class="my-2 flex justify-center items-center" v-for="(id, index) in assigned" :key="`AssignedKey-${index}`">
								<template v-if="!team_members.includes(id)">
									<i style="padding-top:2px; font-size:12px;" title="Assigned by an executive Team Member" class="far fa-info-circle pr-2 text-sm"></i>{{displayUser(id)}}
								</template>
								<template v-else>
									<Button
									:aria-label="`Unassign ${displayUser(id)} from the audit`" 
									hover="true" 
									class="text-lg leading-4 mr-2"
									@click.native.prevent="unassign(id)">&lt;</Button><span>{{displayUser(id)}}</span>
									
								</template>
								
							</li>
						</ul>
					</Card>
				</div>
			</template> -->
			
			<button class="standard my-2" @click.prevent="saveAudit">Save</button>
			
		</div>
		<Modal class="adjust-with-sidebars" :open="confirmModalOpen">
			<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
							<!-- Heroicon name: outline/exclamation -->
							<svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
						</div>
						<div class="mt-3 ml-4 xs:text-center xs:mt-3 xs:ml-0 text-left">
							<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Delete Audit</h3>
							<div class="mt-2">
								<p class="text-sm text-gray-500">
									Are you sure you want to delete this audit? This will delete all associated working sample pages and issues as well. This action cannot be undone.
								</p>
							</div>
						</div>
					</div>
			</div>
			<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
				<button @click="deleteAudit" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
				Delete
				</button>
				<button @click="confirmModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
				Cancel
				</button>
			</div>
		</Modal>
	</div>
</template>

<script>
import Loader from '../../components/Loader'
import Card from '../../components/Card'
import Modal from '../../components/Modal'
import TextInput from '../../components/TextInput'
import Label from '../../components/Label'
import Button from '../../components/Button'
import DatePicker from '../../components/Date'
import Textarea from '../../components/TextArea'
export default {
	data: () => ({
		statusSrc: [
			{name: 'In Progress', value:'in_progress'},
			{name:'Complete', value:'complete'},
			{name:'Archived', value:'archived'},
		],
		assigned: [],
		unassigned: [],
		tech_requirements_src: [
			"HTML5", "ECMAScript 3", "OOXML", "XHTML 1.0", "ECMAScript 5", "ODF 1.2", "HTML 4.01", "DOM", "SVG", "CSS", "Flash", "WAI-ARIA", "Silverlight"
		],
		audit: {
			domain: {},
			title: "",
			essential_functionality: [],
			additional_requirements: "",
			software_used: [],
			assistive_tech: [],
			scope: "",
			tech_requirements: [],
			locked: false,
			number: 1,
			start_date: "",
			end_date: "",
			status: "",
			issue_overview_id: "",
			project_id: "",
			pages: [],
			conformance_target: "WCAG 2.1 Level AA"
		},
		confirmModalOpen: false
	}),
	computed: {
		loading(){
			if( this.$store.state.audits ){
				return this.$store.state.audits.loading || this.$store.state.user.loading
			}
			return false
		},
		projects(){
			return this.$store.state.projects.all
		},
		team_members(){
			let myTeam = this.$store.getters["auth/account"].pivot.team_id
			return this.$store.state.user.byTeam[myTeam]
		},
		assistive_tech_src(){
			return this.$store.state.audits.assistive_tech.map( o=>o.content ) || []
		},
		software_used_src(){
			return this.$store.state.audits.software_used.map( o=>o.content ) || []
		},
		all_users(){
			return this.$store.state.user.all
		}
	},
	props: [],
	watch: {
		"$store.state.audits.audit":function(newVal){
			if( newVal ){
				this.$set(this, "audit", JSON.parse(JSON.stringify(newVal)))
				this.assigned = JSON.parse(JSON.stringify(newVal.assignees.map(  o=>o.id )))
				this.$store.dispatch("audits/getAssistiveTech")
				this.$store.dispatch("audits/getSoftwareUsed")
				this.$store.dispatch("user/getUsers", {vm: this})
				this.$store.dispatch("audits/getSitemap")
				this.$store.dispatch("audits/getStructuredSample")
			}
		},
	},
	methods: {
		deleteAudit(){
			let project_id = this.$store.state.projects.project.id
			this.$store.dispatch("audits/deleteAudit", {audit_id: this.$route.params.id})
			this.$router.push({path: `/projects/${project_id}`})
		},
		removeEssentialFunctionality(index){
			this.audit.essential_functionality.splice(index, 1)
		},
		addNewEssentialFunctionality(){
			this.audit.essential_functionality.push("")
		},
		displayUser(id){
			let user = this.team_members.find( u => u.id == id )
			if( user == undefined ){
				user = this.all_users.find( u => u.id == id )
			}
			return user != undefined ? `${user.first_name} ${user.last_name}` : false
		},
		assign(id){
			let index = this.unassigned.findIndex( v => v == id )
			let user = this.unassigned.splice(index, 1)[0]

			this.assigned.push(user)
		},
		unassign(id){
			let index = this.assigned.findIndex( v => v == id)
			let user = this.assigned.splice(index, 1)[0]

			this.unassigned.push(user)
		},
		changeStartDate(val){
			this.audit.start_date = val;
		},
		changeEndDate(val){
			this.audit.end_date = val;
		},
		addNewSoftwareUsed(){
			this.audit.software_used.push({name:"Android Browser"})
		},
		removeSoftwareUsed(index){
			this.audit.software_used.splice(index, 1)
		},
		addNewTechReq(){
			this.audit.tech_requirements.push({name:"HTML5"})
		},
		removeTechReq(index){
			this.audit.tech_requirements.splice(index, 1)
		},
		addNewAssistiveTech(){
			this.audit.assistive_tech.push({name:"Axe"})
		},
		removeAssistiveTech(index){
			this.audit.assistive_tech.splice(index, 1)
		},
		saveAudit(){
			this.audit.assigned = this.assigned

			this.$store.dispatch("audits/updateAudit", {audit: this.audit, router: this.$router, id: this.$route.params.id})
		}
	},
	created() {
		this.$store.dispatch("audits/getAudit", {id: this.$route.params.id})
	},
	mounted(){
		document.title = "Edit Audit"
	},
	components: {
		Loader,
		TextInput,
		Textarea,
		Label,
		Button,
		Card,
		DatePicker,
		Modal
	},
}
</script>
<style scoped>
	.disabled{
		cursor: not-allowed;
	}
</style>