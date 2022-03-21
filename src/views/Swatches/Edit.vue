<template>
	<div class="pb-24">
		<Loader v-if="loading"></Loader>

		<h2 class="headline">Edit Color Swatch Analysis</h2>
		<h3 class="headline-2">{{swatch.title}}</h3>
		<button v-if="$store.getters['auth/isManager']" @click.prevent="confirmModalOpen = true" title="Delete Audit" class="standard alert" >
			Delete
		</button>

		<Modal class="adjust-with-sidebars" :open="confirmModalOpen">
			<div class="bg-white">
				<h3 class="headline-2" id="modal-title">Delete Color Swatch</h3>
				<div class="mb-2">
					<p class="">
						Are you sure you want to delete this color swatch?
					</p>
				</div>
			</div>
			<div class="flex">
				<button @click="deleteSwatch" type="button" class="standard alert mr-2">
				Delete
				</button>
				<button @click="confirmModalOpen = false" type="button" class="standard">
				Cancel
				</button>
			</div>
		</Modal>
				
		<div class="mb-2 w-full">
			<Label class="text-lg subheadline" for="edit-title">Edit Title</Label>
			<TextInput class="w-full" v-model="swatch.title" id="edit-title"></TextInput>
		</div>
		
		<button @click="save" class="standard">Save</button>
	</div>
</template>

<script>
	import Loader from '../../components/Loader'
	import TextInput from '../../components/TextInput'
	import Label from '../../components/Label'
	import Modal from '../../components/Modal'

	export default {
		data: () => ({
			badContrastIcon: require('../../assets/badContrast.svg'),
			swatch: {
				title: "",
				project_id: ""
			},
			confirmModalOpen: false
		}),
		computed: {
			loading(){
				return this.$store.state.swatch.loading
			},
		},
		props: [],
		watch: {
			"$store.state.projects.project": function(newVal){
				if( newVal ){
					this.setSwatch()
				}
			}
		},
		methods: {
			deleteSwatch(){
				this.confirmModalOpen = false
				this.$store.dispatch("swatch/destroySwatch", {id:this.swatch.id, vm:this})
			},
			save(){
				this.$store.dispatch("swatch/saveSwatch", {swatch: this.swatch})
			},
			setSwatch(){
				let that = this
				let swatch = this.$store.state.projects.project.swatches.find( s=>s.id == that.$route.params.id )
				if( swatch ){
					this.swatch = swatch
				}
			}
		},
		created() {},
		mounted() {
			document.title = "Edit Color Report"
			
			if( this.$store.state.projects.project && this.$store.state.projects.project.swatches ){
				this.setSwatch()
			}
		},
		components: {
			TextInput,
			Loader,
			Label,
			Modal,
		},
	}
</script>