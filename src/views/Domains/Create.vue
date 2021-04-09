<template>
	<div class="text-center mt-32">
		<Loader v-if="loading"></Loader>
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

<script>
import Loader from '../../components/Loader'
import TextInput from '../../components/TextInput'
import Label from '../../components/Label'
import Select from '../../components/Select'
import Form from '../../components/Form'
import Button from '../../components/Button'
export default {
	data: () => ({
		url: "",
		protocol: "",
		domain: {
			title: "",
			project_id: ""
		},
	}),
	computed: {
			loading(){
				return this.$store.state.domains.loading
			},
			projects(){
				return this.$store.state.domains.projects
			},
			fullUrl(){
				let url = this.url.replace(/^https?(:?\/\/?)?/i, "")
				return this.protocol + url
			}
	},
	props: [],
	methods: {
		createDomain(){
			this.domain.url = this.fullUrl
			this.$store.dispatch("domains/createDomain", {domain: this.domain, router: this.$router})
		},
	},
	created() {
		this.$store.dispatch("domains/getProjects")
	},
	mounted() {
		
	},
	components: {
		Loader,
		TextInput,
		Label,
		Form,
		Select,
		Button,
	},
}
</script>