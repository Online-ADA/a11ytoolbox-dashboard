<template>
	<Modal class="z-50" :open="open">
		<Loader v-if="loading"></Loader>
		<template v-if="complete">
			<h1>Go to Audit?</h1>
			<button @click.prevent="EventBus.closeModal( ()=>{ chooseYes() })" class="standard mr-3">Yes</button>
			<button @click.prevent="EventBus.closeModal( ()=>{ chooseNo() })" class="standard">No</button>
		</template>

		<template v-else>
			<h1>Create New WCAG Audit</h1>
		
			<div v-if="open" class="w-full flex flex-col items-start">
				<small v-if="client">Client: {{client.name}}</small>
				<small v-if="project">Project: {{project.name}}</small>
				<small v-if="propertyType == 'website' && step === 2">Domain: {{currentDomain.url}}</small>

				<fieldset role="radiogroup" class="w-full mt-3">
					<legend class="font-semibold">Choose a Property</legend>
					<div class="flex items-center">
						<Label class="pr-3" :stacked="false" for="property-type-website">
							Website
							<input v-model="propertyType" type="radio" id="property-type-website" name="property-type" value="website" />
						</Label>
						
						<Label class="pr-3" :stacked="false" for="property-type-desktop">
							Desktop App
							<input v-model="propertyType" type="radio" id="property-type-desktop" name="property-type" value="desktop_app" />
						</Label>
						
						<Label :stacked="false" for="property-type-mobile">
							Mobile App
							<input v-model="propertyType" type="radio" id="property-type-mobile" name="property-type" value="mobile_app" />
						</Label>
					</div>
				</fieldset>
				
				
				<template v-if="propertyType == 'website' && step == 1">
					<template v-if="domains.length">
						<h2 class="py-4 font-bold">Choose a domain for {{project.name}}</h2>
						<Label for="choose_select">Select Domain</Label>
						<select class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-orange p-2 rounded shadow" v-model="selectedDomain" name="choose_domain" id="choose_select">
							<option :value="domain.id" v-for="(domain) in domains" :key="'domain-' + domain.id">{{domain.url}}</option>
						</select>
						<button @click.prevent="step = 2" class="standard mt-3">Continue</button>
					</template>
					<template v-if="domains.length">
						<h2 class="py-4 font-bold">Or create a new one</h2>
					</template>
					<template v-if="!domains.length">
						<h2 class="py-4 font-bold">Create a New Domain</h2>
					</template>

					<form action="#" class="flex flex-wrap" @submit.prevent>
						<div class="px-2">
							<Label for="domain-title">Title</Label>
							<TextInput class="w-full" id="domain-title" v-model="domain.title" />
						</div>
						<div class="px-2">
							<Label for="domain-existing-url">Url</Label>
							<div class="flex">
								<select class="mx-auto block border cursor-pointer focus:ring-1 outline-none ring-pallette-orange p-2 rounded shadow" v-model="protocol" name="domain-protocol">
									<option :value="protocol" v-for="(protocol, index) in ['https://', 'http://']" :key="'domain-protocol-' + index">{{protocol}}</option>
								</select>
								<TextInput placeholder="example.com" class="w-9/12 ml-1" id="domain-existing-url" v-model="url" />
							</div>
							{{fullUrl}}
						</div>
						<div class="mt-3">
							<button class="standard mr-2" @click.prevent="createDomain">Create</button>
						</div>
					</form>
				</template>
				
				<template v-if="(propertyType == 'website' && step == 2) || propertyType != 'website'">
					<Label for="audit-title">Title</Label>
					<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('title') }" id="title-validation">{{validationMessages["title"]}}</small>
					<TextInput :data-validation-failed="failedValidation.includes('title') ? 'invalid-3' : false" required :aria-describedby="failedValidation.includes('title') ? 'title-validation' : false" class="w-full" id="audit-title" name="title" v-model="audit.title" />

					<Label for="audit-scope">Scope</Label>
					
					<select v-model="audit.scope" class="p-1" id="audit-scope" name="scope">
						<option :value="option" v-for="option in scope_options" :key="'scope-option-'+option">{{option}}</option>
					</select>
					<template v-if="audit.scope == 'Other'">
						<Label for="audit-scope-other">Define Other</Label>
						<TextInput v-model="scope_other_description" id="audit-scope-other" required></TextInput>
					</template>
					

					<template v-if="isManager">
						<h2 class="text-base font-semibold my-3">Assign Users</h2>
						<div class="flex w-full">
							<Card class="w-1/2">
								<h3 class="text-lg">Team Members</h3>
								<ul class="overflow-y-auto max-h-60" v-if="unassigned.length">
									<li class="my-2" v-for="(id, index) in unassigned" :key="`unAssignedKey-${index}`">
										<span>{{displayUser(id)}}</span><Button aria-label="assign this user to the audit" hover="true" class="text-lg leading-4 ml-2" @click.native.prevent="assign(id)">&gt;</Button>
									</li>
								</ul>
							</Card>
							<Card class="w-1/2">
								<h3 class="text-lg">Assignees</h3>
								<ul class="overflow-y-auto max-h-60" v-if="assigned.length">
									<li class="my-2" v-for="(id, index) in assigned" :key="`AssignedKey-${index}`">
										<Button aria-label="unassign this user to the audit" hover="true" class="text-lg leading-4 mr-2" @click.native.prevent="unassign(id)">&lt;</Button><span>{{displayUser(id)}}</span>
									</li>
								</ul>
							</Card>
						</div>
						
					</template>

					<template v-if="propertyType == 'website'">
						<fieldset class="w-full mt-3">
							<legend class="font-semibold">Sitemap Settings</legend>
							<div class="flex items-center">
								<Label class="pr-3" :stacked="false" for="sitemap-full">
									Use Full Sitemap
									<input v-model="audit.sitemap" type="radio" id="sitemap-full" name="sitemap-choice" value="full" class="mt-3" />
								</Label>
								
								<Label :stacked="false" for="sitemap-generate">
									Generate
									<input v-model="audit.sitemap" type="radio" id="sitemap-generate" name="sitemap-choice" value="generate" class="mt-3" />
								</Label>
							</div>
						</fieldset>
					</template>

					<button class="standard mr-2" @click.prevent="deployTool">Deploy</button>
				</template>
			</div>
			<button @click.prevent="EventBus.closeModal( ()=>{ EventBus.$emit('deployWCAGAuditModal', false)})" class="standard">Cancel</button>
		</template>
		
	</Modal>
