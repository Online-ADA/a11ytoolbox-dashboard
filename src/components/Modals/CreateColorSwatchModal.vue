<template>
	<div>
		HELLO WORLD
	</div>
</template>

<script>
	import { EventBus } from "../../services/eventBus"

	export default {
		props:{
			
		},
		data(){
			return {
				EventBus: EventBus,
				
				complete: false
			}
		},
		name: 'CreateColorSwatchModal',
		methods:{
			
		},
		mounted(){

		},
		created(){

		},
		computed: {
			loading(){
				if( this.$store.state.clients ){
					return this.$store.state.clients.loading
				}
				return false
			},
		},
		components:{
			
		}
	}
</script>