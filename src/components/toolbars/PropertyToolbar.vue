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
								<router-link class="mr-3.5" title="Go to Client Properties" :to="{name:'ClientProperties', params:{id: client_id}}"><i class="far fa-arrow-left"></i></router-link>

								<button v-if="isSoftwareEdit" title="Edit software title" aria-label="Edit software title" @click.prevent="EventBus.openModal('editSoftwareModal', $event)"><i class="far fa-edit"></i></button>
								<button v-if="isDomainEdit" title="Edit domain title" aria-label="Edit domain title" @click.prevent="EventBus.openModal('editDomainModal', $event)"><i class="far fa-edit"></i></button>

								<router-link v-if="isDomainShow" :to="{path: `/domains/${$route.params.id}/edit`}" title="Domain Settings"><i class="far fa-cog"></i></router-link>
							</span>
						</div>
					</div>
            </div>
        </div>
    </div>
    
</template>


<script>
import {EventBus} from "../../services/eventBus"
export default {
	name: 'PropertyToolbar',
	props:{
		tool: '',
	},
	data() {
		return {
			EventBus: EventBus
		}
	},
	mounted(){
	},
	watch:{
		
	},
	computed: {
		isSoftwareEdit(){
			return this.$route.name === "SoftwareEdit"
		},
		isDomainEdit(){
			return this.$route.name === "DomainsEdit"
		},
		isDomainShow(){
			return this.$route.name === "DomainsShow"
		},
		pageTitle(){
			switch( this.$route.name ){
					case "DomainsEdit":
						return "Edit Domain"
						break;
					case "DomainsShow":
						return "Domain"
						break;
					case "SoftwareEdit":
						return "Edit Software"
						break;
			}
      },
		client_id(){
			return this.$store.state.clients.client.id
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