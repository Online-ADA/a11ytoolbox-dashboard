<template>
	<div class="text-center mt-32 mx-auto">
		<Loader v-if="loading"></Loader>
		
		<template v-if="audit">
			<A v-if="!audit.locked || isManager" class="pr-3" type='router-link' :to="{path: `/audits/${$route.params.id}/edit`}">Edit Audit</A>
			<A class="pr-3" type='router-link' :to="{path: `/projects/${audit.project_id}`}">View Project</A>
			<A v-if="!audit.locked" type='router-link' :to="{path: `/audits/${$route.params.id}/import`}">Import</A>
			<button v-if="issues.length" @click="whichCSVModalOpen = true" type="button" class="hover:text-white hover:bg-pallette-orange mx-2 justify-center rounded border border-gray-300 shadow-sm px-2 py-1 bg-white transition-colors duration-100 font-medium text-gray-700 w-auto text-sm">
				<span class="sr-only">Download</span> CSV
			</button>
			<h2 class="mb-3">{{audit.title}}</h2>
			<span v-if="audit.locked" class="text-2xl"><i class="fas fa-lock" aria-hidden="true"></i></span>
			<h3 class="text-base" v-if="audit.locked">This audit is locked and cannot be modified</h3>
			<Table :condense="shouldCondense" :locked="audit.locked" @selectAll="selectAll" @deselectAll="deselectAll" ref="issuesTable" :selected="selectedRows" @rowClick="selectRow" v-if="issues.length" :rowsData="issues" :headersData="headers"></Table>
			<template v-else>
				There are no issues currently. <A id="no-issues-import" class="hover:bg-pallette-orange mx-2 justify-center rounded border border-gray-300 shadow-sm px-2 py-1 bg-white transition-colors duration-100 font-medium text-gray-700 w-auto text-sm" type='router-link' :to="{path: `/audits/${$route.params.id}/import`}">Click here</A> to import issues
			</template>
		</template>
		<div class="bg-white w-full border-t border-black p-4 flex justify-between fixed bottom-0 left-0" style="z-index:25;">
			<div class="flex w-1/3 items-center">
				<Button class="mx-2" :color="shouldCondense ? 'orange' : 'white'" @click.native.prevent="shouldCondense = !shouldCondense">
					<span v-if="!shouldCondense">Condense </span>
					<span v-else>Expand </span>
					Table
				</Button>
				<Button v-if="selectedRows.length === 1 && !audit.locked" @click.native.prevent="editIssue" class="mx-2" color="orange" hover="true">Edit Issue</Button>
				<Button v-if="selectedRows.length === 1 && !audit.locked" @click.native.prevent="createFromCopy" class="mx-2" color="orange" hover="true">Copy Issue</Button>
				<Button v-if="selectedRows.length > 1 && !audit.locked" @click.native.prevent="confirmDeleteModalOpen = true" class="mx-2" color="delete" hover="true">Delete Issues</Button>
				<Button v-if="selectedRows.length < 1 && !audit.locked" @click.native.prevent="newIssue" class="mx-2" color="orange" hover="true">Add Issue</Button>
				<Button @click.native.prevent="darkMode = !darkMode" class="mx-2" :color="darkMode ? 'orange' : 'white'" :hover="true">Dark Mode</Button>
			</div>
			<div class="w-1/3 flex flex-wrap items-center justify-center">
				<span aria-live="polite" aria-atomic="true">Issues Selected: {{selectedRows.length}}</span>
				<div class="w-full mt-2">Total Issues: {{issues.length}}</div>
			</div>
			<div class="flex w-1/3 justify-end items-center">
				<Button v-if="!audit.locked" @click.native.prevent="markComplete" class="mx-2" color="orange" hover="true">Complete Audit</Button>
				<Button v-if="audit.locked && audit.number > 0 < 3" @click.native.prevent="createNextAudit" class="mx-2" color="orange" hover="true">Create next audit</Button>
			</div>
		</div>
		
		
		<Modal class="z-40" size="full" :open="issueModalOpen">
			<div role="alert" :class="{ 'hidden': !showValidationAlert}" class="sr-only">
				The following validation errors are present on the add issue form: 
				<div v-for="(prop, index) of failedValidation" :key="'validation-error-'+index">{{validationMessages[ prop ]}}</div>
			</div>
			<div style="padding-bottom:60px;" class="bg-white px-4 pt-5 p-6">
				<Button aria-label="Close add issue modal" @click.native.prevent="issueModalOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Button>
				<h2 class="text-center">{{issue.id ? "Edit Issue" : "Add Issue"}}</h2>
				<div class="flex items-start mt-3 text-left w-full flex-wrap">
					
					<div class="flex w-full mt-2">
						<div class="mx-2 flex-1">
							<Label class="text-lg leading-6 w-full" for="success_criteria">Success Criteria</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('articles') }" id="success-criteria-validation">{{validationMessages["articles"]}}</small>
							<select required :aria-describedby="failedValidation.includes('articles') ? 'success-criteria-validation' : false" style="min-width:200px;" id="success_criteria" class="w-full" v-model="issue.articles" multiple>
								<option class="overflow-ellipsis overflow-hidden whitespace-nowrap" :value="{display: article.number + ' - ' + article.title, id: article.id}" v-for="(article, index) in articles" :key="'success_criteria-'+index">{{article.number}} - {{article.title}}</option>
							</select>
						</div>
						<div class="mx-2 flex-1">
							<Label class="text-lg leading-6 w-full" for="techniques">Techniques</Label>
							<select style="min-width:200px;min-height:118px;" id="techniques" class="w-full" v-model="issue.techniques" multiple>
								<option :value="{display: technique.number + ' - ' + technique.title, id: technique.id}" v-for="(technique, index) in filteredTechniques" :key="'technique-'+index">{{technique.number}}</option>
							</select>
						</div>
						<div class="mx-2 flex-1">
							<Label class="text-lg leading-6 w-full" :stacked="false" for="pages">Pages</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('pages') }" id="pages-validation">The pages field is required</small>
							<select :aria-describedby="failedValidation.includes('pages') ? 'pages-validation' : false" required style="min-width:200px;" id="pages" class="w-full" v-model="issue.pages" multiple>
								<option class="break-words whitespace-normal" :value="page.content" v-for="(page, index) in audit.pages" :key="'page-'+index">{{page.content}}</option>
							</select>
						</div>
						<div class="mx-2 flex-1">
							<Label class="text-lg leading-6 w-full" for="audit_status">States</Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('audit_states') }" id="states-validation">{{validationMessages["audit_states"]}}</small>
							<select :aria-describedby="failedValidation.includes('audit_states') ? 'states-validation' : false" required style="min-width:200px;" id="audit_status" class="w-full" v-model="issue.audit_states" multiple>
								<option :value="status" v-for="(status, index) in audit_states" :key="'audit_status-'+index">{{status}}</option>
							</select>
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
								<option :value="option" v-for="(option, index) in statuses" :key="'status-'+index">{{option}}</option>
							</select>
						</div>
					</div>

					<div class="flex w-full justify-evenly mt-2">
						<div class="w-1/2 flex flex-col px-2">
							<Label :stacked="false" class="text-lg leading-6 w-full" for="issue_descriptions">Descriptions <small>(Note: this editor is not fully accessible)</small></Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('descriptions') }" id="descriptions-validation">{{validationMessages["descriptions"]}}</small>
							<div class="flex items-start mb-1">
								<Button class="mr-2" @click.native.prevent="selectDescriptionsModalOpen = true" color="orange" hover="true">Add Descriptions</Button>
								<Button @click.native.prevent="addIssueReferenceLinkModalOpen = true" color="orange" hover="true">Add issue reference</Button>
							</div>
							<div class="shadow appearance-none bg-white border border-gray-300 focus:border-transparent placeholder-gray-400 px-4 py-2 rounded-b text-base text-gray-700 w-full" ref="descriptionEditor" style="max-height:296px;min-height:296px;overflow-y:auto;" id="editor1" ></div>
						</div>
						<div class="w-1/2 flex flex-col px-2">
							<Label :stacked="false" class="text-lg leading-6 w-full" for="issue_recommendations">Recommendations <small>(Note: this editor is not fully accessible)</small></Label>
							<small class="text-red-600" :class="{ 'hidden': !failedValidation.includes('recommendations') }" id="recommendations-validation">{{validationMessages["recommendations"]}}</small>
							<Button class="self-start mb-1" @click.native.prevent="selectRecommendationsModalOpen = true" color="orange" hover="true">Add Recommendations</Button>
							<div class="shadow appearance-none bg-white border border-gray-300 focus:border-transparent placeholder-gray-400 px-4 py-2 rounded-b text-base text-gray-700 w-full" ref="recommendationEditor" style="max-height:296px;min-height:296px;overflow-y:auto;" id="editor2" ></div>
						</div>
					</div>
					<div class="flex w-full flex-col mt-2 px-2">
						<template v-if="audit.number == 1">
							<Label class="text-lg leading-6 w-full" for="first_audit_notes">Auditor Notes</Label>
							<TextArea rows="14" class="w-full" id="first_audit_notes" v-model="issue.first_audit_notes"></TextArea>
						</template>
						<template v-else-if="audit.number == 2">
							<Label class="text-lg leading-6 w-full" for="second_audit_notes">Auditor Notes</Label>
							<TextArea rows="14" class="w-full" id="second_audit_notes" v-model="issue.second_audit_notes"></TextArea>
						</template>
						<template v-else-if="audit.number == 3">
							<Label class="text-lg leading-6 w-full" for="third_audit_notes">Auditor Notes</Label>
							<TextArea rows="14" class="w-full" id="third_audit_notes" v-model="issue.third_audit_notes"></TextArea>
						</template>
					</div>
					
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex">
				<button @click="confirmDeleteModalOpen = true" v-if="selectedRows.length && issue.id" type="button" class="mx-2 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 w-auto">
					Delete
				</button>
				<button @click="issueModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 w-auto">
					Cancel
				</button>
				<button @click="saveIssue" type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-orange hover:text-white text-gray-700 w-auto">
					Save
				</button>
			</div>
		</Modal>
		<Modal size="wide" v-if="project" class="z-50" :open="addIssueReferenceLinkModalOpen">
			<div class="bg-white px-4 pt-5 pb-4 p-6">
				<Button aria-label="Close select descriptions modal" @click.native.prevent="addIssueReferenceLinkModalOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Button>
				<h2 class="text-center">Select which audit and issue</h2>
				<Label for="referenceAudits">Audit</Label>
				<select id="referenceAudits" name="referenceAudits" aria-label="Select audit" class="m-2 w-full" v-model="selectedReference.audit">
					<option :value="audit.id" v-for="(audit, index) in project.audits" :key="'audits-'+index">{{audit.title}}</option>
				</select>
				<div v-if="selectedReference.audit && selectedReference.issues.length" class="px-2">
					<Label for="referenceIssues">Issue</Label>
					<select id="referenceIssues" aria-label="Select issue" class="m-2 w-full" v-model="selectedReference.issue">
						<option :value="issue" v-for="(issue, index) in selectedReference.issues" :key="'referenceIssues-'+index">{{issue.issue_number}}</option>
					</select>

					<div class="flex flex-col">
						<Label for="referenceText">Link text</Label>
						<TextInput v-model="selectedReference.linkText" id="referenceText"></TextInput>

						<h2 class="self-center my-2">Issue preview</h2>
					</div>

					<div v-if="selectedReference.issue" class="flex w-full">
						<div class="w-1/2 flex flex-col pr-3">
							<Label>Description</Label>
							<p style="max-height:200px;" class="overflow-y-auto" v-html="selectedReference.issue.descriptions"></p>
						</div>
						<div class="w-1/2 flex flex-col pl-3">
							<Label>Recommendation</Label>
							<p style="max-height:200px;" class="overflow-y-auto" v-html="selectedReference.issue.recommendations"></p>
						</div>
					</div>
					<div class="flex w-full">
						<div class="w-1/3 pr-3">
							<Label>Pages</Label>
							<ul style="max-height:200px;" class="overscroll-y-auto">
								<li v-for="(page, index) in selectedReference.issue.pages" :key="'refPage-'+index">{{page}}</li>
							</ul>
						</div>
						<div class="w-1/3 px-3">
							<Label>Success Criteria</Label>
							<ul style="max-height:200px;" class="overscroll-y-auto">
								<li v-for="(article, index) in selectedReference.issue.articles" :key="'refPage-'+index">{{articles.find( a=> a.id==article.id).number}} - {{articles.find( a=> a.id==article.id).title}}</li>
							</ul>
						</div>
						<div class="w-1/3 pl-3">
							<Label>Status</Label>
							<p>{{selectedReference.issue.status}}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex">
				<button @click="addIssueReferenceLinkModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700  w-auto text-sm">
					Cancel
				</button>
				<button @click.prevent="createReferenceLink" type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-orange hover:text-white text-gray-700  w-auto text-sm">
					Create Reference
				</button>
			</div>
			
		</Modal>
		<Modal class="z-50" :open="selectDescriptionsModalOpen">
			<div class="bg-white px-4 pt-5 pb-4 p-6">
				<Button aria-label="Close select descriptions modal" @click.native.prevent="selectDescriptionsModalOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Button>
				<h2 class="text-center">Which Success Criteria descriptions would you like to add?</h2>
				<select aria-label="Select descriptions" class="m-2 w-full" multiple v-model="selectedDescriptions">
					<option :value="articles.find( a=>a.id == option.id)" v-for="(option, index) in issue.articles" :key="'descriptions-'+index">{{articles.find( a=>a.id == option.id).number}}</option>
				</select>
				<Button @click.native.prevent="addSelectedDescriptions" class="mx-2" color="orange" hover="true">Add</Button>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex">
				<button @click="selectDescriptionsModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700  w-auto text-sm">
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
				<button @click="selectRecommendationsModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700  w-auto text-sm">
				Cancel
				</button>
			</div>
		</Modal>
		<Modal style="z-index:60;" :open="confirmDeleteModalOpen">
			<div class="bg-white px-4 pt-5 pb-4 p-6">
				<Button aria-label="Close select descriptions modal" @click.native.prevent="confirmDeleteModalOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Button>
				<h2 class="text-center">Are you sure you want to delete {{ selectedRows.length === 1 ? 'this issue' : 'these issues' }}?</h2>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex">
				<button @click="confirmDeleteModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700  w-auto text-sm">
					Cancel
				</button>
				<button @click="deleteSelectedIssues" v-if="selectedRows.length" type="button" class="mx-2 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 font-medium text-white hover:bg-red-700  w-auto text-sm">
					Delete
				</button>
			</div>
			
		</Modal>
		<Modal style="z-index:60;" :open="whichCSVModalOpen">
			<div class="bg-white px-4 pt-5 pb-4 p-6">
				<Button aria-label="Close select descriptions modal" @click.native.prevent="whichCSVModalOpen = false" class="absolute top-4 right-4" hover="true" color="white">X</Button>
				<h2 class="text-center">Which CSV do you want to export?</h2>
				<div class="flex my-4 justify-center">
					<Button @click.native.prevent="getIssuesCSV" class="mx-2" color="orange" hover="true">Issues</Button>
					<Button @click.native.prevent="getSampleCSV" class="mx-2" color="orange" hover="true">Working Sample</Button>
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex">
				<button @click="whichCSVModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700  w-auto text-sm">
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
import projects from '../../store/modules/project'
import admin from '../../store/modules/admin'

