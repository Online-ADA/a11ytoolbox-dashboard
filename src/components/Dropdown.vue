<template>
    <div class="dropdown relative">
        <a @click.prevent :class="['block whitespace-no-wrap no-underline ' +labelColor]" href="#">
            <slot name="label"></slot>
            <i v-if="!sub" class="fas fa-caret-down pl-1"></i>
        </a>
        <ul class="mt-0 hidden absolute top-full border border-gray-400 bg-white rounded whitespace-nowrap pt-1 pb-1">
            <template v-if="children">
                <li class="hover:bg-pallette-grey-light" v-for="(child, index) in children" :key="index">
                    <template v-if="child.type == 'anchor' || !child.type">
                        <A :to="child.to || '#'" @click.native.prevent class="hover:text-gray-500 block">
                            <span v-html="child.label"></span>
                        </A>
                    </template>
                    <template v-if="child.type == 'router-link'">
                        <router-link class="hover:text-gray-500 block" :to="child.to"><span v-html="child.label"></span></router-link>
                    </template>
                    <template v-if="child.type == 'dropdown'">
                        <Dropdown :sub="true" class="pt-1 px-5" :children="child.children">
                            <template v-slot:label><span v-html="child.label"></span>
                            <i class="fas fa-caret-right pl-1"></i></template>
                        </Dropdown>
                    </template>
                    <template v-if="child.type == 'logout'">
                        <A v-if="$store.getters['auth/isAuthenticated']" href="#" @click.native.prevent="$store.dispatch('auth/logout', $router)">Logout</A>
                        <A v-else href="#" @click.native.prevent="$store.dispatch('auth/login')">Log in</A>
                    </template>
                    <template v-if="child.type == 'account'">
                        <A href="#" @click.native.prevent="setAccount(child.to)">{{child.label}}</A>
                    </template>
                    <template v-if="child.type == 'client'">
                        <A href="#" @click.native.prevent="setClient(child.to)">{{child.label}}</A>
                    </template>
                </li>
            </template>
            <template v-else>
                <slot name="children"></slot>
            </template>
        </ul>
    </div>
</template>


<script>
/*
    Children: object containing information about the child nodes to display.
    type='anchor', 'router-link' OR 'dropdown'
    children = [
        {
            type : 'anchor',
            label : 'Manage',
            to : 'https://google.com'
        },
        {
            type : 'router-link',
            label: 'Homepage',
            to: {path: '/'}
        }
    ]
*/
import A from '../components/Link'
import admin from '../store/modules/admin'

    export default {
        props:[
            'children',
            'icon',
            'sub',
            'labelColor'
        ],
        name: 'Dropdown',
        components: {
            A,
        },
        methods:{
            setAccount(id){
                this.$store.commit("auth/setState", {key: "account", value: id})
                if( this.$store.getters["auth/isManager"] ){
                    if( this.$store.state.admin === undefined ){
                    this.$store.registerModule('admin', admin)
                    }
                    this.$store.dispatch("admin/getProjects", {router: this.$router, client_id: this.$store.state.clients.client.id})
                }else{
                    this.$store.unregisterModule("admin")
                }
            },

            setClient(id){
                this.$store.state.projects.project = false
                this.$store.dispatch("clients/getClient", {id: id})
            }
        },
    }
</script>
<style scoped>
    .dropdown:hover > ul{
        display:block !important;
    }
    .dropdown ul ul{
        left:95%;
        top: 0;
    }
    ul {
        z-index:99;
    }

    ul li {
        padding: 8px;
    }
    .right-align ul{
        right:0;
    }
    .left-align ul{
        left:0;
    }
</style>