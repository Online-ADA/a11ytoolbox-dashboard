<template>
  <div class="flex flex-col items-center justify-center container mx-auto">
    <Loader v-if="$store.state.clients.loading"></Loader>

    <Card class="w-1/2">
        <h1>Choose your account</h1>
        <h2 class="text-lg">Currently selected: {{ currentAccount.name }}</h2>
        <div class="flex flex-col items-center">
            <div v-for="account in accountsWithRole" :key="'acct-'+account.id">
                
                <Button :hover="true" class="my-1 border border-black rounded p-2" color="white" @click="setAccount(account.id)">
                    <div class="font-bold">{{account.name}}</div>
                    <small class="pr-1">Roles:</small>
                    <span v-for="(role, id) in $store.state.auth.accountsRoles[account.id]" :key="'role'+id">{{role}}<template v-if="id !== $store.state.auth.accountsRoles[account.id].length - 1">,</template></span>
                </Button>
            </div>
        </div>
    </Card>
    
  </div>
</template>

<script>
import Dropdown from '../components/Dropdown'
import Card from '../components/Card'
import Loader from '../components/Loader'
import admin from '../store/modules/admin'

export default {
    name: 'ChangeAccount',
    created(){

    },
    methods:{
        setAccount(id){
            this.$store.commit("auth/setState", {key: "account", value: parseInt(id)})
            this.$store.dispatch("clients/getClients")
        },
    },
    computed:{
        accountsWithRole(){
            var that = this;
            //Return the accounts where the key of the accountsRoles includes the ID of the current account
            
            let accountsRoles = Object.keys(that.$store.state.auth.accountsRoles)
            return this.$store.state.auth.accounts.filter( (acc)=>{
                return accountsRoles.includes(acc.id.toString())
            })
        },
        currentAccount(){
            let id = this.$store.state.auth.account
            return this.$store.state.auth.accounts.find( x=>x.id == id) || {name:""}
        }
    },
    components:{
        Dropdown,
        Card,
        Loader
    }
}
</script>