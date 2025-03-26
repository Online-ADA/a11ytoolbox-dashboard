<template>
	<div>
		<Loader v-if="loading"></Loader>
		
		<template v-if="audit">
			<template v-if="audit.status == 'running_automation'">
				<div class="mr-2"><i class="fas fa-circle-notch fa-spin"></i></div>An automated audit is currently running and could take a couple of minutes. Data will be refreshed on completion.
			</template>

			<div :class="{'h-[220px]': showMeasurables, 'h-0': !showMeasurables}" class="bg-white transition-[height]">
				<!-- <Graph :chartId="'line-chart'"></Graph> -->
			</div>
			<Table
			:key="$store.state.audits.audit.id"
			class="xs:mt-[65px]" 
			@sort="(payload)=>{ metaEvent('audit', `${$route.params.id}-issues-columns-sortedBy`, payload) }" 
			@hideColumns="(payload)=>{ metaEvent('audit', `${$route.params.id}-issues-columns-visible`, payload) }" 
			@moveColumn="(payload)=>{ metaEvent('audit', `${$route.params.id}-issues-columns-positions`, payload) }"
			:defaultSortData="tableDefaultSortBy" 
			@freezeColumn="(payload)=>{ metaEvent('audit', `${$route.params.id}-issues-columns-stickied`, payload) }" 
			:issuesTable="true" 
			:condense="shouldCondense" 
			:locked="audit.locked" 
			@selectAll="selectAll" 
			@deselectAll="deselectAll"
			:audit_id="$route.params.id"
			ref="issuesTable" 
			:selected="selectedRows" 
			@rowClick="selectRow" 
			@pageChange="storePaginationData"
			v-if="issues && issues.length" 
			:rowsData="issues" 
			:headersData="headers"></Table>
			<div class="flex justify-center items-center mt-14" v-else>
				There are no issues currently. Add issues <button title="Add Issue" v-if="!audit.locked" class="mx-2 bg-transparent pointer-only" @click.prevent="toolbarEmit('audit-add-issue', $event)"><i class="far fa-plus-square"></i></button> or run an automated audit <router-link class="mx-2" :to="{path: `/automations/${$route.params.id}/new`}" title="Initiate an Automated Audit"><i class="far fa-barcode-scan"></i></router-link>.
			</div>
		</template>
		
		<Modal style="z-index:71;" size="full" :open="issueModalOpen">
			<div class="bg-white">
				<button aria-label="Close add issue modal" @click.prevent="EventBus.closeModal( ()=>{issueModalOpen = false} )" class="absolute top-4 right-4 standard">X</button>
				<div class="flex items-center">
					<h2 class="headline mr-5">{{issue.id ? "Edit Issue" : "Add Issue"}}</h2>
					<Toggle :value="issueModalAdvancedView" class="whitespace-nowrap" v-if="audit.property_type == 'website'" @changed="changeView" :labelLeft="'Simple View'" :labelRight="'Advanced View'" ></Toggle>
					<!-- <Toggle class="whitespace-nowrap" v-if="audit.property_type == 'website'" @changed="((ev)=>{ issueModalAdvancedView = ev })" :labelLeft="'Simple View'" :labelRight="'Advanced View'" ></Toggle> -->
				</div>
				
				<div v-show="showValidationAlert" role="alert" id="validation-alert-box" class="text-red-600" >
					<strong>The following validation errors are present on the add issue form: </strong>
					<div v-for="(prop, index) of failedValidation" :key="'validation-error-'+index">{{validationMessages[ prop ]}}</div>
				</div>

				<form class="flex items-start mt-3 text-left w-full flex-wrap">
					<!-- Row 1 -->
					<div class="flex w-full mt-2 flex-wrap">
						<div class="w-[493.48px] max-[493.48px]">
							<Label for="target" class="text-lg leading-6 w-full subheadline">Target Element Description</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('target') }" id="target-validation">{{validationMessages["target"]}}</small>
							<TextInput :data-validation-failed="failedValidation.includes('target')" required :aria-describedby="failedValidation.includes('target') ? 'target-validation' : false" class="flex-1 w-full" name="target" id="target" v-model="issue.target"></TextInput>
						</div>
					</div>
					<!-- Row 2 -->
					<div class="flex w-full mt-2 flex-wrap">
						<div class="pr-2 flex-1 h-[220px]">
							<div class="flex justify-between">
								<Label class="text-lg leading-6 w-full subheadline" :stacked="false" for="pages">Pages</Label>
								<Toggle fontSize="small" class="whitespace-nowrap" v-if="audit.property_type == 'website'" @changed="((ev)=>{ useSitemap = ev })" :labelLeft="'Working Sample'" :labelRight="'Sitemap'" ></Toggle>
							</div>
							
							<template v-if="audit.property_type == 'website'">
								<select id="pages" class="w-full h-full max-h-[180px] min-w-[200px]" v-model="issue.pages" multiple>
									<option class="break-words whitespace-normal" :value="{title: page.title, url: page.url}" v-for="(page, index) in pagesSrc" :key="'page-'+index">
										<template v-if="page.title">{{page.title}}</template>
										<template v-if="page.title && page.url"> - </template>
										<template v-if="page.url">{{page.url}}</template>
									</option>
								</select>
							</template>
							<template v-if="audit.property_type != 'website'">
								<select id="pages" class="w-full h-full max-h-[180px] min-w-[200px]" v-model="issue.pages" multiple>
									<option class="break-words whitespace-normal" :value="{title: screen.name}" v-for="(screen, index) in pagesSrc" :key="'page-'+index">
										{{screen.name}}
									</option>
								</select>
							</template>
						</div>

						<div class="mx-2 flex-1">
							<div>
								<Label class="text-lg leading-6 w-full subheadline" for="success_criteria">Success Criteria</Label>
								<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('articles') }" id="success-criteria-validation">{{validationMessages["articles"]}}</small>
								<select @change="changeArticles" :data-validation-failed="failedValidation.includes('articles')" required :aria-describedby="failedValidation.includes('articles') ? 'success-criteria-validation' : false" id="success_criteria" class="min-w-[200px] w-full" v-model="issue.articles" multiple>
									<option class="overflow-ellipsis overflow-hidden whitespace-nowrap" :value="{display: article.number + ' - ' + article.title, id: article.id}" v-for="(article, index) in articles" :key="'success_criteria-'+index">{{article.number}} - {{article.title}}</option>
								</select>
							</div>
							<div>
								<div v-show="filteredTechniques.length && issueModalAdvancedView" class="mx-2 flex-1">
									<Label class="text-lg leading-6 w-full subheadline" for="techniques">Add Techniques</Label>
									<div class="overflow-y-auto max-h-[50px] h-[50px]">
										<div class="flex justify-start items-center" v-for="(technique, index) in filteredTechniques" :key="'technique-'+index">
											<Checkbox v-model="issue.techniques" :vsValue="{display: technique.number + ' - ' + technique.title, id: technique.id}" :data-technique="technique.number"></Checkbox>
											<Label class="text-lg leading-6 subheadline py-0" for="techniques">{{technique.number}}</Label>
										</div>
									</div>
									
								</div>
							</div>
						</div>
						
						<div class="mx-2 w-[15%]">
							<div>
								<Label for="status" class="text-lg leading-6 w-full subheadline">Status</Label>
								<select class="w-full p-[2.5px]" id="status" name="status" v-model="issue.status">
									<option :value="option" v-for="(option, index) in statuses" :key="'status-'+index">{{option}}</option>
								</select>
							</div>
							<div>
								<Label class="subheadline text-lg" for="priority">Priority</Label>
								<select class="w-full p-[2.5px]" id="priority" v-model="issue.priority" name="priority">
									<option :value="option" v-for="(option, index) in ['Minor', 'Moderate', 'Serious', 'Critical']" :key="'priority-' + index">{{option}}</option>
								</select>
							</div>
							<div v-if="issueModalAdvancedView">
								<Label class="subheadline text-lg" for="effort">Effort</Label>
								<select class="w-full p-[2.5px]" id="effort" v-model="issue.effort" name="effort">
									<option :value="option" v-for="(option, index) in ['Low', 'Medium', 'High']" :key="'effort-' + index">{{option}}</option>
								</select>
							</div>
						</div>
						<div class="mx-2 flex-1">
							<div v-if="issueModalAdvancedView">
								<Label class="text-lg leading-6 w-full subheadline" for="audit_status">States</Label>
								<select id="audit_status" class="w-full min-w-[200px] h-[70px]" v-model="issue.audit_states" multiple>
									<option :value="status" v-for="(status, index) in audit_states" :key="'audit_status-'+index">{{status}}</option>
								</select>
							</div>

							<div v-show="audit.essential_functionality && audit.essential_functionality.length && issueModalAdvancedView">
							
								<Label class="text-lg leading-6 w-full subheadline" for="essential_functionalities">Essential Functionalities</Label>
								<select class="w-full min-w-[200px] h-[70px]" multiple id="essential_functionalities" name="essential_functionalities" v-model="issue.essential_functionality">
									<option v-for="(option, index) in audit.essential_functionality" :key="'essentials-'+index">{{option}}</option>
								</select>
							</div>
						</div>
					</div>
					<!-- Row 3 -->
					<div class="flex w-full sm:flex-wrap md:flex-wrap mt-2">
						<div class="flex flex-col pr-2 flex-1">
							<div class="flex justify-between items-center">
								<Label :stacked="false" class="text-lg leading-6 w-full subheadline flex-1" for="issue_descriptions">Success Criteria Descriptions</Label>
								<button class="standard" @click.prevent="resetIssueDescriptions" >Reset Descriptions</button>
							</div>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('descriptions') }" id="descriptions-validation">{{validationMessages["descriptions"]}}</small>
							
							<div class="shadow appearance-none bg-white border border-gray-300 focus:border-transparent placeholder-gray-400 px-4 py-2 rounded-b text-base text-gray-700 w-full" ref="descriptionEditor" style="max-height:324px;min-height:324px;overflow-y:auto;" id="editor1"></div>
						</div>
						<div v-if="issueModalAdvancedView" class="flex flex-col px-2 flex-1">
							<Label :stacked="false" class="text-lg leading-6 w-full subheadline" for="issue_description">Issue Description</Label>
							<textarea style="max-height:392px;min-height:392px;overflow-y:auto;" class="shadow appearance-none bg-white border border-gray-300 focus:border-transparent placeholder-gray-400 px-4 py-2 rounded-b text-base text-gray-700 w-full" rows="14" v-model="issue.issue_description"></textarea>
						</div>
						<div class="flex flex-col px-2 flex-1">
							<div class="flex justify-between items-center">
								<Label :stacked="false" class="text-lg leading-6 w-full subheadline flex-1" for="issue_recommendations">Recommendations </Label>
								<button class="standard" @click.prevent="selectRecommendationsModalOpen = true" >Add Recommendations</button>
							</div>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('recommendations') }" id="recommendations-validation">{{validationMessages["recommendations"]}}</small>
							
							<div class="shadow appearance-none bg-white border border-gray-300 focus:border-transparent placeholder-gray-400 px-4 py-2 rounded-b text-base text-gray-700 w-full" ref="recommendationEditor" style="max-height:324px;min-height:324px;overflow-y:auto;" id="editor2" ></div>
						</div>
					</div>
					<!-- Row 4 -->
					<div v-if="issueModalAdvancedView" class="flex w-full flex-wrap justify-evenly mt-2">
						<div class="xs:w-full sm:w-full flex-wrap w-2/3 flex items-center">
							<div class="flex flex-col xs:w-full">
								<div class="flex-1 mx-2 flex flex-col">
									<Label class="text-lg leading-6 w-full subheadline" for="software_used">Software Used</Label>
									<select style="min-width:200px;" id="software_used" class="flex-1" v-model="selectedSoftware">
										<option :value="option" v-for="(option, index) in audit.software_used" :key="'software_used-'+index">{{option}}</option>
									</select>
								</div>
								<div class="flex-1 mx-2 flex flex-col">
									<Label class="text-lg leading-6 w-full subheadline" for="assistive_tech">Assistive Technology</Label>
									<select style="min-width:200px;" id="assistive_tech" class="flex-1" v-model="selectedTech">
										<option value="">None</option>
										<option :value="option" v-for="(option, index) in audit.assistive_tech" :key="'assistive_tech-'+index">{{option}}</option>
									</select>
								</div>
							</div>
							<button style="margin-top:40px" class="px-2 standard" @click.prevent="addBrowserCombo">Add Combo</button>
							<div class="flex-1 mx-2">
								<Label style="margin-bottom:0;" for="browser_combos" class="text-lg leading-6 subheadline">
									Testing Software Used
									<Card :gutters="false" :center="false" style="min-height:8rem" class="overflow-y-auto w-full text-left max-h-32 my-2">
										<div class="flex mb-3" v-for="(input, i) in issue.browser_combos" :key="`bc-${i}`">
											<TextInput class="flex-1" name="browser_combos" id="browser_combos" v-model="issue.browser_combos[i]"></TextInput>
											<button title="Remove this browser combination" class="ml-1 standard alert px-2" @click.prevent="removeBrowserCombo(i)"><i class="fas fa-trash-alt"></i></button>
										</div>
									</Card>
								</Label>
							</div>
						</div>
					</div>
					<!-- Row 5 -->
					<div v-if="issueModalAdvancedView" class="flex w-full flex-wrap mt-2">
						<div class="flex-1 pr-2 max-w-full">
							<Label class="text-lg leading-6 subheadline">
								Screenshots
								<Card :gutters="false" :center="false" class="xs:shadow-none xs:p-0 overflow-y-auto w-full text-left max-h-80 my-2">
									<div class="flex mb-3" v-for="(input, i) in issue.screenshots" :key="`screen-${i}`">
										<TextInput class="flex-1" name="screenshots" id="screenshots" v-model="issue.screenshots[i]"></TextInput>
										<button class="ml-1 standard alert" :title="'Remove screenshot ' + issue.screenshots[i]" @click.prevent="removeScreenshot(i)"><i class="fas fa-trash-alt"></i></button>
									</div>
									
									<button class="standard" @click.prevent="addNewScreenshot">
										<i data-v-0b35166e="" class="far fa-plus" aria-hidden="true"></i>
										<span class="sr-only">Add New</span>
									</button>
								</Card>
							</Label>
						</div>
						<div class="flex-1 mx-2 max-w-full">
							<Label class="text-lg leading-6 subheadline">
								Outside Resources
								<Card :gutters="false" :center="false" class="xs:shadow-none xs:p-0 overflow-y-auto w-full text-left max-h-80 my-2">
									<div class="flex mb-3" v-for="(input, i) in issue.resources" :key="`resource-${i}`">
										<TextInput class="flex-1" name="resources" id="resources" v-model="issue.resources[i]"></TextInput>
										<button :title="'Remove resource ' + issue.resources[i]" class="ml-1 standard alert" @click.prevent="removeResource(i)"><i class="fas fa-trash-alt"></i></button>
									</div>
									
									<button class="standard" @click.prevent="addNewResource">
										<i data-v-0b35166e="" class="far fa-plus" aria-hidden="true"></i>
										<span class="sr-only">Add New</span>
									</button>
								</Card>
							</Label>
						</div>
					</div>
					<!-- Row 6 -->
					<div v-if="issueModalAdvancedView" class="flex w-full mt-2">
						<div class="md:w-1/2 xs:w-full sm:w-full mt-2 pr-2">
							<Label class="text-lg leading-6 w-full subheadline" for="auditor_notes">Auditor Notes</Label>
							<TextArea rows="14" class="w-full" id="auditor_notes" v-model="issue.auditor_notes"></TextArea>
						</div>
						<div class="md:w-1/2 xs:w-full sm:w-full mt-2" v-if="audit.number == 2">
							<Label class="text-lg leading-6 w-full subheadline" for="second_audit_comments">Second Audit Comments</Label>
							<TextArea rows="14" class="w-full" id="second_audit_comments" v-model="issue.second_audit_comments"></TextArea>
						</div>
						<div class="md:w-1/2 xs:w-full sm:w-full mt-2 pl-2" v-else-if="audit.number == 3">
							<Label class="text-lg leading-6 w-full subheadline" for="third_audit_comments">Third Audit Comments</Label>
							<TextArea rows="14" class="w-full" id="third_audit_comments" v-model="issue.third_audit_comments"></TextArea>
						</div>
					</div>
					
				</form>
			</div>
			<div class="mt-3 flex">
				<button @click="confirmDeleteModalOpen = true" v-if="selectedRows.length && issue.id" class="mx-2 standard alert">
					Delete
				</button>
				<button @click="EventBus.closeModal( ()=>{issueModalOpen = false} )" type="button" class="standard">
					Cancel
				</button>
				<button @click="saveIssue" type="button" class="mx-2 standard">
					Save
				</button>
			</div>
		</Modal>
		
		<Modal style="z-index:72;" :open="selectRecommendationsModalOpen">
			<div class="bg-white">
				<button aria-label="Close select recommendations modal" @click.prevent="selectRecommendationsModalOpen = false" class="absolute top-4 right-4 standard" >X</button>
				<h2 class="subheadline pr-8">Which recommendations would you like to add?</h2>
				<template v-if="filteredRecommendations.length" >
					<select aria-label="Select recommendations" class="m-2 w-full" multiple v-model="selectedRecommendations">
						<option :value="option" v-for="(option, index) in filteredRecommendations" :key="'recommendations-'+index">{{option.description}}</option>
					</select>
					<button @click.prevent="addSelectedRecommendations" class="mx-2 standard">Add</button>
				</template>
				<template v-else>
					<p>Select a success criteria first</p>
				</template>
			</div>
			<!-- <div class="bg-gray-50 px-4 py-3 flex flex-row-reverse">
				<button @click="selectRecommendationsModalOpen = false" class="standard">
				Cancel
				</button>
			</div> -->
		</Modal>
		<Modal style="z-index:73;" :open="confirmDeleteModalOpen">
			<div class="bg-white">
				<button aria-label="Close select descriptions modal" @click.prevent="confirmDeleteModalOpen = false" class="absolute top-4 right-4 standard">X</button>
				<h2 class="subheadline">Are you sure you want to delete {{ selectedRows.length === 1 ? 'this issue' : 'these issues' }}?</h2>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex">
				<button @click="confirmDeleteModalOpen = false" class="standard mr-3">
					Cancel
				</button>
				<button @click="deleteSelectedIssues" v-if="selectedRows.length" class="standard alert">
					Delete
				</button>
			</div>
			
		</Modal>
		<Modal style="z-index:72;" :open="whichCSVModalOpen">
			<div class="bg-white">
				<button aria-label="Close select descriptions modal" @click.prevent="EventBus.closeModal(()=>{whichCSVModalOpen = false})" class="absolute top-4 right-4 standard">X</button>
				<h2 class="subheadline">Which item do you want to export?</h2>
				<div class="flex mt-4 justify-center">
					<button @click.prevent="getIssuesCSV" class="mx-2 standard">Issues (.xlsx spreadsheet)</button>
					<button @click.prevent="getSampleCSV" class="mx-2 standard">Working Sample (CSV)</button>
				</div>
			</div>
			<!-- <div class="bg-gray-50 px-4 py-3 flex">
				<button @click="EventBus.closeModal(()=>{whichCSVModalOpen = false})" class="standard">
					Cancel
				</button>
			</div> -->
			
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
import Toggle from '../../components/Toggle'
import { EventBus } from '../../services/eventBus'
import Utility from '../../services/utility'
import Checkbox from "../../components/Checkbox"


