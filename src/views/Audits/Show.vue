<template>
	<div class="text-center mt-32 mx-auto">
		<Loader v-if="loading"></Loader>
		
		<template v-if="audit">
			<A class="pr-3" type='router-link' :to="{path: `/audits/${$route.params.id}/edit`}">Edit Audit</A>
			<A type='router-link' :to="{path: `/projects/${audit.project_id}`}">View Project</A>
			<h2 class="mb-3">{{audit.title}}</h2>
			<Table :selected="selectedRows" @rowClick="selectRow" v-if="audit.issues.length" :rowsData="audit.issues" :headersData="headers"></Table>
			<template v-else>
				There are no issues.
			</template>
		</template>
		<div class="flex fixed bottom-0 left-0 mb-3 ml-3" style="z-index:25;">
			<Button @click.native.prevent="issueModalOpen = true" class="mx-2" color="orange" hover="true">Add Issue</Button>
			<Button @click.native.prevent="darkMode = !darkMode" class="mx-2" :color="darkMode ? 'orange' : 'white'" :hover="true">Dark Mode</Button>
		</div>
		<Modal class="z-40" size="full" :open="issueModalOpen">
			<div role="alert" :class="{ 'hidden': !showValidationAlert}" class="sr-only">
				The following validation errors are present on the add issue form: 
				<div v-for="(prop, index) of failedValidation" :key="'validation-error-'+index">{{validationMessages[ prop ]}}</div>
			</div>
			<div style="padding-bottom:60px;" class="bg-white px-4 pt-5 p-6">
				<Button aria-label="Close add issue modal" @click.native.prevent="issueModalOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Button>
				<h2 class="text-center">Add Issue</h2>
				<div class="flex items-start mt-3 text-left w-full flex-wrap">
					
					<div class="flex w-full mt-2">
						<div class="mx-2 flex-1">
							<Label class="text-lg leading-6 w-full" for="success_criteria">Success Criteria</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('articles') }" id="success-criteria-validation">{{validationMessages["articles"]}}</small>
							<select required :aria-describedby="failedValidation.includes('articles') ? 'success-criteria-validation' : false" style="min-width:200px;" id="success_criteria" class="w-full" v-model="issue.articles" multiple>
								<option class="overflow-ellipsis overflow-hidden whitespace-nowrap" :value="article.id" v-for="(article, index) in articles" :key="'success_criteria-'+index">{{article.number}} - {{article.title}}</option>
							</select>
						</div>
						<div class="mx-2 flex-1">
							<Label class="text-lg leading-6 w-full" for="techniques">Techniques</Label>
							<select style="min-width:200px;min-height:118px;" id="techniques" class="w-full" v-model="issue.techniques" multiple>
								<option :value="technique.id" v-for="(technique, index) in filteredTechniques" :key="'technique-'+index">{{technique.number}}</option>
							</select>
						</div>
						<div class="mx-2 flex-1">
							<Label class="text-lg leading-6 w-full" :stacked="false" for="pages">Pages</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('pages') }" id="pages-validation">The pages field is required</small>
							<select :aria-describedby="failedValidation.includes('pages') ? 'pages-validation' : false" required style="min-width:200px;" id="pages" class="w-full" v-model="issue.pages" multiple>
								<option :value="page.content" v-for="(page, index) in audit.pages" :key="'page-'+index">{{page.content}}</option>
							</select>
						</div>
						<div class="mx-2 flex-1">
							<Label class="text-lg leading-6 w-full" for="audit_status">States</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('audit_states') }" id="states-validation">{{validationMessages["audit_states"]}}</small>
							<select :aria-describedby="failedValidation.includes('audit_states') ? 'states-validation' : false" required style="min-width:200px;" id="audit_status" class="w-full" v-model="issue.audit_states" multiple>
								<option :value="status" v-for="(status, index) in audit_states" :key="'audit_status-'+index">{{status}}</option>
							</select>
						</div>
						<div :class="{'hidden': !issue.audit_states.includes('other')}" class="mx-2 flex-1">
							<Label class="text-lg leading-6">
								Other States
								<Card :gutters="false" :center="false" style="max-height:118px;" class="overflow-y-scroll w-full text-left my-2">
									<div class="flex mb-3" v-for="(input, i) in other_states" :key="`other-states-${i}`">
										<TextInput class="flex-1" name="other-states" id="other-states" v-model="other_states[i]"></TextInput>
										<Button class="ml-1" :aria-label="'Remove other issue state ' + other_states[i]" :hover="true" @click.native.prevent="removeOtherState(i)"><i class="fas fa-trash-alt"></i></Button>
									</div>
									
									<Button :hover="true" @click.native.prevent="addNewOtherState">Add New</Button>
								</Card>
							</Label>
							
						</div>
						<div class="mx-2 flex-1">
							<Label class="text-lg leading-6 w-full" for="essential_functionalities">Essential Functionalities</Label>
							<select class="w-full" style="min-width:200px;;" multiple id="essential_functionalities" name="essential_functionalities" v-model="issue.essential_functionality">
								<option v-for="(option, index) in audit.essential_functionality" :key="'essentials-'+index">{{option}}</option>
							</select>
						</div>
						
					</div>

					<div class="flex w-full justify-evenly mt-2">
						<div class="w-2/3 flex items-center">
							<div class="flex flex-col">
								<div class="flex-1 mx-2 flex flex-col">
									<Label class="text-lg leading-6 w-full" for="software_used">Software Used</Label>
									<select style="min-width:200px;" id="software_used" class="flex-1" v-model="selectedSoftware">
										<option :value="option" v-for="(option, index) in audit.software_used" :key="'software_used-'+index">{{option}}</option>
									</select>
								</div>
								<div class="flex-1 mx-2 flex flex-col">
									<Label class="text-lg leading-6 w-full" for="assistive_tech">Assistive Technology</Label>
									<select style="min-width:200px;" id="assistive_tech" class="flex-1" v-model="selectedTech">
										<option value="">None</option>
										<option :value="option" v-for="(option, index) in audit.assistive_tech" :key="'assistive_tech-'+index">{{option}}</option>
									</select>
								</div>
							</div>
							<Button style="margin-top:40px" class="py-2 px-2" color="orange" hover="true" @click.native.prevent="addBrowserCombo">Add Combo</Button>
							<div class="flex-1 mx-2">
								<Label style="margin-bottom:0;" for="browser_combos" class="text-lg leading-6">
									Browser Combinations
									<Card :gutters="false" :center="false" style="min-height:8rem" class="overflow-y-auto w-full text-left max-h-32 my-2">
										<div class="flex mb-3" v-for="(input, i) in issue.browser_combos" :key="`bc-${i}`">
											<TextInput class="flex-1" name="browser_combos" id="browser_combos" v-model="issue.browser_combos[i]"></TextInput>
											<Button class="ml-1" :hover="true" @click.native.prevent="removeBrowserCombo(i)"><i class="fas fa-trash-alt"></i></Button>
										</div>
									</Card>
								</Label>
							</div>
						</div>
						<div class="w-1/3 flex flex-col">
							<Label for="effort">Effort</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('effort') }" id="effort-validation">{{validationMessages["effort"]}}</small>
							<select :aria-describedby="failedValidation.includes('effort') ? 'effort-validation' : false" id="effort" v-model="issue.effort" name="effort">
								<option :value="option" v-for="(option, index) in ['Low', 'Medium', 'High']" :key="'effort-' + index">{{option}}</option>
							</select>
							<Label for="priority">Priority</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('priority') }" id="priority-validation">{{validationMessages["priority"]}}</small>
							<select :aria-describedby="failedValidation.includes('priority') ? 'priority-validation' : false" id="priority" v-model="issue.priority" name="priority">
								<option :value="option" v-for="(option, index) in ['Low', 'Medium', 'High']" :key="'priority-' + index">{{option}}</option>
							</select>
						</div>
					</div>

					<div class="flex w-full justify-evenly mt-2">
						<div class="flex-1 mx-2">
							<Label class="text-lg leading-6">
								Screenshots
								<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80 my-2">
									<div class="flex mb-3" v-for="(input, i) in issue.screenshots" :key="`screen-${i}`">
										<TextInput class="flex-1" name="screenshots" id="screenshots" v-model="issue.screenshots[i]"></TextInput>
										<Button class="ml-1" :aria-label="'Remove screenshot ' + issue.screenshots[i]" :hover="true" @click.native.prevent="removeScreenshot(i)"><i class="fas fa-trash-alt"></i></Button>
									</div>
									
									<Button :hover="true" @click.native.prevent="addNewScreenshot">Add New</Button>
								</Card>
							</Label>
						</div>
						<div class="flex-1 mx-2">
							<Label class="text-lg leading-6">
								Resources
								<Card :gutters="false" :center="false" class="overflow-y-scroll w-full text-left max-h-80 my-2">
									<div class="flex mb-3" v-for="(input, i) in issue.resources" :key="`resource-${i}`">
										<TextInput class="flex-1" name="resources" id="resources" v-model="issue.resources[i]"></TextInput>
										<Button :aria-label="'Remove resource ' + issue.resources[i]" class="ml-1" :hover="true" @click.native.prevent="removeResource(i)"><i class="fas fa-trash-alt"></i></Button>
									</div>
									
									<Button :hover="true" @click.native.prevent="addNewResource">Add New</Button>
								</Card>
							</Label>
						</div>
						<div class="flex-1 mx-2">
							<Label for="target" class="text-lg leading-6 w-full">Target</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('target') }" id="target-validation">{{validationMessages["target"]}}</small>
							<TextInput required :aria-describedby="failedValidation.includes('target') ? 'target-validation' : false" class="flex-1 w-full" name="target" id="target" v-model="issue.target"></TextInput>
							<Label for="status" class="text-lg leading-6 w-full">Status</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('status') }" id="status-validation">{{validationMessages["status"]}}</small>
							<select :aria-describedby="failedValidation.includes('status') ? 'status-validation' : false" id="status" name="status" v-model="issue.status">
								<option :value="option.display" v-for="(option, index) in statuses" :key="'status-'+index">{{option.display}}</option>
							</select>
						</div>
					</div>

					<div class="flex w-full justify-evenly mt-2">
						<div class="w-1/2 flex flex-col px-2">
							<Label :stacked="false" class="text-lg leading-6 w-full" for="issue_descriptions">Descriptions <small>(Note: this editor is not fully accessible)</small></Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('descriptions') }" id="descriptions-validation">{{validationMessages["descriptions"]}}</small>
							<Button class="self-start" @click.native.prevent="selectDescriptionsModalOpen = true" color="orange" hover="true">Add Descriptions</Button>
							<div class="shadow appearance-none bg-white border border-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-pallette-orange placeholder-gray-400 px-4 py-2 rounded-b text-base text-gray-700 w-full" ref="descriptionEditor" style="max-height:296px;min-height:296px;overflow-y:auto;" id="editor1" ></div>
						</div>
						<div class="w-1/2 flex flex-col px-2">
							<Label :stacked="false" class="text-lg leading-6 w-full" for="issue_recommendations">Recommendations <small>(Note: this editor is not fully accessible)</small></Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('recommendations') }" id="recommendations-validation">{{validationMessages["recommendations"]}}</small>
							<Button class="self-start" @click.native.prevent="selectRecommendationsModalOpen = true" color="orange" hover="true">Add Recommendations</Button>
							<div class="shadow appearance-none bg-white border border-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-pallette-orange placeholder-gray-400 px-4 py-2 rounded-b text-base text-gray-700 w-full" ref="recommendationEditor" style="max-height:296px;min-height:296px;overflow-y:auto;" id="editor2" ></div>
						</div>
					</div>
					<div class="flex w-full flex-col mt-2 px-2">
						<Label class="text-lg leading-6 w-full" for="auditor_notes">Auditor Notes</Label>
						<TextArea rows="14" class="w-full" id="auditor_notes" v-model="issue.auditor_notes"></TextArea>
					</div>
					
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex">
				<button v-if="false" type="button" class="mx-2 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-auto text-sm">
					Delete
				</button>
				<button @click="issueModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto text-sm">
					Cancel
				</button>
				<button @click="createIssue" type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-orange hover:text-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto text-sm">
					Save
				</button>
			</div>
		</Modal>
		<Modal class="z-50" :open="selectDescriptionsModalOpen">
			<div class="bg-white px-4 pt-5 pb-4 p-6">
				<Button aria-label="Close select descriptions modal" @click.native.prevent="selectDescriptionsModalOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Button>
				<h2 class="text-center">Which Success Criteria descriptions would you like to add?</h2>
				<select aria-label="Select descriptions" class="m-2 w-full" multiple v-model="selectedDescriptions">
					<option :value="articles[option]" v-for="(option, index) in issue.articles" :key="'descriptions-'+index">{{articles[option].number}}</option>
				</select>
				<Button @click.native.prevent="addSelectedDescriptions" class="mx-2" color="orange" hover="true">Add</Button>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex">
				<button @click="selectDescriptionsModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto text-sm">
				Cancel
				</button>
			</div>
		</Modal>
		<Modal class="z-50" :open="selectRecommendationsModalOpen">
			<div class="bg-white px-4 pt-5 pb-4 p-6">
				<Button aria-label="Close select recommendations modal" @click.native.prevent="selectRecommendationsModalOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Button>
				<h2 class="text-center">Which recommendations would you like to add?</h2>
				<select aria-label="Select recommendations" class="m-2 w-full" multiple v-model="selectedRecommendations">
					<option :value="option" v-for="(option, index) in filteredRecommendations" :key="'recommendations-'+index">{{option.description}}</option>
				</select>
				<Button @click.native.prevent="addSelectedRecommendations" class="mx-2" color="orange" hover="true">Add</Button>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex flex-row-reverse">
				<button @click="selectRecommendationsModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto text-sm">
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

