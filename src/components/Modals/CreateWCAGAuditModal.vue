<template>
	<Modal class="z-50" :open="open">
		<h1>Create New WCAG Audit</h1>
		
		<div v-if="open" class="w-full flex flex-col items-start">
			<span v-if="client">Client: {{client.name}}</span>
			<span v-if="project">Project: {{project.name}}</span>
			<span v-if="propertyType == 'website' && step === 2">Domain: {{currentDomain.url}}</span>

			<div class="flex items-center justify-evenly w-full">
				<Label :stacked="false" for="property-type-website">
					Website
					<input v-model="propertyType" type="radio" id="property-type-website" name="property-type" value="website" class="mt-3" />
				</Label>
				
				<Label :stacked="false" for="property-type-desktop">
					Desktop App
					<input v-model="propertyType" type="radio" id="property-type-desktop" name="property-type" value="desktop_App" class="mt-3" />
				</Label>
				
				<Label :stacked="false" for="property-type-mobile">
					Mobile App
					<input v-model="propertyType" type="radio" id="property-type-mobile" name="property-type" value="mobile_App" class="mt-3" />
				</Label>
			</div>
			
			
			<template v-if="propertyType == 'website' && step == 1">
				<template v-if="domains.length">
					<h2 class="py-4 font-bold">Choose a domain for {{project.name}}</h2>
					<Label for="choose_select">Select Domain</Label>
					<select class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-orange p-2 rounded shadow" v-model="selectedDomain" name="choose_domain" id="choose_select">
						<option :value="domain.id" v-for="(domain) in domains" :key="'domain-' + domain.id">{{domain.url}}</option>
					</select>
					<button @click.prevent="step = 2" class="standard mt-3">Continue</button>
				</template>
				<template v-if="domains.length">
					<h2 class="py-4 font-bold">Or create a new one</h2>
				</template>
				<template v-if="!domains.length">
					<h2 class="py-4 font-bold">Create a New Domain</h2>
				</template>

				<form action="#" class="flex flex-wrap" @submit.prevent>
					<div class="px-2">
						<Label for="domain-title">Title</Label>
						<TextInput class="w-full" id="domain-title" v-model="domain.title" />
					</div>
					<div class="px-2">
						<Label for="domain-existing-url">Url</Label>
						<div class="flex">
							<select class="mx-auto block border cursor-pointer focus:ring-1 outline-none ring-pallette-orange p-2 rounded shadow" v-model="protocol" name="domain-protocol">
								<option :value="protocol" v-for="(protocol, index) in ['https://', 'http://']" :key="'domain-protocol-' + index">{{protocol}}</option>
							</select>
							<TextInput placeholder="example.com" class="w-9/12 ml-1" id="domain-existing-url" v-model="url" />
						</div>
						{{fullUrl}}
					</div>
					<div class="mt-3">
						<button class="standard mr-2" @click.prevent="createDomain">Create</button>
						<button @click.prevent="EventBus.closeModal( ()=>{ EventBus.$emit('deployWCAGAuditModal', false)})" class="standard">Cancel</button>
					</div>
				</form>
			</template>
			
			<template v-if="(propertyType == 'website' && step == 2) || propertyType != 'website'">
				NEW AUDIT CREATE FORM GOES HERE
			</template>
		</div>

		<!-- <button @click.prevent="EventBus.openModal( ()=>{ EventBus.$emit('deployToolModal', false); EventBus.$emit('deployWCAGAuditModal', true); })" class="standard">WCAG Audit</button>
		<button @click.prevent="EventBus.closeModal( ()=>{ EventBus.$emit('deployToolModal', false)})" class="standard">No</button> -->
	</Modal>
</template>

<script>
	import Modal from "../Modal.vue"
	import TextInput from "../TextInput.vue"
	import Button from "../Button.vue"
	import Label from "../Label.vue"
	import { EventBus } from "../../services/eventBus"

	export default {
		props:{
			open:{
				type: Boolean,
				default: false
			},
		},
		data: () => ({
			propertyType: "website",
			EventBus: EventBus,
			selectedDomain: false,
			url: "",
			protocol: "https://",
			domain: {
				title: "",
				project_id: ""
			},
			step: 1
		}),
		name: 'CreateWCAGAuditModal',
		methods:{
			reset(){
				this.domain = {
					title: "",
					project_id: ""
				}
				this.url = ""
				this.protocol = "https://"
			},
			createDomain(){
				this.domain.url = this.fullUrl
				this.domain.project_id = this.project.id
				let that = this
				
				this.$store.dispatch("domains/createDomain", {domain: this.domain, callback: ((domain)=>{
					that.selectedDomain = domain.id
					that.step = 2
					that.reset()
				})})
			},
		},
		mounted(){},
		created(){},
		watch:{
			open: function(newVal){
				if( newVal ){
					if( this.domains.length ){
						this.selectedDomain = this.domains[0].id
					}
				}
			},
			propertyType: function(newVal){
				if( newVal == 'website' ){
					this.step = 1
				}
			}
		},
		computed: {
			currentDomain(){
				return this.domains.find(d=>d.id == this.selectedDomain)
			},
			project(){
				return this.$store.state.projects.project
			},
			client(){
				return this.$store.state.clients.client
			},
			domains(){
				if( this.project ){
					return this.project.domains
				}

				return []
			},
			loading(){
				return this.$store.state.domains.loading
			},
			fullUrl(){
				let url = this.url.replace(/(?:^https?(:?\/\/?)?)+|(?:\/+|\s$)+/ig, "")
				return this.protocol + url
			},
		},
		components:{
			Modal,
			TextInput,
			Button,
			Label,
		}
	}
</script>