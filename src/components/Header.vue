<template>
  <div id="header-container" :class="{ 'menuOpen': menuOpen }" class="items-center flex w-full fixed px-4 py-2 bg-pallette-grey shadow-custom overflow-visible">
    <router-link class="block" :to="{path:'/'}"><img alt="Ally Toolbox by Online ADA" src="../assets/logo-toolbox.png" /></router-link>
    <button class="menu-button" :aria-label="[menuOpen ? 'close menu' : 'open menu']" @click="menuClick()"><i class="fas fa-bars fa-2x ml-2 cursor-pointer text-white" ></i></button>

    <div class="mb-auto mt-auto">
        <Dropdown :children="getClients" class="pl-8" labelColor="text-white"><template v-slot:label>{{selectedClient}}</template></Dropdown>
    </div>

    <div class="border mx-3 project-divider"></div>
    <div class="text-white capitalize">{{$store.state.projects.project.name}}</div>

    <!-- <button v-if="!$store.state.auth.user" v-bind:class="{ menuOpen: menuOpen }" id="login" class="login-button ml-auto my-auto block whitespace-no-wrap no-underline text-white" @click.prevent="$store.dispatch('auth/login')">Login</button> -->

   <Dropdown :sub="true" v-if="$store.getters['auth/isManager']" :children="manageDropdown" id="manage" class="ml-auto mt-auto mb-auto transition-transform right-align" labelColor="text-white" v-bind:class="{ menuOpen: menuOpen }">
       <template v-slot:label >
           <span aria-label="Management Dropdown">
               <i class="fas fa-tools"></i>
           </span>
        </template>
   </Dropdown>
   <div class="user-container relative flex flex-col ml-5 items-end">
        <div id="login" v-if="$store.state.auth.user" class="dropdown relative ml-5 mt-auto mb-auto transition-transform right-align">
            <a @click.prevent class="block whitespace-no-wrap no-underline text-white" href="#">
                {{$store.state.auth.user.first_name}}
            </a>
        </div>
        <ul class="mt-0 hidden absolute border border-gray-400 bg-white rounded whitespace-nowrap pt-1 pb-1">
            <li class="hover:bg-pallette-grey-light" v-for="(child, index) in userDropdown" :key="index">
                <template v-if="child.type == 'router-link'">
                    <router-link class="hover:text-gray-500 block" :to="child.to"><span v-html="child.label"></span></router-link>
                </template>
                <template v-if="child.type == 'logout'">
                    <A href="#" @click.native.prevent="$store.dispatch('auth/logout', $router)">Logout</A>
                </template>
            </li>
        </ul>
        <!-- <Dropdown :sub="true" v-if="$store.state.auth.user" :children="userDropdown" id="login" class="ml-5 mt-auto mb-auto transition-transform right-align" labelColor="text-white" v-bind:class="{ menuOpen: menuOpen }">
            <template v-slot:label >{{$store.state.auth.user.first_name}}</template>
        </Dropdown> -->
        <span class="account text-white">{{account}}</span>
   </div>
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
    },
    watch: {
        "$store.state.auth.accounts":function(newVal){
            if( newVal !== false && newVal.length ){
                this.updateAccountName()
            }
        }
    },
    methods: {
        updateAccountName(){
            this.userDropdown[0].label = this.$store.state.auth.accounts.find(acc=>acc.id == this.$store.state.auth.account).name
        },
        menuClick() {
            this.menuOpen = !this.menuOpen;
            this.$root.$emit('menuClick', this.menuOpen );
        },
    },
    components:{
        Dropdown,
        A
    },
    created() {},
}

</script>

<style scoped>

#header-container .project-divider{
    height: 35px;
    margin-top: auto;
    margin-bottom: auto;
}
#header-container {
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
#header-container .account{
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

#login.login-button{
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.user-container:hover ul{
    display:block !important;
}
.user-container .dropdown ul ul{
    left:95%;
    top: 0;
}
.user-container ul {
    z-index:99;
    top:130%;
}
.user-container ul:before{
    content: " ";
    position: absolute;
    height: 10px;
    display: block;
    width: 100%;
    top: -10px;
    left: 0;
    right: 0;
}

.user-container ul li {
    padding: 8px;
}
.user-container .right-align ul{
    right:0;
}

</style>