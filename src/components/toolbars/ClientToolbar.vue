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
								<router-link class="mr-3.5" title="Go to Client Overview" :to="{name:'ClientShow', params:{id:$route.params.id}}" v-if="isClientEdit || isProperties"><i class="far fa-arrow-left"></i></router-link>

								<router-link class="mr-3.5" title="Manage Properties" v-if="!isProperties" :to="{name: 'ClientProperties', params:{id:$route.params.id}}"><i class="far fa-atlas"></i></router-link>

								<router-link v-if="!isClientEdit" :to="{path: `/clients/${$route.params.id}/edit`}" title="Client Settings"><i class="far fa-cog"></i></router-link>
							</span>
						</div>
					</div>
            </div>
        </div>
    </div>
    
</template>


<script>

export default {
	name: 'ClientToolbar',
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
		isClientEdit(){
			return this.$route.name === "ClientEdit"
		},
		isProperties(){
			return this.$route.name === "ClientProperties"
		},
		pageTitle(){
			switch( this.$route.name ){
				case "ClientEdit":
					return "Edit Client"
					break
				case "ClientShow":
					return "Client Overview"
					break
				case "ClientProperties":
					return "Client Properties"
					break
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