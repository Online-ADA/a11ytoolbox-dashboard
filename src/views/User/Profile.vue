<template>
	<div class="container px-4 w-full">
		<Loader v-if="loading"></Loader>

		<h1 class="mb-3 headline">User Profile</h1>
		<form class="w-full bg-white p-5">
			<!-- Row -->
			<div class="flex w-full flex-wrap">
				<div class="flex-1">
					<h2 class="text-lg subheadline">First Name</h2>
					<div>{{user.first_name}}</div>
				</div>
				<div class="flex-1">
					<h2 class="text-lg subheadline">Last Name</h2>
					<div>{{user.last_name}}</div>
				</div>
				<div class="flex-1">
					<h2 class="text-lg subheadline">Email</h2>
					<div>{{user.email}}</div>
				</div>
				<div class="flex-1">
					<h2 class="text-lg subheadline">Phone</h2>
					<div>{{user.phone}}</div>
				</div>
			</div>
			
			<div class="mt-3">
				<h2 class="subheadline">Avatar</h2>
				<File @input="handleAvatar" class="block w-auto pb-3" accept="image/*,.svg"></File>
			</div>
			<button @click.prevent="save" class="standard mt-3">Save</button>
		</form>
	</div>
</template>

<script>
import Loader from '../../components/Loader.vue'
import File from '../../components/FileInput.vue'

export default {
	data(){
		return {
			avatar: false
		}
	},
	name: 'UserProfile',
	created(){

	},
	methods:{
		handleAvatar(e){
			this.avatar = e
		},
		save(){
			if( this.avatar ){
				this.$store.dispatch("user/uploadAvatar", {file: this.avatar})
			}
		},
		textRole(id){
			switch(id){
				case 1:
					return "Owner/Manager"
				case 2:
					return "Manager"
				case 3:
					return "Standard"
				case 4:
					return "Limited"
			}
		}
	},
	computed:{
		user(){
			return this.$store.state.auth.user
		},
		accounts(){
			return this.$store.state.auth.accounts
		},
		account(){
			return this.$store.getters["auth/account"]
		},
		loading(){
			return this.$store.state.user.loading
		},
	},
	mounted(){
		document.title = "User Profile"
	},
	components:{
		Loader,
		File
	}
}
</script>