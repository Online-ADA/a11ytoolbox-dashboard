<template>
	<Modal :valign="'top'" style="z-index:999" :size="'creation'" :open="open">
		<h1 class="headline">Deploy A Tool</h1>
		<button aria-label="Close Deploy a tool modal" @click.prevent="EventBus.closeModal(()=>{EventBus.$emit('deployToolModal', false)})" class="absolute top-4 right-4 standard">X</button>
		<div class="mb-10">
			<span class="subheadline">Select a Tool to Continue</span>
		</div>
		
		<div class="flex justify-evenly items-start" v-if="myTeam == 1 || myTeam == 2">
			<button 
			class="font-bold text-center text-pallette-button hover:text-pallette-button-hover" 
			@click.prevent="EventBus.transitionModal( 'deployToolModal', 'deployWCAGAuditModal')">
				<div class="mb-5 text-6xl"><i class="far fa-th-list"></i></div>
				<span class="barlow text-xl">WCAG Audit</span>
			</button>
			
			<button 
			class="font-bold text-center text-pallette-button hover:text-pallette-button-hover mx-5" 
			@click.prevent="EventBus.transitionModal( 'deployToolModal', 'deployMediaAuditModal')">
				<div class="mb-5 text-6xl"><i class="far fa-photo-video"></i></div>
				<span class="barlow text-xl">Media Audit</span>
			</button>
			
			<button 
			class="font-bold text-center text-pallette-button hover:text-pallette-button-hover" 
			@click.prevent="EventBus.transitionModal( 'deployToolModal', 'deployColorSwatchModal')">
				<div class="mb-5 text-6xl"><i class="far fa-palette"></i></div>
				<span class="barlow text-xl">
					<div>Color Swatch</div>
					Analysis
				</span>
			</button>
		</div>
		
	</Modal>
</template>


<script>
	import Modal from "../Modal.vue"
	import Button from "../Button.vue"
	import { EventBus } from "../../services/eventBus"

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
				toolType: false
			}
		},
		name: 'DeployToolModal',
		methods:{

		},
		mounted(){

		},
		created(){

		},
		computed: {
			account(){
				return this.$store.getters["auth/account"]
			},
			myTeam(){
				if( this.open ){
					return this.account.pivot.team_id
				}
			}
		},
		components:{
			Modal,
			Button
		}
	}
</script>