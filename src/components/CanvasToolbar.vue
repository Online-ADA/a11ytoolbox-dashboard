<template>
    <div id="toolbar-container" :class="classes" class="fixed z-50 w-full h-12">
        <WcagAuditToolbar v-if="tool.type === 'audit'" v-on:classupdate="UpdateClasses"/>
        <MediaAuditToolbar v-if="tool.type === 'media-audit'" v-on:classupdate="UpdateClasses"/>
        <OverviewToolbar v-if="$route.name == 'ProjectShow' || $route.name == 'ClientShow'" v-on:classupdate="UpdateClasses"/>
    </div>
</template>


<script>
import { EventBus } from '../services/eventBus'
import WcagAuditToolbar from './toolbars/WcagAuditToolbar'
import MediaAuditToolbar from './toolbars/MediaAuditToolbar'
import OverviewToolbar from './toolbars/OverviewToolbar'
export default {
    props:{
        tool: '',
        route_name: '',
    },
    data() {
        return {
            classes: {
            },
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
        UpdateClasses(classes) {
            for(let i in classes) {
                this.classes[i] = classes[i];
            }
        },
    },
    components:{
        WcagAuditToolbar,
        MediaAuditToolbar,
        OverviewToolbar,
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