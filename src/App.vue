<template>
  <div id="app">
    <notifications/>
    <div id="nav" class="flex items-center relative z-30 w-full">
      <div class="w-1/3"></div>
      <div class="flex place-content-center w-1/3 box-border py-1">
        <router-link class="hover:text-gray-500 pl-4" to="/">Home</router-link>
        <span class="px-2" aria-hidden="true">|</span>
        <template v-if="$store.getters['auth/isManager']">
          <Dropdown  :children="manageDropdown"><template v-slot:label>Manage</template></Dropdown>
          <span class="px-2" aria-hidden="true">|</span>
        </template>
        <template v-if="$store.getters['auth/isAuthenticated'] && !!$store.state.auth.account">
          <Dropdown :children="siteDropdown"><template v-slot:label>Site</template></Dropdown>
          <span class="px-2" aria-hidden="true">|</span>
        </template>
        
        <A v-if="$store.getters['auth/isAuthenticated']" href="#" @click.native.prevent="$store.dispatch('auth/logout', $router)">Logout</A>
        <A v-else href="#" @click.native.prevent="$store.dispatch('auth/login')">Log in</A>
        
        <span v-if="account"><span aria-hidden="true" class="px-2">|</span>Account: {{account}}</span>
      </div>
      <div class="w-1/3"></div>
    </div>
    <Modal class="z-50" :open="showLoginPrompt">
      <div class="bg-white px-4 pt-5 pb-4 p-6">
          <Btn aria-label="Close refresh session modal" @click.native.prevent="showLoginPrompt = false" class="absolute top-4 right-4" hover="true" color="white">X</Btn>
          <h2 class="text-center pb-3">Your session is about to expire</h2>
      </div>
      <div class="bg-gray-50 px-4 py-3 flex">
          <button @click.prevent="refreshSession" type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-orange hover:text-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto">
            Refresh Session
          </button>
          <button @click.prevent="showLoginPrompt = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto">
            Close
          </button>
      </div>
    </Modal>
    <router-view/>
  </div>
</template>

<script>
import A from './components/Link'
import Dropdown from './components/Dropdown'
import Modal from './components/Modal'
import Btn from './components/Button'

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
          label: 'Success Criteria',
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
        },
        {
          type: 'router-link',
          label: 'Scan History',
          to: '/scan/history'
        },
        // {
        //   type: 'dropdown',
        //   label: 'Scan',
        //   children: [
        //     {
        //       type: 'router-link',
        //       label: 'Start New',
        //       to: '/scan/new'
        //     },
        //     {
        //       type: 'router-link',
        //       label: 'My History',
        //       to: '/scan/list'
        //     },
        //   ]
        // }
      ]
    }
  },
  methods:{
    refreshSession(){
      this.$store.dispatch('auth/resetToken', this.$router.history.current.path)
    },
  },
  computed: {
    account(){
      return this.$store.getters["auth/account"]
    },
    showLoginPrompt:{
      get(){
        return this.$store.state.auth.showLoginPrompt
      },
      set(val){
        this.$store.commit("auth/setState", {key: 'showLoginPrompt', value: val})
      }
    },
  },
  components:{
    A,
    Dropdown,
    Modal,
    Btn
  }
}
</script>