<template>
	<div class="w-2/3 mx-auto">
		<div v-if="loading" class="loader-container position-absolute top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center">
			<i class="fas fa-circle-notch fa-spin fs-1"></i>
		</div>
		<h1>This is the User Edit page</h1>
		<h2>User: {{user.first_name}} {{user.last_name}}</h2>
	
		<div class="w-2/4 mx-auto">
			<Label class="text-xl" for="role">Role</Label>
			<ul class="border border-pallette-grey py-2 rounded">
				<li :class="{'bg-pallette-orange text-white': role == r}" class="capitalize" v-for="(r, id) in $store.state.admin.roles" :key="id">
					<A @click.native.prevent="modifyRole(id)">{{r}}</A>
				</li>
			</ul>
		</div>
	
		<div class="w-full flex flex-wrap p-3 justify-center">
			<h3 class="mt-4 w-full">Permissions</h3>
			<div class="w-full flex justify-center">
				<Button hover="true" color="orange" @click.native.prevent="savePermissions" >Save permissions</Button>
			</div>
			<div class="rounded border border-pallette-grey shadow w-1/5 m-2" v-for="(actions, entity) in userData.permissions" :key="entity">
				<div class="capitalize font-bold text-xl">{{entity}}</div>
				<ul class="p-4">
					<li class="flex items-center" v-for="(permission, label) in actions" :key="entity + '-action-'+label">
						<Label class="pr-2" :for="`${entity}-${label}`">{{label}}:</Label>
						<Checkbox v-model="userData.permissions[entity][label]" :id="`${entity}-${label}`" />
					</li>
				</ul>
			</div>
			<div class="w-full flex justify-center">
				<Button hover="true" color="orange" @click.native.prevent="savePermissions" >Save permissions</Button>
			</div>
		</div>
	</div>
</template>

<script>
import Label from '../../../components/Label'
import A from '../../../components/Link'
import Button from '../../../components/Button'
import Checkbox from '../../../components/Checkbox'
export default {
	data(){
		return {
			checkbox1: null,
			userData: {
				permissions: []
			}
		}
	},
	computed: {
		user() {
			if( this.$store.state.admin.user ){
				return this.$store.state.admin.user
			}
			return false
		},
		role(){
			return this.$store.state.admin.user.role
		},
		loading() {
			return this.$store.state.admin.loading.users
		},
	},
	props: [],
	watch: {
		"$store.state.admin.user": function(nv, ov){
			if( ov === false ){
				this.userData.permissions = this.$store.state.admin.user.permissions
			}
		}
	},
	methods: {
		savePermissions(){
			let that = this
			this.$store.dispatch("admin/saveUserPermissions", {
				permissions: that.userData.permissions,
				user_id: that.$route.params.id,
				vm: that
			})
		},
		modifyRole(r){
			let that = this
			this.$store.dispatch("admin/modifyRole", {
				role: r, 
				user_id: that.$route.params.id,
				vm: that
			})
		}
	},
	created() {
		this.userData.permissions = this.permissions
		this.$store.dispatch("admin/getUser", {user_id: this.$route.params.id, router: this.$router})
	},
	mounted() {
	},
	components: {
		A,
		Button,
		Label,
		Checkbox
	},
}
</script>