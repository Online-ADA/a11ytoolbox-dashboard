<template>
	<Modal :valign="'top'" style="z-index:999" :size="'creation'" :open="open">
		<h1 class="headline">Quick Contrast Checker</h1>
		<!-- <div class="mb-10">
			<span class="headline-2">Select a Tool to Continue</span>
		</div> -->
		
		<div class="flex">
			<ColorPicker
			:remove_button="false"
			:color="color_1"
			class="max-w-[230px] min-w-[230px] w-[230px] mr-5"
			v-model="color_1"></ColorPicker>

			<ColorPicker
			:remove_button="false"
			:color="color_2"
			class="max-w-[230px] min-w-[230px] w-[230px]"
			v-model="color_2"></ColorPicker>
		</div>
		<div class="flex items-center">
			<div :style="`background-color:${color_1};`" class="w-40 h-40 border border-black flex items-center justify-center">
				<div class="text-2xl font-extrabold" :style="`color:${color_2}`">Aa</div>
			</div>
			<div class="mx-5 font-bold text-2xl">{{Utility.computeRatio(color_1, color_2)}}:1</div>
			<div :style="`background-color:${color_2};`" class="w-40 h-40 border border-black flex items-center justify-center">
				<div class="text-2xl font-extrabold" :style="`color:${color_1}`">Aa</div>
			</div>
		</div>
		
		<button @click.prevent="EventBus.closeModal(()=>{EventBus.$emit('colorContrastModal', false)})" class="standard mt-2">Close</button>
	</Modal>
</template>


<script>
	import Modal from "../Modal.vue"
	import Button from "../Button.vue"
	import ColorPicker from "../ColorPicker/ColorPicker.vue"
	import { EventBus } from "../../services/eventBus"
	import Utility from "../../services/utility"

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
				Utility:Utility,
				color_1: "#fff",
				color_2: "#000"
			}
		},
		name: 'ColorContrastQuickTool',
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
			Button,
			ColorPicker
		}
	}
</script>