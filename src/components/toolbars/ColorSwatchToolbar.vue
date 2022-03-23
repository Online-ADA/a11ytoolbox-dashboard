<template>
    <div id="toolbar-container" class="fixed xs:absolute sm:absolute z-50 w-full xs:h-auto sm:h-auto">
        <div id="toolbar" class="w-full pl-4 p-2 shadow-custom bg-white">
            <div class="flex items-center justify-between xs:flex-wrap">
                <!-- Left side -->
                <div class="flex items-center text-13 xs:basis-full xs:flex-wrap">
                    <span class="xs:basis-full xs:max-w-full xs:break-all" v-if="$store.state.projects.project">
                        {{$store.state.projects.project.name}}
                    </span>
                </div>
                <!-- Right side -->
                <div class="flex items-center justify-end">
                    <div class="flex items-center text-13">
                        <span class="w-auto mr-2 flex justify-end items-center">
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