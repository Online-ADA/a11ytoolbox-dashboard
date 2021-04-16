<template>
  <div id="app" class="container mx-auto">
    <notifications/>
    <div id="nav" class="flex place-content-center p-2 items-center">
      <router-link class="hover:text-gray-500" to="/">Home</router-link>
      <span class="px-2">|</span>
      <template v-if="$store.getters['auth/isManager']">
        <Dropdown :children="manageDropdown"><template v-slot:label>Manage</template></Dropdown>
        <span class="px-2">|</span>
      </template>
      <template v-if="$store.getters['auth/isAuthenticated'] && !!$store.state.auth.account">
        <Dropdown :children="siteDropdown"><template v-slot:label>Site</template></Dropdown>
        <span class="px-2">|</span>
      </template>
      
      <A v-if="$store.getters['auth/isAuthenticated']" href="#" @click.native.prevent="$store.dispatch('auth/logout', $router)">Logout</A>
      <A v-else href="#" @click.native.prevent="$store.dispatch('auth/login')">Log in</A>
      
      <span v-if="account"><span class="px-2">|</span>Account: {{account}}</span>
    </div>
    <router-view/>
  </div>
</template>

<script>
import A from './components/Link'
import Dropdown from './components/Dropdown'
export default {
  data(){
    return {
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
          label: 'Articles',
          to: '/manage/articles'
        },
      ],
      siteDropdown: [
        {
          type: 'dropdown',
          label: 'Projects',
          children: [
            {
              type: 'router-link',
              label: 'My Projects',
              to: '/projects/list'
            },
            {
              type: 'router-link',
              label: 'Create',
              to: '/projects/create'
            },
          ]
        },
        {
          type: 'dropdown',
          label: 'Domains',
          children: [
            {
              type: 'router-link',
              label: 'My Domains',
              to: '/domains/list'
            },
            {
              type: 'router-link',
              label: 'Create',
              to: '/domains/create'
            },
          ]
        },
        {
          type: 'dropdown',
          label: 'Audits',
          children: [
            {
              type: 'router-link',
              label: 'My Audits',
              to: '/audits/list'
            },
            {
              type: 'router-link',
              label: 'Create',
              to: '/audits/create'
            },
          ]
        }
      ]
    }
  },
  computed: {
    account(){
      return this.$store.getters["auth/account"]
    }
  },
  components:{
    A,
    Dropdown
  }
}
</script>