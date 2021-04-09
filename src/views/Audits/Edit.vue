<template>
	<div class="text-center mt-32">
		<Loader v-if="loading"></Loader>
		<h1>Edit Audit {{audit.title}}</h1>
		<Form class="flex flex-wrap" @submit.native.prevent>
			<div class="w-full">
				<Label for="project">Project</Label>
				<Select name="project" id="project" class="mx-auto" :options="projects" valueProp="id" v-model="audit.project_id"></Select>
			</div>
			<div class="w-1/4"></div>
			<div class="w-1/4">
				<Label for="start_date">Start Date</Label>
				<Date name="start_date" id="start_date" class="mx-auto" @input="changeStartDate" v-model="audit.start_date"></Date>
			</div>
			<div class="w-1/4">
				<Label for="end_date">End Date</Label>
				<Date name="end_date" id="end_date" class="mx-auto" @input="changeEndDate" v-model="audit.end_date"></Date>
			</div>
			<div class="w-1/4"></div>
			<div class="w-full flex justify-center">
				<div class="px-2">
					<Label for="status">Status</Label>
					<Select id="status" class="mx-auto" :options="statusSrc" v-model="audit.status"></Select>
				</div>
				<div class="px-2 w-1/2">
					<Label for="title">Title</Label>
					<TextInput class="w-full" id="title" name="title" v-model="audit.title" />
				</div>
				<div class="px-2">
					<Label for="audit_num">Audit #</Label>
					<Select id="audit_num" class="mx-auto" :options="[{name:1, value: 1}, {name:2, value: 2}, {name:3, value: 3}]" v-model="audit.number"></Select>
				</div>
				<div class="px-2">
					<Label for="ctarget">Conformance Target</Label>
					<TextInput class="w-full" id="ctarget" name="ctarget" v-model="audit.conformance_target" />
				</div>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="scope">Scope of the Audit</Label>
				<Textarea class="w-full" id="scope" name="scope" v-model="audit.scope" rows="4"></Textarea>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="essential_functionality">Essential Functionality</Label>
				<Textarea class="w-full" id="essential_functionality" name="essential_functionality" v-model="audit.essential_functionality" rows="4"></Textarea>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="additional_requirements">Additional Requirements</Label>
				<Textarea class="w-full" id="additional_requirements" name="additional_requirements" v-model="audit.additional_requirements" rows="4"></Textarea>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="software">
					Software Used
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80">
						<div class="flex mb-3" v-for="(input, i) in audit.software_used" :key="`SU-select-${i}`">
							<Select :options="software_used_src"  class="mr-1 w-11/12" id="software" name="software" v-model="audit.software_used[i].name"></Select>
							<Button class="ml-1" :hover="true" @click.native.prevent="removeSoftwareUsed(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>
						
						<Button :hover="true" @click.native.prevent="addNewSoftwareUsed">Add New</Button>
					</Card>
				</Label>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="software">
					Assistive Tech
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80">
						<div class="flex mb-3" v-for="(input, i) in audit.assistive_tech" :key="`AT-select-${i}`">
							<Select :options="assistive_tech_src" class="mr-1 w-11/12" id="assistive" name="assistive" v-model="audit.assistive_tech[i].name"></Select>
							<Button class="ml-1" :hover="true" @click.native.prevent="removeAssistiveTech(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>
						
						<Button :hover="true" @click.native.prevent="addNewAssistiveTech">Add New</Button>
					</Card>
				</Label>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="software">
					Tech Requirements
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80">
						<div class="flex mb-3" v-for="(input, i) in audit.tech_requirements" :key="`TR-select-${i}`">
							<Select :options="tech_requirements_src"  class="mr-1 w-11/12" id="treqs" name="treqs" v-model="audit.tech_requirements[i].name"></Select>
							<Button class="ml-1" :hover="true" @click.native.prevent="removeTechReq(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>
						
						<Button :hover="true" @click.native.prevent="addNewTechReq">Add New</Button>
					</Card>
				</Label>
				
			</div>
			
			<template v-if="$store.getters['auth/isManager']">
				<div class="flex my-3 w-full">
					<Card class="w-1/2">
					<h3>Auditors</h3>
					<ul v-if="unassigned.length">
						<li class="my-2" v-for="(id, index) in unassigned" :key="`unAssignedKey-${index}`">
						<span>{{displayUser(id)}}</span><Button hover="true" class="text-lg leading-4 ml-2" @click.native.prevent="assign(id)">&gt;</Button>
						</li>
					</ul>
					</Card>
					<Card class="w-1/2">
					<h3>Assignees</h3>
					<ul v-if="assigned.length">
						<li class="my-2" v-for="(id, index) in assigned" :key="`AssignedKey-${index}`">
						<Button hover="true" class="text-lg leading-4 mr-2" @click.native.prevent="unassign(id)">&lt;</Button><span>{{displayUser(id)}}</span>
						</li>
					</ul>
					</Card>
				</div>
				
			</template>

			<Button @click.native.prevent="saveAudit">Save</Button>
		</Form>
	</div>
