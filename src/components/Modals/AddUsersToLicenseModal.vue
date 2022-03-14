<template>
	<Modal :valign="'top'" style="z-index:999" :size="'creation'" :open="open">
		<h1 class="headline">Add Users</h1>
		<div class="mt-2">
			<span class="headline-2">Invite a new user</span>
		</div>
		<div class="flex items-start">
            <div class="flex flex-col">
                <label for="invite-user-to-license">Email Address</label>
                <input type="email" class="border m-1 p-1" v-model="invite_user.email">
                <button @click.prevent="InviteUser" :disabled="!invite_user.email.length" class="standard mt-2 mr-2">Invite User</button>
            </div>
            <div class="flex flex-col ml-4">
				<label class="" for="invite_team">Team</label>
				<select v-model="invite_user.team" class="p-1" id="invite_team" name="invite_team">
					<option value="1">Executive</option>
					<option value="2">Development</option>
					<option value="3">Design</option>
					<option value="4">Customer Service</option>
				</select>
            </div>
            <div class="flex flex-col ml-4">
                <label class="" for="invite_role">Role</label>
                <select v-model="invite_user.role" class="p-1 mb-3" id="invite_role" name="invite_role">
                    <option value="2">Manager</option>
                    <option value="3">Standard</option>
                    <option value="4">Client</option>
                </select>
            </div>
        </div>
		<div class="mt-10">
			<span class="headline-2">Add an exiting user from your account</span>
		</div>
		<div class="flex items-start">
            <DT 
            :searchOverride="searchOverride" 
            :searchableProps="searchableProps"
            :items="users" 
            :headers="headers">
                <template v-slot:cells-main>
                <td class="hidden"></td>
                </template>
                <template :class="[{'me':row.data.id == $store.state.auth.user.id}]" v-slot:cells-extra="row">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                        <label class="sr-only" :for="`user_selected-${row.data.id}`">Select User</label>
                        <Checkbox size="small" class="mx-1" :name="`user_selected-${row.data.id}`" :id="`user_selected-${row.data.id}`" v-model="row.data.isSelected"></Checkbox>
                    </div>
                </td>
                <th class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                    {{row.data.first_name}}
                    </div>
                </th>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                    {{row.data.last_name}}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                    {{row.data.email}}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                    {{row.data.phone}}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="capitalize text-sm text-gray-900">
                    {{role(row.data.roleInfo.role_id)}}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="capitalize text-sm text-gray-900">
                    {{team(row.data.roleInfo.team_id)}}
                    </div>
                </td>
                </template>
            </DT>
		</div>
		<button @click.prevent="AddUsers" :disabled="!selectedUsers.length" class="standard mt-2 mr-2">Add Users</button>
		<button @click.prevent="closeModal" class="standard mt-2">Cancel</button>
	</Modal>
</template>
<script>
	import Modal from "../Modal.vue"
	import Button from "../Button.vue"
	import { EventBus } from "../../services/eventBus"
    import DT from '../../components/DynamicTable.vue'
    import Checkbox from '../../components/Checkbox.vue'
	export default {
        name: 'AddUsersToLicenseModal',
		props:{
			open:{
				type: Boolean,
				default: false
			},
		},
		data(){
			return {
                invite_user: {
                    email: '',
                    role: 2,
                    team: 1,
                },
				EventBus: EventBus,
				toolType: false,
                searchableProps: [ "role", "team", "first_name", "last_name", "email", "phone" ],
                searchOverride: {
                },
                headers:[
                    "Select User",
                    {
                        display: "First Name",
                        link: "first_name",
                        sort: true
                    },
                    {
                        display: "Last Name",
                        link: "last_name",
                        sort: true
                    },
                    {
                        display: "Email",
                        link: "email",
                        sort: true
                    },
                    {
                        display: "Phone",
                        link: "phone",
                        sort: true
                    },
                    {
                        display: "Role",
                        link: "role",
                        sort: true
                    },
                    {
                        display: "Team",
                        link: "team",
                        sort: true
                    },
                ],
			}
		},
		methods:{
            InviteUser() {
                if(this.invite_user.email.length) this.$store.dispatch('admin/inviteUsers',{invite:this.invite_user,Success:this.UsersAdded})
            },
            AddUsers() {
                if(this.selectedUsers.length) this.$store.dispatch('admin/addUsers',{users:this.selectedUsers,Success:this.UsersAdded})
            },
            UsersAdded() {
                this.$store.dispatch('user/getUsers')
                this.closeModal()
            },
            role(id){
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
            },
            team(id){
                switch(id){
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
            closeModal() {
                this.EventBus.closeModal(()=>{this.EventBus.$emit('AddUsersToLicenseModal', false)})
            },
		},
		mounted(){
		},
		created(){
            if(!this.isExecutive) {
                this.closeModal()
            }else{
                this.$store.dispatch('admin/getUsers')
            }
		},
		computed: {
            isExecutive() {
                return this.$store.getters['auth/account'].pivot.team_id == 1
            },
            users() {
                let users = [];
                let already_on_license = this.$store.state.user.all.map(user=>user.id)
                this.$store.state.admin.users.forEach(user => {
                    if(!already_on_license.includes(user.id)) users.push(user)
                })
                return users
            },
            selectedUsers() {
                return this.users.filter((user)=>{return user.isSelected})
            },
		},
		components:{
			Modal,
			Button,
            DT,
            Checkbox
		}
	}
</script>