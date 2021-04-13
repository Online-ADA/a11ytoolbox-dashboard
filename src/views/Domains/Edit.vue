<template>
	<div class="text-center mt-32 mb-24">
		<Loader v-if="loading"></Loader>
		
		<A class="pr-3" type='router-link' :to="{path: `/domains/${$route.params.id}`}">View Domain</A>
		<A type='router-link' :to="{path: `/projects/${domain.project_id}`}">View Project</A>
		<h2 class="mb-1">{{domain.title}}</h2>
		<h3 class="mb-3">{{domain.url}}</h3>

		<h3 class="mt-5 mb-3">Add page</h3>

		<div class="w-full flex mb-4">
			<div class="w-1/12"></div>
			<div class="w-5/12 px-2">
				<Label for="description">Description</Label>
				<TextInput placeholder="All modals" class="w-9/12 ml-1" id="description" v-model="page.description" />
			</div>
			<div class="w-5/12 px-2">
				<Label :stacked="false" class="flex items-center justify-center w-full" for="url"><span class="pr-3">Url</span><small>(Without domain)</small></Label>
				<div class="flex items-center">
					<span>{{domain.url}}/</span><TextInput placeholder="contact" class="w-full" id="url" v-model="page.url" />
					<Button class="ml-2" color="orange" @click.native.prevent="addPage">Add</Button>
				</div>
			</div>
			<div class="w-1/12"></div>
		</div>
		
		<template v-if="domain && domain.pages.length">
			<h3 class="mb-3">Sitemap</h3>
			<Card style="max-height:400px" :gutters="false" class="block mx-auto my-4 overflow-y-auto">
				<ul class="mb-4">
					<li v-for="page in domain.pages" :key="page.id">
						<A class="w-full" type='router-link' :to="{path: `/pages/${page.id}`}">{{page.url || page.description}}</A>
						<Button @click.native.prevent="deletePage(page.id)" color="delete" class="ml-4">X</Button>
					</li>
				</ul>
			</Card>
			<Button @click.native.prevent="emptySitemap" color="delete">Remove all</Button>
		</template>
		<template v-else>
			There are no pages for this domain. <A type="router-link" :to="{path: `/pages/create`}">Create one</A>
		</template>

		<FileInput @input="handleFile" class="block w-auto mx-auto pb-3" accept=".csv, .xml"></FileInput>
		<Button color="orange" @click.native.prevent="uploadSitemap">Upload sitemap</Button>
	</div>
</template>

<script>
import Loader from '../../components/Loader'
import TextInput from '../../components/TextInput'
import Label from '../../components/Label'
import A from '../../components/Link'
import Button from '../../components/Button'
import FileInput from '../../components/FileInput'
import Card from '../../components/Card'
export default {
	data: () => ({
		file: false,
		data: {},
		page: {
			description: "",
			url: "",
			domain_id: ""
		}
	}),
	computed: {
		loading(){
			if( this.$store.state.audits ){
				return this.$store.state.audits.loading
			}
			return false
		},
		domain() {
			if( this.$store.state.domains ){
				return this.$store.state.domains.domain
			}
			return false
		},
	},
	props: [],
	watch: {
		"$store.state.domains.domain": function(newVal){
			if( newVal ){
				this.data = newVal
			}
		}
	},
	methods: {
		addPage(){
			this.$store.dispatch("domains/addPageToSitemap", {page: this.page, vm: this})
		},
		deletePage(id){
			this.$store.dispatch("domains/removePageFromSitemap", {page_id: id, domain_id: this.$route.params.id})
		},
		handleFile(e){
			this.file = e
		},
		getDomain(){
			this.$store.dispatch("domains/getDomain", {id: this.$route.params.id, vm: this})
		},
		uploadSitemap(){
			if( this.file ){
				this.$store.dispatch("domains/saveSitemap", {id: this.$route.params.id, file: this.file, domain: this.domain.url})
			}
		},
		emptySitemap(){
			this.$store.dispatch("domains/emptySitemap", {id: this.$route.params.id})
		},
		saveDomain(){
			this.audit.tech_requirements = this.audit.tech_requirements.map(o=>o.name)
			this.audit.assistive_tech = this.audit.assistive_tech.map(o=>o.name)
			this.audit.software_used = this.audit.software_used.map(o=>o.name)
			this.audit.assigned = this.assigned

			this.$store.dispatch("domains/updateDomain", {audit: this.audit, router: this.$router, id: this.$route.params.id})
		}
	},
	created() {
		this.getDomain()
		this.page.domain_id = this.$route.params.id
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
		Card
	},
}
</script>