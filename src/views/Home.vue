<template>
  <div class="home">
    <div class="auth-message" style="color:red">{{$store.state.auth.authMessage}}</div>
    <img alt="Vue logo" src="../assets/logo.png">
    <div v-if="$store.state.auth.user">
      <h2>Choose an Account:</h2>
      
        <div v-for="account in accountsWithRole" :key="'acct-'+account.id">
          <button @click="setAccount(account.id)">
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
      
    }
  }
}
</script>
