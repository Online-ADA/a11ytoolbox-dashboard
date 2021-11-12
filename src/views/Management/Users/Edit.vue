<template>
	<div>
		<Loader v-if="loading"></Loader>
		<template v-if="user">
			<h1 class="mb-3">User: {{user.first_name}} {{user.last_name}}</h1>
			<form class="w-full bg-white p-5">
				<!-- Row -->
				<div class="flex w-full">
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
				<div class="flex w-full mt-3">
					<div class="flex-1">
						<h2 class="text-xl bold">Accounts</h2>
						
						<ul>
							<li class="border border-black p-2 my-3" v-for="(account, index) in accounts" :key="'account-index-'+index">
								<div class="text-sm">Account Name: <span class="bold">{{account.name}}</span></div>
								<div class="text-sm">Account Status: {{account.status}}</div>
								<div class="text-sm">Role: <span class="capitalize">{{role(account.pivot.role_id)}}</span></div>
							</li>
						</ul>
						
					</div>
				</div>
			</form>
		
			<div>
			
				<Label class="text-xl" for="role">Role</Label>
				<select v-model="selectedRole" class="p-1 mx-auto" @change="modifyRole" id="role" name="role">
					<option value="2">Manager</option>
					<option value="3">Standard</option>
					<option value="4">Limited</option>
				</select>
				
			</div>
			<div v-if="iAmExecutive">
				<Label class="text-xl" for="team">Team</Label>
				<select v-model="selectedTeam" class="p-1 mx-auto" @change="modifyTeam" id="team" name="team">
					<option value="1">Executive</option>
					<option value="2">Development</option>
					<option value="3">Design</option>
					<option value="4">Customer Service</option>
				</select>
			</div>
			<div v-else>
				<div class="w-2/4 mx-auto">
					<Label class="text-xl" for="team">Team</Label>
					<span class="text-lg">{{team(selectedTeam)}}</span>
				</div>
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
		accounts(){
			return this.$store.state.auth.accounts
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