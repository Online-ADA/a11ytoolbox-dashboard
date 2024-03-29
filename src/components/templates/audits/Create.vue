<template>
	<div class="text-center mt-20">
		<Loader v-if="loading"></Loader>
		<div role="alert" :class="{ 'hidden': !showValidationAlert}" class="sr-only">
			The following validation errors are present on the create audit form: 
			<div v-for="(prop, index) of failedValidation" :key="'validation-error-'+index">{{validationMessages[ prop ]}}</div>
		</div>
		<h1>Create new Audit</h1>
		<div class="flex flex-wrap w-2/3 mx-auto">
			<div class="w-1/4"></div>
			<div class="w-1/4">
				<Label for="start_date">Start Date</Label>
				<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('start_date') }" id="start-date-validation">{{validationMessages["start_date"]}}</small>
				<Date :data-validation-failed="failedValidation.includes('start_date') ? 'invalid-1' : false" required :aria-describedby="failedValidation.includes('start_date') ? 'start-date-validation' : false" name="start_date" id="start_date" class="mx-auto" @input="changeStartDate"></Date>
			</div>
			<div class="w-1/4">
				<Label for="end_date">End Date</Label>
				<Date name="end_date" id="end_date" class="mx-auto" @input="changeEndDate"></Date>
			</div>
			<div class="w-1/4"></div>
			<div class="w-full flex justify-center">
				<div class="px-2">
					<Label for="status">Status</Label>
					<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('status') }" id="status-validation">{{validationMessages["status"]}}</small>
					<Select :data-validation-failed="failedValidation.includes('status') ? 'invalid-2' : false" required :aria-describedby="failedValidation.includes('status') ? 'status-validation' : false" id="status" class="mx-auto" :options="statusSrc" v-model="audit.status"></Select>
				</div>
				<div class="px-2 w-1/2">
					<Label for="audit-title">Title</Label>
					<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('title') }" id="title-validation">{{validationMessages["title"]}}</small>
					<TextInput :data-validation-failed="failedValidation.includes('title') ? 'invalid-3' : false" required :aria-describedby="failedValidation.includes('title') ? 'title-validation' : false" class="w-full" id="audit-title" name="title" v-model="audit.title" />
				</div>
				<div class="px-2">
					<Label for="audit_num">Audit #</Label>
					<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('number') }" id="number-validation">{{validationMessages["number"]}}</small>
					<Select :data-validation-failed="failedValidation.includes('number') ? 'invalid-4' : false" required :aria-describedby="failedValidation.includes('number') ? 'number-validation' : false" id="audit_num" class="mx-auto" :options="[{name:1, value: 1}, {name:2, value: 2}, {name:3, value: 3}]" v-model="audit.number"></Select>
				</div>
				<div class="px-2">
					<Label for="ctarget">Conformance Target</Label>
					<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('conformance_target') }" id="conformance-target-validation">{{validationMessages["conformance_target"]}}</small>
					<TextInput :data-validation-failed="failedValidation.includes('conformance_target') ? 'invalid-5' : false" required :aria-describedby="failedValidation.includes('conformance_target') ? 'conformance-target-validation' : false" class="w-full" id="ctarget" name="ctarget" v-model="audit.conformance_target" />
				</div>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="scope">Scope of the Audit</Label>
				<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('scope') }" id="scope-validation">{{validationMessages["scope"]}}</small>
				<Textarea :data-validation-failed="failedValidation.includes('scope') ? 'invalid-6' : false" required :aria-describedby="failedValidation.includes('scope') ? 'scope-validation' : false" class="w-full" id="scope" name="scope" v-model="audit.scope" rows="4"></Textarea>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="essential_functionality">
					<div>Essential Functionality</div>
					<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('essential_functionality') }" id="essential-functionality-validation">{{validationMessages["essential_functionality"]}}</small>
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80">
						<div class="flex mb-3" v-for="(input, i) in audit.essential_functionality" :key="`AT-select-${i}`">
							<TextInput :data-validation-failed="failedValidation.includes('essential_functionality') ? 'invalid-7' : false" required :aria-describedby="failedValidation.includes('essential_functionality') ? 'essential-functionality-validation' : false" class="mr-1 w-11/12" id="essential_functionality" name="essential_functionality" v-model="audit.essential_functionality[i]"></TextInput>
							<Button aria-label="delete this essential functionality entry from the list" class="ml-1" :hover="true" @click.native.prevent="removeEssentialFunctionality(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>
						
						<Button :hover="true" @click.native.prevent="addNewEssentialFunctionality">Add New<span class="sr-only"> essential functionality entry to this list</span></Button>
					</Card>
				</Label>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="additional_requirements">Additional Requirements</Label>
				<Textarea class="w-full" id="additional_requirements" name="additional_requirements" v-model="audit.additional_requirements" rows="4"></Textarea>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="audit-software">
					<div>Software Used</div>
					<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('software_used') }" id="software-used-validation">{{validationMessages["software_used"]}}</small>
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80">
						<div class="flex mb-3" v-for="(input, i) in audit.software_used" :key="`SU-select-${i}`">
							<Select :data-validation-failed="failedValidation.includes('software_used') ? 'invalid-8' : false" required :aria-describedby="failedValidation.includes('software_used') ? 'software-used-validation' : false" :options="software_used_src"  class="mr-1 w-11/12" id="audit-software" name="software" v-model="audit.software_used[i]"></Select>
							<Button aria-label="delete this software used entry from the list" class="ml-1" :hover="true" @click.native.prevent="removeSoftwareUsed(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>

						<Button :hover="true" @click.native.prevent="addNewSoftwareUsed">Add New<span class="sr-only"> software used entry to this list</span></Button>
					</Card>
				</Label>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="audit-assistive">
					<div>Assistive Tech</div>
					<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('assistive_tech') }" id="assistive-tech-validation">{{validationMessages["assistive_tech"]}}</small>
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80">
						<div class="flex mb-3" v-for="(input, i) in audit.assistive_tech" :key="`AT-select-${i}`">
							<Select :data-validation-failed="failedValidation.includes('assistive_tech') ? 'invalid-9' : false" required :aria-describedby="failedValidation.includes('assistive_tech') ? 'assistive-tech-validation' : false" :options="assistive_tech_src" class="mr-1 w-11/12" id="audit-assistive" name="assistive" v-model="audit.assistive_tech[i]"></Select>
							<Button aria-label="delete this assistive technology entry from the list" class="ml-1" :hover="true" @click.native.prevent="removeAssistiveTech(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>
						
						<Button :hover="true" @click.native.prevent="addNewAssistiveTech">Add New<span class="sr-only"> assistive technology entry to this list</span></Button>
					</Card>
				</Label>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="audit-treqs">
					<div>Tech Requirements</div>
					<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('tech_requirements') }" id="tech-requirements-validation">{{validationMessages["tech_requirements"]}}</small>
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80">
						<div class="flex mb-3" v-for="(input, i) in audit.tech_requirements" :key="`TR-select-${i}`">
							<Select :data-validation-failed="failedValidation.includes('tech_requirements') ? 'invalid-10' : false" required :aria-describedby="failedValidation.includes('tech_requirements') ? 'tech-requirements-validation' : false" :options="tech_requirements_src"  class="mr-1 w-11/12" id="audit-treqs" name="treqs" v-model="audit.tech_requirements[i]"></Select>
							<Button aria-label="delete this technology requirement entry from the list" class="ml-1" :hover="true" @click.native.prevent="removeTechReq(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>
						
						<Button :hover="true" @click.native.prevent="addNewTechReq">Add New</Button>
					</Card>
				</Label>
				
			</div>
			
			<template v-if="isManager">
				<div class="flex my-3 w-full">
					<Card class="w-1/2">
					<h3>Auditors</h3>
					<ul v-if="unassigned.length">
						<li class="my-2" v-for="(id, index) in unassigned" :key="`unAssignedKey-${index}`">
							<span>{{displayUser(id)}}</span><Button aria-label="assign this user to the audit" hover="true" class="text-lg leading-4 ml-2" @click.native.prevent="assign(id)">&gt;</Button>
						</li>
					</ul>
					</Card>
					<Card class="w-1/2">
					<h3>Assignees</h3>
					<ul v-if="assigned.length">
						<li class="my-2" v-for="(id, index) in assigned" :key="`AssignedKey-${index}`">
							<Button aria-label="unassign this user to the audit" hover="true" class="text-lg leading-4 mr-2" @click.native.prevent="unassign(id)">&lt;</Button><span>{{displayUser(id)}}</span>
						</li>
					</ul>
					</Card>
				</div>
				
			</template>

			<div class="flex flex-wrap w-full justify-center mb-24">
				<h2 class="my-2">Working Sample</h2>
				<span class="text-base my-2">The working sample takes the structured list created with the domain and calculates 10% of the number of items in it. It will then grab that number of pages at random from the sitemap (if it was provided with the domain) and combine them to form the working sample.</span>
				<Button :data-validation-failed="failedValidation.includes('working_sample') ? 'invalid' : false" :aria-describedby="failedValidation.includes('working_sample') ? 'working-sample-validation' : false" class="mt-1 mb-3" hover="true" @click.native.prevent="generateWorkingSample">Generate working sample</Button>
				<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('working_sample') }" id="working-sample-validation">{{validationMessages["working_sample"]}}</small>

				<template v-if="audit.working_sample.length">
					<Card class="w-full p-4 mb-34 mx-2 flex-wrap items-center flex-col">
						<div class="flex flex-wrap w-full justify-center items-end">
							<h3 class="w-full">Add new sample item</h3>
							<Label class="flex-1 pr-3">
								<span>Title</span>
								<TextInput v-model="newSampleItem.title"></TextInput>
							</Label>
							<Label class="flex-1">
								<span>Url</span>
								<TextInput v-model="newSampleItem.url"></TextInput>
							</Label>
							<Button style="margin-bottom:13px" class="ml-3" color="red" @click.native.prevent="addNewSampleItem">Add Item</Button>
						</div>
						
						<h4 class="my-3">Items</h4>
						<Card style="max-height:400px" :gutters="false" class="block mx-auto my-4 overflow-y-auto">
							<table class="w-full border border-black table-fixed">
								<thead>
									<tr>
										<th class="text-center border border-black" width="40%" scope="col"><span id="sample-title">Title</span></th>
										<th class="text-center border border-black" width="40%" scope="col"><span id="sample-url">Url</span></th>
										<th class="text-center border border-black" width="10%" scope="col">Delete</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(sample, index) in audit.working_sample" :key="'sample-'+index">
										<td class="p-1.5 overflow-y-auto border border-black"><TextInput v-model="sample.title" aria-labelledby="sample-title"></TextInput></td>
										<td class="p-1.5 overflow-y-auto border border-black"><TextInput v-model="sample.url" aria-labelledby="sample-url"></TextInput></td>
										<td class="p-1.5 overflow-y-auto border border-black"><Button aria-label="Delete this sample item" @click.native.prevent="deleteItem(index)" color="delete">X</Button></td>
									</tr>
								</tbody>
							</table>
						</Card>
						<Button @click.native.prevent="emptySample" color="delete">Remove all<span class="sr-only"> sample items</span></Button>
					</Card>
					<Label :stacked="false" class="flex text-lg mt-2">
						<Checkbox v-model="createScan"></Checkbox>
						Create an automatic scan for this audit?
					</Label>
					<h2 class="my-3 w-full">Save and go to audit</h2>
					<Button hover="true" @click.native.prevent="createAudit">Create</Button>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import Loader from '../../Loader'
