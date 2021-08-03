<template>
  <div class="flex h-full min-h-screen w-32 shadow-lg bg-pallette-grey-dark text-white " style="width:200px" >
      
      
      <div class="fixed">
          <router-link class="" to="/manage"><img class="pl-3 pt-2" src="../assets/onlineadalogo.png" /></router-link>
                  
            <div class="flex" >
                <ul id="nav" class="pt-8 flex-1">
                    <li>
                    <i class="fas fa-house pl-6 mr-2"></i><router-link class="pl-2 text-white hover:text-pallette-red" to="/">Home</router-link>
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

                    <div v-if="manage==true" class="bg-pallette-grey">
                        <ul class="">
                            
                            <li class="">
                                <div v-bind:class="{ isCurrentPage: getPages['ManageUsers'] }" class="pl-4 py-4" >
                                    <i class="far fa-users pl-3 mr-2 mt-auto mb-auto"></i>
                                    <router-link class="pl-3 text-white hover:text-pallette-red" to="/manage/users">Users</router-link>
                                </div>
                            </li>
                            <li class="">
                                <div v-bind:class="{ isCurrentPage: getPages['ManageProjects'] }" class="pl-4 py-4" >
                                    <i class="far fa-tools pl-3 mr-2 mt-auto mb-auto"></i>
                                    <router-link class="pl-3 text-white hover:text-pallette-red" to="/manage/projects">Projects</router-link>
                                </div>
                            </li>
                            <li class="">
                                <div v-bind:class="{ isCurrentPage: getPages['ManageDomains'] }" class="pl-4 py-4" >
                                    <i class="far fa-browser pl-3 mr-2 mt-auto mb-auto"></i>
                                    <router-link class="pl-3 text-white hover:text-pallette-red" to="/manage/domains">Domains</router-link>
                                </div>
                            </li>
                            <li class="">
                                <div v-bind:class="{ isCurrentPage: getPages['ManageAudits'] }" class="pl-4 py-4" >
                                    <i class="far fa-line-columns pl-3 mr-2 mt-auto mb-auto"></i>
                                    <router-link class="pl-3 text-white hover:text-pallette-red" to="/manage/audits">Audits</router-link>
                                </div>
                            </li>
                            <li class="">
                                <div v-bind:class="{ isCurrentPage: getPages['ManageArticles'] }" class="pl-4 py-4" >
                                    <i class="far fa-tasks pl-3 mr-2 mt-auto mb-auto"></i>
                                    <router-link class="pl-3 text-white hover:text-pallette-red" to="/manage/articles">Success Criteria</router-link>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <li class="flex mt-2">
                        <i v-if="$store.getters['auth/isAuthenticated']" class="fas  pt-2 pl-6 fa-sign-out-alt mr-2 mt-auto mb-auto"></i>
                        <i v-else class="fas fa-sign-in-alt pt-2 pl-7 mr-2 mt-auto mb-auto"></i>
                        <A v-if="$store.getters['auth/isAuthenticated']" class=" pt-2 pl-2 text-white hover:text-pallette-red" href="#" @click.native.prevent="$store.dispatch('auth/logout', $router)">Logout</A>
                        <A v-else href="#" class="pt-2 pl-3 text-white hover:text-pallette-red" @click.native.prevent="$store.dispatch('auth/login')">Log in</A>
                    </li>
                    
                    <li>
                        <span v-if="account">Account: {{account}}</span>
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
        
    },
    data() {
        return {
            expanded: false,
            manage: false,
            currentRoute: "None",
            pages: { 
                ManageArticles: false,
                ManageDomains: false,
                ManageUsers: false,
                ManageProjects: false,
                ManageAudits: false,
                },
        }
    },
    name: 'sidebar',
    computed: {
    },
    components:{
        Button,
    },
    methods: {
        manageMenu()
        {
            this.manage = !this.manage;
        },
    },

    computed: {
        getPages() {
            this.pages[this.currentRoute] = false;
            this.pages[this.$route.name] = true;
            this.currentRoute = this.$route.name;
            return this.pages;
        }
    },

    mounted() {
        this.$root.$on('menuClick', (menuOpen) => {
            this.expanded = menuOpen;
        } );
    }
}

</script>

<style scoped>

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