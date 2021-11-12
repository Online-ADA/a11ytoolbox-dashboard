<template>
	<div id="app" class="bg-pallette-grey-bg h-full">
		<notifications/>
		<ada-header class="fixed"></ada-header>
		<a class="skip-link" href="#main-content">Skip Sidebar Navigation</a>
		<div 
		id="sidebar" 
		class="z-50 flex fixed" 
		v-bind:class="sidebarClasses">
			<sidebar></sidebar>
			<transition name="slideright">
				<secondary-sidebar v-show="$store.state.projects.project !== false"></secondary-sidebar>
			</transition>
		</div>
	
		<div id="content" class="flex ml-auto h-full">
			<div class="w-full h-full max-w-full">
				<div class="flex h-full">
					<div class="max-w-full flex flex-1">
						<CanvasToolbar @showInfoSidebar="showInfoSidebar" v-if="tool.type" :tool="tool"></CanvasToolbar>
						<div
						class="flex-1 px-5"
						:class="{'info-sidebar-expanded':infoSidebarExpanded}"
						id="main-content"
						>
							<router-view></router-view>
							<CreateClientModal style="z-index:999" :open="showClientCreationModal"></CreateClientModal>
							<CreateProjectModal style="z-index:999" :open="showProjectCreationModal"></CreateProjectModal>
							<DeployToolModal style="z-index:999" :open="showToolDeployModal"></DeployToolModal>
							<CreateWCAGAuditModal style="z-index:999" :open="showDeployWCAGAuditModal"></CreateWCAGAuditModal>
						</div>
						<div :class="{expanded:infoSidebarExpanded}" class="flex-1 info-sidebar fixed right-0 w-40 shadow-lg" v-if="tool">
							<span v-html="tool.info"></span>
						</div>
						
					</div>
				</div>
			</div>
		</div>

		<!-- <Modal class="z-50" :open="showLoginPrompt">
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
		</Modal> -->
	</div>
</template>

<script>
import A from './components/Link'
import Dropdown from './components/Dropdown'
import AdaHeader from '@/components/Header.vue'
import CanvasToolbar from '@/components/CanvasToolbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import SecondarySidebar from '@/components/SecondarySidebar.vue'
import Modal from './components/Modal'
import Btn from './components/Button'
import Cookies from 'js-cookie'
import { EventBus } from "./services/eventBus"
import CreateClientModal from "./components/Modals/CreateClientModal"
import CreateProjectModal from "./components/Modals/CreateProjectModal"
import CreateWCAGAuditModal from "./components/Modals/CreateWCAGAuditModal"
import DeployToolModal from "./components/Modals/DeployToolModal"

