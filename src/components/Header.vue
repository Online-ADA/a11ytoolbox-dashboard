<template>
  <div id="header-container" :class="{ 'menuOpen': menuOpen }" class="flex w-full px-4 py-2 bg-pallette-grey shadow-custom overflow-visible">
      
    <button :aria-label="[menuOpen ? 'close menu' : 'open menu']" @click="menuClick()"><i class="fas fa-bars fa-2x ml-2 cursor-pointer text-white" ></i></button>
    
    <div v-if="accountsWithRole.length" class=" mr-auto mb-auto mt-auto">
        <Dropdown :children="accountDropdown" class="pl-8 left-align" labelColor="text-white"><template v-slot:label>{{selectedAccountName}}</template></Dropdown>
    </div>

    <div v-if="getClients.length && $store.getters['auth/isAuthenticated']" class=" mr-auto mb-auto mt-auto">
        <Dropdown :children="getClients" class="pl-8" labelColor="text-white"><template v-slot:label>{{selectedClient}}</template></Dropdown>
    </div>

    <button v-if="!$store.state.auth.user" v-bind:class="{ menuOpen: menuOpen }" id="login" class="login-button ml-auto my-auto block whitespace-no-wrap no-underline text-white" @click.prevent="$store.dispatch('auth/login')">Login</button>

   <Dropdown v-if="$store.state.auth.user" :children="logoutDropdown" id="login" class="ml-auto mt-auto mb-auto transition-transform right-align" labelColor="text-white" v-bind:class="{ menuOpen: menuOpen }">
       <template v-slot:label >{{$store.state.auth.user.first_name}}</template>
   </Dropdown>
  </div>
</template>


<script>
import Dropdown from './Dropdown'

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
            ], 
            menuOpen: true,
            account: false,
        }
    },
    name: 'ada-header',
    computed: {
        accountsWithRole(){
            var that = this;
            
            return this.$store.state.auth.accounts.filter( (acc)=>{
                return Object.keys(that.$store.state.auth.accountsRoles).includes(acc.id.toString())
            } )
        },

        accountDropdown() {
            var accounts = [];
            for ( var i = 0; i < this.accountsWithRole.length; i++ )
            {
                accounts.push({ type: 'account', label: this.accountsWithRole[i].name, to: this.accountsWithRole[i].id })
            }

            return accounts;
        },

        getClients() {
            var clients = [];
            for ( var i = 0; i < this.$store.state.clients.all.length; i++ )
            {
                clients.push({ type: 'client', label: this.$store.state.clients.all[i].name, to: this.$store.state.clients.all[i].id })
            }
            return clients;
        },
        selectedAccount() {      
            if ( this.$store.state.auth.account )
                return this.$store.state.auth.account;
            return false;
        },
        selectedAccountName() {      
            if ( this.$store.state.auth.account )
                return this.accountsWithRole.find(({ id }) => id == this.$store.state.auth.account ).name
            return "Accounts";
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
                if ( this.$store.state.clients.client )
                    this.$store.dispatch("clients/getClient", {id: -1, vm: this})
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
    },
    created() {
        if( this.selectedAccount ){
            this.$store.dispatch("clients/getClients");
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