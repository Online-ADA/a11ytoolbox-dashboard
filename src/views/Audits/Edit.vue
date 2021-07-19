<template>
	<div class="text-center mt-32 container mx-auto">
		<Loader v-if="loading"></Loader>
		<h1>Edit Audit {{audit.title}}</h1>
		<div class="flex flex-wrap">
			<div class="w-1/4"></div>
			<div class="w-1/2">
				<Label for="locked">Audit Locked</Label>
				<select v-model="audit.locked" id="locked" class="mx-auto" name="status">
					<option :value="false">False</option>
					<option :value="true">True</option>
				</select>
			</div>
			<div class="w-1/4"></div>
			<div class="w-1/4"></div>
			<div class="w-1/4">
				<Label for="start_date">Start Date</Label>
				<DatePicker name="start_date" id="start_date" class="mx-auto" @input="changeStartDate" v-model="audit.start_date"></DatePicker>
			</div>
			<div class="w-1/4">
				<Label for="end_date">End Date</Label>
				<DatePicker name="end_date" id="end_date" class="mx-auto" @input="changeEndDate" v-model="audit.end_date"></DatePicker>
			</div>
			<div class="w-1/4"></div>
			<div class="w-full flex justify-center">
				<div class="px-2">
					<Label for="status">Status</Label>
					<select v-model="audit.status" id="status" class="mx-auto" name="status">
						<option :value="status.value" v-for="(status, index) in statusSrc" :key="`status-${index}`">{{status.name}}</option>
					</select>
				</div>
				<div class="px-2 w-1/2">
					<Label for="title">Title</Label>
					<TextInput class="w-full" id="title" name="title" v-model="audit.title" />
				</div>
				<div class="px-2">
					<Label for="audit_num">Audit #</Label>
					<select v-model="audit.number" id="audit_num" name="audit_num" class="mx-auto">
						<option :value="option" v-for="option in [1, 2, 3]" :key="'audit_num-'+option">{{option}}</option>
					</select>
					<!-- <Select id="audit_num" class="mx-auto" :options="[1, 2, 3]" v-model="audit.number"></Select> -->
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
				<Label for="essential_functionality">
					Essential Functionality
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80 my-2">
						<div class="flex mb-3" v-for="(input, i) in audit.essential_functionality" :key="`AT-select-${i}`">
							<TextInput class="mr-1 w-11/12" id="essential_functionality" name="essential_functionality" v-model="audit.essential_functionality[i]"></TextInput>
							<Button class="ml-1" :hover="true" @click.native.prevent="removeEssentialFunctionality(i)"><i class="fas fa-trash-alt"></i></Button>
						</div>
						
						<Button :hover="true" @click.native.prevent="addNewEssentialFunctionality">Add New</Button>
					</Card>
				</Label>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="additional_requirements">Additional Requirements</Label>
				<Textarea class="w-full" id="additional_requirements" name="additional_requirements" v-model="audit.additional_requirements" rows="4"></Textarea>
			</div>

			<div class="w-1/2 text-left px-2">
				<Label for="software">
					Software Used
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80 my-2">
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

			<div class="w-1/2 text-left px-2">
				<Label for="software">
					Assistive Tech
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80 my-2">
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

			<div class="w-1/2 text-left px-2">
				<Label for="software">
					Tech Requirements
					<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80 my-2">
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
			
			<template v-if="$store.getters['auth/isManager']">
				<div class="flex my-3 w-full">
					<Card class="w-1/2">
					<h3>Auditors</h3>
					<ul v-if="unassigned.length">
						<li class="my-2" v-for="(id, index) in unassigned" :key="`unAssignedKey-${index}`">
						<span>{{displayUser(id)}}</span><Button aria-label="Assign user to audit" hover="true" class="text-lg leading-4 ml-2" @click.native.prevent="assign(id)">&gt;</Button>
						</li>
					</ul>
					</Card>
					<Card class="w-1/2">
					<h3>Assignees</h3>
					<ul v-if="assigned.length">
						<li class="my-2" v-for="(id, index) in assigned" :key="`AssignedKey-${index}`">
						<Button aria-label="Unassign user from the audit" hover="true" class="text-lg leading-4 mr-2" @click.native.prevent="unassign(id)">&lt;</Button><span>{{displayUser(id)}}</span>
						</li>
					</ul>
					</Card>
				</div>
			</template>
			<div class="flex flex-wrap w-full justify-center">
				<h2 class="mt-2 mb-1 w-full">Working Sample</h2>
				<h3 v-if="audit.domain" class="text-base">{{audit.domain.url}}</h3>
				<span class="text-base my-2">The working sample takes the structured list created with the domain and calculates 10% of the number of items in it. It will then grab that number of pages at random from the sitemap (if it was provided with the domain) and combine them to form the working sample.</span>
				<span v-if="!loading && audit.pages.length" class="my-2 text-base"><span class="font-bold">Refresh Sample:</span> Pull in any changes made the the structured sample while retaining the original sitemap sample</span>
				<span v-if="!loading && audit.pages.length" class="my-2 text-base"><span class="font-bold">Regenerate Sample:</span> Completely rebuild the working sample, including a new random sample from the sitemap, if provided.</span>
				<div class="flex w-full justify-center">
					<Button v-if="!loading && audit.pages.length" class="mt-1 mb-3 mx-2" hover="true" @click.native.prevent="refreshWorkingSample">Refresh Sample</Button>
					<Button v-if="!loading && structuredSample" class="mt-1 mb-3 mx-2" hover="true" @click.native.prevent="generateWorkingSample">{{audit.pages.length ? 'Regenerate Sample' : 'Generate Sample'}}</Button>
				</div>

				<template v-if="audit.pages.length">
					<Card class="w-full p-4 mb-34 mx-2 flex-wrap items-center flex-col">
						<div class="flex flex-wrap w-full justify-center items-end">
							<h3 class="w-full">Add new sample item</h3>
							<Label class="flex-1 pr-3">
								<span>Content</span>
								<TextInput v-model="newSampleItem.content"></TextInput>
							</Label>
							<Label class="flex-1">
								<span>Screen</span>
								<TextInput v-model="newSampleItem.screen"></TextInput>
							</Label>
							<Button style="margin-bottom:13px" class="ml-3" color="orange" @click.native.prevent="addNewSampleItem">Add Item</Button>
						</div>
						
						<h4 class="my-3">Items</h4>
						<Card style="max-height:400px" :gutters="false" class="block mx-auto my-4 overflow-y-auto">
							<table class="w-full border border-black table-fixed">
								<thead>
									<tr>
										<th class="text-center border border-black" width="40%" scope="col"><span id="sample-content">Content</span></th>
										<th class="text-center border border-black" width="40%" scope="col"><span id="sample-screen">Screen</span></th>
										<th class="text-center border border-black" width="10%" scope="col">Delete</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(sample, index) in audit.pages" :key="'sample-'+index">
										<td class="p-1.5 overflow-y-auto border border-black"><TextInput class="w-full" v-model="sample.content" aria-labelledby="sample-content"></TextInput></td>
										<td class="p-1.5 overflow-y-auto border border-black"><TextInput class="w-full" v-model="sample.screen" aria-labelledby="sample-screen"></TextInput></td>
										<td class="p-1.5 overflow-y-auto border border-black"><Button @click.native.prevent="deleteItem(index)" color="delete">X</Button></td>
									</tr>
								</tbody>
							</table>
						</Card>
						<Button @click.native.prevent="emptySample" style="color:white" class="bg-red-600 hover:bg-red-700 mr-3">Remove all</Button>
						<Button @click.native.prevent="resetSample" color="orange" hover="true">Reset</Button>
					</Card>
					<Button class="mx-auto block my-3" @click.native.prevent="saveAudit">Save</Button>
				</template>
			</div>

			
		</div>
	</div>
