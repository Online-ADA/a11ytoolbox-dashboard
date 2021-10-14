<template>
  <div id="header-container" :class="{ 'menuOpen': menuOpen }" class="items-center flex w-full px-4 py-2 bg-pallette-grey shadow-custom overflow-visible">
    <img src="../assets/logo-toolbox.png" />
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
   <div class="flex flex-col ml-5">
        <Dropdown :sub="true" v-if="$store.state.auth.user" :children="userDropdown" id="login" class="ml-5 mt-auto mb-auto transition-transform right-align" labelColor="text-white" v-bind:class="{ menuOpen: menuOpen }">
            <template v-slot:label >{{$store.state.auth.user.first_name}}</template>
        </Dropdown>
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
            if( this.$store.getters["auth/isManager"] ){
                clients.push({
                    type: "router-link", 
                    label:"Create Client", 
                    to:"/manage/clients/create"
                })
            }
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

</style>