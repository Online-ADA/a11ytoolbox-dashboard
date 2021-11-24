<template>
	<div class="text-center container mx-auto">
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
					<select v-model="audit.status" id="status" class="mx-auto p-1" name="status">
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
					<h3>Users</h3>
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
				<h3 v-if="audit.domain" class="text-base">
					{{audit.domain.url}}
					<template v-if="audit.domain.root">/{{audit.domain.root}}</template>
				</h3>
				<span class="text-base my-2">The working sample takes the structured list created with the domain and calculates 10% of the number of items in it. It will then grab that number of pages at random from the sitemap (if it was provided with the domain) and combine them to form the working sample.</span>
				<span v-if="!loading && audit.pages.length" class="my-2 text-base"><span class="font-bold">Refresh Sample:</span> Pull in any changes made the the structured sample while retaining the original sitemap sample</span>
				<span v-if="!loading && audit.pages.length" class="my-2 text-base"><span class="font-bold">Regenerate Sample:</span> Completely rebuild the working sample, including a new random sample from the sitemap, if provided.</span>
				<div class="flex w-full justify-center">
					<Button v-if="!loading && audit.pages.length" class="mt-1 mb-3 mx-2" hover="true" @click.native.prevent="refreshWorkingSample">Refresh Sample</Button>
					<Button v-if="!loading && structuredSample" class="mt-1 mb-3 mx-2" hover="true" @click.native.prevent="generateWorkingSample">{{audit.pages.length ? 'Regenerate Sample' : 'Generate Sample'}}</Button>
				</div>

				<template v-if="audit.domain && audit.domain.pages && audit.domain.pages.length">
					<template v-if="audit.pages.length">
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
								<Button style="margin-bottom:13px" class="ml-3" color="red" hover="true" @click.native.prevent="addNewSampleItem">Add Item</Button>
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
										<tr v-for="(sample, index) in audit.pages" :key="'sample-'+index">
											<td class="p-1.5 overflow-y-auto border border-black">
												<TextInput class="w-full" v-model="sample.title" aria-labelledby="sample-title"></TextInput>
											</td>
											<td class="p-1.5 overflow-y-auto border border-black"><TextInput class="w-full" v-model="sample.url" aria-labelledby="sample-url"></TextInput></td>
											<td class="p-1.5 overflow-y-auto border border-black"><Button @click.native.prevent="deleteItem(index)" color="delete">X</Button></td>
										</tr>
									</tbody>
								</table>
							</Card>
							<Button @click.native.prevent="emptySample" color="red" hover="true" class="mr-3">Remove all</Button>
							<Button @click.native.prevent="resetSample" color="red" hover="true">Reset</Button>
						</Card>
					</template>
				</template>
				<template v-else>
					There is no sitemap yet for this domain. <button @click="$router.push({path: '/'})" class="standard mx-3">Click here</button> to create one
				</template>
			</div>
			<button class="standard my-5 mx-auto" @click.prevent="saveAudit">Save</button>
			
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
		newSampleItem: {title: "", url: ""},
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
				return this.$store.state.audits.loading || this.$store.state.user.loading
			}
			return false
		},
		projects(){
			return this.$store.state.projects.all || []
		},
		team_members(){
			return this.$store.state.user.team_members || []
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
				this.$store.dispatch("user/getTeamMembers", {team: 2})
				this.$store.dispatch("audits/getSitemap")
				this.$store.dispatch("audits/getStructuredSample")
			}
		},
		"$store.state.user.team_members":function(newVal){
			if( newVal && newVal.length ){
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
			this.newSampleItem = {title: "", url: ""}
		},
		resetSample(){
			this.$set(this.audit, "pages", JSON.parse(JSON.stringify(this.$store.state.audits.audit.pages)))
		},
		refreshWorkingSample(){
			this.$store.state.audits.loading = true

			//First get the current working sample
			//Then get the structured sample. We don't want to alter the current sample in any way except to add any new entries from the structured sample in
			//Loop through the structured sample. If the structured sample entry isn't in the current pages, we add it

			//flatten current sample properties for easier comparison
			let current_existing_titles = this.audit.pages.map(p=>p.title)
			let current_existing_urls = this.audit.pages.map(p=>p.url)

			//Now check to see if any of the structured sample objects exist within the current sample
			let new_entries = this.structuredSample.filter( s=> {
				if( s.title != null ){
					let found = current_existing_titles.some( cet => cet != null && cet.toLowerCase() == s.title.toLowerCase() )
					if( found ){
						return false
					}
				}
				if( s.url != null ){
					let found = current_existing_urls.some( ceu => ceu != null && ceu.toLowerCase() == s.url.toLowerCase() )
					if( found ){
						return false
					}
				}
				if( s.url == null && s.title == null ){
					return false
				}
				return true
			})

			//Now remove duplicates.
			let new_entries_final = []
			for (let i = 0; i < new_entries.length; i++) {
				const entry = new_entries[i];
				let found = new_entries_final.some( ne=>{
					if( ne.title != null && entry.title != null ){
						if( ne.title.toLowerCase() == entry.title.toLowerCase() ){
							return true
						}
					}
					if( ne.url != null && entry.url != null ){
						if( ne.url.toLowerCase() == entry.url.toLowerCase() ){
							return true
						}
					}
				})
				if( !found ){
					new_entries_final.push({
						title: entry.title,
						url: entry.url
					})
				}
			}

			this.audit.pages = [...this.audit.pages, ...new_entries_final]
			this.$store.state.audits.loading = false
		},
		generateWorkingSample(){
			this.processSources(this.structuredSample, this.sitemap.length ? JSON.parse(JSON.stringify(this.sitemap)) : [])
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
				//console.log(structured[i].title, structured[i].url);
				if( structured[i].title != null ){
					if( structured[i].title.toLowerCase() == "sitewide" ){
						continue
					}
					if( structured_map.some( el => el.title != null && el.title.toLowerCase() == structured[i].title.toLowerCase()) ){
						continue
					}
				}
				if( structured[i].url != null ){
					if( structured_map.some( el => el.url != null && el.url.toLowerCase() == structured[i].url.toLowerCase()) ){
						continue
					}
				}
				
				structured_map.push({
					title: structured[i].title,
					url: structured[i].url
				})
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
					
					if( sitemap_sample.some( el => el.url.toLowerCase() == sitemap[index].url.toLowerCase()) ){
						sitemap.splice(index, 1)
						continue //break early for efficiency
					}
					
					if( structured_map.some( el => el.url != null && el.url.toLowerCase() == sitemap[index].url.toLowerCase()) ){
						sitemap.splice(index, 1)
						continue
					}

					sitemap_sample.push( {
						title: "",
						url: sitemap[index].url.toLowerCase()
					})
					sitemap.splice(index, 1)
				}
			}

			this.audit.pages = [{title: "Sitewide", url:null}, ...structured_map, ...sitemap_sample]
			this.$store.state.audits.loading = false
		},
		deleteItem(index){
			this.audit.pages.splice(index, 1)
		},
		emptySample(){
			this.audit.pages = []
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