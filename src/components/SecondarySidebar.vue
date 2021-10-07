<template>
  <div class="flex w-32 shadow-lg transition-all ">
      <div class="fixed">
            <div class="flex" v-bind:style="{ width: currentWidth + 'px' }" >
                <ul id="nav" class="pt-8 flex-1" v-if="type=='ManageProjects'">
                    <li>
                        <i class="fas fa-house pl-4 mr-4"></i><router-link class="text-black hover:text-pallette-red" to="/projects/create">Create</router-link>
                    </li>
                </ul>
                <ul id="nav" class="pt-8 flex-1" v-if="type=='ManageAudits'">
                    <li>
                        <i class="fas fa-house pl-4 mr-4"></i><router-link class="text-black hover:text-pallette-red" to="/audits/create">Create</router-link>
                    </li>
                </ul>
                <ul id="nav" class="pt-8 flex-1" v-if="type=='ManageClients'">
                    <li>
                        <i class="fas fa-house pl-4 mr-4"></i><router-link class="text-black hover:text-pallette-red" to="/manage/clients/create">Create</router-link>
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
        type: "",
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