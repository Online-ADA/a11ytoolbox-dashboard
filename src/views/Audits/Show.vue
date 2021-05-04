<template>
	<div class="text-center mt-32 mx-auto">
		<Loader v-if="loading"></Loader>
		<template v-if="audit">
			<A class="pr-3" type='router-link' :to="{path: `/audits/${$route.params.id}/edit`}">Edit Audit</A>
			<A type='router-link' :to="{path: `/projects/${audit.project_id}`}">View Project</A>
			<h2 class="mb-3">{{audit.title}}</h2>
			<Table v-if="issues.length" :data="issues" :columns="columns"></Table>
			<template v-else>
				There are no issues.
			</template>
		</template>
		<div class="flex fixed bottom-0 left-0 mb-3 ml-3">
			<Button @click.native.prevent="issueModalOpen = true" class="mx-2" color="orange" hover="true">Add Issue</Button>
			<Button @click.native.prevent="darkMode = !darkMode" class="mx-2" :color="darkMode ? 'orange' : 'white'" :hover="true">Dark Mode</Button>
		</div>
		<Modal :open="issueModalOpen">
			<div class="bg-white px-4 pt-5 pb-4 p-6">
				<div class="flex items-start mt-3 text-left w-full">
					
					<div class="flex w-full justify-evenly mt-2">
						<div class="w-1/3">
							<Label class="text-lg leading-6 w-full" for="article-level">Level<small class="pl-1 text-pallette-orange-dark" aria-hidden="true">*</small></Label>
							
						</div>
						<div class="w-1/3">
							<Label class="text-lg leading-6 w-full" for="article-number">Number<small class="pl-1 text-pallette-orange-dark" aria-hidden="true">*</small></Label>
							
						</div>
					</div>
					
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex flex-row-reverse">
					<button v-if="false" type="button" class="mx-2 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-auto text-sm">
					Delete
					</button>
					<button @click="issueModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto text-sm">
					Cancel
					</button>
					<button  type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-orange hover:text-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto text-sm">
					Save
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
import Label from '../../components/Label'
import TextInput from '../../components/TextInput'
import TextArea from '../../components/TextArea'
export default {
	data: () => ({
		darkMode: false,
		issueModalOpen: false
	}),
	computed: {
		loading(){
			if( this.$store.state.audits ){
				return this.$store.state.audits.loading
			}
			return false
		},
		audit(){
			if( this.$store.state.audits ){
				return this.$store.state.audits.audit
			}
			return false
		},
		issues(){
			if( this.audit ){
				return this.audit.issues
			}
			return []
		},
		columns(){
			//{ width: "100px", show: true, header: 'Column 1', sticky: true, style: {} }
			let arr = []
			if( !this.issues.length ){
				return arr
			}
			for( let key of Object.keys(this.issues[0]) ){
				let widthMap = {
					id: "150px",
					pages: "250px",
					status: "150px",
					manual: "150px",
					logged_out: "150px",
					target: "300px",
					screenshots: "250px",
					resources: "250px",
					browser_combos: "300px",
					articles: "150px",
					techniques: "150px",
					recommendations: "300px",
					descriptions: "300px",
					levels: "150px",
					actrs: "250px",
					created_by: "250px",
					issue_number: "150px",
					priority: "150px",
					is_mobile: "150px",
					effort: "300px",
				}
				let hideByDefault = [
					"audit_id",
					"created_by",
					"status",
					"screenshots",
					"resources",
					]
					arr.push({
					header: this.parseHeader(key),
					show: hideByDefault.includes(key),
					sticky: key == "id" ? true : false,
					style: {},
					width: widthMap[key],
					dataKey: key
				})
			}
			return arr
		}
	},
	props: [],
	watch: {
			"$store.state": function(newVal){
				if( !this.audit && newVal.audits ){
					this.$store.dispatch("audits/getAudit", {id: this.$route.params.id, withIssues: true})
			}
		}
	},
	methods: {
		parseHeader(string){
			return string.replace(/[-_.]/gm, " ");
		}
	},
	created() {
		if( this.$store.state.audits ){
			this.$store.dispatch("audits/getAudit", {id: this.$route.params.id, withIssues: true})
		}
	},
	mounted() {
	},
	components: {
		Loader,
		A,
		Table,
		Button,
		Modal,
		Label,
		TextInput,
		TextArea
	},
}
</script>