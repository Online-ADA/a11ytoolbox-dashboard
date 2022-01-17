<template>
    <div class="flex flex-col">
        <div class="flex justify-evenly pb-3 xs:flex-wrap sm:flex-nowrap">
            <label>
                <span class="pr-2">Search {{display}}:</span>
                <TextInput v-model="search" :placeholder="placeholder"></TextInput>
            </label>
            <div v-if="displayProps.length && displayProps.length > 1" class="flex">
                <Button class="mx-1" :style="[prop == display ? activeStyle : '']" :class="[prop == display ? activeClass : '']" @click.native.prevent="changeDisplay(prop)" v-for="(prop, index) in displayProps" :key="index" :hover="true">{{prop}}</Button>
            </div>
        </div>
        <div style="max-height:500px" class="flex w-full flex-wrap justify-center overflow-auto">
            <component :is="tag"
            @click="sendEmit(item)"
            :href="href(item)"
            :target="target"
            style="transition:transform .15s ease-in-out, z-index .15s ease-in-out" 
            :class="[ display != 'description' ? 'justify-center' : '', hoverEffect == 'grow' ? growClasses : '' ]" 
            class="cursor-pointer bg-white my-2 p-2.5 rounded relative z-0 flex flex-col items-center border list-item-custom border-gray-300 shadow mx-1"
            v-for="(item, index) in filteredList" 
            :key="index">
                <div class="text-large text-pallette-grey-dark">{{item[display]}}</div>
                
                <div v-if="showDescription" v-html="item.description" class="text-small text-pallette-grey-dark"></div>
            </component>
        </div>     
    </div>
</template>

<style>
    .list-item-custom{
        max-height:150px;
        overflow-y:auto;
        width:30%;
    }
    .list-item:hover{
        z-index:10;
    }
</style>
<script>

import A from '../components/Link'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
export default {
    props: {
        dataSendBack: {},
        items:{
            type: Array,
            default: function(){
                return []
            }
        },
        showDescription: {
            type: Boolean,
            default: false
        },
        displayProps: {
            type: Array,
            default: function(){
                return []
            }
        },
        hoverEffect: {
            type: String,
            default: ''
        },
        linkOptions: {
            type: Object,
            default: function(){
                return {
                    isLink: false
                }
            }
        }
    },
    data(){
        return {
            search: '',
            display: '',
            activeClass:'bg-pallette-blue',
            activeStyle: {
                color: 'white !important'
            },
            growClasses: [
                'hover:scale-110',
                'transform',
            ]
        }
    },
    methods: {
        sendEmit(item){
            this.$emit( 'click', {item: item, extra: this.dataSendBack} )
        },
        href(item){
            return this.linkOptions.isLink ? item[this.linkOptions.urlProp] : false
        },
        changeDisplay(prop){
            this.display = prop
        },
        getDefaultDisplayProp(){
            if( !this.displayProps.length ){
                for( let i in this.items[0] ){
                    if( i == "title" ){
                        this.display = i
                    }else if( i == "name" ){
                        this.display = i
                    }
                }

                if( this.display == '' ){
                    this.display = Object.keys(this.items[0])[0]
                }
            }
            else{
                this.display = this.displayProps[0]
            }
        }
    },
    mounted(){
        if( this.items.length ){
            this.getDefaultDisplayProp()
        }
    },
    watch:{
        items(newVal){
            if( newVal ){
                this.getDefaultDisplayProp()
            }
        }
    },
    computed: {
        tag(){
            return this.linkOptions.isLink ? "a" : "button"
        },
        target(){
            return this.linkOptions.isLink && this.linkOptions.newTab ? '_blank' : false
        },
        filteredList() {
            if( this.display ){
                return this.items.filter( item => {
                    let temp = new String(item[this.display]) //Necessary in case this.display is "id"
                    return temp.toLowerCase().includes( this.search.toLowerCase() )
                })
            }
            return []
        },
        placeholder(){
            switch(this.display){
                case "title":
                    return 'Non-text...'
                case "description":
                    return 'Captions...'
                case "number":
                    return "4.1..."
            }

            return '';
        }
    },
    components: {
        A,
        Button,
        TextInput
    }
}
</script>