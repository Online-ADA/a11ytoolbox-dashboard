<template>
    <div>
        <WcagAuditToolbar v-if="tool.type === 'audit' || $route.name == 'NewScan'" v-on:classupdate="UpdateClasses"/>
        <ColorSwatchToolbar v-if="tool.type === 'color_swatch'" v-on:classupdate="UpdateClasses"/>
        <MediaAuditToolbar v-if="tool.type === 'media-audit'" v-on:classupdate="UpdateClasses"/>
        <!-- <OverviewToolbar v-if="$route.name == 'ProjectShow'" v-on:classupdate="UpdateClasses"/> -->
        <ProjectToolbar v-if="projectPages.includes($route.name)" v-on:classupdate="UpdateClasses" />
        <ClientToolbar v-if="clientPages.includes($route.name)" v-on:classupdate="UpdateClasses" />
    </div>
</template>


<script>
// import { EventBus } from '../services/eventBus'
import WcagAuditToolbar from './toolbars/WcagAuditToolbar'
import MediaAuditToolbar from './toolbars/MediaAuditToolbar'
// import OverviewToolbar from './toolbars/OverviewToolbar'
import ColorSwatchToolbar from './toolbars/ColorSwatchToolbar'
import ProjectToolbar from './toolbars/ProjectToolbar'
import ClientToolbar from './toolbars/ClientToolbar'

export default {
    props:{
        tool: '',
        route_name: '',
    },
    data() {
        return {
            classes: {
            },
            projectPages: [
                'ProjectEdit',
                'ProjectShow'
            ],
            clientPages: [
                'ClientEdit',
                'ClientShow',
                'ClientProperties'
            ]
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
        // OverviewToolbar,
        ColorSwatchToolbar,
        ProjectToolbar,
        ClientToolbar
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