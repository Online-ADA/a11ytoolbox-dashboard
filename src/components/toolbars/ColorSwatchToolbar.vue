<template>
    <div id="toolbar-container" class="fixed xs:absolute sm:absolute z-50 w-full xs:h-auto sm:h-auto">
        <div id="toolbar" class="w-full pl-4 p-2 shadow-custom bg-white">
            <div class="flex items-center justify-between xs:flex-wrap">
                <!-- Left side -->
                <div class="flex items-center text-13 xs:basis-full xs:flex-wrap">
                    <span style="font-size:16px;" class="toolbar-headline">{{pageTitle}}</span>
                    <div class="divider border border-black mx-3.5"></div>
                    <div class="text-normal">
                        {{$store.state.swatch.swatch.title}}
                    </div>
                </div>
                
                <!-- Right side -->
                <div class="flex items-center justify-end">
                    <div class="flex items-center text-13">
                        <span class="w-auto mr-2 flex justify-end items-center">
                            <router-link v-if="isEditSwatch" title="Go to Audit" :to="{name:'AuditShow', params:{id:$route.params.id}}"><i class="far fa-arrow-left"></i></router-link>
                            <router-link v-if="!isEditSwatch" title="Edit Color Swatch" :to="{name: 'SwatchEdit', id: $route.params.id}"><i class="far fa-cog"></i></router-link>
                            <button class="xs:ml-0 ml-3.5 bg-transparent pointer-only" @click="EventBus.$emit('showInfoSidebar')" title="Show Information Sidebar"><i class="far fa-info-circle"></i></button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>


<script>
import { EventBus } from '../../services/eventBus'
export default {
    name: 'ColorSwatchToolbar',
    data() {
        return {
            EventBus: EventBus,
            
        }
    },
    mounted(){
    },
    watch:{
        
    },
    computed: {
        isEditSwatch(){
            return this.$route.name === "SwatchEdit"
        },
        pageTitle(){
            switch( this.$route.name ){
                case "SwatchEdit":
                    return "Edit Color Swatch Analysis"
                    break;
                case "SwatchShow":
                    return "Color Swatch Analysis"
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