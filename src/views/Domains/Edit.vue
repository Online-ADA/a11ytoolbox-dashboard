<template>
	<div class="text-center pb-24 container mx-auto">
		<Loader v-if="loading"></Loader>
		
		<A class="pr-3" type='router-link' :to="{path: `/domains/${$route.params.id}`}">View Domain</A>
		
		<h2 class="mb-1">{{domain.url}}</h2>
		<div class="flex items-center justify-center mb-3">
			<h3 class="pr-2">{{domain.url}}</h3>
			<Button aria-label="Edit domain title" @click.native.prevent="editDomainOpen = true" :hover="true"><i class="far fa-edit"></i></Button>
		</div>
		<Modal style="z-index:71;" :open="editDomainOpen">
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
		<Modal style="z-index:71;" :size="'wide'" :open="structuredListModalOpen">
			<div class="w-full flex justify-between">
				<h4 class="mb-3">Add item</h4>
				<Button @click.native.prevent="structuredListModalOpen = false" aria-label="Close add items to structured list modal" :hover="true">X</Button>
			</div>
			<div style="max-height:550px" class="w-full xs:p-0 px-2 overflow-y-auto">
				<span id="content-description" class="sr-only">If this field is left empty, it will not be added to the list upon saving but it will indicate a failure</span>
				<div :key="'strucList-' + index" v-for="(item, index) in structured_items" class="flex items-center my-2 xs:flex-wrap">
					<div class="flex flex-1 flex-col mx-1">
						<Label :stacked="false" class="flex-1" :for="'title-' + index">Title<small aria-hidden="true" class="text-red-600">*</small></Label>
						<TextInput aria-describedby="content-description" placeholder="All Modals, https://onlineada.com/contact..." class="flex-1" :id="'title-' + index" v-model="structured_items[index].title" />
					</div>
					<div class="flex flex-1 flex-col mx-1">
						<Label class="flex-1" :for="'url-' + index">Url</Label>
						<TextInput placeholder="https://nimb.ws/AyYVWS" class="flex-1" :id="'url-' + index" v-model="structured_items[index].url" />
					</div>

					<Button class="ml-2 self-end pb-2.5" color="delete" @click.native.prevent="popStructuredItem(index)"><i class="far fa-trash-alt"></i></Button>
				</div>
				<Button class="" color="red" @click.native.prevent="saveStructuredList">Save List</Button>
				<Button class="ml-2" color="red" @click.native.prevent="addStructuredItem">Add</Button>
			</div>
		</Modal>

		<div class="w-full flex xs:flex-wrap sm:flex-wrap">
			<Card class="flex-1 p-4 mx-2">
				<h3 class="mt-3 mb-1">Sitemap</h3>

				<div class="flex w-full justify-center">
					<label class="py-2 font-semibold block" for="specifyRoot">Specify Root</label>
					<Checkbox v-model="specifyRoot" id="specifyRoot"></Checkbox>
				</div>
				

				<div v-if="specifyRoot" class="flex flex-1 flex-col mx-auto w-1/2 pb-5">
					<Label class="flex-1" for="domainRoot">Root</Label>
					<div class="flex w-full">
						<TextInput class="flex-1" id="domainRoot" v-model="domainRoot" />
						<Button class="ml-2" color="red" @click.native.prevent="saveRoot">Save</Button>
					</div>
				</div>

				<h4 class="mb-3">Add url</h4>
				<div class="w-full flex mb-4">
					<div class="w-full px-2">
						<Label :stacked="false" class="flex items-center justify-center w-full" for="url"><span class="pr-3">Url</span><small>(Without domain)</small></Label>
						<div class="flex items-center flex-1">
							<span class="flex-1">{{domain.url}}/<span class="break-word" v-if="domain.root">{{domain.root}}/</span>
								</span>
							<TextInput style="flex-basis:100%" aria-label="Enter a url path" placeholder="contact" class="w-full flex-1" id="url" v-model="page.url" />
							<Button class="ml-2" color="red" @click.native.prevent="addPage">Add</Button>
						</div>
					</div>
				</div>
				<Button color="red" @click.native.prevent="generateSitemap">Generate sitemap</Button>
				<template v-if="domain && domain.pages.length">
					<h4 class="mb-3">Pages</h4>
					<Card style="max-height:400px" :gutters="false" class="block mx-auto my-4 overflow-y-auto">
						<ul class="mb-4">
							<li v-for="page in domain.pages" :key="page.id">
								{{page.url}}
								<Button aria-label="delete this page" @click.native.prevent="deletePage(page.id)" color="delete" class="ml-4">X</Button>
							</li>
						</ul>
					</Card>
					<Button @click.native.prevent="emptySitemap" color="delete">Remove all<span class="sr-only"> sample items</span></Button>
				</template>

				<FileInput @input="handleSitemapFile" class="block w-auto mx-auto pb-3 mt-4" accept=".csv, .xml"></FileInput>
				<small class="text-xs">Note: If the domain on an entry in the uploaded file does not match this domain, it will not be added to the sitemap.</small>
				<Button color="red" @click.native.prevent="uploadSitemap">Upload sitemap</Button>
			</Card>

			<Card class="flex-1 p-4 mx-2 sm:mt-3 xs:mt-3 xs:max-w-full sm:max-w-full">
				<h3 class="mt-3 mb-1">Sample</h3>
				<Button class="" color="red" @click.native.prevent="structuredListModalOpen =true">Add</Button>
				<template v-if="domain && domain.sample.length">
					<h4 class="my-3">Items</h4>
					<Card style="max-height:400px" :gutters="false" class="block mx-auto my-4 overflow-y-auto">
						<table class="w-full border border-black table-fixed min-w-[600px]">
							<thead>
								<tr>
									<th class="text-center border border-black" width="40%" scope="col"><span id="sample-title">Title</span></th>
									<th class="text-center border border-black" width="40%" scope="col"><span id="sample-url">Url</span></th>
									<th class="text-center border border-black" width="10%" scope="col">Delete</th>
									<th class="text-center border border-black" width="10%" scope="col">Save</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="sample in domain.sample" :key="sample.id">
									<td class="p-1.5 overflow-y-auto border border-black"><TextInput v-model="sample.title" aria-labelledby="sample-title"></TextInput></td>
									<td class="p-1.5 overflow-y-auto border border-black"><TextInput v-model="sample.url" aria-labelledby="sample-url"></TextInput></td>
									<td class="p-1.5 overflow-y-auto border border-black"><Button aria-label="delete this sample item" @click.native.prevent="deleteItem(sample.id)" color="delete">X</Button></td>
									<td class="p-1.5 overflow-y-auto border border-black"><Button aria-label="save edits to this sample item" 
									@click.native.prevent="updateItem(sample)" color="orange"><i class="fas fa-save"></i></Button></td>
								</tr>
							</tbody>
						</table>
					</Card>
					<Button @click.native.prevent="emptySample" color="delete">Remove all</Button>
				</template>

				<FileInput @input="handleSampleFile" class="block w-auto mx-auto pb-3" accept=".csv"></FileInput>
				<Button color="red" @click.native.prevent="uploadSample">Upload Sample</Button>
				<div><button class="standard mt-3" @click.prevent="generateSample">Generate Sample</button></div>
			</Card>
			
		</div>
	</div>
