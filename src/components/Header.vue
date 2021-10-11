<template>
  <div id="header-container" :class="{ 'menuOpen': menuOpen }" class="flex w-full px-4 py-2 bg-pallette-grey shadow-custom overflow-visible">
      
    <button :aria-label="[menuOpen ? 'close menu' : 'open menu']" @click="menuClick()"><i class="fas fa-bars fa-2x ml-2 cursor-pointer text-white" ></i></button>

    <div class=" mr-auto mb-auto mt-auto">
        <Dropdown :children="getClients" class="pl-8" labelColor="text-white"><template v-slot:label>{{selectedClient}}</template></Dropdown>
    </div>

    <button v-if="!$store.state.auth.user" v-bind:class="{ menuOpen: menuOpen }" id="login" class="login-button ml-auto my-auto block whitespace-no-wrap no-underline text-white" @click.prevent="$store.dispatch('auth/login')">Login</button>

   <Dropdown v-if="$store.getters['auth/isManager']" :children="manageDropdown" id="manage" class="ml-auto mt-auto mb-auto transition-transform right-align" labelColor="text-white" v-bind:class="{ menuOpen: menuOpen }">
       <template v-slot:label >
           <span aria-label="Management Dropdown">
               <i class="fas fa-tools"></i>
           </span>
        </template>
   </Dropdown>
   <Dropdown v-if="$store.state.auth.user" :children="logoutDropdown" id="login" class="ml-5 mt-auto mb-auto transition-transform right-align" labelColor="text-white" v-bind:class="{ menuOpen: menuOpen }">
       <template v-slot:label >{{$store.state.auth.user.first_name}}</template>
   </Dropdown>
  </div>
</template>


<script>
import Dropdown from './Dropdown'
import A from './Link'

export default {
    props:{
        
    },
    data() {
        return {
            logoutDropdown: [
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
    computed: {
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
        selectedAccount: function(newVal) {
            if ( this.account != this.selectedAccount )
            {
                if ( this.$store.state.clients.client ){
                    this.$store.dispatch("clients/getClient", {id: -1, vm: this})
                }
            }
            
            if( newVal ){
                this.$store.dispatch("clients/getClients")
            }
            
        },
    },

    methods: {
        menuClick() {
            this.menuOpen = !this.menuOpen;
            this.$root.$emit('menuClick', this.menuOpen );
        },
    },
    components:{
        Dropdown,
        A
    },
    created() {
        if( this.selectedAccount ){
            // this.$store.dispatch("clients/getClients");
            this.account = this.selectedAccount;
        }
    },
}

</script>

<style scoped>

#header-container.menuOpen{ padding-right:216px; }
#header-container {
    padding-right:16px;
    transition-property: padding;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

#login.login-button{
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

</style>