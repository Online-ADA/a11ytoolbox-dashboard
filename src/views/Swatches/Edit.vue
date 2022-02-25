<template>
	<div class="pb-24">
		<Loader v-if="loading"></Loader>

		<h2 class="mb-1 headline">{{swatch.title}}</h2>
		<div class="flex items-center mb-3">
			<h3 class="pr-2 headline-2">{{swatch.title}}</h3>
			<button class="standard" aria-label="Edit color report title" @click.prevent="editSwatchOpen = true"><i class="far fa-edit"></i></button>
		</div> 

		<Modal style="z-index:71;" :open="editSwatchOpen">
			<div class="bg-white px-4 pt-5 pb-4">
				
				<div class="mt-3 text-left w-full">
					<h3 class="headline">
						Edit
					</h3>
					<div class="my-2 w-full">
						<Label class="text-lg subheadline" for="edit-title">Edit Title</Label>
						<TextInput class="w-full" v-model="swatch.title" id="edit-title"></TextInput>
					</div>
				</div>

				<button @click.prevent="saveSwatch" class="standard">Save</button>
				<button class="ml-3.5 standard" @click.prevent="editSwatchOpen = false">Cancel</button>
				
			</div>
		</Modal>

		<div class="w-full flex xs:flex-wrap sm:flex-wrap">
			<Card :center="false" class="w-full">
				<div class="flex w-full p-4 flex-wrap items-center">
					<ColorPicker @removePicker="removePicker(index)" class="max-w-[250px] w-[250px]" v-for="(item, index) in colors" v-model="item.color" :key="`color-${index}`"></ColorPicker>
				
					<button v-if="colors.length < 5" @click="newColor" class="border border-black h-20 w-20 mx-1">
						<span class="text-3xl"><i class="fal fa-plus"></i></span>
					</button>
				</div>

				<div class="matrix">
					<h2 class="subheadline mb-8">Accessible Color Combinations</h2>
					<div class="flex items-center mb-3">
						<span class="w-[70px] mr-3"><img alt="Inaccessible color combination" :src="badContrastIcon"/></span>
						<p>Please don't use these color combinations; they do not meet the WCAG 2.1 standards for accessible color contrast ratio of 4.5:1. This means that they could be difficult to read for some users.</p>
					</div>
					<table class="min-w-full">
						<thead>
							<tr>
								<td class="p-3 w-[300px]" scope="col"></td>
								<td class="p-3" scope="col" v-for="(color, index) in colors" :key="`matrix-header-${index+1}`">
									<div class="">
										<div class="text-xl flex-1">{{color.color}}</div>
										<div class="text-2xl font-extrabold" :style="`-webkit-text-stroke: 1px black;color:${color.color}`">Aa</div>
									</div>
								</td>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(foreground_color, index) in colors" :key="`matrix-row-${index+1}`" >
								<td class="p-3" scope="row">
									<div class="flex items-center">
										<div class="text-xl flex-1">{{foreground_color.color}}</div>
										<div class="w-[125px] h-[125px] ml-5 border border-black" :style="`background-color:${foreground_color.color}`"></div>
									</div>
								</td>
								<td class="p-3" v-for="(background_color, index) in colors" :key="`comparison-column-${index}`" role="presentation">
									<div class="w-[125px] h-[125px] flex items-center justify-center mx-auto border border-black" :style="`background-color:${background_color.color}`" :title="`The combination of ${foreground_color.color} on top of ${background_color.color} is 4.5:1`">
										<span class="text-lg font-bold" :style="`color:${foreground_color.color}`" aria-hiddden="true">4.5:1</span>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
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

	export default {
		data: () => ({
			badContrastIcon: require('../../assets/badContrast.svg'),
			editSwatchOpen: false,
			swatch: {
				title: "",
				project_id: ""
			},
			colors: [
				{
					color: "#000"
				},
				{
					color: "#000"
				},
				{
					color: "#000"
				}
			]
		}),
		computed: {
			loading(){
				return this.$store.state.swatch.loading
			}
		},
		props: [],
		watch: {},
		methods: {
			removePicker(index){
				this.colors.splice(index, 1)
			},
			saveSwatch(){
				this.editSwatchOpen = false
				this.$store.dispatch("swatch/saveSwatch", {swatch: this.swatch})
			},
			newColor(){
				if( this.colors.length <= 5 ){
					this.colors.push({color: "#000"})
				}
			},
			removeColor(index){
				this.colors.splice(index, 1)
			}
		},
		created() {},
		mounted() {
			document.title = "Edit Color Report"
			
			let that = this
			this.$store.dispatch("swatch/getSwatch", {id: this.$route.params.id, callback: (data)=>{
				that.swatch = data
			}})
			
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