</template>

<script>
import Loader from '../../components/Loader'
import TextInput from '../../components/TextInput'
import Checkbox from '../../components/Checkbox'
import Label from '../../components/Label'
import Modal from '../../components/Modal'
import A from '../../components/Link'
import Button from '../../components/Button'
import FileInput from '../../components/FileInput'
import Card from '../../components/Card'

export default {
	data: () => ({
		domainRoot: "",
		specifyRoot: false,
		structuredListModalOpen: false,
		editDomainOpen: false,
		sitemapFile: false,
		sampleFile: false,
		data: {},
		domain: false,
		structured_items: [
			{title: "", url: ""}
		],
		page: {
			url: "",
			domain_id: ""
		},
		complete: false
	}),
	computed: {
		loading(){
			return this.$store.state.domains.loading
		},
		projects(){ //Only used if inside a sheet
			return this.$store.state.projects.all
		},
		project(){
			if( this.projects.length ){
				return this.$store.state.projects.project
			}

			return false
		},
	},
	props: [],
	watch: {
		"$store.state.domains.domain": function(newVal){
			if( newVal ){
				this.data = newVal
				this.domain = newVal
				this.page.domain_id = this.domain.id
				this.specifyRoot = !!this.domain.root
				this.domainRoot = this.domain.root || ""
			}
		},
	},
	methods: {
		saveRoot(){
			this.$store.dispatch("domains/saveRoot", {root: this.domainRoot, id: this.domain.id});
		},
		popStructuredItem(index){
			this.structured_items.splice(index, 1)
		},
		addStructuredItem(){
			this.structured_items.push({title: "", url: ""})
		},
		saveStructuredList(){
			this.structuredListModalOpen = false
			this.$store.dispatch("domains/saveSample", {id: this.domain.id, sample: this.structured_items, domain: this.domain.url})
			this.structured_items=  [
				{title: "", url: ""}
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
			console.log(item);
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
		generateSitemap() {
			this.$store.dispatch("domains/generateSitemap", {id: this.domain.id, file: this.sitemapFile, domain: this.domain.url})
		},
		emptySample(){
			this.$store.dispatch("domains/emptySample", {id: this.domain.id})
		},
		emptySitemap(){
			this.$store.dispatch("domains/emptySitemap", {id: this.domain.id})
		},
		generateSample(){
			console.log("fired");
			this.processSources(this.domain.sample.length ? this.domain.sample : [], this.domain.pages.length ? JSON.parse(JSON.stringify(this.domain.pages)) : [])
		},
		processSources(structured, sitemap){
			this.$store.state.domains.loading = true

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
				if( structured[i].title != null && structured[i].title.toLowerCase() == "sitewide" ){
					continue
				}
				let found = structured_map.some( el => {
					let el_title = el.title ? el.title.toLowerCase() : null
					let el_url = el.url ? el.url.toLowerCase() : null
					let struc_title = structured[i].title ? structured[i].title.toLowerCase() : null
					let struc_url = structured[i].url ? structured[i].url.toLowerCase() : null
					return el_title == struc_title && el_url == struc_url
				})
				if( found ){
					continue
				}
				
				structured_map.push({
					title: structured[i].title,
					url: structured[i].url
				})
			}

			if( sitemap.length ){
				//Remove duplicates from sitemap and structured sample
				while( sitemap_sample.length < tenPercent ){
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

			this.$store.dispatch("domains/generateSample", {items: [{title: "Sitewide", url:null}, ...structured_map, ...sitemap_sample], domain_id: this.$route.params.id})
			this.$store.state.domains.loading = false
		},
	},
	created() {
		
	},
	mounted() {
		this.getDomain()
		document.title = "Edit Domain"
	},
	components: {
		TextInput,
		Loader,
		Label,
		A,
		Modal,
		Button,
		FileInput,
		Card,
		Checkbox
	},
}
</script>