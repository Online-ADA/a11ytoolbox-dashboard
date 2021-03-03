<template>
  <div>Authenticating...</div>
</template>

<script>


export default {
  name: 'Auth',
  created(){
        let that = this
        let params = (new URL(document.location)).searchParams;
        let the_redirect = params.get('oada_redirect')
        if(!the_redirect || the_redirect == '' || the_redirect == '?') the_redirect = '/';
        if(params.get('oada_token') && params.get('oada_token') != ''){
            this.$store.dispatch('auth/setToken',{
                token: params.get('oada_token'),
                redirect: the_redirect,
                router: that.$router,
            })
        }
        if(!params.get('oada_token') || params.get('oada_token') == ''){
            console.log("is this firing?");
            that.$router.push({path: '/'})
        }
  }
}
</script>
