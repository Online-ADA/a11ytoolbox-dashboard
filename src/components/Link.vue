<template>
    <router-link v-if="getType == 'router-link'" :class="getHoverColor" class="transition-colors duration-100" :to="href"><slot></slot></router-link>
    <a v-else :class="getHoverColor" class="transition-colors duration-100" :href="href" :target="target"><slot></slot></a>
</template>


<script>
    export default {
        props: {
            to: {},
            newTab: {},
            type: {},
            hoverText: {
                type: String,
                default: 'text-gray-500'
            },
        },
        name: 'Link',
        computed: {
            getType(){
                if( this.type == 'router-link' ){
                    return 'router-link'
                }
                
                return 'a'
            },
            target(){
                if( this.newTab ){
                    return '_blank'
                }

                return false
            },
            href(){
                if( this.to ){
                    return this.to
                }

                return "#"
            },
            getHoverColor(){
                return "hover:"+this.hoverText
            }
        }
    }
</script>