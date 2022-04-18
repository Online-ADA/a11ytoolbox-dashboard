<template>
	<div @click="checkCloseDropdowns" id="app" class="bg-pallette-grey-bg h-full">
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
	
		<div id="content" class="flex ml-auto h-screen">
			<div :class="{'ml-6': $route.name != 'AuditShow'}" class="max-w-full flex flex-1 overflow-auto">
				<CanvasToolbar :tool="tool"></CanvasToolbar>
				<div
				class="flex-1 canvas"
				:class="{'info-sidebar-expanded':infoSidebarExpanded, 'audit-show': $route.name == 'AuditShow'}"
				id="main-content"
				>
					<router-view></router-view>
					<CreateClientModal style="z-index:999" :open="show.ClientCreationModal"></CreateClientModal>
					<CreateProjectModal style="z-index:999" :open="show.ProjectCreationModal"></CreateProjectModal>
					<DeployToolModal style="z-index:999" :open="show.ToolDeployModal"></DeployToolModal>
					<CreateWCAGAuditModal style="z-index:999" :open="show.DeployWCAGAuditModal"></CreateWCAGAuditModal>
					<CreateColorSwatchModal style="z-index:999" :open="show.CreateColorSwatchModal"></CreateColorSwatchModal>
					<CreateMediaAuditModal style="z-index:999" :open="show.DeployMediaAuditModal"></CreateMediaAuditModal>
					<AddUsersToLicenseModal style="z-index:999" v-if="show.AddUsersToLicenseModal" :open="show.AddUsersToLicenseModal"></AddUsersToLicenseModal>
					<ColorContrastQuickToolModal style="z-index:999" :open="show.ColorContrastModal"></ColorContrastQuickToolModal>
					<UpgradeLicenseModal style="z-index:999" :open="show.UpgradeLicenseModal"/>
				</div>
				<div :class="{expanded:infoSidebarExpanded}" class="flex-1 info-sidebar fixed right-0 w-40 shadow-lg" v-if="tool">
					<span v-html="tool.info"></span>
				</div>
				
			</div>
			
		</div>
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
import Cookies from './services/cookies'
import { EventBus } from "./services/eventBus"
// import Utility from "./services/utility.js"
import CreateClientModal from "./components/Modals/CreateClientModal"
import CreateProjectModal from "./components/Modals/CreateProjectModal"
import CreateWCAGAuditModal from "./components/Modals/CreateWCAGAuditModal"
import DeployToolModal from "./components/Modals/DeployToolModal"
import CreateMediaAuditModal from './components/Modals/CreateMediaAuditModal'
import AddUsersToLicenseModal from './components/Modals/AddUsersToLicenseModal'
import UpgradeLicenseModal from './components/Modals/UpgradeLicenseModal'
import CreateColorSwatchModal from './components/Modals/CreateColorSwatchModal'
import ColorContrastQuickToolModal from './components/Modals/ColorContrastModal.vue'

