<template>
	<div class="pb-24 container">
		<Loader v-if="loading"></Loader>

		<h2 class="mb-1 headline">{{software.title}}</h2>
		<div class="flex items-center mb-3">
			<h3 class="pr-2 headline-2">{{software.title}}</h3>
			<button class="standard" aria-label="Edit software title" @click.prevent="editSoftwareOpen = true"><i class="far fa-edit"></i></button>
		</div>

		<Modal style="z-index:71;" :open="editSoftwareOpen">
			<div class="bg-white px-4 pt-5 pb-4">
				
				<div class="mt-3 text-left w-full">
					<h3 class="headline">
						Edit
					</h3>
					<div class="mt-2 w-full">
						<Label class="text-lg subheadline" for="edit-title">Edit Title</Label>
						<TextInput class="w-full" v-model="data.title" id="edit-title"></TextInput>
					</div>
				</div>
				
			</div>
			
			<button @click.prevent="saveSoftware" class="standard">Save</button>
			<button class="ml-3.5 standard" @click.prevent="editSoftwareOpen = false">Cancel</button>
			
		</Modal>
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
			editSoftwareOpen: false,
			data: {},
			software: false
		}),
		computed: {
			loading(){
				return this.$store.state.properties.loading
			}
		},
		props: [],
		watch: {
			"$store.state.auth.license":function(newVal){
				if( newVal ){
					this.$store.dispatch("properties/getSoftware", {id: this.$route.params.id})
				}
			}
		},
		methods: {
			saveSoftware(){
				this.editSoftwareOpen = false
				this.$store.dispatch("properties/saveSoftware", {id: this.software.id, software: this.data})
			},
		},
		created() {
			
		},
		mounted() {
			document.title = "Edit Software"
			if( this.$store.state.auth.license ){
				this.$store.dispatch("properties/getSoftware", {id: this.$route.params.id})
			}
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