</template>

<script>
import Loader from '../../components/Loader'
import Card from '../../components/Card'
import TextInput from '../../components/TextInput'
import Label from '../../components/Label'
import Button from '../../components/Button'
import DatePicker from '../../components/Date'
import Textarea from '../../components/TextArea'
export default {
	data: () => ({
		newSampleItem: {content: "", screen: ""},
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
		}
	}),
	computed: {
		loading(){
			if( this.$store.state.audits ){
				return this.$store.state.audits.loading || this.$store.state.audits.auditorsLoading
			}
			return false
		},
		projects(){
			return this.$store.state.audits.projects || []
		},
		auditors(){
			return this.$store.state.audits.auditors || []
		},
		structuredSample(){
			return this.$store.state.audits.structured_sample || []
		},
		sitemap(){
			return this.$store.state.audits.sitemap || []
		},
		assistive_tech_src(){
			return this.$store.state.audits.assistive_tech.map( o=>o.content ) || []
		},
		software_used_src(){
			return this.$store.state.audits.software_used.map( o=>o.content ) || []
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
				this.$store.dispatch("audits/getAuditors")
				this.$store.dispatch("audits/getSitemap")
				this.$store.dispatch("audits/getStructuredSample")
			}
		},
		"$store.state.audits.auditors":function(newVal){
			if( newVal ){
				let self = this
				this.unassigned = JSON.parse(JSON.stringify(newVal.filter( o=>!self.assigned.includes(o.id)).map( o=>o.id )))
			}
		}
	},
	methods: {
		removeEssentialFunctionality(index){
			this.audit.essential_functionality.splice(index, 1)
		},
		addNewEssentialFunctionality(){
			this.audit.essential_functionality.push("")
		},
		addNewSampleItem(){
			this.audit.pages.push(this.newSampleItem)
			this.newSampleItem = {content: "", screen: ""}
		},
		resetSample(){
			this.$set(this.audit, "pages", JSON.parse(JSON.stringify(this.$store.state.audits.audit.pages)))
		},
		refreshWorkingSample(){
			this.$store.state.audits.loading = true

			//flatten current pages to get just the content
			let current_sample_content = this.audit.pages.map( o=>o.content) 
			//flatten structured sample
			let structured_list = this.structuredSample.map( o=>o.content ) 
			//figure out sitemap entries by checking against 2 flattened arrays. This gets us a flat array of the sitemap values
			let sitemap_content_list = current_sample_content.filter( p=> !structured_list.includes(p))
			//now get the actual objects from the current pages by comparing against the flat sitemap values array
			let sitemap_list = this.audit.pages.filter( p=>sitemap_content_list.includes(p.content) )

			let structured_map = []
			let self = this

			//Remove duplicates from structured sample
			for( let i in self.structuredSample ){
				let found = structured_map.some( el => el.content == self.structuredSample[i].content)
				
				if( !found ){
					structured_map.push({
						content: self.structuredSample[i].content,
						screen: self.structuredSample[i].screen
					})
				}
			}

			this.audit.pages = [...structured_map, ...sitemap_list]
			this.$store.state.audits.loading = false
		},
		generateWorkingSample(){
			this.processSources(this.structuredSample, this.sitemap.length ? JSON.parse(JSON.stringify(this.sitemap)) : [])
		},
		processSources(structured, sitemap){
			this.$store.state.audits.loading = true

			//Calculate what 10% of the structured list is
			let tenPercent = parseInt( structured.length * .1 )
			if( tenPercent < 10 ){
				tenPercent = 10
			}
			
			let sitemap_sample = []
			let structured_map = []

			//Remove duplicates from structured sample
			for( let i in structured ){
				let found = structured_map.some( el => el.content == structured[i].content)
				
				if( !found ){
					structured_map.push({
						content: structured[i].content,
						screen: structured[i].screen
					})
				}
			}

			if( sitemap.length ){
				//Remove duplicates from sitemap and structured sample
				while( sitemap_sample.length <= tenPercent ){
					if( sitemap.length < 1 ){
						break
					}
					let index = Math.floor( Math.random() * (sitemap.length - 1)) + 1
					let found = sitemap_sample.some( el => el.content == sitemap[index].url)
					if( found ){
						sitemap.splice(index, 1)
						continue //break early for efficiency
					}
					found = structured_map.some( el => el.content == sitemap[index].url)
					if( found ){
						sitemap.splice(index, 1)
						continue
					}

					sitemap_sample.push( {
						content: sitemap[index].url,
						screen: ""
					})
					sitemap.splice(index, 1)
				}
			}

			this.audit.pages = [...structured_map, ...sitemap_sample]
			this.$store.state.audits.loading = false
		},
		deleteItem(index){
			this.audit.pages.splice(index, 1)
		},
		emptySample(){
			this.audit.pages = []
		},
		displayUser(id){
			let user = this.auditors.find( u => u.id == id )
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
	components: {
		Loader,
		TextInput,
		Textarea,
		Label,
		Button,
		Card,
		DatePicker
	},
}
</script>