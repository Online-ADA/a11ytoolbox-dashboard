<template>
	<div class="text-center mt-32 container mx-auto flex justify-center">
		<Loader v-if="loading"></Loader>
		<template v-if="independent">
			<div class="flex-1 flex flex-col items-center">
				<h1>Create new Domain</h1>
				<template v-if="projects.length">
					<Form class="flex flex-wrap" @submit.native.prevent>
						<div class="w-full">
							<Label for="choose_product">Select a project</Label>
							<Select id="choose_product" class="mx-auto mb-3" :options="projects" v-model="domain.project_id" :valueProp="'id'" :displayProp="'name'"></Select>
						</div>
						<div class="w-1/12"></div>
						<div class="w-5/12 px-2">
							<Label for="title">Title</Label>
							<TextInput class="w-full" id="title" v-model="domain.title" />
						</div>
						<div class="w-5/12 px-2">
							<Label for="url">Url</Label>
							<div class="flex">
								<Select class="mx-auto w-3/12" :options="['https://', 'http://']" v-model="protocol"></Select>
								<TextInput placeholder="example.com" class="w-9/12 ml-1" id="url" v-model="url" />
							</div>
							{{fullUrl}}
						</div>
						<div class="w-1/12"></div>
						<div class="w-full mt-3">
							<Button hover="true" @click.native.prevent="createDomain">Create</Button>
						</div>
					</Form>
				</template>
				<template v-else>
					There are no projects for this account. <A type="router-link" :to="{path: `/projects/create`}">Create one</A>
				</template>
			</div>
		</template>
		<template v-else>
			<template v-if="project && project.domains.length">
				<div class="w-full flex flex-col items-center">
					<Label for="choose_select"><h1>Select a domain for {{project.name}}</h1></Label>
					<select class="w-1/2 block border cursor-pointer focus:ring-1 outline-none ring-pallette-orange p-2 rounded shadow" v-model="selectedDomain" name="choose_domain" id="choose_select">
						<option :value="domain.id" v-for="(domain) in domains" :key="'domain-' + domain.id">{{domain.url}}</option>
					</select>
					<Button class="mt-3" @click.native.prevent="setComplete" color="orange" hover="true">Continue</Button>
					<h2 class="my-3">Or create a new one</h2>
					<Form class="flex flex-wrap" @submit.native.prevent>
						<div class="w-1/12"></div>
						<div class="w-5/12 px-2">
							<Label for="title">Title</Label>
							<TextInput class="w-full" id="title" v-model="domain.title" />
						</div>
						<div class="w-5/12 px-2">
							<Label for="url">Url</Label>
							<div class="flex">
								<!-- <Select class="mx-auto w-3/12" :options="['https://', 'http://']" v-model="protocol"></Select> -->
								<select class="mx-auto w-3/12 block border cursor-pointer focus:ring-1 outline-none ring-pallette-orange p-2 rounded shadow" v-model="protocol" name="protocol">
									<option :value="protocol" v-for="(protocol, index) in ['https://', 'http://']" :key="'protocol-' + index">{{protocol}}</option>
								</select>
								<TextInput placeholder="example.com" class="w-9/12 ml-1" id="url" v-model="url" />
							</div>
							{{fullUrl}}
						</div>
						<div class="w-1/12"></div>
						<div class="w-full mt-3">
							<Button hover="true" @click.native.prevent="createDomain">Create</Button>
						</div>
					</Form>
				</div>
			</template>
			<template v-else-if="project">
				<div class="w-full flex flex-col items-center">
					<h2 class="my-3">Project {{project.name}} doesn't have any domains. Lets create one</h2>
					<Form class="flex flex-wrap" @submit.native.prevent>
						<div class="w-1/12"></div>
						<div class="w-5/12 px-2">
							<Label for="title">Title</Label>
							<TextInput class="w-full" id="title" v-model="domain.title" />
						</div>
						<div class="w-5/12 px-2">
							<Label for="url">Url</Label>
							<div class="flex">
								<Select class="mx-auto w-3/12" :options="['https://', 'http://']" v-model="protocol"></Select>
								<TextInput placeholder="example.com" class="w-9/12 ml-1" id="url" v-model="url" />
							</div>
							{{fullUrl}}
						</div>
						<div class="w-1/12"></div>
						<div class="w-full mt-3">
							<Button hover="true" @click.native.prevent="createDomain">Create</Button>
						</div>
					</Form>
				</div>
			</template>
		</template>
		
		
		
	</div>
</template>

<script>
import Loader from '../../../components/Loader'
import TextInput from '../../../components/TextInput'
import Label from '../../../components/Label'
import Select from '../../../components/Select'
import Form from '../../../components/Form'
import Button from '../../../components/Button'
import A from '../../../components/Link'
import domains from '../../../store/modules/domains'

export default {
	props: {
		independent: {
			type: Boolean,
			default: true
		},
	},
	data: () => ({
		selectedDomain: false,
		url: "",
		protocol: "https://",
		domain: {
			title: "",
			project_id: ""
		},
		complete: false
	}),
	watch:{
		complete(newVal){
			if( newVal ){
				this.$emit("complete", {sheet: 'sheet1', key: 'domain', data: this.domain.id, sheetIndex: this.$parent.index})
				this.reset()
			}
		},
		"sheetData.sheet0.project":function(newVal){
			this.$store.dispatch("domains/getProjectDomains", {project_id: newVal})
			this.domain.project_id = newVal
		}
	},
	computed: {
			domains(){
				return this.$store.state.domains.all
			},
			loading(){
				return this.$store.state.domains.loading
			},
			projects(){
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
				if(!this.independent){
					let self = this
					return this.projects.filter( p=>{
						return parseInt(p.id) === parseInt(self.sheetData.sheet0.project)
					})[0]
				}
				
				return this.$store.state.domains.projects.filter( p=>{
					return p.i == this.project_id
				})[0]
			},
			fullUrl(){
				let url = this.url.replace(/^https?(:?\/\/?)?/i, "")
				return this.protocol + url
			},
			sheetData(){
				return this.$parent.$parent.sheetData
			}
	},
	methods: {
		reset(){
			this.selectedDomain = this.sheetData.sheet1.domain
			this.domain = {
				title: "",
				project_id: ""
			}
			this.url = ""
			this.protocol = "https://"
			this.complete = false
		},
		createDomain(){
			this.domain.url = this.fullUrl
			this.$store.dispatch("domains/createDomain", {domain: this.domain, vm: this})
		},
		setFirstDomain(){
			this.selectedDomain = this.project.domains[0].id
		},
		setComplete(){
			if( this.selectedDomain ){
				this.domain.id = this.selectedDomain
				this.complete = true
			}
		}
	},
	created() {
		if( this.$store.state.domains === undefined ){
			this.$store.registerModule('domains', domains)
		}
	},
	mounted() {
		if( this.independent ){
			this.$store.dispatch("domains/getProjects")
		}
		
	},
	components: {
		Loader,
		TextInput,
		Label,
		Form,
		Select,
		Button,
		A
	},
}
</script>