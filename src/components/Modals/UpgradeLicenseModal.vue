<template>
	<Modal style="z-index:999" :valign="'top'" :size="'wide'" :open="open">
		<div >
			<h1 class="headline text-center">Upgrade License</h1>
		</div>
		<div >
			<p>{{message}}</p>
		</div>
		<div v-if="loading" >
			<Loader v-if="loading"></Loader>
		</div>
		<div v-else class="my-10">
			<PricingOptions :tiers="tier_data" :tier="tier" @option:update="OptionSelected"/>
		</div>
		<template>
			<div class="w-full flex justify-center items-center">
				<button @click.prevent="chooseYes" class="standard mr-2" :disabled="!selected_option || selected_option == tier">Upgrade Now</button>
				<button @click.prevent="chooseNo" class="standard">Cancel</button>
			</div>
		</template>
	</Modal>
</template>


<script>
	import PricingOptions from '../PricingOptions.vue'
	import Modal from "../Modal.vue"
	import { EventBus } from "../../services/eventBus"
	import Loader from "../Loader.vue"
	export default {
        name: 'UpgradeLicenseModal',
		props:{
			open:{
				type: Boolean,
				default: false
			},
		},
		data(){
			return {
				loading: false,
				EventBus: EventBus,
				selected_option: false,
			}
		},
		methods:{
			OptionSelected(option) {
				this.selected_option = option
			},
			chooseNo(){
				this.GoBack()
			},
			chooseYes(){
				
				this.GoBack()
			},
			GoBack() {
				switch(this.trigger) {
					case 'CreateClient': 
						EventBus.transitionModal('UpgradeLicenseModal', 'createClientModal')
					break;
					default:
						EventBus.closeModal( ()=>{ EventBus.$emit('UpgradeLicenseModal', false)})
						return
				}
			},
		},
		mounted(){

		},
		created(){
			this.$store.dispatch('upgrade/GetLicense')
		},
		computed: {
			trigger() {
				return this.$store.state.upgrade.trigger
			},
			message() {
				return this.$store.state.upgrade.message
			},
			license() {
				return this.$store.state.upgrade.license
			},
			tier() {
				return this.$store.state.upgrade.tier
			},
			tier_data() {
				return this.$store.state.upgrade.tier_data
			}
		},
		components:{
			Modal,
			Loader,
			PricingOptions
		}
	}
</script>