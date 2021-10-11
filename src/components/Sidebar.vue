<template>
  <div class="flex h-full min-h-screen shadow-lg bg-pallette-grey-dark text-white w-full" >
      <div class="fixed" >
          <img class="pl-3 pt-2" src="../assets/onlineadalogo.png" />
                  
        <div class="flex" style="width:200px">
            <ul v-if="$store.state.clients.client" id="nav" class="pt-8 flex-1">
                <li class="flex mt-2" v-for="project in projects" :key="project.id">
                    <button class="w-full h-full bg-pallette-grey pt-2 shaddow-inner" @click="setCurrentProject(project.id)">{{project.name}}</button>
                </li>

                <!-- <li>
                    <i class="fas fa-house pl-6 mr-2"></i><router-link class="pl-2 text-white hover:text-pallette -red" to="/">Home</router-link>
                </li>

                <li class="flex mt-2">
                    <template v-if="$store.getters['auth/isManager']" >
                        <div v-if="manage==true" class="w-full h-full bg-pallette-grey pt-2 shaddow-inner" >
                            <div class="flex">
                                <i class="fas fa-tasks pt-2 pl-7 mr-2 mt-auto mb-auto"></i> 
                                <div class="pl-3 pt-2 text-white cursor-pointer hover:text-pallette-red" @click="manageMenu()" aria-label="Expand the sidebar menu" aria-controls="fail-article">Manage</div>
                            </div>
                            <div class="w-4/5 pt-2 ml-auto mr-auto pb-2" style="border-bottom: 1px solid #424242"> </div>
                        </div>
                        <div v-else class="flex w-full h-full">
                            <i class="fas fa-tasks pt-2 pl-6 mr-2 mt-auto mb-auto"></i>
                            <div class="pl-3 pt-2 text-white cursor-pointer hover:text-pallette-red" @click="manageMenu()" aria-label="Expand the sidebar menu" aria-controls="fail-article">Manage</div>
                        </div>
                    </template>
                    
                </li>

                <li v-if="$store.state.clients.client">
                    <div class="mt-2" >
                        <i class="fas  pt-2 pl-6 fa-tools mr-2 mt-auto mb-auto"></i>
                        <router-link class="pt-2 pl-2 text-white hover:text-pallette-red" to="/projects/list">Projects</router-link>
                    </div>
                </li> -->

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
        
    },
    data() {
        return {
            expanded: false,
            manage: false,
            currentProject: false,
        }
    },
    name: 'sidebar',
    watch: {
        "$store.state.clients.client": function(newVal){
            console.log(newVal);
            if( newVal !== false ){
                this.getProjects()
            }
        },
    },
    computed: {
    },
    components:{
        Button,
    },
    methods: {
        setCurrentProject(){
            this.projects.fill(false)
            this.projects[this.currentProject.id] = true
        },
        getProjects(){
            if( this.$store.getters["auth/isManager"] ){
                this.$store.dispatch("admin/getProjects")
            }else{
                this.$store.dispatch("projects/getProjects")
            }
        }
    },
    computed: {
        projects(){
            if( this.$store.getters["auth/isManager"] ){
                if( this.$store.state.admin !== undefined ){
                    return this.$store.state.admin.projects
                }
                return []
            }

            return this.$store.state.projects.all
        }
    },
    mounted() {
        this.$root.$on('menuClick', (menuOpen) => {
            this.expanded = menuOpen;
        } );

        if( this.$store.state.clients.client ){
            this.getProjects()
        }
    }
}

</script>

<style scoped>

.isCurrentProject {
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