export default {
	data: () => ({
		selectedRows: [],
		quillEditorOptions: [
			[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			['bold', 'italic', 'underline', 'strike'],
			['blockquote', 'code-block'],
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			[{ 'indent': '-1'}, { 'indent': '+1' }],
			[{ 'size': ['small', false, 'large', 'huge'] }],
			[{ 'color': [] }, { 'background': [] }],
			[{ 'align': [] }],
			['link'],
			['clean']
		],
		statuses: [
			{display: "New", color: "#FFFFFF"},
			{display: "Resolved", color: "#C5F8BE"},
			{display: "Partly Resolved", color: "#FFF2CC"},
			{display: "Remains", color: "#F4CCCC"},
			{display: "Regression", color: "#D9D2E9"},
			{display: "Best Practice", color: "#CFE2F3"},
			{display: "Third party problem", color: "#D9D9D9"},
			{display: "Resolved by removal", color: "#D9D9D9"}
		],
		darkMode: false,
		issueModalOpen: false,
		audit_states: [
			"desktop",
			"mobile",
			"normal zoom",
			"200% zoom",
			"logged into account",
			"not logged into account",
			"high contrast mode",
			"screen reader in use",
			"other"
		],
		selectDescriptionsModalOpen: false,
		selectRecommendationsModalOpen: false,
		selectedDescriptions: [],
		selectedRecommendations: [],
		issueDefaults: {
			status: "New",
			pages: [],
			audit_states: [],
			how_discovered: "manual",
			essential_functionality: [],
			target: "",
			screenshots: [""],
			resources: [""],
			browser_combos: [],
			articles: [],
			techniques: [],
			recommendations: [],
			descriptions: "",
			levels: [],
			actrs: [],
			audit_id: "",
			auditor_notes: "",
			priority: "Low",
			effort: "Low",
		},
		issue: {
			status: "New",
			pages: [],
			audit_states: [],
			how_discovered: "manual",
			essential_functionality: [],
			target: "",
			screenshots: [""],
			resources: [""],
			browser_combos: [],
			articles: [],
			techniques: [],
			recommendations: "",
			descriptions: "",
			levels: [],
			actrs: [],
			audit_id: "",
			auditor_notes: "",
			priority: "Low",
			effort: "Low",
		},
		selectedSoftware: "",
		selectedTech: "",
		descriptionsQuill: null,
		recommendationsQuill: null,
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
		showValidationAlert: false,
		other_states: [""]
	}),
	computed: {
		browserCombo(){
			return  this.selectedTech ? this.selectedSoftware + " + " + this.selectedTech : this.selectedSoftware
		},
		displayLevels(){
			return this.issue.levels.join(", ") 
		},
		filteredTechniques(){
			if( this.issue.articles.length ){
				let self = this
				return this.techniques.filter( t => {
					return self.issue.articles.some( a => t.article_ids.includes(a))
				})
			}
			return []
		},
		filteredRecommendations(){
			if( this.issue.articles.length ){
				let self = this
				return this.recommendations.filter( t => {
					return self.issue.articles.some( a => t.article_ids.includes(a))
				})
			}
			return []
		},
		articles(){
			return this.$store.state.audits.articles
		},
		techniques(){
			return this.$store.state.audits.techniques
		},
		recommendations(){
			return this.$store.state.audits.recommendations
		},
		loading(){
			if( this.$store.state.audits ){
				return this.$store.state.audits.loading
			}
			return false
		},
		headers(){
			let arr = []
			if( !this.audit.issues.length ){
				return arr
			}
			let widthMap = {
				id: "150px",
				pages: "250px",
				status: "150px",
				how_discovered: "150px",
				audit_states: "150px",
				target: "300px",
				screenshots: "250px",
				resources: "250px",
				browser_combos: "300px",
				essential_functionality: "300px",
				articles: "150px",
				techniques: "150px",
				recommendations: "400px",
				descriptions: "400px",
				levels: "150px",
				actrs: "250px",
				created_by: "250px",
				issue_number: "150px",
				priority: "150px",
				auditor_notes: "150px",
				effort: "300px",
			}
			let hideByDefault = [
				"id",
				"screenshots",
				"resources",
				"effort",
				"priority",
				"auditor_notes",
				"browser_combos",
				"audit_id",
				"created_at",
				"updated_at",
				"actrs",
				"created_by",
				"how_discovered"
			]
			for( let key of Object.keys(this.audit.issues[0]) ){
				arr.push({
					header: this.parseHeader(key),
					show: !hideByDefault.includes(key),
					sticky: key == "issue_number" || key == "id" ? true : false,
					style: {},
					width: widthMap[key],
				})
			}
			return arr
		},
		audit(){
			return this.$store.state.audits && this.$store.state.audits.audit ? this.$store.state.audits.audit : false
		},
	},
	props: [],
	watch: {
		"$store.state": function(newVal){
			if( !this.audit && newVal.audits ){
				this.$store.dispatch("audits/getAudit", {id: this.$route.params.id, withIssues: true})
			}
		},
		"$store.state.audits.audit": function(newVal){
			this.selectedSoftware = newVal.software_used[0]
		},
		"issue.articles": function(){
			this.issue.levels = []
			this.issue.techniques = []
			this.issue.recommendations = []
			
			for( let i in this.issue.articles ){
				if( !this.issue.levels.includes( this.articles[ this.issue.articles[i] ].level ) ){
					this.issue.levels.push( this.articles[ this.issue.articles[i] ].level )
				}
			}
		},
		failedValidation(newVal){
			if(newVal.includes('descriptions')){
				this.$refs.descriptionEditor.querySelector(".ql-editor").setAttribute("aria-describedby", "descriptions-validation")
			}else{
				this.$refs.descriptionEditor.querySelector(".ql-editor").removeAttribute("aria-describedby")
			}
		}
	},
	methods: {
		selectRow(issue){
			if( this.selectedRows.includes( issue.id ) ){
				let index = this.selectedRows.indexOf( issue.id )
				this.selectedRows.splice(index, 1)
			}else{
				this.selectedRows.push( issue.id )
			}
		},
		htmlDecode(input) {
			var doc = new DOMParser().parseFromString(input, "text/html");
			return doc.documentElement.textContent;
		},
		addSelectedDescriptions(){
			let builder = ""
			for( let j in this.selectedDescriptions ){
				builder += "<div>" + this.htmlDecode(this.selectedDescriptions[j].number + " - " + this.selectedDescriptions[j].description) + '</div><br>'
			}
			builder = builder.replace(/\n|\r/g, "</div><div>")
			
			this.descriptionsQuill.root.innerHTML += builder
			
			this.selectDescriptionsModalOpen = false
		},
		addSelectedRecommendations(){
			let builder = ""
			for( let j in this.selectedRecommendations ){
				builder += "<div>" + this.htmlDecode(this.selectedRecommendations[j].description.replaceAll(/[ ]{2,}/g, '- ')) + '</div><br>'
			}
			builder = builder.replace(/\n|\r/g, "</div><div>")
			
			this.recommendationsQuill.root.innerHTML += builder
			
			this.selectRecommendationsModalOpen = false
		},
		addBrowserCombo(){
			this.issue.browser_combos.push(this.browserCombo)
		},
		addNewOtherState(){
			this.other_states.push("")
		},
		removeOtherState(i){
			this.other_states.splice(i, 1)
		},
		addNewResource(){
			this.issue.resources.push("")
		},
		removeBrowserCombo(i){
			this.issue.browser_combos.splice(i, 1)
		},
		removeResource(i){
			this.issue.resources.splice(i, 1)
		},
		addNewScreenshot(){
			this.issue.screenshots.push("")
		},
		removeScreenshot(i){
			this.issue.screenshots.splice(i, 1)
		},
		parseHeader(string){
			return string.replace(/[-_.]/gm, " ");
		},
		validate(){
			let toValidate = [
				"target",
				"articles",
				"pages",
				"status",
				"descriptions",
				"recommendations",
				"audit_states",
				"effort",
				"priority"
			]
			this.failedValidation = []
			var pass

			for( let prop of toValidate ){
				if( Array.isArray( this.issue[prop] ) ){
					pass = this.issue[prop].length
				}else{
					pass = this.issue[prop]
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
		createIssue(){
			if( this.validate() ){
				this.issue.audit_id = this.$route.params.id
				this.issue.issue_number = this.audit.issues.length + 1
				if( this.issue.audit_states.includes("other") ){
					this.issue.audit_states.splice( this.issue.audit_states.indexOf("other"), 1 )
					this.issue.audit_states = [...this.issue.audit_states, ...this.other_states.filter( i => i !== "")]
				}
				this.$store.dispatch("audits/createIssue", {issue: this.issue})
				this.issueModalOpen = false
				this.issue = this.issueDefaults
			}
		}
	},
	created() {
		if( this.$store.state.audits ){
			this.$store.dispatch("audits/getAudit", {id: this.$route.params.id, withIssues: true})
			this.$store.dispatch("audits/getArticlesTechniquesRecommendations")
		}
	},
	mounted() {
		var Block = Quill.import('blots/block');
		Block.tagName = 'DIV';
		Quill.register(Block, true);

		this.descriptionsQuill = new Quill('#editor1', {
			theme: 'snow',
			modules: {
				toolbar: this.quillEditorOptions
			}
		});
		let self = this
		this.descriptionsQuill.on('text-change', function(){
			self.issue.descriptions = self.descriptionsQuill.root.innerHTML
		})

		let descrEditor = this.$refs.descriptionEditor.querySelector(".ql-editor")
		descrEditor.setAttribute("role", "textbox")
		descrEditor.setAttribute("aria-multiline", true)
		descrEditor.setAttribute("id", "issue_descriptions")
		descrEditor.setAttribute("tabindex", 0)
		descrEditor.setAttribute("aria-describedby", "descriptions-validation")
		descrEditor.setAttribute("required", "required")

		this.recommendationsQuill = new Quill('#editor2', {
			theme: 'snow',
			modules: {
				toolbar: this.quillEditorOptions
			}
		});
		
		this.recommendationsQuill.on('text-change', function(){
			self.issue.recommendations = self.recommendationsQuill.root.innerHTML
		})

		let reccEditor = this.$refs.recommendationEditor.querySelector(".ql-editor")
		reccEditor.setAttribute("role", "textbox")
		reccEditor.setAttribute("aria-multiline", true)
		reccEditor.setAttribute("id", "issue_recommendations")
		reccEditor.setAttribute("tabindex", 0)
		reccEditor.setAttribute("aria-describedby", "recommendations-validation")
		reccEditor.setAttribute("required", "required")
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