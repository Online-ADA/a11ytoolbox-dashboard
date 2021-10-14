<template>
    <div class="flex shadow-lg transition-all sub-sidebar secondary relative">
        <div class="fixed">
            <div class="flex sub-nav-container" >
                <ul class="pt-8 flex-1 px-5">
                    <li class="flex py-1">
                        <router-link class="text-black hover:text-pallette-red" :to="{path: `/projects/${$store.state.projects.project.id}/edit`}">Project Settings</router-link>
                    </li>
                    <li class="flex py-1">
                        <router-link class="text-black hover:text-pallette-red" :to="{path: '/audits/create'}">Create New Audit</router-link>
                    </li>
                    <li class="text-sm py-1" v-for="item in $store.state.projects.audits" :key="item.id">
                        <router-link class="text-black hover:text-pallette-red" @click="updateAudit" :to="{path: getRoute(item)}">{{getTitle(item)}}</router-link>
                    </li>
                </ul>

                <!-- <button class="font-button h-4 rounded uppercase transition-colors duration-100 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-red hover:text-white text-xs" @click="expand_secondary_menu" aria-label="Expand the sidebar menu" aria-controls="fail-article">Menu</button>
                <div v-if="secondaryExpanded == true">
                    secondary menu
                </div> -->
            </div>
        </div>
    </div>
</template>


<script>
import Button from './Button'

export default {
    props:{
        type: {
            default: ""
        },
    },
    data() {
        return {
            currentRoute: "None",
        }
    },
    name: 'secondary-sidebar',
    computed: {
    },
    components:{
        Button,
    },
    methods: {
        updateAudit(){
            this.$store.dispatch("audits/get")
        },
        getRoute(item){
            return "/audits/" + item.id
        },
        getTitle(item){
            return item.title
        },
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
        // this.$root.$on('menuClick', (menuOpen) => {
        //     this.expanded = menuOpen;
        // } );
    }
}

</script>

<style scoped>

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
    height:calc(100vh - 50px);
}

</style>