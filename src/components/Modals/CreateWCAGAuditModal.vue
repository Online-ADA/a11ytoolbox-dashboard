<template>
	<Modal @initialized="getRootModal" :valign="'top'" style="z-index:999" :size="'creation'" :open="open">
		<Loader v-if="loading" :local="true"></Loader>
		<template v-if="complete">
			<h1 class="headline">Go to Audit?</h1>
			<button @click.prevent="EventBus.closeModal( ()=>{ chooseYes() })" class="standard mr-3">Yes</button>
			<button @click.prevent="EventBus.closeModal( ()=>{ chooseNo() })" class="standard">No</button>
		</template>

		<template v-else>
			<h1 class="headline">Create New WCAG Audit</h1>
			<button aria-label="Close Create New WCAG Audit modal" @click.prevent="EventBus.closeModal(()=>{EventBus.$emit('deployWCAGAuditModal', false)})" class="absolute top-4 right-4 standard">X</button>
		
			<div v-if="open" class="w-full flex flex-col items-start">
				<div class="flex">
					<small class="mr-2" v-if="client">Client: {{client.name}}</small>
					<small class="mr-2" v-if="project">Project: {{project.name}}</small>
				</div>

				<div class="w-full">
					<Label for="audit-title">Title of WCAG Audit</Label>
					<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('title') }" id="title-validation">{{validationMessages["title"]}}</small>
					<TextInput :data-validation-failed="failedValidation.includes('title') ? 'invalid-3' : false" required :aria-describedby="failedValidation.includes('title') ? 'title-validation' : false" class="w-full" id="audit-title" name="title" v-model="audit.title" />

					<Label for="audit-scope">Scope of WCAG Audit</Label>
					<select v-model="audit.scope" class="p-1 xs:max-w-full" id="audit-scope" name="scope">
						<option :value="option" v-for="option in scope_options" :key="'scope-option-'+option">{{option}}</option>
					</select>
					<template v-if="audit.scope == 'Other'">
						<Label for="audit-scope-other">Define Other</Label>
						<TextInput v-model="scope_other_description" id="audit-scope-other" required></TextInput>
					</template>
				</div>

				<fieldset role="radiogroup" class="w-full">
					<legend class="pt-7 subheadline">Choose a Property</legend>
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
				
				<template v-if="propertyType == 'website'">
					<template v-if="projectDomains.length">
						<h2 id="choose_select_heading" class="pt-4 pb-3 subheadline">Select a Domain</h2>
						<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('domain') }" id="domain-validation">{{validationMessages["domain"]}}</small>
						<select 
						:data-validation-failed="failedValidation.includes('domain') ? 'invalid-3' : false" 
						required 
						:aria-describedby="failedValidation.includes('domain') ? 'domain-validation' : false" 
						aria-labelledby="choose_select_heading" 
						class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-orange p-2 rounded shadow xs:w-full sm:w-auto" v-model="selectedDomain" 
						name="choose_domain" 
						id="choose_select">
							<option :value="domain.id" v-for="(domain) in projectDomains" :key="'domain-' + domain.id">
								{{domain.url}}<template v-if="domain.root">/{{domain.root}}</template>
							</option>
						</select>
					</template>
					<button 
					@click="createDomainSectionOpen = !createDomainSectionOpen" 
					:aria-expanded="createDomainSectionOpen ? 'true' : 'false'" 
					class="text-base mt-3">
						<template v-if="projectDomains.length">
							Or Add a New Domain
						</template>
						<template v-if="!projectDomains.length">
							Create a New Domain
						</template>
					</button>

					<form v-if="createDomainSectionOpen" action="#" class="flex flex-wrap" @submit.prevent>
						<div class="px-2 w-full">
							<Label for="domain-existing-url">Url</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('domainURL') }" id="domainURL-validation">{{validationMessages["domainURL"]}}</small>
							<div class="flex">
								<select
								class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-orange p-2 rounded shadow" 
								v-model="protocol" 
								name="domain-protocol">
									<option :value="protocol" v-for="(protocol, index) in ['https://', 'http://']" :key="'domain-protocol-' + index">{{protocol}}</option>
								</select>
								<TextInput
								:data-validation-failed="failedValidation.includes('domainURL') ? 'invalid-3' : false" 
								:aria-describedby="failedValidation.includes('domainURL') ? 'domainURL-validation' : false"
								required 
								placeholder="example.com" 
								class="w-9/12 ml-1" 
								id="domain-existing-url" 
								v-model="url" />
							</div>
						</div>

						<div class="mt-3 w-full">
							<button v-if="domain_loading" disabled class="standard mr-2">Add Domain</button>
							<button v-else class="standard mr-2" @click.prevent="createDomain">Add Domain</button>
						</div>
						<div class="feedback" role="status" aria-live="polite"> 
							{{domain_feedback}}
						</div> 
					</form>
				</template>

				<template v-if="propertyType != 'website'">
					<template v-if="$store.state.projects.project.software != undefined && $store.state.projects.project.software.length">
						<h2 id="choose_select_heading" class="pt-4 pb-3 subheadline">Select a Software</h2>
						<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('software') }" id="software-validation">{{validationMessages["software"]}}</small>
						<select 
						:data-validation-failed="failedValidation.includes('software') ? 'invalid-3' : false" 
						required 
						:aria-describedby="failedValidation.includes('software') ? 'software-validation' : false" 
						aria-labelledby="choose_select_heading" 
						class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-orange p-2 rounded shadow xs:w-full sm:w-auto" v-model="selectedSoftware" 
						name="choose_software" 
						id="choose_select">
							<option :value="software.id" v-for="software in $store.state.projects.project.software" :key="'software-' + software.id">
								{{software.title}}
							</option>
						</select>
					</template>
					<button 
					@click="createSoftwareSectionOpen = !createSoftwareSectionOpen" 
					:aria-expanded="createSoftwareSectionOpen ? 'true' : 'false'" 
					class="text-base mt-3">
						<template v-if="$store.state.projects.project.software != undefined && $store.state.projects.project.software.length">
							Or Add a New Software
						</template>
						<template v-if="$store.state.projects.project.software == undefined || !$store.state.projects.project.software.length">
							Create a New Software
						</template>
					</button>

					<form v-if="createSoftwareSectionOpen" action="#" class="flex flex-wrap" @submit.prevent>
						<div class="px-2 w-full">
							<Label for="software-existing-title">Title</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('softwareTitle') }" id="softwareTitle-validation">{{validationMessages["softwareTitle"]}}</small>
							<div class="flex">
								<TextInput
								:data-validation-failed="failedValidation.includes('software.title') ? 'invalid-3' : false" 
								:aria-describedby="failedValidation.includes('software.title') ? 'softwareTitle-validation' : false"
								required
								class="w-9/12 ml-1" 
								id="software-existing-title" 
								v-model="software.title" />
							</div>
						</div>

						<div class="mt-3 w-full">
							<button v-if="software_loading" disabled class="standard mr-2">Add Software</button>
							<button v-else class="standard mr-2" @click.prevent="createSoftware">Add Software</button>
						</div>
						<div class="feedback" role="status" aria-live="polite"> 
							{{software_feedback}}
						</div> 
					</form>
				</template>
				
				<!-- <div class="w-full">

					<template v-if="isManager">
						<h2 class="subheadline pt-7 pb-3">Assign Users</h2>
						<div class="flex w-full xs:flex-wrap">
							<Card :gutters="false" class="xs:w-full w-1/2 md:mr-5 sm:mr-5 xs:mb-5">
								<h3 v-if="isExecutive" class="subheadline">Assign Account Users</h3>
								<h3 v-if="!isExecutive" class="subheadline">Assign Team Members</h3>
								<ul class="overflow-y-auto max-h-60" v-if="unassigned.length">
									<li class="my-2" v-for="(id, index) in unassigned" :key="`unAssignedKey-${index}`">
										<span>{{displayUser(id)}}</span><Button aria-label="assign this user to the audit" hover="true" class="text-lg leading-4 ml-2" @click.native.prevent="assign(id)">&gt;</Button>
									</li>
								</ul>
							</Card>
							<Card :gutters="false" class="xs:w-full w-1/2">
								<h3 class="subheadline">Assignees</h3>
								<ul class="overflow-y-auto max-h-60" v-if="assigned.length">
									<li class="my-2" v-for="(id, index) in assigned" :key="`AssignedKey-${index}`">
										<Button aria-label="unassign this user to the audit" hover="true" class="text-lg leading-4 mr-2" @click.native.prevent="unassign(id)">&lt;</Button><span>{{displayUser(id)}}</span>
									</li>
								</ul>
							</Card>
						</div>
						
					</template>
				</div> -->
			</div>
			<button class="standard mr-2 mt-2" @click.prevent="deployTool">Deploy</button>
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
			selectedSoftware: false,
			createDomainSectionOpen: false,
			createSoftwareSectionOpen: false,
			domain_loading: false,
			software_loading: false,
			software_feedback: '',
			domain_feedback: '',
			protocol: "https://",
			url: "",
			domain: {
				project_id: "",
				url: "",
			},
			software: {
				project_id: "",
				title: "",
			},
			failedValidation: [],
			showValidationAlert: false,
			validationMessages: {
				"title": "The title field is required",
				"domainURL": "The domain url is required",
				"domain": "A domain is required",
				"software.title" : "The software title field is required",
				"software": "A software is required"
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
				assigned: []
			},
			scope_other_description:"",
			assigned: [],
			unassigned: [],
			rootModal: "",
			complete: false,
		}),
		name: 'CreateWCAGAuditModal',
		methods:{
			getRootModal(root){
				this.rootModal = root
			},
			chooseNo(){
				this.reset()
				EventBus.$emit('deployWCAGAuditModal', false)
			},
			chooseYes(){
				this.reset()
				this.$store.state.projects.tool.type = "audit"
				EventBus.$emit('deployWCAGAuditModal', false)
				this.$router.push({path: `/audits/${this.$store.state.audits.all[this.$store.state.audits.all.length - 1].id}`})
			},
			displayUser(id){
				let user = this.users.find( u => u.id == id )
				return user != undefined ? `${user.first_name} ${user.last_name}` : false
			},
			deployTool(){
				if( this.validate() ){
					this.audit.assigned = this.assigned
					this.audit.project_id = this.$store.state.projects.project.id
					this.audit.domain_id = this.selectedDomain
					this.audit.software_id = this.selectedSoftware
					this.audit.property_type = this.propertyType

					if( this.audit.scope == "Other" ){
						this.audit.scope = this.scope_other_description
					}

					this.$store.dispatch("audits/createAudit", {audit: this.audit, vm: this})
					this.reset()
					this.rootModal.scrollTop = 0
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
					assigned: []
				}
				this.scope_other_description = ""
				this.complete = false
				this.selectedDomain = false

				this.software = {
					title: "",
					project_id: ""
				}
				this.selectedSoftware = false		
				this.software_loading = false,
				this.software_feedback = '',	
				this.domain_feedback = '',	

				this.assigned = []
				this.unassigned = []
			},
			createSoftware(){
				this.software_loading = true
				this.software_feedback = 'Software is being created.'
				this.software.project_id = this.project.id
				let that = this
				this.$store.dispatch("properties/createSoftware", {software: this.software, callback: ((software)=>{
					that.selectedSoftware = software.id
					that.software.title = ""
					that.software_feedback = 'Software created successfully and added to list.'
					that.software_loading = false
					that.createSoftwareSectionOpen = false
				})})
			},
			createDomain(){
				this.domain_loading = true
				this.domain_feedback = 'Domain is being created.'
				this.domain.url = this.fullUrl
				this.domain.project_id = this.project.id
				let that = this
				
				this.$store.dispatch("domains/createDomain", {domain: this.domain, callback: ((domain)=>{
					that.selectedDomain = domain.id
					that.domain.url = ""
					that.url = ""
					that.domain_feedback = 'Domain created successfully and added to list.'
					that.domain_loading = false
					that.createDomainSectionOpen = false
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
					"domain",
					"software.title",
					"software"
				]
				this.failedValidation = []
				var pass

				for( let prop of toValidate ){
					switch(prop){
						case "software.title":
							if( this.propertyType != 'website' ){
								pass = (this.createSoftwareSectionOpen && this.software.title) || 
										!this.createSoftwareSectionOpen
							}
							else{
								pass = true
							}
							break
						case "title":
							pass = this.audit.title
							break
						case "software":
							if( this.propertyType != "website" ){
								pass = this.selectedSoftware
							}else{
								pass = true
							}
							break
						case "domain":
							if( this.propertyType == "website" ){
								pass = this.selectedDomain
							}else{
								pass = true
							}
							break
						case "domainURL":
							if( this.propertyType == 'website' ){
								pass = (this.createDomainSectionOpen && this.domain.url) || 
										!this.createDomainSectionOpen
							}
							else{
								pass = true
							}
							break
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
			selectedDomain(val) {
				if(val) {
					this.createDomainSectionOpen = false
				}
			},
			open: function(newVal){
				if( newVal ){
					if( !this.project.domains || !this.project.domains.length ){
						this.createDomainSectionOpen = true
					}
					// this.$store.dispatch("user/getUsers", {vm: this})
				}
			},
		},
		computed: {
			isManager(){
				return this.$store.getters["auth/isManager"]
			},
			isExecutive(){
				return this.$store.getters["auth/isExecutive"]
			},
			team_members(){
				let myTeam = this.$store.getters["auth/account"].pivot.team_id
				return this.$store.state.user.byTeam[myTeam]
			},
			users() {
				return this.$store.state.user.all
			},
			account(){
				return this.$store.getters["auth/account"]
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
			loading(){
				return this.$store.state.audits.loading
			},
			fullUrl(){
				let url = this.url.replace(/(?:^https?(:?\/\/?)?)+|(?:\/+|\s$)+/ig, "")
				return this.protocol + url
			},
			projectDomains(){
				return this.project.domains || []
			}
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