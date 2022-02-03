<template>
    <div id="header-container" :class="{ 'menuOpen': menuOpen }" class="items-center flex w-full fixed px-4 py-2 shadow-custom overflow-visible">
        <router-link class="block" :to="{path:'/'}"><img alt="Ally Toolbox by Online ADA" src="../assets/logo-toolbox.png" /></router-link>
        <button class="menu-button" :aria-label="[menuOpen ? 'close menu' : 'open menu']" @click="menuClick"><i class="fas fa-bars fa-2x ml-2 cursor-pointer text-white" ></i></button>

        <div class="flex items-center">
            <div class="mb-auto mt-auto">
                <div ref="clientDropdown" role="button" tabindex="0" :aria-expanded="[ dropdownsExpanded.includes('clientDropdown') ? 'true' : 'false' ]" @keyup.enter.space="expandDropdown('clientDropdown')" @click.prevent="expandDropdown('clientDropdown')" :class="{expanded: dropdownsExpanded.includes('clientDropdown')}" class="dropdown-container dropdown-nolabel client-dropdown relative flex flex-col pl-8">
                    <div v-if="$store.state.auth.user" class="flex items-center dropdown relative ml-5 mt-auto mb-auto transition-transform right-align">
                        <span @click.prevent class="block whitespace-no-wrap no-underline text-white" >
                            {{selectedClient}}
                        </span>
                        <i class="fas fa-caret-down pl-1 text-white"></i>
                    </div>
                    <ul class="mt-0 absolute border border-gray-400 bg-white whitespace-nowrap pt-1 pb-1">
                        <li>
                            <button @click.prevent="launchCreateClientModal">Create Client</button>
                        </li>
                        <li class="hover:bg-pallette-grey-light" v-for="(child, index) in getClients" :key="index">
                            <template v-if="child.type == 'router-link'">
                                <router-link class="hover:text-gray-500 block" :to="child.to"><span v-html="child.label"></span></router-link>
                            </template>
                            <template v-if="child.type == 'client'">
                                <A href="#" @click.native.prevent="setClient(child.to)">{{child.label}}</A>
                            </template>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="border mx-3 divider"></div>
            <div v-if="$store.state.projects.project" class="text-white capitalize">{{$store.state.projects.project.name}}</div>
        </div>
        <div ref="settingsDropdown" role="button" tabindex="0" @keyup.enter.space="expandDropdown('settingsDropdown')" @click.prevent="expandDropdown('settingsDropdown')" :aria-expanded="[ dropdownsExpanded.includes('settingsDropdown') ? 'true' : 'false' ]" :class="{expanded: dropdownsExpanded.includes('settingsDropdown')}" class="text-center settings-dropdown dropdown-container dropdown-w-label relative flex flex-col ml-auto mr-10 items-end">
            <div id="settings" v-if="$store.state.auth.user" class="dropdown relative mx-auto mt-auto mb-auto transition-transform right-align">
                <span aria-labelledby="management-label" @click.prevent class="block whitespace-no-wrap no-underline text-white" href="#">
                    <i class="fas fa-tools"></i>
                </span>
            </div>
            <ul class="text-left mt-0 absolute border border-gray-400 bg-white whitespace-nowrap pt-1 pb-1">
                <template v-if="isManager">
                    <li class="hover:bg-pallette-grey-light">
                        <router-link class="hover:text-gray-500 block" :to="'/manage/articles'">
                            <span>Success Criteria</span>
                        </router-link>
                    </li>
                    <li class="hover:bg-pallette-grey-light">
                        <router-link class="hover:text-gray-500 block" :to="'/manage/users'">
                            <span>Users</span>
                        </router-link>
                    </li>
                </template>
                <li>
                    <router-link :to="'/domains'" class="hover:text-gray-500 block"><span>Domains</span></router-link>
                </li>
                <li>
                    <router-link :to="'/automations/history'" class="hover:text-gray-500 block"><span>Automated Audits</span></router-link>
                </li>
            </ul>
            <span id="management-label" class="sub-label text-white uppercase">Settings</span>
        </div>

        <div ref="userDropdown" role="button" tabindex="0" @keyup.enter.space="expandDropdown('userDropdown')" @click.prevent="expandDropdown('userDropdown')" :aria-expanded="[ dropdownsExpanded.includes('userDropdown') ? 'true' : 'false' ]" :class="[dropdownsExpanded.includes('userDropdown') ? 'expanded' : '']" class="dropdown-container dropdown-w-label relative flex flex-col items-end">
            <div id="login" v-if="$store.state.auth.user" class="dropdown relative ml-5 mt-auto mb-auto transition-transform right-align">
                <span @click.prevent class="block whitespace-no-wrap no-underline text-white" href="#">
                    {{$store.state.auth.user.first_name}}
                </span>
            </div>
            <ul class="mt-0 absolute border border-gray-400 bg-white whitespace-nowrap pt-1 pb-1">
                <li class="hover:bg-pallette-grey-light" v-for="(child, index) in userDropdown" :key="index">
                    <template v-if="child.type == 'router-link'">
                        <router-link class="hover:text-gray-500 block" :to="GoToDropdown(child)"><span class="sm:text-right" v-html="child.label"></span></router-link>
                    </template>
                    <template v-if="child.type == 'logout'">
                        <A href="#" @click.native.prevent="$store.dispatch('auth/logout', $router)">Logout</A>
                    </template>
                </li>
            </ul>
            <span class="sub-label text-white">{{account}}</span>
        </div>

        <router-link aria-label="Go to user profile" :to="profileLink"><img alt="User Avatar" :src="user_avatar" class="avatar" /></router-link>
    </div>
