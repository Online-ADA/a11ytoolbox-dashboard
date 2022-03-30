<template>
	<div id="toolbar-container" class="fixed xs:absolute sm:absolute z-50 w-full xs:h-auto sm:h-auto">
        <div id="toolbar" class="w-full pl-4 p-2 shadow-custom bg-white">
            <div class="flex items-center justify-between xs:flex-wrap">
					<!-- Left side -->
					<div class="flex items-center xs:basis-full xs:flex-wrap">
						<span class="toolbar-headline">{{pageTitle}}</span>
                  <!-- <div class="border border-black mx-3.5 divider"></div> -->
					</div>
					<!-- Right side -->
					<div class="flex items-center justify-end">
						<div class="flex items-center text-13">
							<span class="w-auto mr-2 flex justify-end items-center">
								<router-link title="Go to Project Overview" :to="{name:'ProjectShow', params:{id:$route.params.id}}" v-if="!isProjectOverview"><i class="far fa-arrow-left"></i></router-link>
								<router-link v-if="!isProjectEdit"  :to="{name:'ProjectEdit', params: {id: $route.params.id}}" title="Edit Project"><i class="far fa-cog"></i></router-link>
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
		isProjectOverview(){
			return this.$route.name === "ProjectShow"
		},
		pageTitle(){
			switch( this.$route.name ){
					case "ProjectEdit":
						return "Edit Project"
						break;
					case "ProjectShow":
						return "Project Overview"
						break;
			}
      }
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
	.divider{
		height: 30px;
		margin-top: auto;
		margin-bottom: auto;
   }
</style>