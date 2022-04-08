<template>
	<Modal @initialized="getRootModal" :valign="'top'" style="z-index:999" :size="'creation'" :open="open">
		
		
		<template v-if="complete">
			<h1 class="headline">Go to New Color Swatch?</h1>
			<button @click.prevent="EventBus.closeModal( ()=>{ chooseYes() })" class="standard">Yes</button>
			<button @click.prevent="EventBus.closeModal( ()=>{ chooseNo() })" class="standard mx-3">No</button>
		</template>
		<template v-else>
			<h1 class="headline">Create Color Swatch</h1>
			<button aria-label="Close Create Color Swatch modal" @click.prevent="EventBus.closeModal( ()=>{ chooseNo() })" class="absolute top-4 right-4 standard">X</button>
			<Label for="swatch">Title</Label>
			<TextInput required class="w-full" id="swatch-title" name="title" v-model="swatch.title"></TextInput>
			<button @click.prevent="createSwatch" class="standard mt-2 mr-2">Save</button>
		</template>
	</Modal>
</template>

<script>
	import { EventBus } from "../../services/eventBus"
	import Modal from "../Modal.vue"
	import TextInput from "../TextInput.vue"
	import Label from "../Label.vue"

	export default {
		props:{
			open:{
				type: Boolean,
				default: false
			},
		},
		data(){
			return {
				EventBus: EventBus,
				complete: false,
				swatch: {
					title: "",
					project_id: ""
				},
				rootModal: ""
			}
		},
		name: 'CreateColorSwatchModal',
		methods:{
			chooseNo(){
				EventBus.$emit('deployColorSwatchModal', false)
				this.reset()
			},
			chooseYes(){
				EventBus.$emit('deployColorSwatchModal', false)
				this.reset()
				
				this.$store.state.projects.tool.type = "color_swatch"
				let id = this.$store.state.projects.project.swatches[this.$store.state.projects.project.swatches.length - 1].id
				this.$router.push({path: `/color-reports/${id}`})
			},
			createSwatch(){
				this.swatch.project_id = this.$store.state.projects.project.id
				this.$store.dispatch("swatch/createSwatch", {swatch: this.swatch})
				this.complete = true
				this.rootModal.scrollTop = 0
			},
			reset(){
				this.complete = false
				this.swatch.title = ""
			},
			getRootModal(root){
				this.rootModal = root
			},
		},
		mounted(){

		},
		created(){

		},
		computed: {
			
		},
		components:{
			Modal,
			TextInput,
			Label
		}
	}
</script>