<template>
  <div id="app" class="overflow-x-hidden bg-pallette-grey-bg">
      <notifications/>
    <div id="slider" class="transition-transform" v-bind:class="{ sidebarOpen: sidebarExpanded }" >
      
        <ada-header class="fixed z-40" ></ada-header>

      <div id="content" class="flex" >
        <div id="sidebar" class=" z-50">
          <sidebar></sidebar>
        </div>

        <div class="pt-12 w-full" v-bind:class="{ sidebarOpen: sidebarExpanded }">

        <div class="flex">
          <transition name="slideright">
            <secondary-sidebar v-if="this.$route.name=='ManageProjects' || this.$route.name=='ProjectCreate'" type="Projects"></secondary-sidebar>
          </transition>

          <div class="flex-1">
            
            <ada-secondary-header id="secondaryHeader" class="transition-transform" :label="secondaryHeaderLabel" v-bind:class="{ open: showSecondaryHeader }" ></ada-secondary-header>

            <div id="main-content" class="pt-12 " v-bind:class="{ sidebarOpen: sidebarExpanded }">

              <div class="flex-1">
                <div id="nav" class="flex items-center relative z-30 w-full">
                  <div class="w-1/3"></div>
                    <div class="flex place-content-center w-1/3 box-border py-1">
                      <router-link class="hover:text-gray-500 pl-4" to="/">Home</router-link>
                      <span class="px-2" aria-hidden="true">|</span>
                      <template v-if="$store.getters['auth/isManager']">
                        <Dropdown  :children="manageDropdown"><template v-slot:label>Manage</template></Dropdown>
                        <span class="px-2" aria-hidden="true">|</span>
                      </template>
                      <template v-if="$store.getters['auth/isAuthenticated'] && !!$store.state.auth.account">
                        <Dropdown :children="siteDropdown"><template v-slot:label>Site</template></Dropdown>
                        <span class="px-2" aria-hidden="true">|</span>
                      </template>
                      
                      <A v-if="$store.getters['auth/isAuthenticated']" href="#" @click.native.prevent="$store.dispatch('auth/logout', $router)">Logout</A>
                      <A v-else href="#" @click.native.prevent="$store.dispatch('auth/login')">Log in</A>
                      
                      <span v-if="account"><span aria-hidden="true" class="px-2">|</span>Account: {{account}}</span>
                    </div>
                    <div class="w-1/3"></div>
                  </div>
                  <router-view/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import A from './components/Link'
import Dropdown from './components/Dropdown'
import AdaHeader from '@/components/Header.vue'
import AdaSecondaryHeader from '@/components/SecondaryHeader.vue'
import Sidebar from '@/components/Sidebar.vue'
import SecondarySidebar from '@/components/SecondarySidebar.vue'
import Card from '@/components/Card.vue'

export default {
  data(){
    return {
      sidebarExpanded: true,

      manageDropdown: [
        {
          type: 'router-link',
          label: 'Dashboard',
          to: '/manage'
        },
        {
          type: 'router-link',
          label: 'Users',
          to: '/manage/users'
        },
        {
          type: 'router-link',
          label: 'Projects',
          to: '/manage/projects'
        },
        {
          type: 'router-link',
          label: 'Domains',
          to: '/manage/domains'
        },
        // {
        //   type: 'router-link',
        //   label: 'Clients',
        //   to: '/manage/clients'
        // },
        {
          type: 'router-link',
          label: 'Audits',
          to: '/manage/audits'
        },
        {
          type: 'router-link',
          label: 'Success Criteria',
          to: '/manage/articles'
        },
      ],
      siteDropdown: [
        {
          type: 'dropdown',
          label: 'Projects',
          children: [
            {
              type: 'router-link',
              label: 'My Projects',
              to: '/projects/list'
            },
            {
              type: 'router-link',
              label: 'Create',
              to: '/projects/create'
            },
          ]
        },
        {
          type: 'dropdown',
          label: 'Domains',
          children: [
            {
              type: 'router-link',
              label: 'My Domains',
              to: '/domains/list'
            },
            {
              type: 'router-link',
              label: 'Create',
              to: '/domains/create'
            },
          ]
        },
        {
          type: 'dropdown',
          label: 'Audits',
          children: [
            {
              type: 'router-link',
              label: 'My Audits',
              to: '/audits/list'
            },
            {
              type: 'router-link',
              label: 'Create',
              to: '/audits/create'
            },
          ]
        },
        {
          type: 'router-link',
          label: 'Scan History',
          to: '/scan/history'
        },
        // {
        //   type: 'dropdown',
        //   label: 'Scan',
        //   children: [
        //     {
        //       type: 'router-link',
        //       label: 'Start New',
        //       to: '/scan/new'
        //     },
        //     {
        //       type: 'router-link',
        //       label: 'My History',
        //       to: '/scan/list'
        //     },
        //   ]
        // }
      ]
    }
  },
  computed: {
    account(){
      return this.$store.getters["auth/account"]
    },

    contentWidth() {
      if ( sidebarExpanded)
        return document.getElementById("main-content").clientWidth - 200;
      else
        return document.getElementById("main-content").clientWidth;
    },

    secondaryHeaderLabel() {
      if ( "this.$route.name=='ManageProjects' || this.$route.name=='ProjectCreate'" )
        return "Projects";
      else
        return false;
    },

    showSecondaryHeader() {
      if ( this.$route.name=='ManageProjects' || this.$route.name=='ProjectCreate' )
        return true;
      else
        return false;
    }
  },
  
  mounted() {
      this.$root.$on('menuClick', (menuOpen) => {
          this.sidebarExpanded = menuOpen;
      } );
  },

  components:{
    A,
    Dropdown,
    AdaHeader,
    AdaSecondaryHeader,
    Sidebar,
    SecondarySidebar,
    Card
  }
}
</script>

<style scoped>

.slideright-enter, .slideright-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-200px);
}

#secondaryHeader
/* .slide-fade-leave-active below version 2.1.8 */ {
  /* transform: translateY(-200px); */
  
  transform: translateY(-200px);
}

#secondaryHeader.open
/* .slide-fade-leave-active below version 2.1.8 */ {
  /* transform: translateY(-200px); */
 
  transform: translateY(0px);
}


#slider {
  transform: translateX(-200px);
  width: calc(100% + 200px);
  /* overflow: hidden; */
}

#slider.sidebarOpen {
  /* transition: margin-right 4s; */
  transform: translateX(0px);
  /* overflow: hidden; */
}

#main-content {
  padding-right: 0px;
  transition-property: padding;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
transition-duration: 150ms;
}

#main-content.sidebarOpen {
  padding-right: 200px;
  /* width:50%; */
}


</style>