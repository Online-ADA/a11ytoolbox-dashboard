<template>
	<div class="text-center mt-32">
		<Loader v-if="loading"></Loader>
		
		<A class="pr-3" type='router-link' :to="{path: `/domains/${$route.params.id}`}">View Domain</A>
		<A type='router-link' :to="{path: `/projects/${domain.project_id}`}">View Project</A>
		<h2 class="mb-1">{{domain.title}}</h2>
		<h3 class="mb-3">{{domain.url}}</h3>
		
		<template v-if="domain && domain.pages.length">
			<h3 class="mb-3">Pages</h3>
			<ul class="mb-4">
				<li v-for="page in domain.pages" :key="page.id">
					<A type='router-link' :to="{path: `/pages/${page.id}`}">{{page.url || page.description}}</A>
				</li>
			</ul>
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
export default {
	data: () => ({
		file: false,
		data: {}
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
	},
	mounted() {
		
	},
	components: {
		Loader,
		A,
		FileInput,
		Button,
		TextInput,
		Label
	},
}
</script>