export default {
	data: () => ({
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
			"Resolved by removal"
		],
		darkMode: false,
		issueModalOpen: false,
		selectDescriptionsModalOpen: false,
		selectRecommendationsModalOpen: false,
		addIssueReferenceLinkModalOpen: false,
		selectedDescriptions: [],
		selectedReference: { audit: null, issue: null, issues: [], linkText: "" },
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
			recommendations: "",
			descriptions: "",
			levels: [],
			actrs: [],
			audit_id: "",
			first_audit_notes: "",
			second_audit_notes: "",
			third_audit_notes: "",
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
			first_audit_notes: "",
			second_audit_notes: "",
			third_audit_notes: "",
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
		fixCSVIssues : { auditLoaded: false, articlesLoaded: false},
		issuesFixed: false
	}),
	computed: {
		isManager(){
			return this.$store.getters["auth/isManager"]
		},
		issues(){
			return this.audit ? this.audit.issues : []
		},
		audit_states(){
			return this.$store.state.admin.audit_states.map( as => as.content)
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
				first_audit_notes: "150px",
				second_audit_notes: "150px",
				third_audit_notes: "150px",
				effort: "300px",
			}
			let hideByDefault = [
				"id",
				"screenshots",
				"resources",
				"effort",
				"priority",
				"first_audit_notes",
				"second_audit_notes",
				"third_audit_notes",
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
					hidePermanent: this.isHeaderHidePermanent(key)
				})
			}
			
			return arr
		},
		audit(){
			return this.$store.state.audits && this.$store.state.audits.audit ? this.$store.state.audits.audit : false
		},
		project(){
			return this.$store.state.projects.project ? this.$store.state.projects.project : false
		}
	},
	props: [],
	watch: {
		"$store.state.audits.audit": function(newVal){
			this.selectedSoftware = newVal.software_used[0]
			this.$store.dispatch("projects/getProject", {id: newVal.project_id})
		},
		"issue.articles": function(){
			if( this.selectedRows.length ){
				return
			}

			this.issue.levels = []
			this.issue.techniques = []
			
			for( let i in this.issue.articles ){
				if( !this.issue.levels.includes( this.articles[ this.issue.articles[i].id ].level ) ){
					this.issue.levels.push( this.articles[ this.issue.articles[i].id ].level )
				}
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
		addIssueReferenceLinkModalOpen(newVal){
			if( newVal ){
				this.selectedReference.audit = null
			}
		},
		"selectedReference.audit": function(newVal){
			if( newVal ){
				this.$store.state.audits.loading = true
				Request.getPromise( `${this.$store.state.audits.API}/${this.$store.state.auth.account}/audits/${newVal}/issues` )
				.then( response=>{
					this.selectedReference.issues = response.data.details
					this.selectedReference.issue = response.data.details[0]
				})
				.catch( response=>{console.log(response)})
				.then( () => this.$store.state.audits.loading = false )
			}
		}
	},
	methods: {
		isHeaderHidePermanent(key){
			if( this.audit.number == 1 && ( key == "second_audit_notes" || key == "third_audit_notes" ) ){
				return true
			}
			if( this.audit.number == 2 && key == "third_audit_notes" ){
				return true
			}

			return false
		},
		selectAll(ids){
			this.selectedRows = ids
		},
		deselectAll(){
			this.selectedRows = []
		},
		markComplete(){
			this.$store.dispatch("audits/completeAudit", {audit_id: this.$route.params.id})
		},
		createNextAudit(){
			this.$store.dispatch("audits/createNextAudit", {audit_id: this.$route.params.id})
		},
		getIssuesCSV(){
			this.$store.state.audits.loading = true
			Request.postPromise(`${this.$store.state.auth.userAPI}/${this.$store.state.auth.account}/audits/${this.$route.params.id}/meta`, {params: {key: "sort", value: this.$refs.issuesTable.columnData.map( o=> o.id)}})
			.then( ()=> {
				this.$store.state.audits.loading = false
				window.location.href = `${this.$store.state.auth.toolboxapi}/user/${this.$store.state.auth.account}/${this.$store.state.auth.user.id}/audits/${this.$route.params.id}/csv/issues`
			})
			.catch()
			.then( ()=> this.$store.state.audits.loading = false )
		},
		getSampleCSV(){
			window.location.href = `${this.$store.state.auth.toolboxapi}/user/${this.$store.state.auth.account}/audits/${this.$route.params.id}/csv/sample`
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
			delete this.issue.id
			this.descriptionsQuill.root.innerHTML = this.issue.descriptions
			this.recommendationsQuill.root.innerHTML = this.issue.recommendations
			
			this.issueModalOpen = true
		},
		editIssue(){
			let copy = JSON.parse(JSON.stringify(this.audit.issues.find( i => i.id == this.selectedRows[0] )))
			this.issue = copy
			let allPages = this.audit.pages.map( p=>p.content)
			for( let p in this.issue.pages ){
				if( !allPages.includes(this.issue.pages[p]) ){
					this.$store.state.audits.audit.pages.push({
						content: this.issue.pages[p],
						screen: null
					})
				}
			}
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
			this.$store.dispatch("audits/deleteIssues", { issues: this.selectedRows, audit_id: this.$route.params.id })
			this.issue = this.getDefault()
			this.descriptionsQuill.root.innerHTML = ""
			this.recommendationsQuill.root.innerHTML = ""
			this.issueModalOpen = false
			this.selectedRows = []
			this.confirmDeleteModalOpen = false
		},
		createReferenceLink(){
			let builder = `<a href="https://toolboxdashboard.ngrok.io/audits/${this.selectedReference.audit}/overview#${this.selectedReference.issue.issue_number}" target="_blank" rel="nofollow">${this.selectedReference.linkText}</a>`

			this.descriptionsQuill.root.innerHTML += builder
			this.addIssueReferenceLinkModalOpen = false
			this.selectedReference = { audit: null, issue: null, issues: [], linkText: "" }
		},
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
			this.selectedDescriptions = []
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
					pass = !!this.issue[prop]
					if( prop == "descriptions" || prop == "recommendations" ){
						pass = !!this.issue[prop] && this.issue[prop] != "<div><br></div>";
					}
					console.log(prop, pass);
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
				let uniqid = this.generateUniqueID()
				
				this.issue.issue_number = uniqid
				
				this.$store.dispatch("audits/createIssue", {issue: this.issue})
				this.issueModalOpen = false
				this.issue = this.getDefault()
				this.descriptionsQuill.root.innerHTML = ""
				this.recommendationsQuill.root.innerHTML = ""
			}
		},
		updateIssue(){
			if( this.validate() ){
				this.$store.dispatch("audits/updateIssue", {issue: this.issue, audit_id: this.$route.params.id})
				this.issueModalOpen = false
				this.issue = this.getDefault()
				this.descriptionsQuill.root.innerHTML = ""
				this.recommendationsQuill.root.innerHTML = ""
				this.selectedRows = []
			}
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
		if(this.$store.state.projects === undefined){
			this.$store.registerModule('projects', projects)
		}
		if(this.$store.state.admin === undefined){
			this.$store.registerModule('admin', admin)
		}
		if( this.$store.state.audits ){
			this.$store.dispatch("audits/getAudit", {id: this.$route.params.id, withIssues: true})
			this.$store.dispatch("audits/getArticlesTechniquesRecommendations")
			this.$store.dispatch("admin/getAuditStates")
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
<style scoped>
	#no-issues-import:hover{
		color:white !important;
	}
</style>