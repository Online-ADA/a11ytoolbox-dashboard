<template>
	<div class="text-center">
		<Loader v-if="loading"></Loader>
		<h1>{{client.name}}</h1>
		<Form @submit.native.prevent>
			<Label for="name">Client Name</Label>
			<TextInput class="mb-2" id="name" name="name" v-model="client.name" />

			<Label for="email">Client Email</Label>
			<TextInput id="email" name="email" v-model="client.email" />

			<Label for="status">Status</Label>
			<Select id="status" class="mx-auto" :options="statusSrc" v-model="client.status"></Select>

			<Button hover="true" @click.native.prevent="saveClient">Save</Button>
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
		this.$store.dispatch("clients/getClient", {id: this.$route.params.id})
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