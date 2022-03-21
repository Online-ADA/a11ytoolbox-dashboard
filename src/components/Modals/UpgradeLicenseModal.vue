<template>
	<Modal style="z-index:999" :valign="'top'" :size="'wide'" :open="open">
		<div class="h-24" v-show="loading" >
			<Loader v-if="loading" :local="true"></Loader>
		</div>
		<div v-show="!loading" class="w-full min-h-[500px]">
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
			<div :class="[{'translate-x-0':tab == 'payment','translate-x-[250%] invisible absolute': tab != 'payment'},'min-w-full bg-pallette-white  w-full options-tab transform transition ease-in-out duration-500 sm:duration-700']">
				<div >
					<h1 class="headline text-center">Payment Information</h1>
				</div>
				<div class="flex p-12">
					<div v-show="payment_screen == 'method'" class="my-10 flex justify-center w-full px-2 relative">
						<div class="h-24" v-show="loading_payment_method" >
							<Loader v-if="loading_payment_method" :local="true"></Loader>
						</div>
						<div class="flex flex-wrap w-full">
							<p>Add A New Payment Method</p>
							<div class="flex flex-col w-full">
								<label for="payment_method-number">Card Number</label>
								<input class="border px-4 py-2  h-[44px]" id="payment_method-number" type="text">
							</div>
							<div class="flex flex-col w-1/2">
								<label for="payment_method-exp">Card Expiration</label>
								<input class="border px-4 py-2  h-[44px]" id="payment_method-exp" type="month">
							</div>
							<div class="flex flex-col w-1/2">
								<label for="payment_method-code">Card Code</label>
								<input class="border px-4 py-2 h-[44px]" id="payment_method-code" type="text">
							</div>
							<div class="flex basis-full">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="#f9a51a">
								<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
								</svg>
								<span>Fully Encrypted & Secure</span>
							</div>
						</div>
					</div>
					<div v-show="payment_screen == 'methods'" class="my-10 flex justify-center w-full px-2">
						<div class="flex flex-col w-full">
							<p>Select An Existing Payment Method</p>
							<div v-for="(payment,i) in payments" :key="i" class="border my-2 w-full">
								<label :for="`payment-method-${payment.id}`" :class="[{'bg-pallette-blue text-white':selected_payment==payment.id},'w-full flex items-center  py-2 px-6']">
									<div class="basis-3/4">
										{{payment.card_type}} - {{payment.card_number}} - {{payment.expiration_date}}
									</div>
									<input class="basis-1/4" type="radio" :id="`payment-method-${payment.id}`" name="payment_method" :value="payment.id" v-model="selected_payment">
								</label>
							</div>
						</div>
					</div>
				</div>
				<template>
					<div class="w-full flex justify-center items-center">
						<button @click.prevent="chooseNo" class="standard mr-2">Cancel</button>
						<button @click.prevent="GoBackWithin" class="standard mr-2">Back</button>
						<button v-if="payments.length && payment_screen == 'methods'"  @click.prevent="chooseYes" class="standard mr-2" :disabled="!selected_option || selected_option == tier">Upgrade Now</button>
						<button v-if="payment_screen == 'method'" @click.prevent="MaybeAddPaymentMethod" class="standard mr-2" :disabled="false">Add Payment Method</button>
					</div>
				</template>
			</div>
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
				payment_screen: 'methods',
				loading_payment_method: false,
			}
		},
		methods:{
			GoBackWithin() {
				if(this.payment_screen == 'method' && this.payments.length){
					this.payment_screen = 'methods'
				}else{
					this.tab = 'options'
				}
			},
			MaybeAddPaymentMethod() {

			},
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
						if(!this.payments.length) {
							this.payment_screen = 'method'
						}
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