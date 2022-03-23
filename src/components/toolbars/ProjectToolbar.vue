<template>
	<div id="toolbar-container" class="fixed xs:absolute sm:absolute z-50 w-full xs:h-auto sm:h-auto">
        <div id="toolbar" class="w-full pl-4 p-2 shadow-custom bg-white">
            <div class="flex items-center justify-between xs:flex-wrap">
					<!-- Left side -->
					<div class="flex items-center text-13 xs:basis-full xs:flex-wrap">
						<!-- <span class="xs:basis-full xs:max-w-full xs:break-all" v-if="$store.state.projects.project">
							{{$store.state.projects.project.name}}
						</span> -->
						
					</div>
					<!-- Right side -->
					<div class="flex items-center justify-end">
						<div class="flex items-center text-13">
							<span class="w-auto mr-2 flex justify-end items-center">
								<router-link title="Go to Project Overview" :to="{name:'ProjectShow', params:{id:$route.params.id}}" v-if="isProjectEdit"><i class="far fa-arrow-left"></i></router-link>
							</span>
						</div>
					</div>
            </div>
        </div>
    </div>
    
</template>


<script>

export default {
	name: 'ProjectToolbar',
	props:{
		tool: '',
	},
	data() {
		return {
			
		}
	},
	mounted(){
	},
	watch:{
		
	},
	computed: {
		isProjectEdit(){
			return this.$route.name === "ProjectEdit"
		},
	},
	methods: {
	},
	components:{
	},
	created() {
		
	},
}

</script>

<style scoped>    
</style>