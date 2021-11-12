<template>
    <div id="toolbar-container" :class="{'search-bar-open': searchBarOpen}" class="fixed z-50 w-full h-12" v-if="showToolbar">
    
    </div>
</template>


<script>
import { EventBus } from '../services/eventBus'

export default {
    props:{
        tool: '',
    },
    data() {
        return {

        }
    },
    name: 'ada-canvas-toolbar',
    mounted(){
    },
    watch:{
    },
    computed: {
    },
    methods: {
        showToolbar(){
            return this.tool.type === 'audit' && this.audit
        },
    },
    components:{
    },
    created() {
    },
}

</script>

<style scoped>
    #sidebar.sidebarOpen.subSidebarExpanded ~ #content #toolbar-container{
        width: calc(100% - 400px);
    }
    #sidebar.sidebarOpen ~ #content #toolbar-container{
        width: calc(100% - 200px);
    }
    #toolbar-container{
        width: calc(100%);
    }
</style>