</template>

<script>
	import Modal from "../Modal.vue"
	import Loader from "../Loader.vue"
	import TextInput from "../TextInput.vue"
	import Button from "../Button.vue"
	import Label from "../Label.vue"
	import Card from "../Card.vue"
	import { EventBus } from "../../services/eventBus"

	export default {
		props:{
			open:{
				type: Boolean,
				default: false
			},
		},
		data: () => ({
			propertyType: "website",
			EventBus: EventBus,
			selectedDomain: false,
			url: "",
			protocol: "https://",
			domain: {
				title: "",
				project_id: ""
			},
			step: 1,
			failedValidation: [],
			showValidationAlert: false,
			validationMessages: {
				"title": "The title field is required",
			},
			scope_options:[
				"The whole website/app",
				"The account creation user journey",
				"The login user journey",
				"The site search experience",
				"The shopping and checkout user journey",
				"Other"
			],
			audit: {
				title: "",
				scope: "The whole website/app",
				sitemap: "full", //full or generate
				assigned: []
			},
			scope_other_description:"",
			assigned: [],
			unassigned: [],
			complete: false
		}),
		name: 'CreateWCAGAuditModal',
		methods:{
			chooseNo(){
				this.reset()
				EventBus.$emit('deployWCAGAuditModal', false)
				this.$router.push({path: `/audits/${this.$store.state.audits.all[this.$store.state.audits.all.length - 1].id}/overview`})
			},
			chooseYes(){
				this.reset()
				EventBus.$emit('deployWCAGAuditModal', false)
				this.$router.push({path: `/audits/${this.$store.state.audits.all[this.$store.state.audits.all.length - 1].id}`})
			},
			displayUser(id){
				let user = this.team_members.find( u => u.id == id )
				return user != undefined ? `${user.first_name} ${user.last_name}` : false
			},
			deployTool(){
				if( this.validate() ){
					this.audit.assigned = this.assigned
					this.audit.project_id = this.$store.state.projects.project.id
					this.audit.domain_id = this.selectedDomain
					this.audit.property_type = this.propertyType

					if( this.audit.scope == "Other" ){
						this.audit.scope = this.scope_other_description
					}

					this.$store.dispatch("audits/createAudit", {audit: this.audit, vm: this, createScan: this.createScan})
				}else{
					let self = this
					this.$nextTick( ()=>{
						let allValidationErrors = document.querySelectorAll("[data-validation-failed]");
						
						allValidationErrors[0].scrollIntoView({
							block: "center"
						})
						allValidationErrors[0].focus()

						self.$notify({
							title: "Warning",
							text: `There are ${allValidationErrors.length} validation errors in the create audit form`,
							type: "warn"
						})
					})


				}
			},
			reset(){
				this.domain = {
					title: "",
					project_id: ""
				}
				this.url = ""
				this.protocol = "https://"
				this.audit = {
					title: "",
					scope: "The whole website/app",
					sitemap: "full", //full or generate
					assigned: []
				}
				this.scope_other_description = ""
				this.complete = false
				this.assigned = []
				this.unassigned = []
			},
			createDomain(){
				this.domain.url = this.fullUrl
				this.domain.project_id = this.project.id
				let that = this
				
				this.$store.dispatch("domains/createDomain", {domain: this.domain, callback: ((domain)=>{
					that.selectedDomain = domain.id
					that.step = 2
					that.reset()
				})})
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
			validate(){
				let toValidate = [
					"title",
					// "status",
					// "essential_functionality",
					// "scope",
					// "conformance_target",
					// "software_used",
					// "assistive_tech",
					// "tech_requirements",
					// "number",
					// "start_date",
					// "working_sample",
				]
				this.failedValidation = []
				var pass

				for( let prop of toValidate ){
					if( Array.isArray( this.audit[prop] ) ){
						pass = this.audit[prop].length
					}else{
						pass = this.audit[prop]
					}

					if( !pass ){
						if( !this.failedValidation.includes( prop ) ){
							this.failedValidation.push( prop )
						}
					}
				}

				if( this.failedValidation.length !== 0 ){
					this.showValidationAlert = true
					setTimeout(()=>{
						this.showValidationAlert = false
					}, 500)
				}

				return this.failedValidation.length === 0
			},
		},
		mounted(){},
		created(){},
		watch:{
			team_members(newVal){
				this.unassigned = newVal.map( o=>o.id)
			},
			open: function(newVal){
				if( newVal ){
					if( this.domains.length ){
						this.selectedDomain = this.domains[0].id
					}

					if( this.isManager ){ //Get the team members each time modal is opened
						this.$store.dispatch("user/getTeamMembers", {team: 2})
					}
				}
			},
			propertyType: function(newVal){
				if( newVal == 'website' ){
					this.step = 1
				}
			}
		},
		computed: {
			isManager(){
				return this.$store.getters["auth/isManager"]
			},
			team_members(){
				return this.$store.state.user.team_members
			},
			currentDomain(){
				return this.domains.find(d=>d.id == this.selectedDomain)
			},
			project(){
				return this.$store.state.projects.project
			},
			client(){
				return this.$store.state.clients.client
			},
			domains(){
				if( this.project ){
					return this.project.domains
				}

				return []
			},
			loading(){
				return this.$store.state.audits.loading
			},
			fullUrl(){
				let url = this.url.replace(/(?:^https?(:?\/\/?)?)+|(?:\/+|\s$)+/ig, "")
				return this.protocol + url
			},
		},
		components:{
			Modal,
			TextInput,
			Button,
			Label,
			Card,
			Loader,
		}
	}
</script>