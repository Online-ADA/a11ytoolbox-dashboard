<template>
  <div>Authenticating...</div>
</template>

<script>


export default {
  name: 'Auth',
  created(){
    
    let that = this
    let params = (new URL(document.location)).searchParams;

    console.log("TOKEN", params.get('oada_auth'));
    let the_redirect = params.get('oada_redirect')
    if(!the_redirect || the_redirect == '' || the_redirect == '?') the_redirect = '/';
    if(params.get('oada_auth') && params.get('oada_auth') != ''){
        this.$store.dispatch('auth/setToken',{
            token: params.get('oada_auth'),
            token_expire: params.get('oada_token_expire'),
            redirect: the_redirect,
            router: that.$router,
        })
    }

    if(!params.get('oada_auth') || params.get('oada_auth') == ''){
        // that.$router.push({path: '/'})
    }
  }
}
</script>
