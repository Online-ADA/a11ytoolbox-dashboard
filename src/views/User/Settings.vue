<template>
	<div class="">
		<Loader v-if="loading"></Loader>

		<h1 class="mb-3 headline">User Settings</h1>
		<Card style="height: calc(100vh - 170px)" class="w-full" :center="false" :gutters="false">
			<label class="label text-lg">Filter projects sidebar</label>
			<Toggle @changed="changeFilter" :fontSize="'small'" :value="projectFilter" :labelLeft="'All'" :labelRight="'Assigned only'"></Toggle>
		</Card>
	</div>
</template>

<script>
import Loader from '../../components/Loader.vue'
import Card from '../../components/Card.vue'
import Toggle from '../../components/Toggle.vue'
import {EventBus} from '../../services/eventBus'

export default {
	data(){
		return {
			EventBus: EventBus,
			projectFilter: false
		}
	},
	name: 'UserSettings',
	methods:{
		changeFilter(data){
			this.projectFilter = data
			EventBus.$emit( "metaEvent", {
				key: "license",
				path: this.license.id + "-project_filter",
				value: this.projectFilter
			})
		}
	},
	computed:{
		user(){
			return this.$store.state.auth.user
		},
		license(){
			return this.$store.state.auth.license
		},
		loading(){
			return this.$store.state.user.loading
		},
	},
	created(){
		document.title = "User Settings"

		if( this.user && 
			this.user.meta && 
			this.user.meta.license && 
			this.user.meta.license[this.license.id] 
		){
			this.projectFilter = this.user.meta.license[this.license.id].project_filter
		}
	},
	components:{
		Loader,
		Card,
		Toggle
	}
}
</script>