export default {
	data: () => ({
		showMeasurables: false,
		issueModalAdvancedView: false,
		prevSelectedArticles: [],
		paginationData: {page:1, limit:100},
		shouldCondense: false,
		confirmDeleteModalOpen: false,
		whichCSVModalOpen: false,
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
		issueModalOpen: false,
		selectRecommendationsModalOpen: false,
		selectedDescriptions: [],
		// selectedReference: { audit: null, issue: null, issues: [], linkText: "" },
		selectedRecommendations: [],
		issueDefaults: {
			issue_description: "",
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
			second_audit_comments: "",
			third_audit_comments: "",
			priority: "Minor",
			effort: "Low",
		},
		issue: {
			issue_description: "",
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
			second_audit_comments: "",
			third_audit_comments: "",
			priority: "Minor",
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
		fixCSVIssues : { auditLoaded: false, articlesLoaded: false},
		issuesFixed: false,
		tableDefaultSortBy: {
			columns: ["id"],
			orders: ["asc"],
			reference: ["id"]
		},
		useSitemap:false,
		EventBus: EventBus,
	}),
	computed: {
		pagesSrc(){
			if( this.audit ){
				if( this.audit.property_type == "website" ){
					if( this.useSitemap ){
						return this.audit.domain.pages
					}

					return this.audit.domain.sample
				}
				
				if( this.audit.property_type != "website" ){
					return this.audit.software.screens
				}
			}
		},
		isManager(){
			return this.$store.getters["auth/isManager"]
		},
		issues(){
			if( !this.audit ){
				return []
			}
			return this.$store.state.audits.audit.issues
		},
		audit_states(){
			return this.$store.state.audits.audit_states.map( as => as.content)
		},
		issue_numbers(){
			return this.audit.issues.map( i => i.issue_number)
		},
		browserCombo(){
			return this.selectedTech ? this.selectedSoftware + " + " + this.selectedTech : this.selectedSoftware
		},
		displayLevels(){
			return this.issue.levels.join(", ") 
		},
		filteredTechniques(){
			if( this.issue.articles.length ){
				let self = this
				return this.techniques.filter( t => {
					return self.issue.articles.map( a=>a.id).some( a => t.article_ids.includes(a))
				})
			}
			return []
		},
		filteredRecommendations(){
			if( this.issue.articles.length ){
				let self = this
				return this.recommendations.filter( t => {
					return self.issue.articles.map( a => a.id).some( a => t.article_ids.includes(a))
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
			if( !this.issues.length ){
				return arr
			}

			// let headers = Object.keys(this.audit.issues[0])
			//This array has been implemented to adjust the default order of the headers
			let headers = ['id', 'issue_number', 'target', 'pages', 'status', 'levels', 'articles', 'techniques', 'issue_description', 'descriptions', 'recommendations', 'audit_states', 'priority', 'effort', 'how_discovered', 'screenshots', 'resources', 'browser_combos', 'essential_functionality', 'actrs', 'created_by', 'audit_id', 'auditor_notes', 'second_audit_comments', 'third_audit_comments', 'date_created']
			
			let hide = [
				"id",
				'issue_number',
				'issue_description',
				'essential_functionality',
				'audit_states',
				'auditor_notes',
				'techniques',
				"screenshots",
				"resources",
				"effort",
				"browser_combos",
				"audit_id",
				"created_at",
				"updated_at",
				"actrs",
				"created_by",
				"how_discovered",
				"date_created"
			]

			let stickied = [
				"id",
				"issue_number"
			]

			let columnPositions = []
			let auditMeta = false

			if( this.$store.state.auth.user.meta.audit != undefined && 
				this.$store.state.auth.user.meta.audit[this.$route.params.id] != undefined ){
					//Converts JSON storage of function values into usable values for lodash _.orderBy()
					auditMeta = Utility.reviveAuditMetaFunction( this.$store.state.auth.user.meta.audit[this.$route.params.id], this )
			}
			
			if( auditMeta ){
				if( auditMeta.issues != undefined && 
					auditMeta.issues.columns != undefined && 
					auditMeta.issues.columns.stickied != undefined ){
						stickied = auditMeta.issues.columns.stickied.map(c=>c.replace(" ", "_"))
				}
				if( auditMeta.issues != undefined && 
					auditMeta.issues.columns != undefined && 
					auditMeta.issues.columns.visible != undefined ){
						hide = headers.filter(h=>!auditMeta.issues.columns.visible.includes(h))
				}
				if( auditMeta.issues != undefined && 
					auditMeta.issues.columns != undefined && 
					auditMeta.issues.columns.sortedBy != undefined ){
						this.tableDefaultSortBy = auditMeta.issues.columns.sortedBy
				}
				if( auditMeta.issues != undefined && 
					auditMeta.issues.columns != undefined && 
					auditMeta.issues.columns.positions != undefined ){
						columnPositions = auditMeta.issues.columns.positions
				}

				if( auditMeta.issues != undefined && 
					auditMeta.issues.modal != undefined && 
					auditMeta.issues.modal.advanced ){
						this.issueModalAdvancedView = auditMeta.issues.modal.advanced
				}
			}
			
			return this.setHeaders(headers, hide, stickied, columnPositions)
		},
		audit(){
			return this.$store.state.audits.audit || false
		},
		project(){
			return this.$store.state.projects.project || false
		},
		license(){
			return this.$store.state.auth.license
		}
	},
	props: [],
	watch: {
		"$route.params.id": function(){
			this.$store.dispatch("audits/getAudit", {id: this.$route.params.id, withIssues: true})
			this.$store.dispatch("audits/getArticlesTechniquesRecommendations")
			this.$store.dispatch("audits/getAuditStates")
		},
		"$store.state.audits.audit": function(newVal){
			this.selectedSoftware = newVal.software_used[0]
			this.$store.dispatch("projects/getProject", {id: newVal.project_id})
		},
		"issue.articles": function(newVal, oldVal){
			if( this.selectedRows.length > 1 ){
				return
			}
			
			this.issue.levels = []
			this.issue.techniques = []
			for( let i in this.issue.articles ){
				let article_id = this.issue.articles[i].id - 1
				if( !this.issue.levels.includes( this.articles[ article_id ].level ) ){
					this.issue.levels.push( this.articles[ article_id ].level )
				}
			}
		},
		"issue.techniques": function(newVal, oldVal){
			if( this.selectedRows.length > 1 ){
				return
			}
			let newIDs = []
			let newValIDs = newVal.map(a => a.id)
			//Go through all of the new IDs
			for (let x = 0; x < newValIDs.length; x++) {
				let id = newValIDs[x];
				//Go through the array of old values
				//If oldVal contains the current id, continue to the next id
				if( oldVal.some( v=>v.id === id ) ){
					continue
				}
				newIDs.push(id)
			}
			
			if( newIDs.length ){
				this.addIssueTechniqueDescriptions(newIDs)
			}
		},
		failedValidation(newVal){
			if(newVal.includes('descriptions')){
				this.$refs.descriptionEditor.querySelector(".ql-editor").setAttribute("aria-describedby", "descriptions-validation")
			}else{
				this.$refs.descriptionEditor.querySelector(".ql-editor").removeAttribute("aria-describedby")
			}

			if(newVal.includes('recommendations')){
				this.$refs.recommendationEditor.querySelector(".ql-editor").setAttribute("aria-describedby", "recommendations-validation")
			}else{
				this.$refs.recommendationEditor.querySelector(".ql-editor").removeAttribute("aria-describedby")
			}
		},
		// addIssueReferenceLinkModalOpen(newVal){
		// 	if( newVal ){
		// 		this.selectedReference.audit = null
		// 	}
		// },
		// "selectedReference.audit": function(newVal){
		// 	if( newVal ){
		// 		this.$store.state.audits.loading = true
		// 		Request.getPromise( `${this.$store.state.audits.API}/${this.$store.state.auth.account}/audits/${newVal}/issues` )
		// 		.then( response=>{
		// 			this.selectedReference.issues = response.data.details
		// 			this.selectedReference.issue = response.data.details[0]
		// 		})
		// 		.catch( response=>{console.log(response)})
		// 		.then( () => this.$store.state.audits.loading = false )
		// 	}
		// },
	},
	beforeDestroy(){
		EventBus.$off('toolbarEmit')
	},
	methods: {
		changeView(data){
			this.issueModalAdvancedView = data
			this.metaEvent('audit', `${this.$route.params.id}-issues-modal-advanced`, data)
		},
		toolbarEmit(action, $event){
			EventBus.$emit('toolbarEmit', {action: action, data: null, $event: $event})
		},
		changeArticles(){
			let newIDs = []
			let newValIDs = this.issue.articles.map(a => a.id)
			//Go through all of the new IDs
			for (let x = 0; x < newValIDs.length; x++) {
				let id = newValIDs[x];
				//Go through the array of old values
				//If oldVal contains the current id, continue to the next id
				if( this.prevSelectedArticles.some( v=>v.id === id ) ){
					continue
				}
				newIDs.push(id)
			}
			
			if( newIDs.length ){
				this.addIssueArticleDescriptions(newIDs)
			}

			this.prevSelectedArticles = this.issue.articles
			
		},
		storePaginationData(data){
			this.paginationData = data
		},
		resetIssueDescriptions(){
			this.descriptionsQuill.root.innerHTML = ""
		},
		addIssueArticleDescriptions(articleIDs){
			//For every article ID, find the corresponding article in this.articles and construct the 
			//HTML around the number and description of said article
			let builder = ""
			
			for (let x = 0; x < articleIDs.length; x++) {
				let article = this.articles.find(a=>a.id == articleIDs[x])
				builder += "<div>" + this.htmlDecode(article.number + " - " + article.description) + '</div><br>'
			}
			builder = builder.replace(/\n|\r/g, "</div><div>")

			this.descriptionsQuill.root.innerHTML += builder
		},
		addIssueTechniqueDescriptions(techniqueIDs){
			let builder = ""
			
			for (let x = 0; x < techniqueIDs.length; x++) {
				let technique = this.techniques.find(a=>a.id == techniqueIDs[x])
				builder += "<div>" + this.htmlDecode(technique.number + " - " + technique.description) + '</div><br>'
			}
			builder = builder.replace(/\n|\r/g, "</div><div>")

			this.descriptionsQuill.root.innerHTML += builder
		},
		setHeaders(headers, hide, stickied, columnPositions){
			let widthMap = {
				id: "150px",
				audit_id: "150px",
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
				issue_description: "400px",
				recommendations: "400px",
				descriptions: "400px",
				levels: "150px",
				actrs: "250px",
				created_by: "250px",
				issue_number: "150px",
				priority: "150px",
				auditor_notes: "300px",
				second_audit_comments: "300px",
				third_audit_comments: "300px",
				effort: "150px",
			}

			let arr = []

			for( let key of headers ){
				arr.push({
					key: key,
					display: this.parseHeader(key),
					show: !hide.includes(key) && !this.isHeaderHidePermanent(key),
					sticky: stickied.includes(key),
					style: {},
					width: widthMap[key],
					hidePermanent: this.isHeaderHidePermanent(key)
				})
			}

			if( columnPositions.length ){
				let finalOrder = []
				for( let y = 0; y < columnPositions.length; y++ ){
					let header = arr.find(h=>h.key == columnPositions[y])
					finalOrder.push(header)
				}
				return finalOrder
			}
			return arr
			
		},
		metaEvent(key, subKeys, value){
			if( value.columns ){
				for (let index = 0; index < value.columns.length; index++) {
					const val = value.columns[index];
					if( typeof val === 'function' ){
						value.columns[index] = "function"
					}
				}
			}
			
			this.$store.dispatch("user/storeUserMeta", {key: key, subKeys: subKeys, value:value})
		},
		isHeaderHidePermanent(key){
			if( this.audit.number == 1 && ( key == "second_audit_comments" || key == "third_audit_comments" ) ){
				return true
			}
			if( this.audit.number == 2 && key == "third_audit_comments" ){
				return true
			}

			return false
		},
		selectAll(ids){
			this.selectedRows = ids
			EventBus.$emit('auditSelectedRowsUpdated', this.selectedRows.length)
		},
		deselectAll(){
			this.selectedRows = []
			EventBus.$emit('auditSelectedRowsUpdated', this.selectedRows.length)
		},
		markComplete(){
			this.$store.dispatch("audits/completeAudit", {audit_id: this.$route.params.id})
		},
		createNextAudit(){
			this.$store.dispatch("audits/createNextAudit", {audit_id: this.$route.params.id})
		},
		getIssuesCSV(){
			this.$store.state.audits.loading = true
			Request.postPromise(`${this.$store.state.auth.API}/l/${this.$store.state.auth.license.id}/audits/${this.$route.params.id}/meta`, {params: {key: "sort", value: this.$refs.issuesTable.columnData.map( o=> o.id)}})
			.then( (re)=> {
				this.$store.state.audits.loading = false
				if(re.data.success == '1') {
					window.location.href = `${this.$store.state.auth.toolboxapi}/user/${this.$store.state.auth.license.id}/${this.$store.state.auth.user.id}/audits/${this.$route.params.id}/csv/issues/?app_origin=${window.location.href}`
				}
				if(re.data.success == 'error') {
					this.$notify({
						title:"Warning",
						text:re.data.error,
						type: "warn",
						position: 'bottom right'
					})
				}
			})
			.catch()
			.then( ()=> this.$store.state.audits.loading = false )
		},
		getSampleCSV(){
			window.location.href = `${this.$store.state.auth.toolboxapi}/user/${this.$store.state.auth.license.id}/audits/${this.$route.params.id}/csv/sample/?app_origin=${window.location.href}`
		},
		getDefault(){
			return JSON.parse( JSON.stringify(this.issueDefaults) )
		},
		newIssue(){
			this.$set(this, "issue", this.getDefault())
			this.descriptionsQuill.root.innerHTML = ""
			this.recommendationsQuill.root.innerHTML = ""
			this.issueModalOpen = true
		},
		createFromCopy(){
			let copy = JSON.parse(JSON.stringify(this.audit.issues.find( i => i.id == this.selectedRows[0] )))
			this.issue = copy
			// this.addIssuePagesToGlobalPagesList()

			delete this.issue.id
			this.descriptionsQuill.root.innerHTML = this.issue.descriptions
			this.recommendationsQuill.root.innerHTML = this.issue.recommendations
			
			this.issueModalOpen = true
		},
		editIssue(){
			let copy = JSON.parse(JSON.stringify(this.audit.issues.find( i => i.id == this.selectedRows[0] )))
			
			// Copy the issue
			// Check to see if the pages on the issue are an object or a string value
			// - If string value, check to see if the value is a URL
			// -- If URL, check against the current audit's pages.url
			// -- otherwise check against the current audit's pages.title
			// - If an object, check to see if page.title and page.url match before adding
			this.issue = copy
			
			// this.addIssuePagesToGlobalPagesList()
			
			this.descriptionsQuill.root.innerHTML = this.issue.descriptions
			this.recommendationsQuill.root.innerHTML = this.issue.recommendations
			
			this.issueModalOpen = true

		},
		saveIssue(){
			if( !this.issue.id   ){
				this.createIssue()
			}else{
				this.updateIssue()
			}
		},
		deleteSelectedIssues(){
			this.$store.dispatch("audits/deleteIssues", { issues: this.selectedRows, audit_id: this.$route.params.id, pagination: this.paginationData })
			this.issue = this.getDefault()
			this.descriptionsQuill.root.innerHTML = ""
			this.recommendationsQuill.root.innerHTML = ""
			this.confirmDeleteModalOpen = false
			EventBus.closeModal(()=>{this.issueModalOpen = false})
			this.selectedRows = []
			EventBus.$emit('auditSelectedRowsUpdated', this.selectedRows.length)
		},
		// createReferenceLink(){
		// 	let builder = `<a href="https://toolbox.devproxy.onlineada.com/audits/${this.selectedReference.audit}/overview#${this.selectedReference.issue.issue_number}" target="_blank" rel="nofollow">${this.selectedReference.linkText}</a>`

		// 	this.descriptionsQuill.root.innerHTML += builder
		// 	EventBus.closeModal(()=>{this.addIssueReferenceLinkModalOpen = false})
		// 	this.selectedReference = { audit: null, issue: null, issues: [], linkText: "" }
		// },
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
		
		addSelectedRecommendations(){
			let builder = ""
			for( let j in this.selectedRecommendations ){
				builder += "<div>" + this.htmlDecode(this.selectedRecommendations[j].description.replaceAll(/[ ]{2,}/g, '- ')) + '</div><br>'
			}
			builder = builder.replace(/\n|\r/g, "</div><div>")
			
			this.recommendationsQuill.root.innerHTML += builder
			
			EventBus.closeModal(()=>{this.selectRecommendationsModalOpen = false})
		},
		addBrowserCombo(){
			this.issue.browser_combos.push(this.browserCombo)
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
			if( string == "articles" ){
				return "success criteria"
			}
			if( string == "recommendations" ){
				return "audit 1 recommendations"
			}
			if( string == "issue_description" ){
				return "issue description"
			}

			if( string == "created_by" ){
				return "last saved by"
			}
			return string.replace(/[-_.]/gm, " ");
		},
		validate(){
			this.showValidationAlert = false
			let toValidate = [
				"target",
				"articles",
				// "pages",
				"status",
				"descriptions",
				"recommendations",
				// "audit_states",
				"effort",
				"priority"
			]
			this.failedValidation = []
			var pass

			for( let prop of toValidate ){
				if( Array.isArray( this.issue[prop] ) ){
					pass = this.issue[prop].length
				}else{
					pass = !!this.issue[prop]
					if( prop == "descriptions" || prop == "recommendations" ){
						pass = !!this.issue[prop] && this.issue[prop] != "<div><br></div>";
					}
				}

				if( !pass ){
					if( !this.failedValidation.includes( prop ) ){
						this.failedValidation.push( prop )
					}
					if( prop == "descriptions" ){
						let editor = this.$refs.descriptionEditor.querySelector(".ql-editor")
						editor.setAttribute("data-validation-failed", true)
					}
					if( prop == "recommendations" ){
						let editor = this.$refs.recommendationEditor.querySelector(".ql-editor")
						editor.setAttribute("data-validation-failed", true)
					}
				}
			}

			if( this.failedValidation.length !== 0 ){
				this.showValidationAlert = true
				let self = this
				this.$nextTick( ()=>{
					let allValidationErrors = document.querySelectorAll("[data-validation-failed]")
					
					allValidationErrors[0].scrollIntoView({
						block: "center"
					})
					allValidationErrors[0].focus()
					let issue_form_type = this.issue.id ? "Edit Issue" : "Add Issue"
					self.$notify({
						title: "Warning",
						text: `There are ${allValidationErrors.length} validation errors in the ${issue_form_type} form`,
						type: "warn"
					})
				})
			}

			return this.failedValidation.length === 0
		},
		createIssue(){
			if( this.validate() ){
				this.issue.audit_id = this.$route.params.id
				let uniqid = this.generateUniqueID()
				
				this.issue.issue_number = uniqid
				
				this.$store.dispatch("audits/createIssue", {issue: this.issue, pagination: this.paginationData})
				
				EventBus.closeModal(()=>{this.issueModalOpen = false})
				this.issue = this.getDefault()
				this.descriptionsQuill.root.innerHTML = ""
				this.recommendationsQuill.root.innerHTML = ""
			}
		},
		updateIssue(){
			if( this.validate() ){
				this.$store.dispatch("audits/updateIssue", {issue: this.issue, audit_id: this.$route.params.id, pagination: this.paginationData})
				EventBus.closeModal(()=>{this.issueModalOpen = false})
				this.issue = this.getDefault()
				this.descriptionsQuill.root.innerHTML = ""
				this.recommendationsQuill.root.innerHTML = ""
				this.selectedRows = []
				EventBus.$emit('auditSelectedRowsUpdated', this.selectedRows.length)
			}
		},
		generateUniqueID(){
			let id = Math.random().toString(36).substring(5)
			
			if( this.issue_numbers.includes(id) ){
				return this.generateUniqueID()
			}

			return id
		},
		setupQuillDescriptionsBar(){
			var Block = Quill.import('blots/block');
			Block.tagName = 'DIV';
			Quill.register(Block, true);
			let self = this
			
			this.descriptionsQuill = new Quill('#editor1', {
				modules: {
					toolbar: self.quillEditorOptions,
					keyboard: {
						bindings: {
							tab: {
								key: 9,
								handler: function (range, context) {
									return true;
								},
							},
						},
					}
				},
				theme: 'snow'
			});

			this.descriptionsQuill.on('text-change', function(){
				self.issue.descriptions = self.descriptionsQuill.root.innerHTML
			})

			//Make the toolbar accessible after its been instantiated
			let descrEditor = self.$refs.descriptionEditor.querySelector(".ql-editor")
			descrEditor.setAttribute("role", "textbox")
			descrEditor.setAttribute("aria-multiline", true)
			descrEditor.setAttribute("id", "issue_descriptions")
			descrEditor.setAttribute("tabindex", 0)
			descrEditor.setAttribute("aria-describedby", "descriptions-validation")
			descrEditor.setAttribute("required", "required")

			let toolbar = self.$refs.descriptionEditor.previousSibling
			
			let svgs = toolbar.querySelectorAll("svg")
			for (let index = 0; index < svgs.length; index++) {
				let el = svgs[index];
				el.setAttribute("aria-hidden", true)
			}
			toolbar.querySelector(".ql-bold").setAttribute("title", "Bold")
			toolbar.querySelector(".ql-italic").setAttribute("title", "Italic")
			toolbar.querySelector(".ql-underline").setAttribute("title", "Underline")
			toolbar.querySelector(".ql-strike").setAttribute("title", "Strike")
			toolbar.querySelector(".ql-blockquote").setAttribute("title", "Block Quote")
			toolbar.querySelector(".ql-code-block").setAttribute("title", "Code Block")
			toolbar.querySelector(".ql-link").setAttribute("title", "Create Link")
			toolbar.querySelector(".ql-clean").setAttribute("title", "Remove Formatting")

			toolbar.querySelector(".ql-list[value=ordered]").setAttribute("title", "Ordered List")
			toolbar.querySelector(".ql-list[value=bullet]").setAttribute("title", "Un Ordered List")

			toolbar.querySelector(".ql-indent[value='-1']").setAttribute("title", "Indent Left")
			toolbar.querySelector(".ql-indent[value='+1']").setAttribute("title", "Indent Right")

			//The following code literally only works so long as the wysiwyg buttons are in this current order
			toolbar.querySelector(".ql-formats:first-child .ql-picker-label").setAttribute("title", "Text Style")
			toolbar.querySelector(".ql-formats:nth-child(6) .ql-picker-label").setAttribute("title", "Text Size")
			
			//Add labels to the text color picker options
			let picker3_items = toolbar.querySelectorAll(".ql-color .ql-picker-options > span")
			for (let index = 0; index < picker3_items.length; index++) {
				let el = picker3_items[index];
				if( !el.getAttribute("data-value") ){
					el.setAttribute("title", "#000000")
					continue
				}
				let value = el.getAttribute("data-value")
				el.setAttribute("title", value)
			}
			
			//Add label to the selected value
			let picker3_label = toolbar.querySelector(".ql-color .ql-picker-label")
			picker3_label.setAttribute("title", "Text color picker. Current Color: #000000")

			var picker3_observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.type === "attributes" && mutation.attributeName == "data-value") {
						let currentValue = mutation.target.getAttribute("data-value")
						if( currentValue ){
							mutation.target.setAttribute("title", "Text color picker. Current Color: "+currentValue.toUpperCase())
						}else{
							mutation.target.setAttribute("title", "Text color picker. Current Color: #000000")
						}
					}
				});
			});

			picker3_observer.observe(picker3_label, {
				attributes: true //configure it to listen to attribute changes
			});

			//Add labels to the text background color picker options
			let picker4_items = toolbar.querySelectorAll(".ql-background .ql-picker-options > span")
			for (let index = 0; index < picker4_items.length; index++) {
				let el = picker4_items[index];
				if( !el.getAttribute("data-value") ){
					el.setAttribute("title", "None")
					continue
				}
				let value = el.getAttribute("data-value")
				value.charAt(0).toUpperCase() + value.slice(1)
				el.setAttribute("title", value)
			}
			
			let picker4_label = toolbar.querySelector(".ql-background .ql-picker-label")
			picker4_label.setAttribute("title", "Text background color picker. Current Color: None")

			var picker4_observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.type === "attributes" && mutation.attributeName == "data-value") {
						let currentValue = mutation.target.getAttribute("data-value")
						if( !currentValue ){
							mutation.target.setAttribute("title", "Text background color picker. Current Color: None")
						}else{
							mutation.target.setAttribute("title", "Text background color picker. Current Color: "+currentValue.toUpperCase())
						}
					}
				});
			});

			picker4_observer.observe(picker4_label, {
				attributes: true //configure it to listen to attribute changes
			});

			//Add labels to the text align dropdown options
			let picker5_items = toolbar.querySelectorAll(".ql-align .ql-picker-options > span")
			for (let index = 0; index < picker5_items.length; index++) {
				let el = picker5_items[index];
				if( !el.getAttribute("data-value") ){
					el.setAttribute("title", "None")
					continue
				}
				let value = el.getAttribute("data-value")
				value = value.charAt(0).toUpperCase() + value.slice(1)
				el.setAttribute("title", value)
			}

			let picker5_label = toolbar.querySelector(".ql-align .ql-picker-label")
			picker5_label.setAttribute("title", "Text Align. Current: None")

			var picker5_observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.type === "attributes" && mutation.attributeName == "data-value") {
						let currentValue = mutation.target.getAttribute("data-value")
						if( !currentValue ){
							mutation.target.setAttribute("title", "Text Align. Current: None")
						}else{
							currentValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1)
							mutation.target.setAttribute("title", "Text Align. Current: "+currentValue)
						}
					}
				});
			});

			picker5_observer.observe(picker5_label, {
				attributes: true //configure it to listen to attribute changes
			});

		},
		setupQuillRecommendationsBar(){
			this.recommendationsQuill = new Quill('#editor2', {
				theme: 'snow',
				modules: {
					toolbar: this.quillEditorOptions,
					keyboard: {
						bindings: {
							tab: {
								key: 9,
								handler: function (range, context) {
									return true;
								},
							},
						},
					}
				}
			});
			let self = this
			
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

			let toolbar = self.$refs.recommendationEditor.previousSibling
			let svgs = toolbar.querySelectorAll("svg")
			for (let index = 0; index < svgs.length; index++) {
				let el = svgs[index];
				el.setAttribute("aria-hidden", true)
			}
			toolbar.querySelector(".ql-bold").setAttribute("title", "Bold")
			toolbar.querySelector(".ql-italic").setAttribute("title", "Italic")
			toolbar.querySelector(".ql-underline").setAttribute("title", "Underline")
			toolbar.querySelector(".ql-strike").setAttribute("title", "Strike")
			toolbar.querySelector(".ql-blockquote").setAttribute("title", "Block Quote")
			toolbar.querySelector(".ql-code-block").setAttribute("title", "Code Block")
			toolbar.querySelector(".ql-link").setAttribute("title", "Create Link")
			toolbar.querySelector(".ql-clean").setAttribute("title", "Remove Formatting")

			toolbar.querySelector(".ql-list[value=ordered]").setAttribute("title", "Ordered List")
			toolbar.querySelector(".ql-list[value=bullet]").setAttribute("title", "Un Ordered List")

			toolbar.querySelector(".ql-indent[value='-1']").setAttribute("title", "Indent Left")
			toolbar.querySelector(".ql-indent[value='+1']").setAttribute("title", "Indent Right")

			//The following code literally only works so long as the wysiwyg buttons are in this current order
			toolbar.querySelector(".ql-formats:first-child .ql-picker-label").setAttribute("title", "Text Style")
			toolbar.querySelector(".ql-formats:nth-child(6) .ql-picker-label").setAttribute("title", "Text Size")
			
			//Add labels to the text color picker options
			let picker3_items = toolbar.querySelectorAll(".ql-color .ql-picker-options > span")
			for (let index = 0; index < picker3_items.length; index++) {
				let el = picker3_items[index];
				if( !el.getAttribute("data-value") ){
					el.setAttribute("title", "#000000")
					continue
				}
				let value = el.getAttribute("data-value")
				el.setAttribute("title", value)
			}
			
			//Add label to the selected value
			let picker3_label = toolbar.querySelector(".ql-color .ql-picker-label")
			picker3_label.setAttribute("title", "Text color picker. Current Color: #000000")

			var picker3_observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.type === "attributes" && mutation.attributeName == "data-value") {
						let currentValue = mutation.target.getAttribute("data-value")
						if( currentValue ){
							mutation.target.setAttribute("title", "Text color picker. Current Color: "+currentValue.toUpperCase())
						}else{
							mutation.target.setAttribute("title", "Text color picker. Current Color: #000000")
						}
					}
				});
			});

			picker3_observer.observe(picker3_label, {
				attributes: true //configure it to listen to attribute changes
			});

			//Add labels to the text background color picker options
			let picker4_items = toolbar.querySelectorAll(".ql-background .ql-picker-options > span")
			for (let index = 0; index < picker4_items.length; index++) {
				let el = picker4_items[index];
				if( !el.getAttribute("data-value") ){
					el.setAttribute("title", "None")
					continue
				}
				let value = el.getAttribute("data-value")
				value.charAt(0).toUpperCase() + value.slice(1)
				el.setAttribute("title", value)
			}
			
			let picker4_label = toolbar.querySelector(".ql-background .ql-picker-label")
			picker4_label.setAttribute("title", "Text background color picker. Current Color: None")

			var picker4_observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.type === "attributes" && mutation.attributeName == "data-value") {
						let currentValue = mutation.target.getAttribute("data-value")
						if( !currentValue ){
							mutation.target.setAttribute("title", "Text background color picker. Current Color: None")
						}else{
							mutation.target.setAttribute("title", "Text background color picker. Current Color: "+currentValue.toUpperCase())
						}
					}
				});
			});

			picker4_observer.observe(picker4_label, {
				attributes: true //configure it to listen to attribute changes
			});

			//Add labels to the text align dropdown options
			let picker5_items = toolbar.querySelectorAll(".ql-align .ql-picker-options > span")
			for (let index = 0; index < picker5_items.length; index++) {
				let el = picker5_items[index];
				if( !el.getAttribute("data-value") ){
					el.setAttribute("title", "None")
					continue
				}
				let value = el.getAttribute("data-value")
				value = value.charAt(0).toUpperCase() + value.slice(1)
				el.setAttribute("title", value)
			}

			let picker5_label = toolbar.querySelector(".ql-align .ql-picker-label")
			picker5_label.setAttribute("title", "Text Align. Current: None")

			var picker5_observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.type === "attributes" && mutation.attributeName == "data-value") {
						let currentValue = mutation.target.getAttribute("data-value")
						if( !currentValue ){
							mutation.target.setAttribute("title", "Text Align. Current: None")
						}else{
							currentValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1)
							mutation.target.setAttribute("title", "Text Align. Current: "+currentValue)
						}
					}
				});
			});

			picker5_observer.observe(picker5_label, {
				attributes: true //configure it to listen to attribute changes
			});
		},
	},
	created() {
		if( this.$store.state.audits ){
			this.$store.dispatch("audits/getAudit", {id: this.$route.params.id, withIssues: true})
			this.$store.dispatch("audits/getArticlesTechniquesRecommendations")
			this.$store.dispatch("audits/getAuditStates")
		}
		let that = this
		EventBus.$on('toolbarEmit', (payload)=>{
			if( payload.action == 'audit-condense' ){
				that.shouldCondense = !that.shouldCondense
				return
			}
			if( payload.action == 'audit-add-issue' ){
				EventBus.openModal(false, payload.$event, that.newIssue)
				// that.openModal(that.newIssue)
				return
			}
			if( payload.action == 'audit-delete-many' ){
				EventBus.openModal( false, payload.$event, ()=>{that.confirmDeleteModalOpen = true} )
				// that.openModal( ()=>{that.confirmDeleteModalOpen = true} )
				return
			}
			if( payload.action == 'audit-edit-issue' ){
				EventBus.openModal( false, payload.$event, that.editIssue )
				// that.openModal( that.editIssue )
				return
			}
			if( payload.action == 'audit-copy-issue' ){
				EventBus.openModal( false, payload.$event, that.createFromCopy )
				// that.openModal( that.createFromCopy )
				return
			}
			if( payload.action == 'audit-issues-download' ){
				EventBus.openModal( false, payload.$event, ()=>{that.whichCSVModalOpen = true})
				// that.openModal(()=>{that.whichCSVModalOpen = true})
				return
			}
			if( payload.action == 'audit-complete' ){
				that.markComplete()
				return
			}
			if( payload.action == 'audit-next' ){
				
				that.createNextAudit()
				return
			}
			if( payload.action == 'audit-issue-status-change' ){
				let found = that.issues.find( i=>i.id == that.selectedRows[0])
				
				found.status = payload.data
				this.issue = found
				this.saveIssue()
			}
			if( payload.action == 'toggle-measurables' ){
				that.showMeasurables = !that.showMeasurables
			}
		})
		
	},
	mounted() {
		document.title = "Audit Issues"
		this.$store.state.projects.tool.info = '<p>Here is a list of the various functionality you can expect on the audit issues table:</p>'+
			'<ul class="list-disc text-left mb-3">'+
			'	<li><strong>Horizontal scrolling:</strong> at any point while focused inside the table, using the left and right arrow keys will scroll the table to the left and right</li>'+
			'	<li><strong>Freezing Columns:</strong> Each column has a button for freezing it in place, such that while scrolling the table left and right, the column will remain in its position while the rest of the unfrozen columns scroll like normal</li>'+
			'	<li><strong>Multi Column Sorting:</strong> The sort buttons have 3 modes: Unsorted, Ascending and Descending. If more than one column has been sorted, the columns will sort in order across all sorted columns, i.e. sorting by column A by ascending and column B by descending will sort both columns respectively first by column A then by column B.</li>'+
			'	<li><strong>Repositioning of Columns:</strong> Each column, while not frozen, can be moved left or right to reposition them within the table.</li>'+
			'</ul>'+
			'<h2 style="line-height:18px;font-size:12px;" class="pt-5 w-full">'+
			'	<div style="font-size:14px">Search</div>'+
			'	<span style="font-size:12px">First choose which column you want to search from the dropdown, then enter your search criteria, then click submit</span>'+
			'</h2>'

		this.setupQuillDescriptionsBar()
		this.setupQuillRecommendationsBar()
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
		TextArea,
		Toggle,
		Checkbox,
	},
}

</script>
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