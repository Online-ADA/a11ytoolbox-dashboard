<template>
	<div class="flex flex-col items-center justify-center container mx-auto px-4">
		<Loader v-if="$store.state.clients.loading"></Loader>

		<h1 class="mb-3">User Profile</h1>
		<form class="w-full bg-white p-5">
			<!-- Row -->
			<div class="flex w-full justify-center">
				<div class="flex-1">
					<h2 class="text-xl bold">First Name</h2>
					<div>{{user.first_name}}</div>
				</div>
				<div class="flex-1">
					<h2 class="text-xl bold">Last Name</h2>
					<div>{{user.last_name}}</div>
				</div>
				<div class="flex-1">
					<h2 class="text-xl bold">Email</h2>
					<div>{{user.email}}</div>
				</div>
				<div class="flex-1">
					<h2 class="text-xl bold">Phone</h2>
					<div>{{user.phone}}</div>
				</div>
			</div>
			<!-- Row -->
			<div class="flex w-full justify-center mt-3">
				<div class="flex-1">
					<h2 class="text-xl bold">Accounts</h2>
					
					<ul>
						<li class="border border-black p-2 my-3" v-for="(account, index) in accounts" :key="'account-index-'+index">
							<div class="text-sm">Account Name: <span class="bold">{{account.name}}</span></div>
							<div class="text-sm">Account Status: {{account.status}}</div>
							<div class="text-sm">Role: <span class="capitalize">{{$store.state.auth.accountsRoles[account.id][0]}}</span></div>
						</li>
					</ul>
					
				</div>
			</div>
			<div class="mt-3">
				<h2 class="text-xl bold">Avatar</h2>
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
		}
	},
	computed:{
		user(){
			return this.$store.state.auth.user
		},
		accounts(){
			return this.$store.state.auth.accounts
		}
	},
	components:{
		Loader,
		File
	}
}
</script>