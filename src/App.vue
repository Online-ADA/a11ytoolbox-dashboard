<template>
  <div id="app">
    <div id="nav" class="d-flex align-items-center justify-content-center">
      <router-link class="nav-link" to="/">Home</router-link>
      <span>|</span>
      <template v-if="$store.getters['auth/isManager']">
        <div class="dropdown nav-item">
          <a href="#" @click.prevent class="dropdown-toggle nav-link" id="manage_dropdown" aria-expanded="false">
            Manage
          </a>
          <ul class="dropdown-menu" aria-labelledby="manage_dropdown">
            <li><router-link class="nav-link dropdown-item" to="/manage">Dashboard</router-link></li>
            <li><router-link class="nav-link dropdown-item" to="/manage/users">Users</router-link></li>
            <li><router-link class="nav-link dropdown-item" to="/manage/projects">Projects</router-link></li>
          </ul>
        </div>
        <span>|</span>
      </template>
      <template v-if="$store.getters['auth/isAuthenticated'] && !!$store.state.auth.account">
        <div class="dropdown nav-item">
          <a @click.prevent href="#" class="nav-link dropdown-toggle" id="site_dropdown" aria-expanded="false">
            Site
          </a>
          <ul class="dropdown-menu" aria-labelledby="site_dropdown">
            <li>
              <div class="btn-group dropend nav-item">
                <a href="#" @click.prevent class="nav-link dropdown-toggle" aria-expanded="false">
                  Projects
                </a>
                <ul class="dropdown-menu">
                  <li><router-link class="nav-link dropdown-item" to="/projects">List</router-link></li>
                  <li><router-link class="nav-link dropdown-item" to="/projects/create">Create</router-link></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <span>|</span>
      </template>
      
      <a v-if="$store.getters['auth/isAuthenticated']" class="nav-link" href="#" @click.stop.prevent="$store.dispatch('auth/logout', $router)">Logout</a>
      <a v-else class="nav-link" href="#" @click.stop.prevent="$store.dispatch('auth/login')">Log in</a>
      <span v-if="$store.state.auth.account"><span class="pe-3">|</span>Account: {{$store.getters["auth/account"]}}</span>
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
.nav-item:hover > .dropdown-menu{
  display:block;
}
</style>
