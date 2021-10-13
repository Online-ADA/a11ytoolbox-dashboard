<template>
  <div id="app" class="bg-pallette-grey-bg">
    <notifications/>
    <div id="page-container" class="transition-transform flex w-full height:100% flex-nowrap" >
      <div id="sidebar" class="z-50" v-bind:class="{ sidebarOpen: sidebarExpanded, subSidebarOpen: sidebarExpanded && $route.path != '/projects/create' }">
        <sidebar></sidebar>
      </div>
      <div id="content" class="flex" >
        <ada-header class="fixed z-40"></ada-header>
        <div class="w-full h-full max-w-full pt-12" >
          <div class="flex h-full">
            <transition name="slideright">
              <secondary-sidebar v-if="$route.path != '/projects/create'" :type="secondarySidebarType"></secondary-sidebar>
            </transition>
            <div class="max-w-full flex-1">
              <ada-secondary-header v-if="secondaryHeaderLabel !== false" id="secondaryHeader" class="transition-transform" :label="secondaryHeaderLabel" :aria-hidden="[ !showSecondaryHeader ? true : false ]" v-bind:class="{ open: showSecondaryHeader }" ></ada-secondary-header>
              <div id="main-content" class="pt-12" v-bind:class="{ sidebarOpen: sidebarExpanded, subSidebarExpanded: $store.state.projects.audits.length }">
                <div class="flex-1">
                  <router-view></router-view>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal class="z-50" :open="showLoginPrompt">
      <div class="bg-white px-4 pt-5 pb-4 p-6 text-center">
          <Btn aria-label="Close refresh session modal" @click.native.prevent="showLoginPrompt = false" class="absolute top-4 right-4" hover="true" color="white">X</Btn>
          <h2 class="text-center pb-3">Your session is about to expire</h2>

          <span class="text-sm">Time Remaining: {{tokenMinutesLeft}} minute<template v-if="tokenMinutesLeft != 1">s</template> and {{tokenSecondsLeft}} second<template v-if="tokenSecondsLeft != 1">s</template></span>
          <div class="text-sm">When your session ends you will be redirected to the home page</div>
      </div>
      <div class="bg-gray-50 px-4 py-3 flex">
          <button @click.prevent="refreshSession" type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-orange hover:text-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto">
            Refresh Session
          </button>
          <button @click.prevent="showLoginPrompt = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto">
            Close
          </button>
      </div>
    </Modal>
    
  </div>
</template>

<script>
import A from './components/Link'
import Dropdown from './components/Dropdown'
import AdaHeader from '@/components/Header.vue'
import AdaSecondaryHeader from '@/components/SecondaryHeader.vue'
import Sidebar from '@/components/Sidebar.vue'
import SecondarySidebar from '@/components/SecondarySidebar.vue'
import Modal from './components/Modal'
import Btn from './components/Button'
// import Card from '@/components/Card.vue'
// import clients from './store/modules/clients'

export default {
  data(){
    return {
      sidebarExpanded: true,
    }
  },
  methods:{
    refreshSession(){
      this.$store.dispatch('auth/resetToken', this.$router.history.current.path)
    },
  },
  computed: {
    account() {
      return this.$store.getters["auth/account"]
    },
    client(){
      if ( this.$store.state.clients )
      {
        if ( this.$store.state.clients.client )
          return this.$store.state.clients.client
      }
      return false;
    },
    secondaryHeaderLabel() {
      if ( this.$route.name=='ManageProjects' || this.$route.name=='ProjectList' )
        return "Projects";
      else
        return false;
    },
    showSecondaryHeader() {
      let showRoutes = ["ManageAudits", 'ManageProjects', 'ProjectList', 'ManageClients']
      if ( showRoutes.includes(this.$route.name) )
        return this.$route.name;
      else
        return false;
    },
    secondarySidebarType(){
      //Its possible this will change based on routes in the future, but for now default to always showing projects
      if( this.$store.getters["auth/isManager"] ){
        return 'ManagerAudits'
      }

      return 'ProjectAudits'
    },
    tokenSecondsLeft(){
      return this.$store.state.auth.token_time_left.seconds
    },
    tokenMinutesLeft(){
      return this.$store.state.auth.token_time_left.minutes
    },
    showLoginPrompt:{
      get(){
        return this.$store.state.auth.showLoginPrompt
      },
      set(val){
        this.$store.commit("auth/setState", {key: 'showLoginPrompt', value: false})
        this.$store.commit("auth/setState", {key: 'showLoginPromptOverride', value: true})
      }
    },
  },
  watch: {
    account: function() {
      if ( !this.account && this.$route.path != '/' )
        this.$router.push({path: '/'}).catch(()=>{})
    },
    client: function() {
      if ( !this.client && this.$route.path != '/' )
        this.$router.push({path: '/'}).catch(()=>{})
    },
  },
  created() {
  },
  mounted() {
      this.$root.$on('menuClick', (menuOpen) => {
        this.sidebarExpanded = menuOpen;
      } );
      if( this.$route.path == "/projects/create" ){
          this.$store.state.projects.project = false
      }
  },

  components:{
    A,
    Dropdown,
    AdaHeader,
    AdaSecondaryHeader,
    Sidebar,
    SecondarySidebar,
    Modal,
    Btn
  }
}
</script>

<style scoped>

.slideright-enter, .slideright-leave-to {
  transform: translateX(-200px);
}

#secondaryHeader {
  margin-top:-55px;
}

#secondaryHeader.open {
  margin-top:0px;
}

#sidebar {
  margin-left:-200px;
  width:200px;
  flex-shrink:0;
  transition-property: margin;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

#sidebar.sidebarOpen {
  margin-left:0px;
}

#content {
  flex-basis:0%;
  flex-grow:1;
  flex-shrink:1;
  max-width:100vw;
}

#sidebar.sidebarOpen ~ #content{
  max-width: calc(100vw - 200px);
}
#sidebar.sidebarOpen.subSidebarOpen ~ #content{
  max-width: calc(100vw - 400px);
}


</style>