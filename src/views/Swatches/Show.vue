<template>
	<div >
		<Loader v-if="loading"></Loader>

		<div class="w-full flex xs:flex-wrap sm:flex-wrap">
			
			<Card :gutters="false" :center="false" class="w-full">
				<div class="matrix overflow-x-auto relative">
					<div class="flex items-center">
						<ColorPicker 
						:color="color"
						@removePicker="removePicker(index)" 
						class="max-w-[230px] min-w-[230px] w-[230px] mr-2.5" 
						v-for="(color, index) in colors" 
						v-model="colors[index]" 
						:key="`color-${index}`"></ColorPicker>
					
						<button v-if="colors.length < 6" @click="newColor" class="border border-black h-20 min-w-[80px] mx-1">
							<span class="text-3xl"><i class="fal fa-plus"></i></span>
						</button>
					</div>
					<table cellpadding="0" cellspacing="0" class="border-0 ml-[-30px]" style="border-spacing:10px">
						<thead>
							<tr>
								<td class="border-0" scope="col"></td>
								<td class="w-[230px] min-w-[230px] border-0" scope="col" v-for="(color, index) in colors" :key="`matrix-header-${index+1}`">
									<div class="text-center">
										<!-- <div class="text-xl flex-1">{{color}}</div> -->
										<div class="text-2xl font-extrabold" :style="`-webkit-text-stroke: 1px black;color:${color}`">Aa</div>
									</div>
								</td>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(background_color, index) in colors" :key="`matrix-row-${index+1}`" >
								<td class="border-0" scope="row">
									<div class="font-bold text-center -rotate-90 mr-[-80px]">{{background_color}}</div>
									<!-- <div class="w-[125px] h-[125px] mx-auto border border-black" :style="`background-color:${background_color}`"></div> -->
								</td>

								<td class="border-0" v-for="(foreground_color, index) in colors" :set="ratio = Utility.computeRatio(foreground_color, background_color)" :key="`comparison-column-${index}`" role="presentation">
									<div class="border border-black w-[125px] mx-auto" :title="`The combination of ${foreground_color} on top of ${background_color} is ${ratio}:1`">
										<!-- Showing the background and foreground color combinations -->
										<div class="text-lg font-bold flex items-center justify-center flex-col h-[125px] w-full" :style="`color:${foreground_color}; background-color:${background_color}`" aria-hiddden="true">
											<div>{{ratio}}:1</div>
											<div>
												<i v-if="ratio >= 4.5" class="fas fa-check"></i>
												<i v-else class="fas fa-times"></i>
											</div>
										</div>
										
										
									</div>
								</td>
							</tr>
							
						</tbody>
					</table>
				</div>
				<button @click="saveSwatch" class="standard mt-3">Save</button>
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
	import Card from '../../components/Card'
	import ColorPicker from '../../components/ColorPicker/ColorPicker.vue'
	import Utility from "../../services/utility"
	import { EventBus } from '../../services/eventBus'

	export default {
		data: () => ({
			EventBus: EventBus,
			badContrastIcon: require('../../assets/badContrast.svg'),
			swatch: {
				title: "",
				project_id: ""
			},
			colors: [
				"#000",
				"#FFFFFF"
			],
			Utility: Utility
		}),
		computed: {
			loading(){
				return this.$store.state.swatch.loading
			}
		},
		props: [],
		watch: {
			"$route.params.id": function(){
				this.setSwatch()
			},
		},
		methods: {
			setSwatch(){
				let that = this
				this.$store.dispatch("swatch/getSwatch", {id: this.$route.params.id, callback: (data)=>{
					that.swatch = data
					if( data.data ){
						that.colors = data.data
					}else{
						that.colors = ["#000", "#FFFFFF"]
					}
				}})
			},
			removePicker(index){
				if( this.colors.length > 2 ){
					this.colors.splice(index, 1)
				}
			},
			saveSwatch(){
				this.swatch.data = this.colors
				this.$store.dispatch("swatch/saveSwatch", {swatch: this.swatch})
			},
			newColor(){
				if( this.colors.length <= 6 ){
					this.colors.push("#000")
				}
			},
			removeColor(index){
				this.colors.splice(index, 1)
			}
		},
		created() {},
		mounted() {
			document.title = "Edit Color Report"
			
			this.setSwatch()
		},
		components: {
			TextInput,
			Loader,
			Label,
			Modal,
			Card,
			Checkbox,
			ColorPicker,
		},
	}
</script>