export default {
  data(){
		return {
			sidebarExpanded: true,
			infoSidebarExpanded: false,
			show: {
				ClientCreationModal: false,
				ProjectCreationModal: false,
				ToolDeployModal: false,
				DeployWCAGAuditModal: false,
				DeployMediaAuditModal: false,
				AddUsersToLicenseModal: false,
				UpgradeLicenseModal: false,
				CreateColorSwatchModal: false,
				ColorContrastModal: false,
			},
			EventBus: EventBus,
			openDropdowns:[],
			semaphore: false
		}
	},
	methods:{
		checkCloseDropdowns($ev){
			if( this.semaphore ){
				this.semaphore = false
				return
			}

			let dropdownsToClose = this._.cloneDeep(this.openDropdowns)
			this.openDropdowns = []
			
			for (let z = 0; z < dropdownsToClose.length; z++) {
				const dropdown = dropdownsToClose[z];
				EventBus.$emit("close-dropdown", dropdown)
			}
			
		},
		checkMobileNoOverflow(){
			if( window.screen.width < 1024 ){
				let body = document.querySelector("body")
				if( body.classList.contains("mobile-no-overflow") ){
					body.classList.remove("mobile-no-overflow")
				}else{
					body.classList.add("mobile-no-overflow")
				}
			}
		},
		showHideContent(){
			if( window.screen.width < 1024 ){
				let content = document.querySelector("#content")
				if( content.classList.contains("hidden") ){
					content.classList.remove("hidden")
				}else{
					content.classList.add("hidden")
				}
			}
		},
		CloseModals() {
			for(let i in this.show) {
				if(this.show[i]) this.show[i] = false
			}
		},
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
		// secondaryHeaderLabel() {
		// 	if ( this.$route.name=='ManageProjects' || this.$route.name=='ProjectList' )
		// 		return "Projects";
		// 	else
		// 		return false;
		// },
		// showSecondaryHeader() {
		// 	let showRoutes = ["ManageAudits", 'ManageProjects', 'ProjectList', 'ManageClients']
		// 	if ( showRoutes.includes(this.$route.name) )
		// 		return this.$route.name;
		// 	else
		// 		return false;
		// },
	},
	watch: {
		"$store.state.projects.project":{
			deep: true,
			handler(newVal){
				console.log("Project changed", newVal);
			}
		},
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
				if( this.$route.name === "ProjectShow" || this.$route.name === "ProjectEdit" ){
					let that = this
					this.$store.state.projects.project = newVal.find(p=>p.id == that.$route.params.id)
					return
				}

				if( this.$route.name === "AuditShow" || this.$route.name === "AuditEdit" ){
					let that = this
					
					this.$store.state.projects.project = newVal.find(p=>p.id == that.$store.state.audits.audit.project_id)
					return
				}

				if( !this.$store.state.projects.project && this.$route.path !== "/projects/create" ){
					this.$store.state.projects.project = this.$store.state.projects.all[0]
				}
			}
		},
		"$route.path": function(){
			if( this.$route.matched[0].name == 'Audits' ){
				if( this.$route.params.id !== undefined ){
					this.$store.state.projects.tool = {type:"audit", info:""}
					return
				}
			}
			
			if( this.$route.matched[0].path == '/color-reports' ){
				if( this.$route.params.id !== undefined ){
					this.$store.state.projects.tool = {type:"color_swatch", info:"<div>Using the w3.org wiki for Relative Luminance as a guide, our forumal for determining color contrast between 2 relative luminances is calculated using the threshold for piecewise equation of 0.04045 for better accuracy rather than the older accepted threshold of 0.03928, as per the official IEC standard for the sRGB color space.</div><div class='break-all mt-3'><small>Source: <a class='block' href='https://www.w3.org/WAI/GL/wiki/Relative_luminance' target='_blank'>https://www.w3.org/WAI/GL/wiki/Relative_luminance</a></small></div>"}
					return
				}
			}
			if( this.$route.matched[0].name == 'MediaAudits' ){
				if( this.$route.params.id !== undefined ){
					this.$store.state.projects.tool = {type:"media-audit", info:""}
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
		if( window.screen.width < 1024 ){
			this.sidebarExpanded = false
		}
		const urlSearchParams = new URLSearchParams(window.location.search);
		if(urlSearchParams.get('pop')) {
			switch(urlSearchParams.get('pop')) {
				
				case 'upgrade': {
					if(urlSearchParams.get('trigger')) this.$store.commit("upgrade/setState",{key:'trigger',value: urlSearchParams.get('trigger')})
					if(urlSearchParams.get('message')) this.$store.commit("upgrade/setState",{key:'message',value: urlSearchParams.get('message')})
					this.show.UpgradeLicenseModal = true
				}
			}
		}
	},
	mounted() {
		gtag('event', 'conversion', {'send_to': 'AW-343018477/f_37CP_rrrIDEO2XyKMB'});
		this.$root.$on('menuClick', (menuOpen) => {
			this.sidebarExpanded = menuOpen;
			
			this.checkMobileNoOverflow()
			this.showHideContent()
		} );
		if( this.$route.path == "/projects/create" ){
			this.$store.state.projects.project = false
		}

		let that = this
		//Payload is true or false
		EventBus.$on("createClientModal", (payload)=>{
			that.show.ClientCreationModal = payload
		})
		EventBus.$on("createProjectModal", (payload)=>{
			that.show.ProjectCreationModal = payload
		})
		EventBus.$on("deployToolModal", (payload)=>{
			that.show.ToolDeployModal = payload
		})
		EventBus.$on("deployWCAGAuditModal", (payload)=>{
			that.show.DeployWCAGAuditModal = payload
		})
		EventBus.$on("deployColorSwatchModal", (payload)=>{
			that.show.CreateColorSwatchModal = payload
		})
		EventBus.$on("deployMediaAuditModal", (payload)=>{
			that.show.DeployMediaAuditModal = payload
		});
		EventBus.$on("AddUsersToLicenseModal", (payload)=>{
			that.show.AddUsersToLicenseModal = payload
		})
		EventBus.$on("colorContrastModal", (payload)=>{
			console.log(payload)
			that.show.ColorContrastModal = payload
		});
		EventBus.$on("dropdown-expanded", (payload)=>{
			this.semaphore = true
			this.openDropdowns.push(payload)
		})
		EventBus.$on("showInfoSidebar", ()=>{
			this.infoSidebarExpanded = !this.infoSidebarExpanded
			that.checkMobileNoOverflow()
		})
		EventBus.$on("UpgradeLicenseModal",(payload)=>{
			this.CloseModals()
			this.show.UpgradeLicenseModal = payload
		})
		//Meta Events
		EventBus.$on("metaEvent", (payload)=>{
			this.$store.dispatch("user/storeUserMeta", {key: payload.key, subKeys: payload.path, value: payload.value})
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
		DeployToolModal,
		CreateMediaAuditModal,
		AddUsersToLicenseModal,
		UpgradeLicenseModal,
		CreateColorSwatchModal,
		ColorContrastQuickToolModal
	}
}
</script>

<style scoped>

.canvas.audit-show{
	padding-top:0 !important;
}
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
	margin-right:24px;
}
#main-content.audit-show{
	margin-top:46px;
}

#main-content.info-sidebar-expanded{
	margin-right:200px;
	max-width: calc(100% - 200px);
}
#toolbar-container.search-bar-open + #main-content{
	margin-top:85px;
}

@media only screen and (min-width:320px) and (max-width:1024px){
	.info-sidebar{
		top:205px;
		max-height:calc(100vh - 205px);
	}
}

</style>