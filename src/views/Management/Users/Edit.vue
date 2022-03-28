<template>
	<div>
		<Loader v-if="loading"></Loader>
		<template v-if="user">
			<h1 class="mb-3 headline">User: {{user.first_name}} {{user.last_name}}</h1>
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
				<!-- Row -->
				<!-- <div class="flex w-full mt-3">
					<div class="flex-1">
						<h2 class="subheadline">Accounts</h2>
						
						<ul>
							<li class="border border-black p-2 my-3" v-for="(account, index) in accounts" :key="'account-index-'+index">
								<div><h3 class="text-base subheadline inline-block pr-3">Account Name:</h3><span class="text-base">{{account.name}}</span></div>
								<div><h3 class="text-base subheadline inline-block pr-3">Account Status:</h3><span class="text-base">{{account.status}}</span></div>
								<div><h3 class="text-base subheadline inline-block pr-3">Role:</h3><span class="text-base capitalize">{{role(account.pivot.role_id)}}</span></div>
							</li>
						</ul>
						
					</div>
				</div> -->
			</form>
		
			<Label class="subheadline mt-3" for="role">Role</Label>
			<select v-model="selectedRole" class="p-1 mb-3" @change="modifyRole" id="role" name="role">
				<option value="2">Manager</option>
				<option value="3">Standard</option>
				<option value="4">Client</option>
			</select>
			
			<div v-if="iAmExecutive">
				<Label class="subheadline" for="team">Team</Label>
				<select v-model="selectedTeam" class="p-1" @change="modifyTeam" id="team" name="team">
					<option value="1">Executive</option>
					<option value="2">Development</option>
					<option value="3">Design</option>
					<option value="4">Customer Service</option>
				</select>
			</div>
			<div v-else>
				<Label class="subheadline" for="team">Team</Label>
				<span class="text-lg">{{team(selectedTeam)}}</span>
			</div>
		</template>
	</div>
</template>

<script>
import Label from '../../../components/Label'
import A from '../../../components/Link'
import Button from '../../../components/Button'
import Checkbox from '../../../components/Checkbox'
import Loader from '../../../components/Loader'
export default {
	data(){
		return {
			selectedTeam: false,
			selectedRole: false
		}
	},
	computed: {
		user() {
			return this.$store.state.user.user
		},
		loading() {
			return this.$store.state.user.loading
		},
		account(){
			return this.$store.getters["auth/account"]
		},
		iAmExecutive(){
			if( this.account ){
				return this.account.pivot.team_id === 1
			}
		}
	},
	props: [],
	watch: {
		"$store.state.user.user":function(newVal){
			this.selectedTeam = newVal.roleInfo.team_id
			this.selectedRole = newVal.roleInfo.role_id
		}
	},
	methods: {
		modifyRole(ev){
			this.$store.dispatch("admin/modifyRole", { role: ev.target.value })
		},
		modifyTeam(ev){
			this.$store.dispatch("admin/modifyTeam", { team: ev.target.value })
		},
		role(){
			switch(this.user.roleInfo.role_id){
				case 1:
					return "Owner/Manager"
				case 2:
					return "Manager"
				case 3:
					return "Standard"
				case 4:
					return "Limited"
			}
		},
		team(){
			switch(this.user.roleInfo.team_id){
				case 1:
					return "Executive"
				case 2:
					return "Development"
				case 3:
					return "Design"
				case 4:
					return "Customer Service"
			}
		},
	},
	created() {
		
	},
	mounted() {
		this.$store.dispatch("user/getUser", {user_id: this.$route.params.id})
		document.title = "Manage User"
	},
	components: {
		A,
		Button,
		Label,
		Checkbox,
		Loader
	},
}
</script>