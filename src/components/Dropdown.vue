<template>
    <div class="dropdown relative">
        <a @click.prevent class="block whitespace-no-wrap no-underline" href="#">
            <slot name="label"></slot>
            <i v-if="!sub" class="fas fa-caret-down pl-1"></i>
        </a>
        <ul class="mt-0 hidden absolute top-full border border-gray-400 bg-white rounded whitespace-nowrap pt-1 pb-1">
            <template v-if="children">
                <li class="hover:bg-pallette-grey-light" v-for="(child, index) in children" :key="index">
                    <template v-if="child.type == 'anchor' || !child.type">
                        <A :to="child.to || '#'" @click.native.prevent class="hover:text-gray-500 block pt-1 px-5">
                            <span v-html="child.label"></span>
                        </A>
                    </template>
                    <template v-if="child.type == 'router-link'">
                        <router-link class="hover:text-gray-500 pt-1 px-5 block" :to="child.to"><span v-html="child.label"></span></router-link>
                    </template>
                    <template v-if="child.type == 'dropdown'">
                        <Dropdown :sub="true" class="pt-1 px-5" :children="child.children">
                            <template v-slot:label><span v-html="child.label"></span>
                            <i class="fas fa-caret-right pl-1"></i></template>
                        </Dropdown>
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
    export default {
        props:[
            'children',
            'icon',
            'sub'
        ],
        name: 'Dropdown',
        components: {
            A,
        }
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
</style>