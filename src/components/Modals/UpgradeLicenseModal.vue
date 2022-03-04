<template>
	<Modal style="z-index:999" :valign="'top'" :size="'creation'" :open="open">
		<div>
			<Loader v-if="loading"></Loader>
			<h1 class="headline">Unlock Features</h1>
		</div>
		<template>
			<button @click.prevent="chooseYes" class="standard mr-2">Yes</button>
			<button @click.prevent="chooseNo" class="standard">No</button>
		</template>
	</Modal>
</template>


<script>
	import Modal from "../Modal.vue"
	import { EventBus } from "../../services/eventBus"
	import Loader from "../Loader.vue"
	export default {
        name: 'UpgradeLicenseModal',
		props:{
			open:{
				type: Boolean,
				default: false
			},
		},
		data(){
			return {
				EventBus: EventBus,
			}
		},
		methods:{
			chooseNo(){
			},
			chooseYes(){
			},
		},
		mounted(){

		},
		created(){

		},
		computed: {
		},
		components:{
			Modal,
			Loader
		}
	}
</script>