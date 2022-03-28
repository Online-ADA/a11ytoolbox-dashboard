<template>
	<Modal :valign="'top'" style="z-index:999" :size="'creation'" :open="open">
		<template v-if="!complete">
			<Loader v-if="loading" :local="true"></Loader>
				<h1 class="headline">Create New Project</h1>
				
				<Label for="project-name">Name</Label>
				<TextInput id="project-name" name="project-name" v-model="project.name" />

				<Label for="project-status">Status</Label>
				
				<select name="project-status" id="project-status" aria-label="Select project status" class="p-1" v-model="project.status">
					<option :value="option.value" v-for="(option, index) in statusSrc" :key="'project-status-'+index">{{option.name}}</option>
				</select>

				<template v-if="isManager">
					<div class="flex my-3 xs:flex-wrap">
						<Card :gutters="false" class="xs:w-full xs:mb-3 w-1/2 sm:mr-5 md:mr-5">
							<h2 class="pb-3 subheadline">Users</h2>
							<ul style="max-height:310px;" class="overflow-y-auto" v-if="unassigned.length">
							<li class="my-2" v-for="(id, index) in unassigned" :key="`unAssignedKey-${index}`">
								<span>{{displayUser(id)}}</span>
								<Button hover="true" class="text-lg leading-4 ml-2" @click.native.prevent="assign(id)">&gt;</Button>
							</li>
							</ul>
						</Card>
						<Card :gutters="false" class="xs:w-full xs:mb-3 w-1/2">
							<h2 class="pb-3 subheadline">Assignees</h2>
							<ul style="max-height:310px;" class="overflow-y-auto" v-if="assigned.length">
							<li class="my-2" v-for="(id, index) in assigned" :key="`AssignedKey-${index}`">
								<Button hover="true" class="text-lg leading-4 mr-2" @click.native.prevent="unassign(id)">&lt;</Button><span>{{displayUser(id)}}</span>
							</li>
							</ul>
						</Card>
					</div>
				</template>

				<button class="standard mr-2" @click.prevent="createProject">Create</button>
				<button class="standard" @click.prevent="EventBus.closeModal(()=>{EventBus.$emit('createProjectModal', false)})">Cancel</button>
		</template>
		<template v-if="complete">
			<h1 class="pb-5">Do you want to deploy a tool?</h1>
			<button @click.prevent="()=>{EventBus.transitionModal( 'createProjectModal', 'deployToolModal'), reset()}" class="standard mr-2">Yes</button>
			<button @click.prevent="chooseNo" class="standard">No</button>
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
				project: {
					name: "",
					status: "active",
					created_by: "",
					license_id: "",
					client_id: "",
				},
			}
		},
		name: 'CreateProjectModal',
		methods:{
			getUsers(){
				this.$store.dispatch("user/getUsers", {vm: this})
			},
			chooseNo(){
				this.EventBus.closeModal( ()=>{ this.EventBus.$emit('createProjectModal', false)})
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
			displayUser(id){
				let user = this.users.find( u => u.id == id )
				return user != undefined ? `${user.first_name} ${user.last_name}` : false
			},
			assign(id){
				let index = this.unassigned.findIndex( v => v == id )
				let user = this.unassigned.splice(index, 1)[0]
				
				this.assigned.push(user)
			},
			unassign(id){
				let index = this.assigned.findIndex( v => v == id)
				let user = this.assigned.splice(index, 1)[0]
				
				this.unassigned.push(user)
			},
			createProject(){
				this.project.license_id = this.$store.state.auth.license.id
				this.project.assigned = this.assigned;
				this.$store.dispatch("projects/createProject", {project: this.project, router: this.$router, vm: this})
			}
		},
		mounted(){},
		created(){},
		watch:{
			open: function(newVal){
				if( newVal ){
					this.project.created_by = this.$store.state.auth.user.id
					this.project.account_id = this.$store.state.auth.account
					this.project.client_id = this.$store.state.clients.client.id
					
					if( !this.$store.state.user.all.length ){
						this.getUsers()
					}else{
						this.unassigned = this.$store.state.user.all.map(u=>u.id)
					}
					
				}
			}
		},
		computed: {
			users(){
				return this.$store.state.user.all
			},
			loading(){
				return this.$store.state.projects.loading || this.$store.state.user.loading
			},
			isManager(){
				return this.$store.getters["auth/isManager"]
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