<template>
    <div id="toolbar-container" class="fixed xs:absolute sm:absolute z-50 w-full xs:h-auto sm:h-auto h-12">
        <div id="toolbar" class="w-full pl-4 p-2 shadow-custom bg-white">
            <div class="flex items-center justify-end">
                <div class="flex items-center text-13">
                    <span class="w-auto mr-2 flex justify-end items-center">
                        <button class="xs:ml-0 ml-3.5 bg-transparent pointer-only" @click="EventBus.$emit('showInfoSidebar')" title="Show Information Sidebar"><i class="far fa-info-circle"></i></button>
                    </span>
                </div>
            </div>
        </div>
    </div>
    
</template>


<script>
import { EventBus } from '../../services/eventBus'
export default {
    name: 'OverviewToolbar',
    props:{
        tool: '',
    },
    data() {
        return {
            EventBus: EventBus,
            object_id: false,
            route_name: false,
        }
    },
    mounted(){
    },
    watch:{
        $route(val) {
            if(val) {
                this.object_id = val.params.id
                this.route_name = val.name
            }
        }
    },
    computed: {
        link_title() {
            if(this.object_id && this.route_name){
                switch (this.route_name) {
                    case 'ProjectShow':
                        return 'Project Settings'
                    case 'ClientShow':
                        return 'Client Settings'
                }
            }
            return ''
        },
        base_url() {
            if(this.object_id && this.route_name){
                switch (this.route_name) {
                    case 'ProjectShow':
                        return `/projects/${this.object_id}/edit`
                    case 'ClientShow':
                        return `/clients/${this.object_id}/edit`
                }
            }
            return ''
        },
    },
    methods: {
    },
    components:{
    },
    created() {
        if(this.$route) {
            if(this.$route.params.id) {
                this.object_id = this.$route.params.id
            }
            if(this.$route.name) {
                this.route_name = this.$route.name
            }
        }
    },
}

</script>

<style scoped>    
</style>