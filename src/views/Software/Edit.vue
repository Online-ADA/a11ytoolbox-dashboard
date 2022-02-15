<template>
	<div class="pb-24">
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
					<div class="my-2 w-full">
						<Label class="text-lg subheadline" for="edit-title">Edit Title</Label>
						<TextInput class="w-full" v-model="software.title" id="edit-title"></TextInput>
					</div>
				</div>

				<button @click.prevent="saveSoftware" class="standard">Save</button>
				<button class="ml-3.5 standard" @click.prevent="editSoftwareOpen = false">Cancel</button>
				
			</div>
		</Modal>

		<div class="w-1/2 flex xs:flex-wrap sm:flex-wrap">
			<Card :center="false" class="flex-1 p-4">

				<h4 class="text-left pt-3 pb-4 subheadline">Add Screen</h4>
				<div class="w-full flex mb-4">
					<div class="w-full">
						<Label :stacked="false" class="subheadline text-lg flex items-center w-full" for="name-input"><span class="pr-3">Name</span></Label>
						<div class="flex items-center flex-1">
							<TextInput style="flex-basis:100%" class="w-full flex-1" id="name-input" v-model="newScreen.name" />
							<button class="ml-2 standard" @click.prevent="addScreen">Add</button>
						</div>
					</div>
				</div>

				<h3 class="mt-3 mb-1 headline-2">Screens</h3>
				<Card style="max-height:400px" :gutters="false" class="block my-4 overflow-y-auto">
					<ul class="mb-4">
						<li class="my-1" v-for="screen in software.screens" :key="screen.id">
							{{screen.name}}
							<button aria-label="delete this screen" @click.prevent="deleteScreen(screen.id)" class="ml-4 standard alert">X</button>
						</li>
					</ul>
				</Card>
				<button class="standard alert" @click.prevent="deleteAllScreens" >Remove all<span class="sr-only"> screens</span></button>
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
			editSoftwareOpen: false,
			newScreen: {name: ""},
			software: {},
			screensToDelete: []
		}),
		computed: {
			loading(){
				return this.$store.state.properties.loading
			}
		},
		props: [],
		watch: {},
		methods: {
			addScreen(){
				this.$store.dispatch("properties/addScreen", {screen: this.newScreen, software: this.software})
				this.software.screens.push(this.newScreen)
				this.newScreen = {name:""}
			},
			saveSoftware(){
				this.editSoftwareOpen = false
				this.$store.dispatch("properties/saveSoftware", {software: this.software})
			},
			deleteScreen(id){
				this.screensToDelete.push(id)
				this.$store.dispatch("properties/destroyScreens", {software_id: this.software.id, screens:this.screensToDelete})
				let index = this.software.screens.findIndex(s=>s.id == id)
				this.software.screens.splice(index, 1)
				this.screensToDelete = []
			},
			deleteAllScreens(){
				this.screensToDelete = this.software.screens.map( s=> s.id)
				this.$store.dispatch("properties/destroyScreens", {software_id: this.software.id, screens:this.screensToDelete})
				this.screensToDelete = []
				this.software.screens = []
			}
		},
		created() {},
		mounted() {
			document.title = "Edit Software"
			
			let that = this
			this.$store.dispatch("properties/getSoftware", {id: this.$route.params.id, successCallback: (data)=>{
				that.software = data
			}})
			
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