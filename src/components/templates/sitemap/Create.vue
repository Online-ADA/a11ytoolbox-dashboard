<template>
	<div class="text-center mt-20 pb-24 container mx-auto">
		<Loader v-if="loading"></Loader>
		
		<template v-if="independent">
			<A class="pr-3" type='router-link' :to="{path: `/domains/${$route.params.id}`}">View Domain</A>
			<A type='router-link' :to="{path: `/projects/${domain.project_id}`}">View Project</A>
		</template>
		<template v-if="!independent">
			<h1 class="mb-2">Create the structured sample</h1>
			<h2 class="text-base mb-3">Before we can create an audit, we must create a structured sample. The Structured sample serves as the core list of pages available to pick from when adding new issues to your audit. The can be anything from an actual valid URL to a description like "All modals". The structured sample is required to generate a working sample (on the next page). The Sitemap is a list of actual valid URLs of the site and is used when running the scan. The Sitemap is optional, but if present, will be used in conjunction with the Structured List to generate a working sample. </h2>
		</template>
		<h2 class="mb-1">{{domain.title}}</h2>
		<div class="flex items-center justify-center mb-3">
			<h3 class="pr-2">{{domain.url}}</h3>
			<Button @click.native.prevent="editDomainOpen = true" :hover="true"><i class="far fa-edit"></i></Button>
		</div>
		<Modal :open="editDomainOpen">
			<div class="bg-white px-4 pt-5 pb-4">
				<div class="flex items-start">
					<div class="mt-3 text-left w-full">
						<h3 class="text-lg leading-6 font-medium text-gray-900">
							Edit
						</h3>
						<div class="mt-2 w-full">
							<Label for="edit-title">Edit Title</Label>
							<TextInput class="w-full" v-model="data.title" id="edit-title"></TextInput>

							<Label class="mt-2" for="edit-url">Edit Url</Label>
							<TextInput class="w-full" v-model="data.url" id="edit-url"></TextInput>
						</div>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
				<Button @click.native.prevent="saveDomain" :hover="true">Save</Button>
				<Button class="mr-2" @click.native.prevent="editDomainOpen = false" :hover="false">Cancel</Button>
			</div>
		</Modal>
		<Modal :size="'wide'" :open="structuredListModalOpen">
			<div class="w-full flex justify-between">
				<h4 class="mb-3">Add item</h4>
				<Button @click.native.prevent="structuredListModalOpen = false" aria-label="Close add items to structured list modal" :hover="true">X</Button>
			</div>
			<div style="max-height:550px" class="w-full px-2 overflow-y-auto">
				<span id="content-description" class="sr-only">If this field is left empty, it will not be added to the list upon saving but it will indicate a failure</span>
				<div :key="'strucList-' + index" v-for="(item, index) in structured_items" class="flex items-center my-2">
					<div class="flex flex-1 flex-col mx-1">
						<Label :stacked="false" class="flex-1" :for="'content-' + index">Content<small aria-hidden="true" class="text-red-600">*</small></Label>
						<TextInput aria-describedby="content-description" placeholder="All Modals, https://onlineada.com/contact..." class="flex-1" :id="'content-' + index" v-model="structured_items[index].content" />
					</div>
					<div class="flex flex-1 flex-col mx-1">
						<Label class="flex-1" :for="'screen-' + index">Screen</Label>
						<TextInput placeholder="https://nimb.ws/AyYVWS" class="flex-1" :id="'screen-' + index" v-model="structured_items[index].screen" />
					</div>

					<Button class="ml-2 self-end pb-2.5" color="delete" @click.native.prevent="popStructuredItem"><i class="far fa-trash-alt"></i></Button>
				</div>
				<Button class="" color="orange" @click.native.prevent="saveStructuredList">Save List</Button>
				<Button class="ml-2" color="orange" @click.native.prevent="addStructuredItem">Add</Button>
			</div>
		</Modal>

		<div class="w-full flex">
			<Card class="flex-1 p-4 mx-2">
				<h3 class="mt-3 mb-1">Structured Sample</h3>
				<Button class="" color="orange" @click.native.prevent="structuredListModalOpen =true">Add</Button>
				<template v-if="domain && domain.sample.length">
					<h4 class="my-3">Items</h4>
					<Card style="max-height:400px" :gutters="false" class="block mx-auto my-4 overflow-y-auto">
						<table class="w-full border border-black table-fixed">
							<thead>
								<tr>
									<th class="text-center border border-black" width="40%" scope="col"><span id="sample-content">Content</span></th>
									<th class="text-center border border-black" width="40%" scope="col"><span id="sample-screen">Screen</span></th>
									<th class="text-center border border-black" width="10%" scope="col">Delete</th>
									<th class="text-center border border-black" width="10%" scope="col">Save</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="sample in domain.sample" :key="sample.id">
									<td class="p-1.5 overflow-y-auto border border-black"><TextInput v-model="sample.content" aria-labelledby="sample-content"></TextInput></td>
									<td class="p-1.5 overflow-y-auto border border-black"><TextInput v-model="sample.screen" aria-labelledby="sample-screen"></TextInput></td>
									<td class="p-1.5 overflow-y-auto border border-black"><Button @click.native.prevent="deleteItem(sample.id)" color="delete">X</Button></td>
									<td class="p-1.5 overflow-y-auto border border-black"><Button @click.native.prevent="updateItem(sample)" color="orange"><i class="fas fa-save"></i></Button></td>
								</tr>
							</tbody>
						</table>
					</Card>
					<Button @click.native.prevent="emptySample" color="delete">Remove all</Button>
				</template>

				<FileInput @input="handleSampleFile" class="block w-auto mx-auto pb-3" accept=".csv"></FileInput>
				<Button color="orange" @click.native.prevent="uploadSample">Upload Sample</Button>
			</Card>

			<Card class="flex-1 p-4 mx-2">
				<h3 class="mt-3 mb-1">Sitemap</h3>
				<h4 class="mb-3">Add url</h4>
				<div class="w-full flex mb-4">
					<div class="w-full px-2">
						<Label :stacked="false" class="flex items-center justify-center w-full" for="url"><span class="pr-3">Url</span><small>(Without domain)</small></Label>
						<div class="flex items-center">
							<span>{{domain.url}}/</span><TextInput placeholder="contact" class="w-full" id="url" v-model="page.url" />
							<Button class="ml-2" color="orange" @click.native.prevent="addPage">Add</Button>
						</div>
					</div>
				</div>
				<template v-if="domain && domain.pages.length">
					<h4 class="mb-3">Pages</h4>
					<Card style="max-height:400px" :gutters="false" class="block mx-auto my-4 overflow-y-auto">
						<ul class="mb-4">
							<li v-for="page in domain.pages" :key="page.id">
								{{page.url}}
								<Button @click.native.prevent="deletePage(page.id)" color="delete" class="ml-4">X</Button>
							</li>
						</ul>
					</Card>
					<Button @click.native.prevent="emptySitemap" color="delete">Remove all</Button>
				</template>

				<FileInput @input="handleSitemapFile" class="block w-auto mx-auto pb-3" accept=".csv, .xml"></FileInput>
				<small class="text-xs">Note: If the domain on an entry in the uploaded file does not match this domain, it will not be added to the sitemap.</small>
				<Button color="orange" @click.native.prevent="uploadSitemap">Upload sitemap</Button>
			</Card>
			
		</div>

		<template v-if="!independent">
			<div class="flex justify-center flex-wrap" v-if="domain && domain.sample.length">
				<h2 class="my-3 w-full">Now that we have a structured sample, we can create our audit</h2>
				<Button @click.native.prevent="setComplete" color="orange" :hover="true">Continue</Button>
			</div>
		</template>
	</div>