</template>

<script>
import Loader from '../../components/Loader'
import Card from '../../components/Card'
import TextInput from '../../components/TextInput'
import Label from '../../components/Label'
import Select from '../../components/Select'
import Form from '../../components/Form'
import Button from '../../components/Button'
import Date from '../../components/Date'
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
		software_used_src: [
			"Android Browser", "Chrome - Latest", "Chrome for Android", "Edge - Latest", "Firefox - Latest", "Firefox for Android", "IE Mobile 11", "IE11", 
			"Safari - Latest", "iOS Safari -Latest", "Opera - Latest", "Opera Mini"
		],
		assistive_tech_src: [
			"Axe", "NVDA", "JAWS", "TPGI Color Contrast Analyser"
		],
		tech_requirements_src: [
			"HTML5", "ECMAScript 3", "OOXML", "XHTML 1.0", "ECMAScript 5", "ODF 1.2", "HTML 4.01", "DOM", "SVG", "CSS", "Flash", "WAI-ARIA", "Silverlight"
		],
		audit: {
			title: "",
			essential_functionality: "",
			additional_requirements: "",
			software_used: [{name:""}],
			assistive_tech: [{name:""}],
			scope: "",
			tech_requirements: [{name:""}],
			locked: false,
			number: 1,
			start_date: "",
			end_date: "",
			status: "",
			issue_overview_id: "",
			project_id: "",
			sitemap: [],
			audit_sample: [],
			conformance_target: "WCAG 2.1 Level AA"
		}
	}),
	computed: {
		loading(){
			if( this.$store.state.audits ){
				return this.$store.state.audits.loading
			}
			return false
		},
		projects(){
			return this.$store.state.audits.projects || []
		},
		auditors(){
			return this.$store.state.audits.auditors || []
		},
	},
	props: [],
	watch: {},
	methods: {
		displayUser(id){
			let user = this.auditors.find( u => u.user_id == id )
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
			this.audit.software_used.push({name:""})
		},
		removeSoftwareUsed(index){
			this.audit.software_used.splice(index, 1)
		},
		addNewTechReq(){
			this.audit.tech_requirements.push({name:""})
		},
		removeTechReq(index){
			this.audit.tech_requirements.splice(index, 1)
		},
		addNewAssistiveTech(){
			this.audit.assistive_tech.push({name:""})
		},
		removeAssistiveTech(index){
			this.audit.assistive_tech.splice(index, 1)
		},
		saveAudit(){
			this.audit.tech_requirements = this.audit.tech_requirements.map(o=>o.name)
			this.audit.assistive_tech = this.audit.assistive_tech.map(o=>o.name)
			this.audit.software_used = this.audit.software_used.map(o=>o.name)
			this.audit.assigned = this.assigned

			this.$store.dispatch("audits/updateAudit", {audit: this.audit, router: this.$router, id: this.$route.params.id})
		}
	},
	created() {
		this.$store.dispatch("audits/getProjects", {router: this.$router, account_id: this.$store.state.auth.account, vm: this})
	},
	mounted() {
		this.$store.dispatch("audits/getAudit", {id: this.$route.params.id, account_id: this.$store.state.auth.account, vm: this})
	},
	components: {
		Loader,
		TextInput,
		Textarea,
		Label,
		Form,
		Select,
		Button,
		Card,
		Date
	},
}
</script>