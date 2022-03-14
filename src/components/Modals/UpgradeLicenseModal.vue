<template>
	<Modal style="z-index:999" :valign="'top'" :size="'wide'" :open="open">
		<div class="h-24" v-if="loading" >
			<Loader v-if="loading" :local="true"></Loader>
		</div>
		<div v-else class="w-full min-h-[500px]">
			<div :class="[{'translate-x-0':tab == 'options','translate-x-[250%] invisible absolute': tab != 'options'},'min-w-full bg-pallette-white w-full options-tab transform transition ease-in-out duration-500 sm:duration-700']">
				<div >
					<h1 class="headline text-center">Upgrade License</h1>
				</div>
				<div >
					<p>{{message}}</p>
				</div>
				<div class="my-10">
					<PricingOptions :tiers="tier_data" :tier="tier" @option:update="OptionSelected"/>
				</div>
				<template>
					<div class="w-full flex justify-center items-center">
						<button @click.prevent="chooseNo" class="standard mr-2">Cancel</button>
						<button @click.prevent="tab = 'payment'" :disabled="!selected_option || selected_option == tier" class="standard mr-2">Payment Information</button>
					</div>
				</template>
			</div>
			<!-- <div :class="[{'translate-x-0':tab == 'payment','translate-x-[250%] invisible absolute': tab != 'payment'},'min-w-full bg-pallette-white  w-full options-tab transform transition ease-in-out duration-500 sm:duration-700']">
				<div >
					<h1 class="headline text-center">Payment Information</h1>
				</div>
				<div class="my-10">
					<div class="flex flex-col">
						<label for="select_payment_method">Select Payment Method</label>
						<select id="select_payment_method" v-model="selected_payment">
							<option v-for="(payment,i) in payments" :key="i">{{payment.card_type}} - {{payment.card_number}} - {{payment.expiration_date}}</option>
						</select>
					</div>
				</div>
				<template>
					<div class="w-full flex justify-center items-center">
						<button @click.prevent="chooseNo" class="standard mr-2">Cancel</button>
						<button @click.prevent="tab = 'options'" class="standard mr-2">Back</button>
						<button @click.prevent="chooseYes" class="standard mr-2" :disabled="!selected_option || selected_option == tier">Upgrade Now</button>
					</div>
				</template>
			</div> -->
		</div>
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
				selected_payment: false,
				tab: 'options',
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
				this.loading = true
				this.$store.dispatch('upgrade/UpgradeLicense',{upgrade:this.tier_data[this.selected_option],Failure: this.Failure,Success:this.Success})
			},
			Success(data) {
				console.log('Success: ',data)
				this.loading = false
				// this.GoBack()
			},
			Failure(data) {
				console.log('Failure: ',data)
				this.loading = false
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
		watch:{
			tab(val) {
				if(val == 'payment' && !this.payments.length) {
					this.loading = true
					this.$store.dispatch('upgrade/GetPayments',{Success:()=>{
						this.loading = false
					}})
				}
			},
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
			},
			payments() {
				return this.$store.state.upgrade.payments
			}
		},
		components:{
			Modal,
			Loader,
			PricingOptions
		}
	}
</script>