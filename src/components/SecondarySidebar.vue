<template>
    <div class="flex shadow-lg transition-all sub-sidebar secondary relative">
        <div class="fixed">
            <div class="flex sub-nav-container" >
                <button @click.prevent="EventBus.openModal(()=>{ EventBus.$emit('deployToolModal', true) })" aria-label="Deploy New Tool" class="absolute deploy-tool">
                    <i class="far fa-plus-octagon"></i>
                </button>
                <ul class="pt-2.5 flex-1 px-5">
                    <!-- Tools Level -->
                    <li class="py-1 tool-container" :class="[expanded.includes('audit') ? 'expanded' : '']">
                        <span class="flex items-center">
                            <button @click.prevent="expand('audit')" class="">
                                <i v-if="!expanded.includes('audit')" class="fas fa-caret-right"></i>
                                <i v-else class="fas fa-caret-down"></i>
                                <span class="ml-2">WCAG Audits</span>
                            </button>
                        </span>
                        <div class="block">
                            <ul>
                                <!-- <li>
                                    <router-link class="text-sm py-2 text-black" :to="{path: '/audits/create'}">Create New Audit</router-link>
                                </li> -->
                                <li :class="[$store.state.audits.audit.id === item.id ? 'selected' : '']" class="text-sm py-2" v-for="item in $store.state.audits.all" :key="item.id">
                                    <button class="text-black" @click="updateAudit(item)">{{getTitle(item)}}</button>
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
    },
    components:{},
    methods: {
        updateAudit(item){
            this.$router.push({path: this.getRoute(item)})
        },
        getRoute(item){
            return "/audits/" + item.id
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
        }
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

            if( (oldVal === false || oldVal === undefined) && newVal !== false ){
                this.$store.state.audits.all = []
                this.$store.dispatch("audits/getAudits", {project_id: this.$store.state.projects.project.id})
                return
            }

            if( newVal.id !== oldVal.id ){
                let withIssues = false
                if( this.$route.name == "AuditImport" ){
                    withIssues = true
                }
                this.$store.dispatch("audits/getAudits", {project_id: this.$store.state.projects.project.id}, withIssues)
            }
        },
        "$store.state.projects.tool.type":function(newVal){
            if( newVal ){
                this.expanded.push(newVal)
            }
        }
    },
    computed: {},
    mounted() {
        if( this.$store.state.projects.tool.type === 'audit' ){
            this.expanded.push('audit')
        }
    }
}

</script>

<style scoped>
button.deploy-tool{
    top:5px;
    right:10px;
    font-size:16px;
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
    background-color: rgba(202, 202, 202, 0.8);
    border-left-color:#C80A00;
}
.sub-sidebar{
    overflow-y:auto;
    width:0px;
    flex-grow:0;
    flex-shrink:0;
    z-index:9;
    background-color: #E5E5E5;
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