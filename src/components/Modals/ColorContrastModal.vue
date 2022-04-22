<template>
	<Modal :valign="'top'" style="z-index:999" :size="'creation'" :open="open">
		<h1 class="headline mb-5">Quick Contrast Checker</h1>
		<button aria-label="Close Quick Contrast Checker modal" class="standard absolute top-4 right-4" @click.prevent="EventBus.closeModal(()=>{EventBus.$emit('colorContrastModal', false)})" >X</button>
		
		<div class="flex mb-5">
			<ColorPicker
			:remove_button="false"
			:color="color_1"
			class="max-w-[230px] min-w-[230px] w-[230px] mr-9"
			v-model="color_1"></ColorPicker>

			<ColorPicker
			:remove_button="false"
			:color="color_2"
			class="max-w-[230px] min-w-[230px] w-[230px]"
			v-model="color_2"></ColorPicker>
		</div>

		<div class="flex items-center" :set="ratio = Utility.computeRatio(color_1, color_2)">
			<div :style="`background-color:${color_1};`" :title="`The combination of ${color_2} on top of ${color_1} is ${ratio}:1`" class="ml-[35px] w-40 h-40 border border-black flex items-center justify-center">
				<div class="text-2xl font-extrabold" :style="`color:${color_2}`">Aa</div>
			</div>
			
			<div class="w-[110px] font-bold text-2xl text-center">
				<div>Ratio</div>
				<div>{{ratio}}:1</div>
				<div v-show="ratio >= 4.5" style="color:#0c793d;" >
					<i class="fas fa-check"></i>
				</div>
				<div v-show="ratio < 4.5" style="color:#c80a00;" >
					<i class="fas fa-times"></i>
				</div>
			</div>

			<div :title="`The combination of ${color_1} on top of ${color_2} is ${ratio}:1`" :style="`background-color:${color_2};`" class="w-40 h-40 border border-black flex items-center justify-center">
				<div class="text-2xl font-extrabold" :style="`color:${color_1}`">Aa</div>
			</div>
		</div>
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