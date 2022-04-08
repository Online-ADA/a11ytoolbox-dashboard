<template>
    <div class="flex shadow-lg transition-all sub-sidebar secondary relative">
        <div class="fixed">
            <div class="flex sub-nav-container" >
                <button title="Deploy a tool" @click.prevent="EventBus.openModal('deployToolModal', $event)" aria-label="Deploy New Tool" class="deploy-tool text-white absolute">
                    <div class="bg-pallette-button hover:bg-pallette-button-hover oswald pointer-events-none">
                        +
                    </div>
                </button>
                <ul class="pt-2.5 flex-1 px-5">
                    <!-- Tools Level -->
                    <li v-show="$store.state.audits.all.length" class="py-1 tool-container text-white" :class="[expanded.includes('audit') ? 'expanded' : '']">
                        <span class="flex items-center">
                            <button @click.prevent="expand('audit')">
                                <i class="fas fa-caret-right" ></i>
                                <span class="ml-2">WCAG Audits</span>
                            </button>
                        </span>
                        <div class="block">
                            <ul>
                                <template v-if="$store.state.projects.project">
                                    <li :class="[$store.state.audits.audit.id === item.id ? 'selected' : '']" class="text-sm py-2" v-for="item in $store.state.audits.all" :key="item.id">
                                        <button class="text-white" @click="updateAudit(item)">{{getTitle(item)}}</button>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </li>
                    <li v-show="mediaAudits.length" class="py-1 tool-container text-white" :class="[expanded.includes('media_audit') ? 'expanded' : '']">
                        <span class="flex items-center">
                            <button @click.prevent="expand('media_audit')">
                                <i class="fas fa-caret-right"></i>
                                <span class="ml-2">Media Audits</span>
                            </button>
                        </span>
                        <div class="block">
                            <ul>
                                <li :class="[(mediaAudits.audit && mediaAudits.audit.id === item.id) ? 'selected' : '']" class="text-sm py-2 text-white" v-for="item in mediaAudits" :key="item.id">
                                    <button class="" @click="updateMediaAudit(item)">{{getTitle(item)}}</button>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li v-show="colorSwatches.length" class="py-1 tool-container text-white" :class="[expanded.includes('color_swatch') ? 'expanded' : '']">
                        <span class="flex items-center">
                            <button @click.prevent="expand('color_swatch')" class="">
                                <i class="fas fa-caret-right"></i>
                                <!-- <i v-if="!expanded.includes('color_swatch')" class="fas fa-caret-right"></i>
                                <i v-else class="fas fa-caret-down"></i> -->
                                <span class="ml-2">Color Swatches</span>
                            </button>
                        </span>
                        <div class="block">
                            <ul>
                                <li :class="[($store.state.swatch.swatch.id === swatch.id) ? 'selected' : '']" class="text-sm py-2 text-white" v-for="swatch in colorSwatches" :key="'swatch-'+swatch.id">
                                    <button class="capitalize" @click="updateColorSwatch(swatch)">{{swatch.title}}</button>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>
import { EventBus } from "../services/eventBus"

