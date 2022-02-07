<template>
	<Modal :valign="'top'" style="z-index:999" :size="'creation'" :open="open">
		<h1 class="headline">Create Color Swatch</h1>
		<ColorPicker></ColorPicker>
		<button @click.prevent="EventBus.closeModal(()=>{EventBus.$emit('deployColorSwatchModal', false)})" class="standard mt-2">Cancel</button>
	</Modal>
</template>

<script>
	import { EventBus } from "../../services/eventBus"
	import Modal from "../Modal.vue"
	import ColorPicker from "../ColorPicker/ColorPicker.vue"

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
				complete: false
			}
		},
		name: 'CreateColorSwatchModal',
		methods:{
			
		},
		mounted(){

		},
		created(){

		},
		computed: {
			
		},
		components:{
			Modal,
			ColorPicker
		}
	}
</script>