import TextInput from '../../TextInput'
import Label from '../../Label'
import Select from '../../Select'
import Button from '../../Button'
import Textarea from '../../TextArea'
import Card from '../../Card'
import Date from '../../Date'
import Checkbox from '../../Checkbox.vue'

export default {
	data: () => ({
		failedValidation: [],
		showValidationAlert: false,
		validationMessages: {
			"start_date": "The start date field is required",
			"title": "The title field is required",
			"status": "The status field is required",
			"essential_functionality": "The essential functionality field is required",
			"scope": "The scope field is required",
			"conformance_target": "The conformance target field is required",
			"software_used": "The software used field is required",
			"assistive_tech": "The assistive tech field is required",
			"tech_requirements": "The tech requirements field is required",
			"number": "The number field is required",
			"working_sample": 'A working sample is required. Please click the "generate working sample" button',
		},
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
			title: "",
			essential_functionality: [""],
			additional_requirements: "",
			software_used: [""],
			assistive_tech: [""],
			scope: "",
			tech_requirements: [""],
			locked: false,
			number: 1,
			start_date: "",
			end_date: "",
			status: "",
			issue_overview_id: "",
			project_id: "",
			working_sample: [],
			conformance_target: "WCAG 2.1 Level AA"
		},
        complete: false,
		newSampleItem: {title: "", url: ""},
		createScan: false
	}),
    watch:{
      complete(newVal){
			if( newVal ){
				this.$emit("complete", {sheetIndex: this.$parent.index})
			}
		},
		
		team_members(newVal){
			this.unassigned = newVal.map( o=>o.id)
		}
    },
	computed: {
		loading(){
			if( this.$store.state.audits ){
				return this.$store.state.audits.loading
			}
			return false
		},
		assistive_tech_src(){
			return this.$store.state.audits.assistive_tech.map( o=>o.content ) || []
		},
		software_used_src(){
			return this.$store.state.audits.software_used.map( o=>o.content ) || []
		},
		
		team_members(){
			return this.$store.state.user.team_members
		},
		isManager(){
			return this.$store.getters["auth/isManager"]
		},
		sheetData(){
			return this.$parent.$parent.sheetData
		},
		structuredSample(){
			return this.sheetData.sheet2.sample.structured
		},
		sitemap(){
			return this.sheetData.sheet2.sample.sitemap
		},
	},
	props: [],
	methods: {
		validate(){
			let toValidate = [
				"title",
				"status",
				"essential_functionality",
				"scope",
				"conformance_target",
				"software_used",
				"assistive_tech",
				"tech_requirements",
				"number",
				"start_date",
				"working_sample",
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
		removeTechReq(index){
			this.audit.tech_requirements.splice(index, 1)
		},
		removeAssistiveTech(index){
			this.audit.assistive_tech.splice(index, 1)
		},
		removeSoftwareUsed(index){
			this.audit.software_used.splice(index, 1)
		},
		removeEssentialFunctionality(index){
			this.audit.essential_functionality.splice(index, 1)
		},
		addNewEssentialFunctionality(){
			this.audit.essential_functionality.push("")
		},
		addNewSampleItem(){
			this.audit.working_sample.push(this.newSampleItem)
			this.newSampleItem = {content: "", screen: ""}
		},
		emptySample(){
			this.audit.working_sample = []
		},
		displayUser(id){
			let user = this.team_members.find( u => u.id == id )
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
			this.audit.software_used.push("")
		},
		addNewTechReq(){
			this.audit.tech_requirements.push("")
		},
		addNewAssistiveTech(){
			this.audit.assistive_tech.push("")
		},
		processSources(structured, sitemap){
			this.$store.state.audits.loading = true
			//The end product is calculated like this:
			//The entire structured sample + a number of additional pages from the sitemap that equal 10% of the structured sample
			//i.e. if the structured sample is 30 pages/screens, the working sample should be 3 additional pages

			//Calculate what 10% of the structured list is
			let tenPercent = parseInt( structured.length * .1 )
			if( tenPercent < 10 ){
				tenPercent = 10
			}
			
			let sitemap_sample = []
			let structured_map = []

			//Remove duplicates from structured sample
			for( let i in structured ){
				if( structured[i].title.toLowerCase() == "sitewide" ){
					continue
				}
				let found = structured_map.some( el => {
								if(el.title && structured[i].title){
									return el.title.toLowerCase() == structured[i].title.toLowerCase()
								}
							}) &&
							structured_map.some( el => {
								if(el.url && structured[i].url){
									return el.url.toLowerCase() == structured[i].url.toLowerCase()
								}
							})

				if( !found ){
					structured_map.push({
						title: structured[i].title,
						url: structured[i].url
					})
				}
			}

			if( sitemap.length ){
				//Remove duplicates from sitemap and structured sample
				while( sitemap_sample.length <= tenPercent ){
					if( sitemap.length < 1 ){
						break
					}
					let index = Math.floor( Math.random() * (sitemap.length - 1))
					if( !sitemap[index] ){
						continue
					}
					let found = sitemap_sample.some( el => {
						if(el.url && sitemap[index].url){
							el.url.toLowerCase() == sitemap[index].url.toLowerCase()
						}
					})

					if( found ){
						sitemap.splice(index, 1)
						continue //break early for efficiency
					}
					found = structured_map.some( el => {
								if( el.title && sitemap[index].url ){
									el.title.toLowerCase() == sitemap[index].url.toLowerCase()
								}
							}) ||
							structured_map.some( el => {
								if(el.url && sitemap[index].url){
									el.url.toLowerCase() == sitemap[index].url.toLowerCase()
								}
							})

					if( found ){
						sitemap.splice(index, 1)
						continue
					}

					sitemap_sample.push( {
						title: "",
						url: sitemap[index].url
					})
					sitemap.splice(index, 1)
				}
			}

			this.audit.working_sample = [{title: "Sitewide", url: null}, ...structured_map, ...sitemap_sample]
			this.$store.state.audits.loading = false
		},
		generateWorkingSample(){
			this.processSources(this.structuredSample, this.sitemap.length ? JSON.parse(JSON.stringify(this.sitemap)) : [])
		},
		deleteItem(index){
			this.audit.working_sample.splice(index, 1)
		},
		createAudit(){
			if( this.validate() ){
				this.audit.assigned = this.assigned
				this.audit.project_id = this.sheetData.sheet0.project
				this.audit.domain_id = this.sheetData.sheet1.domain

				this.$store.dispatch("audits/createAudit", {audit: this.audit, router: this.$router, createScan: this.createScan})
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
	},
	created() {
		
	},
	mounted() {
		if( this.isManager && !this.team_members.length ){
			this.$store.dispatch("user/getUsers")
		}
		
		this.$store.dispatch("audits/getAssistiveTech")
		this.$store.dispatch("audits/getSoftwareUsed")
	},
	components: {
		Loader,
		TextInput,
		Textarea,
		Label,
		Select,
		Button,
		Card,
		Date,
		Checkbox,
	},
}
</script>