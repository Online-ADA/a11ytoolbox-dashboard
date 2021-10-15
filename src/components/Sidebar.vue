<template>
  <div class="primary flex shadow-lg bg-pallette-grey-dark text-white relative" >
        <div>
            <div class="flex" style="width:200px;overflow-y:auto;">
                <ul v-if="$store.state.clients.client" id="nav" class="flex-1">
                    <li :aria-current="[$route.path == '/projects/create' && $store.state.projects.project === false ? 'true' : false]" :class="[$route.path == '/projects/create' && $store.state.projects.project === false ? 'selected' : '']" class="flex">
                        <router-link class="text-center w-full h-full py-2 text-base" :to="{name: 'ProjectCreate'}">Create New Project</router-link>
                    </li>
                    <li :aria-current="[$store.state.projects.project !== false && selectedProject.id === project.id  ? 'true' : false]" :class="[$store.state.projects.project !== false && selectedProject.id === project.id  ? 'selected' : '']" class="flex" v-for="project in projects" :key="project.id">
                        <button class="w-full h-full py-2 text-left pl-2.5" @click="setCurrentProject(project.id)">{{project.name}}</button>
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
import Cookies from 'js-cookie'

export default {
    props:{},
    data() {
        return {
            expanded: false,
            manage: false,
        }
    },
    name: 'sidebar',
    watch: {
        "$store.state.clients.client": function(newVal){
            this.$store.state.projects.audits = []
            this.$store.state.projects.project = false
            if( newVal !== false && newVal !== undefined && newVal !== null ){
                Cookies.set('toolboxClient', parseInt(this.$store.state.clients.client.id))
                this.getProjects()
            }
        },
        "$store.state.projects.all":function(newVal){
            if( newVal.length ){
                if( !this.$store.state.projects.project && this.$route.path !== "/projects/create" ){
                    this.$store.state.projects.project = this.$store.state.projects.all[0]
                }
            }
        }
    },
    components:{
        Button,
    },
    methods: {
        setCurrentProject(id){
            this.$store.state.projects.project = this.projects.find(p=>p.id === id)
            this.$router.push({path:`/projects/${id}`})
        },
        getProjects(){
            this.$store.dispatch("projects/getProjects")
        }
    },
    computed: {
        projects(){
            return this.$store.state.projects.all
        },
        selectedProject(){
            return this.$store.state.projects.project
        }
    },
    mounted() {
        this.$root.$on('menuClick', (menuOpen) => {
            this.expanded = menuOpen;
        } );

        // if( this.$store.state.clients.client ){
        //     this.getProjects()
        // }
    }
}

</script>

<style scoped>

#sidebar .primary{
    z-index:10;
}
#nav{
    padding-top:5px;
}
#nav li{
    font-size:13px;
}
#sidebar .primary li.selected {
    border-left-color: #C80A00;
    border-left-width: 4px;
    background-color: rgba(97, 97, 97, 1);
    /* -webkit-box-shadow: inset 5px 3px 5px #222222;
    -moz-box-shadow: inset 5px 3px 5px #222222;
    box-shadow: inset 5px 3px 5px #222222; */
}
#nav{
    height: calc(100vh - 60px);
    max-height: 100%;
    overflow-y: auto;
}

</style>