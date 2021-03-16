<template>
  <div class="home">
    <div class="danger">{{message}}</div>
    <img alt="Vue logo" src="../assets/logo.png">
    <div v-if="$store.state.auth.user">
      <h2>Choose an Account:</h2>
      
        <div v-for="account in accountsWithRole" :key="'acct-'+account.id">
          <button class="btn btn-secondary my-1" @click="setAccount(account.id)">
          <div>{{account.name}}</div>
          <small>Roles:</small>
          <span v-for="(role, id) in $store.state.auth.accountsRoles[account.id]" :key="'role'+id">{{role}}<template v-if="id !== $store.state.auth.accountsRoles[account.id].length - 1">,</template></span>
          
          <!-- <small>Permissions</small>
          <ul>
            <li v-for="(permissions, entity) in $store.state.auth.accountsPermissions[account.id]" :key="'perm'+entity"><strong>{{entity}}</strong>:
              <ul>
                <li v-for="(perm, id) in permissions" :key="'entity'+id">{{id}} - {{perm}}</li>
              </ul>
            </li>
          </ul> -->
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data(){
    return {
      message: ""
    }
  },
  methods:{
    setAccount(id){
      this.$store.commit("auth/setState", {key: "account", value: id})
    }
  },
  computed: {
    accountsWithRole(){
      var that = this;
      
      return this.$store.state.auth.accounts.filter( (acc)=>{
        return Object.keys(that.$store.state.auth.accountsRoles).includes(acc.id.toString())
      } )
      
    },
    // authMessage(){
    //   if( this.$store.state.auth.authMessage ){
    //     this.message = this.$store.state.auth.authMessage
    //     this.$store.state.auth.authMessage = ""
    //     return this.message
    //   }

    //   return this.message
    // }
  },
  watch:{
    "$store.state.auth.authMessage": {
      handler: function(newVal){
        this.message = newVal
        this.$store.state.auth.authMessage = ""
      }
    }
  }
}
</script>
