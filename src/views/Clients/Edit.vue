<template>
	<div>
		<Loader v-if="loading"></Loader>
		<h1 class="headline">{{client.name}}</h1>
		<form @submit.prevent>
			<Label class="subheadline text-lg" for="name">Client Name</Label>
			<TextInput class="mb-2" id="name" name="name" v-model="client.name" />

			<Label class="subheadline text-lg" for="email">Client Email</Label>
			<TextInput id="email" name="email" v-model="client.email" />

			<Label class="subheadline text-lg" for="status">Status</Label>
			<Select id="status" :options="statusSrc" v-model="client.status"></Select>

			<button class="standard mt-3" @click.prevent="saveClient">Save</button>
		</form>
	</div>
</template>

<script>
import Loader from '../../components/Loader'
import TextInput from '../../components/TextInput'
import Label from '../../components/Label'
import Select from '../../components/Select'
export default {
	data: () => ({
		statusSrc: [
			{name: 'Active', value:'active'},
			{name:'Inactive', value:'inactive'},
		],
		client: {
			name: "",
			status: "active",
			email: "",
			created_by: "",
			project_id: ""
		}
	}),
	computed: {
		loading(){
			return this.$store.state.clients.loading
		}
	},
	props: [],
	watch: {
		"$store.state.clients.client": function(newVal){
			if( newVal ){
				this.client = newVal
			}
		}
	},
	methods: {
		saveClient(){
			this.$store.dispatch("clients/updateClient", {client: this.client, router: this.$router, id: this.$route.params.id})
		}
	},
	created() {
	},
	mounted() {
		document.title = "Edit Client"
		this.$store.dispatch("clients/getClient", {id: this.$route.params.id})
	},
	components: {
		Loader,
		TextInput,
		Label,
		Select,
	},
}
</script>