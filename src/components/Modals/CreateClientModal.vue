<template>
	<Modal style="z-index:999" :valign="'top'" :size="'creation'" :open="open">
		<div v-if="!complete">
			<Loader v-if="loading"></Loader>
			<h1 class="headline">Create New Client</h1>
			<Form @submit.native.prevent>
				<Label class="subheadline text-lg" for="client-name">Client Name</Label>
				<TextInput id="client-name" name="client-name" v-model="client.name" />
				
				<Label class="subheadline text-lg" for="client-email">Client Email</Label>
				<TextInput id="client-email" name="client-email" v-model="client.email" />

				<Label class="subheadline text-lg" for="client-status">Status</Label>
				
				<select name="client-status" id="client-status" aria-label="Select client status" class="m-2 p-1" v-model="client.status">
					<option :value="option.value" v-for="(option, index) in statusSrc" :key="'client-status-'+index">{{option.name}}</option>
				</select>

				<button class="standard mr-2" @click.prevent="createClient">Create</button>
				<button class="standard" @click.prevent="EventBus.closeModal(()=>{EventBus.$emit('createClientModal', false)})">Cancel</button>
			</Form>
		</div>
		
		<template v-if="complete">
			<h1 class="pb-5 headline">Do you want to create a project?</h1>
			<button @click.prevent="EventBus.transitionModal('createClientModal', 'createProjectModal')" class="standard mr-2">Yes</button>
			
			<button @click.prevent="chooseNo" class="standard">No</button>
		</template>
	</Modal>
</template>


<script>
	import Modal from "../Modal.vue"
	import { EventBus } from "../../services/eventBus"
	import Loader from "../Loader.vue"
	import Form from "../Form.vue"
	import Label from "../Label.vue"
	import TextInput from "../TextInput.vue"

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
				statusSrc: [
					{name: 'Active', value:'active'},
					{name:'Inactive', value:'inactive'},
				],
				client: {
					name: "",
					email: "",
					status: "active",
					created_by: "",
					account_id: "",
				},
				complete: false
			}
		},
		name: 'CreateClientModal',
		methods:{
			createClient(){
				this.client.created_by = this.$store.state.auth.user.id
				this.client.account_id = this.$store.state.auth.account
				let that = this
				this.$store.dispatch("clients/createClient", {client: this.client, router: this.$router, callback: (()=>{
					that.complete = true
				})})
			},
			chooseNo(){
				EventBus.closeModal( ()=>{ EventBus.$emit('createClientModal', false)})
				this.$router.push({path: `/clients/${this.$store.state.clients.client.id}`})
				this.reset()
			},
			reset(){
				this.complete = false
				this.client = {
					name: "",
					email: "",
					status: "active",
					created_by: "",
					account_id: "",
				}
			}
		},
		mounted(){

		},
		created(){

		},
		computed: {
			loading(){
				if( this.$store.state.clients ){
					return this.$store.state.clients.loading
				}
				return false
			},
		},
		components:{
			Modal,
			Loader,
			Form,
			Label,
			TextInput
		}
	}
</script>