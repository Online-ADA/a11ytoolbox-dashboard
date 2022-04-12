<template>
	<Modal style="z-index:999" :valign="'top'" :size="'wide'" :open="open">
		<div class="h-24" v-show="loading" >
			<Loader v-if="loading" :local="true"></Loader>
		</div>
		<button @click.prevent="chooseNo" class="absolute right-4 top-4 standard" aria-label="Close Modal">
			X
		</button>
		<div class="sr-only" role="status">
			<p v-for="(message,i) in validation_errors" :key="i">
				{{message}}
			</p>
		</div>
		<div v-show="!loading" class="w-full min-h-[500px]">
			<div :class="[{'translate-x-0':tab == 'options','translate-x-[250%] invisible absolute': tab != 'options'},'min-w-full w-full options-tab transform transition ease-in-out duration-500 sm:duration-700']">
				<div >
					<h1 class="headline text-center">Upgrade License</h1>
				</div>
				<div >
					<p class="text-center">{{message}}</p>
				</div>
				<div v-if="error_message" class="flex justify-center items-center text-pallette-red">
					<p>{{error_message}}</p>
				</div>
				<div class="my-10">
					<PricingOptions :tiers="tier_data" :tier="tier" @option:update="OptionSelected"/>
				</div>
				<template>
					<div v-if="license.type == 'Subscription' && license.subscription_id" class="w-full flex justify-center items-center">
						<button @click.prevent="chooseYes" :disabled="!selected_option || selected_option == tier" class="standard mr-2">Upgrade Now</button>
					</div>
					<div v-else class="w-full flex justify-center items-center">
						<button @click.prevent="tab = 'payment'" :disabled="!selected_option || selected_option == tier" class="standard mr-2">Continue</button>
					</div>
				</template>
			</div>
			<div :class="[{'translate-x-0':tab == 'payment','translate-x-[250%] invisible absolute': tab != 'payment'},'min-w-full  w-full options-tab transform transition ease-in-out duration-500 sm:duration-700']">
				<div v-if="payment_screen != 'success'" >
					<h1 class="headline text-center">Payment Information</h1>
				</div>				
				<div v-if="payment_screen == 'success'" >
					<h1 class="headline text-center">Thank You!</h1>
				</div>
				<div class="flex p-12">
					<div v-show="payment_screen == 'success'" class="my-10 flex flex-col justify-center w-full px-2 relative">
						<p>Congratulations!</p>
						<p>License has been upgraded successfully</p>
					</div>
					<div v-show="payment_screen == 'method'" class="my-10 flex flex-col justify-center w-full px-2 relative">
						<div class="h-24" v-show="loading_payment_method" >
							<Loader v-if="loading_payment_method" :local="true"></Loader>
						</div>
						<div class="flex flex-wrap w-full">
							<div class="flex w-full justify-between">
								<p>Add A New Payment Method</p>
								<button v-if="payments.length" @click.prevent="payment_screen = 'methods'" class="standard">Use an existing payment method</button>
							</div>
							<div class="flex flex-col w-1/2">
								<label for="payment_method-first_name">First Name</label>
								<input class="border px-4 py-2  h-[44px]" id="payment_method-first_name" type="text" v-model="card.first_name" required aria-describedby="payment_method-first_name-description">
								<small v-show="validation_errors['payment_method-first_name']" id="payment_method-first_name-description" class="form-error">
									{{validation_errors['payment_method-first_name']}}
								</small>
							</div>
							<div class="flex flex-col w-1/2">
								<label for="payment_method-last_name">Last Name</label>
								<input class="border px-4 py-2  h-[44px]" id="payment_method-last_name" type="text" v-model="card.last_name" required aria-describedby="payment_method-last_name-description">
								<small v-show="validation_errors['payment_method-number']" id="payment_method-last_name-description" class="form-error">
									{{validation_errors['payment_method-last_name']}}
								</small>
							</div>
							<div class="flex flex-col w-full">
								<label for="payment_method-number">Card Number</label>
								<input class="border px-4 py-2  h-[44px]" id="payment_method-number" type="text" v-model="card.number" required aria-describedby="payment_method-number-description">
								<small v-show="validation_errors['payment_method-number']" id="payment_method-number-description" class="form-error">
									{{validation_errors['payment_method-number']}}
								</small>
							</div>
							<div class="flex flex-col w-4/12">
								<label for="payment_method-exp_month">Card Expiration Month</label>
								<select id="payment_method-exp_month" class="border px-4 py-2  h-[44px]" v-model="card.exp_month" required aria-describedby="payment_method-exp_month-description">
                                    <option value="01">January ( 01 ) </option>
                                    <option value="02">February ( 02 ) </option>
                                    <option value="03">March ( 03 ) </option>
                                    <option value="04">April ( 04 ) </option>
                                    <option value="05">May ( 05 ) </option>
                                    <option value="06">June ( 06 ) </option>
                                    <option value="07">July ( 07 ) </option>
                                    <option value="08">August ( 08 ) </option>
                                    <option value="09">September ( 09 ) </option>
                                    <option value="10">October ( 10 ) </option>
                                    <option value="11">November ( 11 ) </option>
                                    <option value="12">December ( 12 ) </option>
								</select>
								<small v-show="validation_errors['payment_method-exp_month']" id="payment_method-exp_month-description" class="form-error">
									{{validation_errors['payment_method-exp_month']}}
								</small>
							</div>
							<div class="flex flex-col w-4/12">
								<label for="payment_method-exp_year">Card Expiration Year</label>
								<select id="payment_method-exp_year" class="border px-4 py-2  h-[44px]" v-model="card.exp_year" aria-describedby="payment_method-exp_year-description" required>
									<option v-for="i in year_options" :key="i" :value="i">{{i}}</option>
								</select>
								<small v-show="validation_errors['payment_method-exp_year']" id="payment_method-exp_year-description" class="form-error">
									{{validation_errors['payment_method-exp_year']}}
								</small>
							</div>
							<div class="flex flex-col w-4/12">
								<label for="payment_method-code">Card Code</label>
								<input class="border px-4 py-2 h-[44px]" id="payment_method-code" type="text" v-model="card.code" aria-describedby="payment_method-code-description" required>
								<small v-show="validation_errors['payment_method-code']" id="payment_method-code-description" class="form-error">
									{{validation_errors['payment_method-code']}}
								</small>
							</div>
							<div class="flex basis-full">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="#f9a51a">
								<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
								</svg>
								<span>Fully Encrypted & Secure</span>
							</div>
						</div>
						<div v-if="selected_option" class="flex flex-wrap w-full my-4">
							<div class="text-black flex my-2 p-4 relative">
								<div v-if="selected_option == 'PAP'" class="product-name ml-6 text-[20px]">
									Partner Agency Program
								</div>
								<div v-else class="product-name ml-6 text-[20px]">
									{{selected_option}}
								</div>
								<div class="ml-6 text-[20px]">
									<span>$</span>
									<span>{{GetPrice(tier_data[selected_option].product.price)}}</span>
									<span> / Month</span>
								</div>
							</div>
						</div>
						<div class="flex flex-wrap w-full">
							<div class="" role="status">
								<p v-for="(message,i) in auth_messages" :key="i" class="text-pallette-red">
									{{message}}
								</p>
							</div>
						</div>
					</div>
					<div v-show="payment_screen == 'methods'" class="my-10 flex justify-center w-full px-2">
						<div class="flex flex-col w-full">
							<div class="flex w-full  justify-between">
								<p>Select An Existing Payment Method</p>
								<button @click.prevent="payment_screen = 'method'" class="standard mr-2">Add a new payment method</button>
							</div>

							<div class="flex flex-col w-full">
								<div v-for="(payment,i) in payments" :key="i" tabindex="0" role="button" @keyup.enter="PaymentSelected(payment)" @click="PaymentSelected(payment)" :class="[{'bg-pallette-yellow': selected_payment == payment.id},'flex border my-2 p-4 relative w-full']">
									<div class="check justify-center items-center flex" v-if="selected_payment == payment.id" >
										<CheckCircle size="30" />
									</div>
									<div class="product-name ml-6 text-[20px] flex flex-col w-full">
										<div class="flex w-full">
											<div class="basis-4/12">
												Card Type
											</div>
											<div class="basis-4/12">
												Card Ends In
											</div>
											<div class="basis-4/12">
												Card Expiration
											</div>
										</div>
										<div class="flex w-full">
											<div class="basis-4/12">
												{{payment.card_type}}
											</div>
											<div class="basis-4/12">
												{{payment.card_number}}
											</div>
											<div class="basis-4/12">
												{{payment.expiration_date}}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div v-if="selected_option" class="flex flex-wrap w-full my-4">
								<div class="text-black flex my-2 p-4 relative">
									<div v-if="selected_option == 'PAP'" class="product-name ml-6 text-[20px]">
										Partner Agency Program
									</div>
									<div v-else class="product-name ml-6 text-[20px]">
										{{selected_option}}
									</div>
									<div class="ml-6 text-[20px]">
										<span>$</span>
										<span>{{GetPrice(tier_data[selected_option].product.price)}}</span>
										<span> / Month</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<template>
					<div class="w-full flex justify-center items-center">
						<button v-if="payment_screen != 'success'" @click.prevent="GoBackWithin" class="standard mr-2">Back</button>
						<button v-if="payment_screen == 'success'" @click.prevent="chooseNo" class="standard mr-2">Close</button>
						<button v-if="payments.length && payment_screen == 'methods'"  @click.prevent="chooseYes" class="standard mr-2" :disabled="!selected_option || selected_option == tier">Upgrade Now</button>
						<button v-if="payment_screen == 'method'" @click.prevent="MaybeAddPaymentMethod" class="standard mr-2" :disabled="false">Upgrade Now</button>
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
	import moment from 'moment'
	import CheckCircle from '../icons/CheckCircle'

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
				current_year: false,
				EventBus: EventBus,
				selected_option: false,
				selected_payment: false,
				tab: 'options',
				payment_screen: 'methods',
				loading_payment_method: false,
				auth_response: false,
				card: {
					first_name: '',
					last_name: '',
					number: '',
					exp_year: '',
					exp_month: '',
					code: '',
				},
				validation_errors: {},
				auth_messages: [],
				error_message: false,
			}
		},
		methods:{
			PaymentSelected(payment) {
				this.selected_payment = payment.id
			},
			GetPrice(price) {
				price = parseInt(price)
				if(price == 0) return price
				return parseInt(price)/12
			},
			GoBackWithin() {
				if(this.payment_screen == 'method' && this.payments.length){
					this.payment_screen = 'methods'
				}else{
					this.tab = 'options'
				}
			},
			MaybeAddPaymentMethod() {
				let valid = true
				this.error_message = false
				this.validation_errors = {}
				this.auth_messages = []
				if(!this.card.first_name || !this.card.first_name.length) {
					valid = false
					this.validation_errors['payment_method-first_name'] = 'Please provide you first name'
				}
				if(!this.card.last_name || !this.card.last_name.length) {
					valid = false
					this.validation_errors['payment_method-last_name'] = 'Please provide your last name'
				}
				if(!this.card.number || !this.card.number.length) {
					valid = false
					this.validation_errors['payment_method-number'] = 'Please provide a card number'
				}
				if(!this.card.exp_month || !this.card.exp_month.length) {
					valid = false
					this.validation_errors['payment_method-exp_month'] = 'Please provide an expiration month'
				}
				if(!this.card.exp_year || !this.card.exp_year.length) {
					valid = false
					this.validation_errors['payment_method-exp_year'] = 'Please provide an expiration year'
				}
				if(!this.card.code || !this.card.code.length) {
					valid = false
					this.validation_errors['payment_method-code'] = 'Please provide a card code'
				}
				if(valid) {
					this.loading = true
                    let cardData = {
                        cardNumber: this.card.number.trim(),
                        month: this.card.exp_month.trim(),
                        year: this.card.exp_year.trim(),
                        cardCode: this.card.code,
                    }
                    let secureData = {
                        authData: this.authdotnet,
                        cardData: cardData,
                    }
                    Accept.dispatchData(secureData, this.authResponseHandler);
				}
			},
			authResponseHandler(response) {
				if (response.messages.resultCode === "Error") {
					for(let i in response.messages.message) {
						this.auth_messages.push(response.messages.message[i].text)
					}
					this.loading = false
				}else{
					this.resetCard();
					this.auth_response = response
					this.chooseYes()
				}
			},
			resetCard() {
				this.card.number = ''
				this.card.code = ''
			},
			OptionSelected(option) {
				this.selected_option = option
			},
			chooseNo(){
				this.GoBack()
			},
			chooseYes(){
				this.loading = true
				this.error_message = false
				this.$store.dispatch('upgrade/UpgradeLicense',{upgrade:{
					tier: this.tier_data[this.selected_option],
					card: this.card,
					selected_payment: this.selected_payment,
					payment_screen: this.payment_screen,
					auth_response: this.auth_response,
					accounts_api: this.$store.state.auth.accapi,
				},Failure: this.Failure,Success:this.Success})
			},
			Success(response) {
				this.loading = false
				this.payment_screen = 'success'
				if(response.data.free_upgrade) {
					gtag('event', 'conversion', {
						'send_to': 'AW-343018477/7tx5CKnS860DEO2XyKMB',
						'transaction_id': ''
					});
				}
				location.reload()
			},
			Failure(response) {
				if(response.data.success == '0') {
					this.error_message = response.data.error
				}
				this.loading = false
			},
			GoBack() {
				switch(this.trigger) {
					case 'CreateClient': 
						EventBus.transitionModal('UpgradeLicenseModal', 'createClientModal')
					break;
					case 'CreateProject': 
						EventBus.transitionModal('UpgradeLicenseModal', 'createProjectModal')
					break;
					// case 'Download': 
					// 	EventBus.transitionModal('UpgradeLicenseModal', '')
					// break;
					case 'AddUsers': 
						if(this.payment_screen == 'sucess') {
							EventBus.transitionModal('UpgradeLicenseModal', 'AddUsersToLicenseModal')
						}else{
							EventBus.closeModal( ()=>{ EventBus.$emit('UpgradeLicenseModal', false)})
						}
					break;
					default:
						EventBus.closeModal( ()=>{ EventBus.$emit('UpgradeLicenseModal', false)})
						return
				}
			},
		},
		watch:{
			open(val) {
				if(val) {
					gtag('event', 'conversion', {'send_to': 'AW-343018477/7wrrCNzFs7IDEO2XyKMB'});
				}
			}
		},
		created(){
			this.current_year = parseInt(moment().format('YYYY'))
			this.$store.dispatch('upgrade/GetLicense')
			this.$store.dispatch('upgrade/AuthDotNet')
			this.$store.dispatch('upgrade/GetPayments',{Success:()=>{
				if(!this.payments.length) {
					this.payment_screen = 'method'
				}
			}})
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
			},
			authdotnet() {
				return this.$store.state.upgrade.authdotnet
			},
			year_options() {
				let years = [];
				if(!this.current_year) return years
				for(let year = this.current_year;year <= this.current_year+10;year++) {
					years.push(year+'')
				}
				return years
			},
		},
		components:{
			Modal,
			Loader,
			PricingOptions,
			CheckCircle
		}
	}
</script>