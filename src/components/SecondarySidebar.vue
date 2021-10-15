<template>
    <div class="flex shadow-lg transition-all sub-sidebar secondary relative">
        <div class="fixed">
            <div class="flex sub-nav-container" >
                <ul class="pt-1.5 flex-1 px-5">
                    <!-- Tools Level -->
                    <li class="py-1 tool-container" :class="[expanded.includes('audits') ? 'expanded' : '']">
                        <span class="flex items-center">
                            <i v-if="!expanded.includes('audits')" class="fas fa-caret-right"></i>
                            <i v-else class="fas fa-caret-down"></i>
                            <button @click.prevent="expand('audits')" class="">
                                Audits
                            </button>
                        </span>
                        <div class="block">
                            <ul>
                                <li>
                                    <router-link class="text-sm py-2 text-black hover:text-pallette-red" :to="{path: '/audits/create'}">Create New Audit</router-link>
                                </li>
                                <li :class="[$store.state.audits.audit.id === item.id ? 'selected' : '']" class="text-sm py-2" v-for="item in $store.state.projects.audits" :key="item.id">
                                    <button class="text-black hover:text-pallette-red" @click="updateAudit(item)">{{getTitle(item)}}</button>
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
import Button from './Button'

export default {
    props:{
        
    },
    data() {
        return {
            expanded: []
        }
    },
    name: 'secondary-sidebar',
    computed: {
    },
    components:{
        Button,
    },
    methods: {
        updateAudit(item){
            this.$store.state.projects.tool = "audit"
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
        "$store.state.projects.project": function(newVal){
            //ALWAYS reset audits to empty if project is switched.
            this.$store.state.projects.audits = []
            if( newVal !== false ){
                //If not false, we get the new audits
                this.$store.dispatch("projects/getAuditsForProject", {project_id: this.$store.state.projects.project.id})
            }
        }
    },
    computed: {},

    mounted() {
        
    }
}

</script>

<style scoped>

.tool-container button{
    width:100%;
    text-align:left;
    padding-left: 7px;
}
.tool-container > div{
    overflow:hidden;
    height:auto;
}
.tool-container ul{
    height:auto;
    padding-left:4px;
    max-height: 0px;
    overflow-y: auto;
    transition: max-height;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.tool-container.expanded ul{
    max-height:100%;
}
.tool-container ul li{
    border-left: 3px solid rgba(202, 202, 202, 0.8);
    padding-left:12px;
}
.tool-container ul li.selected{
    background-color: rgba(202, 202, 202, 0.8);
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
#sidebar.subSidebarOpen .sub-sidebar > div.fixed{
    display:block;
}
#sidebar.subSidebarOpen .sub-sidebar{
    width:200px;
    flex-grow:1;
    max-width:200px;
    overflow-y:auto;
}
.sub-sidebar li{
    word-break:break-all;
}
#sidebar.subSidebarOpen .sub-nav-container{
    width:200px;
    overflow-y:auto;
    max-height:calc(100vh - 60px);
}

</style>