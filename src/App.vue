<template>
  <div id="app">
    <div id="nav" class="d-flex align-items-center justify-content-center">
      <router-link class="nav-link" to="/">Home</router-link>
      <span >|</span>
      <template v-if="$store.getters['auth/isManager']">
        <router-link class="nav-link" to="/manage">Manage</router-link>
        <span>|</span>
      </template>
      <a v-if="$store.getters['auth/isAuthenticated']" class="nav-link" href="#" @click.stop.prevent="$store.dispatch('auth/logout', $router)">Logout</a>
      <a v-else class="nav-link" href="#" @click.stop.prevent="$store.dispatch('auth/login')">Log in</a>
      <span v-if="$store.state.auth.account"><span class="pr-3">|</span>Account: {{$store.getters["auth/account"]}}</span>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