export default {
  data(){
		return {
			sidebarExpanded: true,
			infoSidebarExpanded: false,
			showClientCreationModal: false,
			showProjectCreationModal: false,
			showToolDeployModal: false,
			showDeployWCAGAuditModal: false,
			EventBus: EventBus
		}
	},
	methods:{
		showInfoSidebar(){
			this.infoSidebarExpanded = !this.infoSidebarExpanded
		}
		// refreshSession(){
		// 	this.$store.dispatch('auth/resetToken', this.$router.history.current.path)
		// },
	},
  	computed: {
		tool(){
			return this.$store.state.projects.tool
		},
		sidebarClasses(){
			let classes = []
			if( this.sidebarExpanded ){
				classes.push("sidebarOpen")
			}
			if( this.sidebarExpanded && this.$store.state.projects.project !== false ){
				classes.push("subSidebarExpanded")
			}
		
			return classes
		},
		account() {
			return this.$store.getters["auth/account"]
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
		// tokenSecondsLeft(){
		// 	return this.$store.state.auth.token_time_left.seconds
		// },
		// tokenMinutesLeft(){
		// 	return this.$store.state.auth.token_time_left.minutes
		// },
		// showLoginPrompt:{
		// 	get(){
		// 		return this.$store.state.auth.showLoginPrompt
		// 	},
		// 	set(val){
		// 		this.$store.commit("auth/setState", {key: 'showLoginPrompt', value: false})
		// 		this.$store.commit("auth/setState", {key: 'showLoginPromptOverride', value: true})
		// 	}
		// },
	},
	watch: {
		"$store.state.clients.client": function(newVal){
			this.$store.state.audits.all = []
			this.$store.state.projects.project = false
			if( newVal !== false && newVal !== undefined && newVal !== null ){
				Cookies.set('toolboxClient', parseInt(this.$store.state.clients.client.id))
				this.$store.dispatch("projects/getProjects")
			}
		},
		"$store.state.projects.all":function(newVal){
			//This function triggers when the projects list changes, primarily when switching clients or on initial login
			if( newVal.length ){
				if( this.$route.name === "ProjectShow" ){
					let that = this
					this.$store.state.projects.project = newVal.find(p=>p.id == that.$route.params.id)
					return
				}

				if( !this.$store.state.projects.project && this.$route.path !== "/projects/create" ){
					this.$store.state.projects.project = this.$store.state.projects.all[0]
				}
			}
		},
		"$route.path": function(newVal){
			if( newVal.includes("audits") ){
				if( this.$route.params.id !== undefined ){
					this.$store.state.projects.tool = {type:"audit", info:""}
					return
				}
			}

			this.$store.state.projects.tool = {
				type: false,
				info: ""
			}
		}
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

		let that = this
		//Payload is true or false
		EventBus.$on("createClientModal", (payload)=>{
			that.showClientCreationModal = payload
		})
		EventBus.$on("createProjectModal", (payload)=>{
			that.showProjectCreationModal = payload
		})
		EventBus.$on("deployToolModal", (payload)=>{
			that.showToolDeployModal = payload
		})
		EventBus.$on("deployWCAGAuditModal", (payload)=>{
			that.showDeployWCAGAuditModal = payload
		})
	},

	components:{
		A,
		Dropdown,
		AdaHeader,
		CanvasToolbar,
		Sidebar,
		SecondarySidebar,
		Modal,
		Btn,
		CreateClientModal,
		CreateProjectModal,
		CreateWCAGAuditModal,
		DeployToolModal
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
  z-index: 60;
  margin-top:60px;
  margin-left:-200px;
  max-width:400px;
  display:none;
  flex-shrink:0;
  transition-property: margin;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

#sidebar.sidebarOpen {
  margin-left:0px;
  display:flex;
}
#sidebar.sidebarOpen .primary{
  z-index:10;
}
#sidebar.sidebarOpen.subSidebarExpanded .secondary{
  z-index:1;
}
#sidebar.sidebarOpen .primary,
#sidebar.sidebarOpen.subSidebarExpanded .secondary{
  width:200px;
}

#content {
  flex-basis:0%;
  flex-grow:1;
  flex-shrink:1;
  max-width:100%;
  padding-top:60px;
}

#sidebar.sidebarOpen ~ #content{
  max-width: calc(100% - 200px);
}
#sidebar.sidebarOpen.subSidebarExpanded ~ #content{
  max-width: calc(100% - 400px);
}
.skip-link{
  position: absolute;
  left: -999px;
  width:1px;
  height: 1px;
  top: auto;
}
.skip-link:focus{
  left: 13px;
  display: inline-block;
  height: auto;
  width: auto;
  margin: auto;
  z-index: 99;
  top: 50px;
  background-color: white;
  color: black;
}
.info-sidebar{
	top:105px;
	width:200px;
	padding:10px;
	font-size:12px;
	background-color: #E5E5E5;
	overflow-x: hidden;
	overflow-y:auto;
	height:100vh;
	max-height:calc(100vh - 105px);
	display:none;
	animation-duration: 150ms;
   animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
   animation-direction: forwards;
}
.info-sidebar.expanded{
	display:block;
	max-width: 200px;
   animation-name: showInfoBar;
}
@keyframes showInfoBar {
   0%{  right:-200px; }
   100%{ right: 0; }
}
#main-content{
	transition:margin 150ms ease;
	margin-right:0px;
	max-width:100%;
	margin-top:50px;
}

#main-content.info-sidebar-expanded{
	margin-right:200px;
	max-width: calc(100% - 200px);
}
#toolbar-container.search-bar-open + #main-content{
	margin-top:85px;
}

</style>