export default {
    props:{
        
    },
    data() {
        return {
            expanded: [],
            EventBus: EventBus
        }
    },
    name: 'secondary-sidebar',
    computed: {
        mediaAudits() {
            return this.$store.state.mediaAudits.all
        },
        colorSwatches(){
            if( this.$store.state.projects.project ){
                return this.$store.state.projects.project.swatches || []
            }
            return []
        },
    },
    components:{
    },
    methods: {
        updateMediaAudit(item) {
            this.$router.push({
                name: 'MediaAuditShow',
                params: {
                    id: item.id
                }
            })
        },
        updateAudit(item){
            this.$router.push({
                name: 'AuditShow',
                params: {
                    id: item.id
                }
            })
        },
        updateColorSwatch(swatch){
            this.$router.push({
                name: 'SwatchShow',
                params: {
                    id: swatch.id
                }
            })
        },
        getTitle(item){
            return item.title
        },
        expand(tool){
            if( this.expanded.includes(tool) ){
                let index = this.expanded.indexOf(tool)
                this.expanded.splice(index, 1)
            }else{
                this.expanded.push(tool)
            }

            EventBus.$emit( "metaEvent", {
                key: "project",
                path: this.$store.state.projects.project.id + "-tools-sidebar-open",
                value: this.expanded
            })
        },
        setProjectMeta(){
            let meta = this.$store.state.auth.user.meta
            let id = this.$store.state.projects.project.id
            if( meta.project != undefined && meta.project[id] != undefined ){
                if( meta.project[id].tools != undefined && meta.project[id].tools.sidebar != undefined && meta.project[id].tools.sidebar.open != undefined ){
                    this.expanded = meta.project[id].tools.sidebar.open
                }
            }
        },
    },
    watch: {
        "$store.state.projects.project": function(newVal, oldVal){
            if( newVal === undefined ){
                return
            }

            if( newVal === false ){
                this.$store.state.audits.all = []
                return
            }
            
            if( !this.$store.state.projects.tool || !this.$store.state.projects.tool.type ){
                this.expanded = []
            }
            
            this.setProjectMeta()

            if( (oldVal === false || oldVal === undefined) && newVal !== false ){
                this.$store.state.audits.all = []
                this.$store.dispatch("audits/getAudits", {project_id: this.$store.state.projects.project.id})
                this.$store.dispatch("mediaAudits/getAudits", {project_id: this.$store.state.projects.project.id})
                return
            }

            if( newVal.id !== oldVal.id ){
                let withIssues = false
                if( this.$route.name == "AuditImport" ){
                    withIssues = true
                }
                this.$store.dispatch("audits/getAudits", {project_id: this.$store.state.projects.project.id}, withIssues)
                this.$store.dispatch("mediaAudits/getAudits", {project_id: this.$store.state.projects.project.id}, withIssues)
            }
        },
        "$store.state.projects.tool.type":function(newVal){
            if( newVal ){
                this.expanded.push(newVal)
            }
        },
    },
    mounted() {
        console.log(this.$store.state.projects.project);
        if( this.$store.state.projects.tool.type === 'audit' ){
            this.expanded.push('audit')
        }
        if( this.$store.state.projects.tool.type === 'media_audit' ){
            this.expanded.push('media_audit')
        }
        if( this.$store.state.projects.tool.type === 'color_swatch' ){
            this.expanded.push('color_swatch')
        }
    }
}

</script>

<style scoped>
button.deploy-tool{
    top:5px;
    right:-10px;
}
button.deploy-tool > div{
    -webkit-clip-path: circle(50% at 50% 50%);
    clip-path: circle(50% at 50% 50%);
    font-size: 40px;
    height: 34px;
    width: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 3px;
}
.tool-container button{
    width:100%;
    text-align:left;
}
.tool-container > div{
    overflow:hidden;
    height:auto;
}
.tool-container ul{
    height:auto;
    padding-left:4px;
    display:none;
    /* max-height: 0px; */
    overflow-y: auto;
    /* transition: max-height;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); */
}
.tool-container.expanded ul{
    /* max-height:100%; */
    display:block;
    min-height:30px;
}
.tool-container i{
    transition:transform .2s ease;
}
.tool-container.expanded i{
    transform:rotate(90deg);
}
.tool-container ul li:hover,
.tool-container ul li:focus{
    border-left-color:#C80A00;
}
.tool-container ul li{
    border-left: 3px solid;
    border-left-color: rgba(202, 202, 202, 0.8);
    padding-left:12px;
}
.tool-container ul li.selected{
    background-color: #717171;
    border-left-color:#C80A00;
}
.sub-sidebar{
    overflow-y:auto;
    width:0px;
    flex-grow:0;
    flex-shrink:0;
    z-index:9;
    background-color: #666666;
}
.sub-sidebar > div.fixed{
    display:none;
}
#sidebar.subSidebarExpanded .sub-sidebar > div.fixed{
    display:block;
}
#sidebar.subSidebarExpanded .sub-sidebar{
    width:200px;
    flex-grow:1;
    max-width:200px;
    overflow-y:auto;
}
.sub-sidebar li{
    word-break: break-word;
}
#sidebar.subSidebarExpanded .sub-nav-container{
    width:200px;
    overflow-y:auto;
    max-height:calc(100vh - 60px);
}

</style>