</template>


<script>
import Dropdown from './Dropdown'
import A from './Link'
import { EventBus } from "../services/eventBus"

export default {
    props:{},
    data() {
        return {
            userDropdown: [
                {
                    type: 'logout',
                    label: 'Logout',
                    to: 'auth/logout'
                },
            ],
            menuOpen: true,
            dropdownsExpanded: []
        }
    },
    name: 'ada-header',
    mounted(){
    },
    computed: {
        account(){
            if( this.$store.getters['auth/account'] ){
                return this.$store.getters['auth/account'].name
            }
            return ""
        },
        getClients() {
            let clients = [];
            
            for ( let i = 0; i < this.$store.state.clients.all.length; i++ )
            {
                clients.push({ type: 'client', label: this.$store.state.clients.all[i].name, to: this.$store.state.clients.all[i].id })
            }
            return clients;
        },
        selectedClient() {
            if ( this.$store.state.clients.client )
                return this.$store.state.clients.client.name;
            return "Clients";
        },
        user_avatar(){
            if( this.$store.state.auth.user && this.$store.state.auth.user.meta != undefined ){
                if( this.$store.state.auth.user.meta.avatar != undefined && this.$store.state.auth.user.meta.avatar.url != undefined ){
                    return this.$store.state.auth.user.meta.avatar.url
                }
            }
            
            return require('../assets/user.gif')
        },
        isManager(){
            return this.$store.getters['auth/isManager']
        },
        profileLink() {
            return `/user/profile`
        },
    },
    watch: {
    },
    methods: {
        GoToDropdown(item) {
            return `/${item.to}`
        },
        launchCreateClientModal($ev){
            EventBus.openModal('createClientModal', document.querySelector(".client-dropdown"))
        },
        closeDropdown(value){
            let index = this.dropdownsExpanded.indexOf(value)
            this.dropdownsExpanded.splice(index, 1)
        },
        expandDropdown(value){
            if( this.dropdownsExpanded.includes(value) ){
                this.closeDropdown(value)
                return
            }else{
                this.dropdownsExpanded.push(value)
                EventBus.$emit("dropdown-expanded", {dropdown: value, ref: this.$refs[value]})
            }
        },
        updateAccountName(){
            if(this.account) this.userDropdown[0].label = this.account.name
        },
        menuClick() {
            this.menuOpen = !this.menuOpen;
            this.$root.$emit('menuClick', this.menuOpen );
        },
        setClient(id){
            this.$store.state.projects.project = false
            this.$store.dispatch("clients/getClient", {id: id, callback: (()=>{
                this.$router.push({
                    name: 'ClientShow',
                    params: {
                        id: id
                    }
                })
            })})
        }
    },
    mounted(){
        EventBus.$on("close-dropdown", (payload)=>{
            this.closeDropdown(payload.dropdown)
        })

        if( window.screen.width < 1024 ){
            this.menuOpen = false
        }
    },
    components:{
        Dropdown,
        A
    },
    created() {},
}

</script>

<style scoped>

#header-container .divider{
    height: 35px;
    margin-top: auto;
    margin-bottom: auto;
}
#header-container {
    z-index:70;
    height:60px;
    padding-right:16px;
    transition-property: padding;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    background-color:#004458;
}
#header-container .menu-button{
    margin-left:60px;
    width:40px;
}
#header-container .settings-dropdown .sub-label{
    font-size: 8px;
    line-height:1.2;
    letter-spacing: 0.5px;
}
#header-container .sub-label{
    font-size:10px;
    line-height:0.8;
}

.menu-button > i{
    margin:0;
    display:block;
}
img {
    height: 48px;
    image-rendering: -moz-crisp-edges;         /* Firefox */
    image-rendering:   -o-crisp-edges;         /* Opera */
    image-rendering: -webkit-optimize-contrast;/* Webkit (non-standard naming) */
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
}
img.avatar{
    width: 31px;
    height: 31px;
    margin-left: 10px;
    margin-top: 5px;
    clip-path: circle(50% at 50% 50%);
}

#login.login-button{
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.dropdown-container.expanded ul{
    display:block;
    animation-name: showDropdown;
}

/* .dropdown-container:focus ul,
.dropdown-container:hover ul{
    display:block;
    animation-name: showDropdown;
} */

.dropdown-container .dropdown ul ul{
    left:95%;
    top: 0;
}
.dropdown-container ul{
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    display:none;
    animation-duration: 150ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    animation-direction: forwards;
    z-index:99;
}
.dropdown-container.settings-dropdown ul{
    top:140%;
}
.dropdown-container:after{
    content: " ";
    position: absolute;
    display: block;
    width: 100%;
    left: 0;
    right: 0;
    height: 30px;
    top: 22px;
}
.dropdown-container.dropdown-w-label:not(.settings-dropdown ) ul  {
    top:145%;
}
.dropdown-container.dropdown-nolabel:not(.settings-dropdown ) ul {
    top:175%;
}
.dropdown-container ul li {
    padding: 8px;
}
.dropdown-container .right-align ul{
    right:0;
}

@keyframes showDropdown {
    0%{  opacity:0; }
    100%{ opacity: 1; }
}

</style>