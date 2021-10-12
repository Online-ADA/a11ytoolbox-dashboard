<template>
    <div :class="{ 'expanded': source.length }" class="flex shadow-lg transition-all sub-sidebar">
        <div class="fixed">
            <div class="flex sub-nav-container" >
                <ul class="pt-8 flex-1 px-5">
                    <li class="text-sm">
                        <router-link class="text-black hover:text-pallette-red" :to="{path: '/audits/create'}">Create New</router-link>
                    </li>
                    <li class="text-sm" v-for="item in source" :key="item.id">
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
            expanded: false,
            manage: false,
            currentWidth: 200,
            currentRoute: "None",
            pages: { 
                Manage: false,
            },
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
        expand() {
            this.expanded = !this.expanded;
            if ( this.expanded)
            {
                this.currentWidth = 200;
            }
            else
                this.currentWidth = 60;

        },
        manageMenu()
        {
            this.manage = !this.manage;
        },
    },
    watch: {
        "$store.state.projects.project": function(newVal){
            if( newVal ){
                this.$store.state.projects.audits = []
                this.$store.dispatch("projects/getAuditsForProject", {project_id: this.$store.state.projects.project.id})
            }
        }
    },
    computed: {
        getPages() {
            this.pages[this.currentRoute] = false;
            this.pages[this.$route.name] = true;
            this.currentRoute = this.$route.name;
            return this.pages;
        },
        source(){
            return this.$store.state.projects.audits
        }
    },

    mounted() {
        this.$root.$on('menuClick', (menuOpen) => {
            this.expanded = menuOpen;
            // if ( menuOpen)
            // {
            //     this.currentWidth = 200;
            // }
            // else
            //     this.currentWidth = 60;
        } );
    }
}

</script>

<style scoped>

.sub-sidebar{
    overflow-y:auto;
    flex-grow:0;
    flex-shrink:0;
    z-index:26;
    background-color: #E5E5E5;
}
.sub-sidebar > div.fixed{
    display:none;
}
#sidebar.subSidebarOpen  ~ #content .sub-sidebar > div.fixed{
    display:block;
}
#sidebar.subSidebarOpen  ~ #content .sub-sidebar.expanded{
    width:200px;
    flex-grow:1;
    max-width:200px;
    overflow-y:auto;
}
.sub-sidebar.expanded li{
    word-break:break-all;
}
#sidebar.subSidebarOpen ~ #content .sub-nav-container{
    width:200px;
    overflow-y:auto;
    height:calc(100vh - 50px);
}
.isCurrentPage {
    border-left-color: #C80A00;
    border-left-width: 4px;

  -webkit-box-shadow: inset 5px 3px 5px #222222;
     -moz-box-shadow: inset 5px 3px 5px #222222;
          box-shadow: inset 5px 3px 5px #222222;
}

img {
    height: 48px;
    image-rendering: -moz-crisp-edges;         /* Firefox */
    image-rendering:   -o-crisp-edges;         /* Opera */
    image-rendering: -webkit-optimize-contrast;/* Webkit (non-standard naming) */
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
}

</style>