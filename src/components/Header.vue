<template>
  <div class="flex w-full px-4 py-2 bg-pallette-grey shadow-custom overflow-visible overflow-hidden" style="margin-left: 200px">
      
      <i class="fas fa-bars fa-2x ml-2 cursor-pointer text-white" @click="menuClick()" ></i>

    <div v-if="accountsWithRole.length" class=" mr-auto mb-auto mt-auto">
        <Dropdown  :children="accountDropdown" class="pl-8" labelColor="text-white"><template v-slot:label>Account</template></Dropdown>
    </div>

   <Dropdown  :children="logoutDropdown" id="login" class="ml-auto mt-auto mb-auto transition-transform" labelColor="text-white" v-bind:class="{ menuOpen: menuOpen }">
       <template v-if="$store.state.auth.user.first_name" v-slot:label >{{$store.state.auth.user.first_name}}</template>
       <template v-else v-slot:label >Login</template>
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
        }
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
    },
}

</script>

<style scoped>

#login {
    transform: translateX(-200px);
}

#login.menuOpen {
    transform: translateX(-400px);
}

</style>