</template>

<script>
import Loader from '../../../components/Loader'
import TextInput from '../../../components/TextInput'
import Label from '../../../components/Label'
import Modal from '../../../components/Modal'
import A from '../../../components/Link'
import Button from '../../../components/Button'
import FileInput from '../../../components/FileInput'
import Card from '../../../components/Card'

export default {
	data: () => ({
		structuredListModalOpen: false,
		editDomainOpen: false,
		sitemapFile: false,
		sampleFile: false,
		data: {},
		domain: false,
		structured_items: [
			{content: "", screen: ""}
		],
		page: {
			url: "",
			domain_id: ""
		},
		complete: false
	}),
	props: {
		independent: {
			type: Boolean,
			default: true
		},
	},
	computed: {
		loading(){
			if( this.$store.state.domains ){
				return this.$store.state.domains.loading
			}
			return false
		},
		sheetData(){
			return this.$parent.$parent.sheetData
		},
		projects(){ //Only used if inside a sheet
			if( !this.independent ){
				if( this.$store.getters["auth/isManager"] ){
					return this.$store.state.admin.projects
				}

				return this.$store.state.projects.all
			}
			else{
				return this.$store.state.domains.projects
			}
		},
		project(){
			if( !this.independent && this.projects.length ){
				return this.projects.filter( p=> p.id == this.sheetData.sheet0.project)[0]
			}else{
				return false
			}
		},
	},
	watch: {
		"$store.state.domains.domain": function(newVal){
			if( newVal ){
				this.data = newVal
				this.domain = newVal
				this.page.domain_id = this.domain.id
			}
		},
		"sheetData.sheet1.domain": function(newVal){
			if( newVal ){
				this.domain = this.project.domains.filter( d=>d.id == newVal )[0]
				this.data = this.domain
				this.page.domain_id = this.domain.id
			}
		},
		complete(newVal){
			if( newVal ){
				this.$emit("complete", {sheet: 'sheet2', key: 'sample', data: {'structured': this.domain.sample, 'sitemap': this.domain.pages}, sheetIndex: this.$parent.index})
				this.complete = false
			}
		},
	},
	methods: {
		popStructuredItem(index){
			this.structured_items.splice(index, 1)
		},
		addStructuredItem(){
			this.structured_items.push({content: "", screen: ""})
		},
		saveStructuredList(){
			this.structuredListModalOpen = false
			this.$store.dispatch("domains/saveSample", {id: this.domain.id, sample: this.structured_items, domain: this.domain.url})
			this.structured_items=  [
				{content: "", screen: ""}
			]
		},
		saveDomain(){
			this.editDomainOpen = false
			this.$store.dispatch("domains/saveDomain", {id: this.domain.id, domain: this.data})
		},
		addPage(){
			this.$store.dispatch("domains/addPageToSitemap", {page: this.page, vm: this})
		},
		deleteItem(id){
			this.$store.dispatch("domains/removeItemFromSample", {item_id: id, domain_id: this.domain.id})
		},
		deletePage(id){
			this.$store.dispatch("domains/removePageFromSitemap", {page_id: id, domain_id: this.domain.id})
		},
		updateItem(item){
			this.$store.dispatch("domains/updateStructuredSampleItem", {item: item})
		},
		handleSitemapFile(e){
			this.sitemapFile = e
		},
		handleSampleFile(e){
			this.sampleFile = e
		},
		getDomain(){
			this.$store.dispatch("domains/getDomain", {id: this.$route.params.id})
		},
		uploadSample(){
			if( this.sampleFile ){
				this.$store.dispatch("domains/saveSample", {id: this.domain.id, file: this.sampleFile, domain: this.domain.url})
			}
		},
		uploadSitemap(){
			if( this.sitemapFile ){
				this.$store.dispatch("domains/saveSitemap", {id: this.domain.id, file: this.sitemapFile, domain: this.domain.url})
			}
		},
		emptySample(){
			this.$store.dispatch("domains/emptySample", {id: this.domain.id})
		},
		emptySitemap(){
			this.$store.dispatch("domains/emptySitemap", {id: this.domain.id})
		},
		setComplete(){
			this.complete = true
		}
	},
	created() {
		if( this.independent ){
			this.getDomain()
		}
	},
	mounted() {
		
	},
	components: {
		Loader,
		A,
		FileInput,
		Button,
		TextInput,
		Label,
		Card,
		Modal
	},
}
</script>