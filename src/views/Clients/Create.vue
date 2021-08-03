<template>
	<div class="text-center mt-32">
		<Loader v-if="loading"></Loader>
		<h1>Create new Client</h1>
			<Form @submit.native.prevent>
				<Label for="name">Name</Label>
				<TextInput id="name" name="name" v-model="client.name" />
				
				<Label for="email">Email</Label>
				<TextInput id="email" name="email" v-model="client.email" />

				<Label for="status">Status</Label>
				<Select class="mx-auto" :options="statusSrc" v-model="client.status"></Select>

				<Button hover="true" @click.native.prevent="createClient">Create</Button>
			</Form>
	</div>
</template>

<script>
import Loader from '../../components/Loader'
import TextInput from '../../components/TextInput'
import Label from '../../components/Label'
import Select from '../../components/Select'
import Form from '../../components/Form'
import Button from '../../components/Button'
export default {
	data: () => ({
		statusSrc: [
			{name: 'Active', value:'active'},
			{name:'Inactive', value:'inactive'},
		],
		client: {
			name: "",
			email: "",
			status: "",
			created_by: "",
			account_id: "",
		}
	}),
	computed: {
			loading(){
				if( this.$store.state.clients ){
					return this.$store.state.clients.loading
				}
				return false
			},
			projects(){
				return this.$store.state.clients.projects
			},
			userID(){
				return this.$store.state.auth.user.id
			}
	},
	props: [],
	watch: {
		"$store.state.auth.user": function (newVal, oldVal){
			if( oldVal === false ){ //Watch for when user is set, then get the projects
				this.$store.dispatch("clients/getProjects", {router: this.$router})
			}
		}
	},
	methods: {
		handleThis(e){
			console.log(e, e.target.value);
		},
		createClient(){
			console.log(this.client.account_id);
			this.client.created_by = this.userID
			this.$store.dispatch("clients/createClient", {client: this.client, router: this.$router, vm: this})
		}
	},
	created() {
	},
	mounted() {
		if( this.$store.state.auth.user ){ //Check if user is set. Won't be if page was just refreshed
			this.$store.dispatch("clients/getProjects", {router: this.$router})
		}else{
			this.$store.state.clients.loading = true
		}
		
		this.client.account_id = this.$store.state.auth.account
	},
	components: {
		Loader,
		TextInput,
		Label,
		Form,
		Select,
		Button
	},
}
</script>