<template>
    <div id="header-container" :class="{ 'menuOpen': menuOpen }" class="items-center flex w-full fixed px-4 py-2 bg-pallette-grey shadow-custom overflow-visible">
        <router-link class="block" :to="{path:'/'}"><img alt="Ally Toolbox by Online ADA" src="../assets/logo-toolbox.png" /></router-link>
        <button class="menu-button" :aria-label="[menuOpen ? 'close menu' : 'open menu']" @click="menuClick()"><i class="fas fa-bars fa-2x ml-2 cursor-pointer text-white" ></i></button>

        <div class="mb-auto mt-auto">
            <div role="button" tabindex="0" :aria-expanded="[ dropdownsExpanded.includes('client') ? 'true' : 'false' ]" @click.prevent="expandDropdown('client')" :class="{expanded: dropdownsExpanded.includes('client')}" class="dropdown-container dropdown-nolabel client-dropdown relative flex flex-col pl-8">
                <div v-if="$store.state.auth.user" class="flex items-center dropdown relative ml-5 mt-auto mb-auto transition-transform right-align">
                    <span @click.prevent class="block whitespace-no-wrap no-underline text-white" >
                        {{selectedClient}}
                    </span>
                    <i class="fas fa-caret-down pl-1 text-white"></i>
                </div>
                <ul class="mt-0 absolute border border-gray-400 bg-white whitespace-nowrap pt-1 pb-1">
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
        <div class="text-white capitalize">{{$store.state.projects.project.name}}</div>

        <div role="button" tabindex="0" @click.prevent="expandDropdown('manage')" :aria-expanded="[ dropdownsExpanded.includes('manage') ? 'true' : 'false' ]" v-if="$store.getters['auth/isManager']" :class="{expanded: dropdownsExpanded.includes('manage')}" class="text-center manager-dropdown dropdown-container dropdown-w-label relative flex flex-col ml-auto mr-10 items-end">
            <div id="manage" v-if="$store.state.auth.user" class="dropdown relative mx-auto mt-auto mb-auto transition-transform right-align">
                <span aria-labelledby="management-label" @click.prevent class="block whitespace-no-wrap no-underline text-white" href="#">
                    <i class="fas fa-tools"></i>
                </span>
            </div>
            <ul class="text-left mt-0 absolute border border-gray-400 bg-white whitespace-nowrap pt-1 pb-1">
                <li class="hover:bg-pallette-grey-light" v-for="(child, index) in manageDropdown" :key="index">
                    <template v-if="child.type == 'router-link'">
                        <router-link class="hover:text-gray-500 block" :to="child.to"><span v-html="child.label"></span></router-link>
                    </template>
                </li>
            </ul>
            <span id="management-label" class="sub-label text-white uppercase"><div>Manager</div>Settings</span>
        </div>

        <div role="button" tabindex="0" @click.prevent="expandDropdown('user')" :aria-expanded="[ dropdownsExpanded.includes('user') ? 'true' : 'false' ]" :class="[!$store.getters['auth/isManager'] ? 'ml-auto' : '', dropdownsExpanded.includes('user') ? 'expanded' : '']" class="dropdown-container dropdown-w-label relative flex flex-col items-end">
            <div id="login" v-if="$store.state.auth.user" class="dropdown relative ml-5 mt-auto mb-auto transition-transform right-align">
                <span @click.prevent class="block whitespace-no-wrap no-underline text-white" href="#">
                    {{$store.state.auth.user.first_name}}
                </span>
            </div>
            <ul class="mt-0 absolute border border-gray-400 bg-white whitespace-nowrap pt-1 pb-1">
                <li class="hover:bg-pallette-grey-light" v-for="(child, index) in userDropdown" :key="index">
                    <template v-if="child.type == 'router-link'">
                        <router-link class="hover:text-gray-500 block" :to="child.to"><span v-html="child.label"></span></router-link>
                    </template>
                    <template v-if="child.type == 'logout'">
                        <A href="#" @click.native.prevent="$store.dispatch('auth/logout', $router)">Logout</A>
                    </template>
                </li>
            </ul>
            
            <span class="sub-label text-white">{{account}}</span>
        </div>

        <router-link to="/user/profile"><img :src="user_avatar" class="avatar" /></router-link>
    </div>
</template>


<script>
import Dropdown from './Dropdown'
import A from './Link'

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
                {
                    type: 'router-link',
                    label: 'Accounts',
                    to: '/account'
                }
            ],
            manageDropdown: [
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
            menuOpen: true,
            dropdownsExpanded: []
        }
    },
    name: 'ada-header',
    mounted(){
        if( this.$store.state.auth.accounts !== false && this.$store.state.auth.accounts.length ){
            this.updateAccountName()
        }
    },
    computed: {
        account(){
            if( this.$store.state.auth.account && this.$store.state.auth.accounts.length ){
                return this.$store.state.auth.accounts.find(acc=>acc.id == this.$store.state.auth.account).name
            }
            return ""
        },
        getClients() {
            let clients = [];
            clients.push({
                type: "router-link", 
                label:"Create Client", 
                to:"/clients/create"
            })
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
        }
    },
    watch: {
        "$store.state.auth.accounts":function(newVal){
            if( newVal !== false && newVal.length ){
                this.updateAccountName()
            }
        }
    },
    methods: {
        expandDropdown(value){
            if( this.dropdownsExpanded.includes(value) ){
                let index = this.dropdownsExpanded.indexOf(value)
                this.dropdownsExpanded.splice(index, 1)
            }else{
                this.dropdownsExpanded.push(value)
            }
        },
        updateAccountName(){
            this.userDropdown[0].label = this.$store.state.auth.accounts.find(acc=>acc.id == this.$store.state.auth.account).name
        },
        menuClick() {
            this.menuOpen = !this.menuOpen;
            this.$root.$emit('menuClick', this.menuOpen );
        },
        setClient(id){
            this.$store.state.projects.project = false
            this.$store.dispatch("clients/getClient", {id: id})
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
}
#header-container .menu-button{
    margin-left:60px;
    width:40px;
}
#header-container .manager-dropdown .sub-label{
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
.dropdown-container.manager-dropdown ul{
    top:121%;
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
.dropdown-container.dropdown-w-label:not(.manager-dropdown ) ul  {
    top:145%;
}
.dropdown-container.dropdown-nolabel:not(.manager-dropdown ) ul {
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