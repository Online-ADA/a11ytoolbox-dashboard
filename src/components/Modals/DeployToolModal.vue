<template>
	<Modal :valign="'top'" style="z-index:999" :size="'creation'" :open="open">
		<h1 class="mb-2 headline">Select a Tool to Deploy</h1>
		
		<div v-if="myTeam == 1 || myTeam == 2">
			<Button @click.native.prevent="EventBus.openModal( ()=>{ EventBus.$emit('deployToolModal', false); EventBus.$emit('deployWCAGAuditModal', true); })" class="mr-2 text-center">
				<div><i class="far fa-wrench"></i></div>
				WCAG Audit
			</Button>
		</div>
		<button @click.prevent="EventBus.closeModal( ()=>{ EventBus.$emit('deployToolModal', false)})" class="standard mt-2">Cancel</button>
	</Modal>
</template>


<script>
	import Modal from "../Modal.vue"
	import Button from "../Button.vue"
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
				toolType: false
			}
		},
		name: 'DeployToolModal',
		methods:{

		},
		mounted(){

		},
		created(){

		},
		computed: {
			account(){
				return this.$store.getters["auth/account"]
			},
			myTeam(){
				if( this.open ){
					return this.account.pivot.team_id
				}
			}
		},
		components:{
			Modal,
			Button
		}
	}
</script>