<template>
	<div class="w-2/3 container mx-auto">
		<Loader v-if="loading"></Loader>
		<h1>This is the User Edit page</h1>
		<template v-if="user">
			<h2>User: {{user.first_name}} {{user.last_name}}</h2>
	
			<div>
				<div class="w-2/4 mx-auto">
					<Label class="text-xl" for="role">Role</Label>
					<select v-model="selectedRole" class="p-1 mx-auto" @change="modifyRole" id="role" name="role">
						<option value="2">Manager</option>
						<option value="3">Standard</option>
						<option value="4">Limited</option>
					</select>
				</div>
			</div>
			<div v-if="iAmExecutive">
				<div class="w-2/4 mx-auto">
					<Label class="text-xl" for="team">Team</Label>
					<select v-model="selectedTeam" class="p-1 mx-auto" @change="modifyTeam" id="team" name="team">
						<option value="1">Executive</option>
						<option value="2">Development</option>
						<option value="3">Design</option>
						<option value="4">Customer Service</option>
					</select>
				</div>
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
		loading() {
			return this.$store.state.user.loading
		},
		account(){
			return this.$store.getters["auth/account"]
		},
		iAmExecutive(){
			return this.account.pivot.team_id === 1
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
		}
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