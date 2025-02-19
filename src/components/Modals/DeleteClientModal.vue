<template>
	<Modal :valign="'top'" style="z-index:999" :size="'creation'" :open="open">
		<template>
			<Loader v-if="loading" :local="true"></Loader>
				<h1 class="headline">Are You Sure?</h1>
				<button aria-label="Close Delete Client modal" class="standard absolute top-4 right-4 " @click.prevent="EventBus.closeModal(()=>{EventBus.$emit('deleteClientModal', false)})">X</button>

        <p class="mt-2 mb-3">
          This will delete all associated projects and audits for this client.
        </p>

        <div>
          <button class="standard mr-2 mt-2 inline-block" @click.prevent="EventBus.closeModal(()=>{EventBus.$emit('deleteClientModal', false)})">Back</button>
          <button class="standard alert mr-2 mt-2 inline-block" @click.prevent="deleteClient()">Delete Client</button>
        </div>
		</template>
	</Modal>
</template>


<script>
	import Modal from "../Modal.vue"
	import Loader from '../Loader'
	import Button from '../Button'
	import TextInput from '../TextInput'
	import Label from '../Label'
	import Card from '../Card'
	import { EventBus } from "../../services/eventBus"
  import Vue from "vue";

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
				complete: false,
				statusSrc: [
					{name: 'Active', value:'active'},
					{name:'Inactive', value:'inactive'},
				],
				unassigned: [],
				assigned: [],
			}
		},
		name: 'DeleteClientModal',
		methods:{
			getUsers(){
				this.$store.dispatch("user/getUsers", {vm: this})
			},
			chooseNo(){
				this.EventBus.closeModal( ()=>{ this.EventBus.$emit('deleteClientModal', false)})
				this.$router.push({path: `/projects/${this.$store.state.projects.project.id}`})
				this.reset()
			},
			reset(){
				this.complete = false
				this.project = {
					name: "",
					status: "active",
					created_by: "",
					account_id: "",
					client_id: "",
				}
			},
		  deleteClient(){
        this.$store.dispatch("clients/deleteClient", {client: this.selectedClient, router: this.$router, eventBus: this.EventBus});
      }
		},
		mounted(){},
		created(){},
		watch:{
			// open: function(newVal){
			// 	if( newVal ){
			// 		this.project.created_by = this.$store.state.auth.user.id
			// 		this.project.account_id = this.$store.state.auth.account
			// 		this.project.client_id = this.$store.state.clients.client.id
			//
			// 		// if( !this.$store.state.user.all.length ){
			// 		// 	this.getUsers()
			// 		// }else{
			// 		// 	this.unassigned = this.$store.state.user.all.map(u=>u.id)
			// 		// }
			//
			// 	}
			// }
		},
		computed: {
			// users(){
			// 	return this.$store.state.user.all
			// },
			loading(){
				return this.$store.state.clients.loading
			},
			isManager(){
				return this.$store.getters["auth/isManager"]
			},
      selectedClient() {
        if ( this.$store.state.clients.client )
          return this.$store.state.clients.client;
        return "Clients";
      },
		},
		components:{
			Modal,
			Loader,
			TextInput,
			Label,
			Card,
			Button
		}
	}
</script>