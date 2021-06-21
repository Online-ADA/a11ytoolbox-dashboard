<template>
    <fragment>
        <!-- <div :class="['sheet-overlay']"></div> -->
        <div :style="[left, transitionDelay]" class="sheet relative">
            <div class="flex justify-between">
                <Button class="absolute left-2 top-8" @click.native.prevent="$emit('previous', index)">&#60;</Button>
                <Button class="absolute right-2 top-8" @click.native.prevent="$emit('next', index)">&#62;</Button>
            </div>
            <slot></slot>
        </div>
    </fragment>
</template>


<script>
    import { Fragment } from 'vue-fragment'
    import Button from '../components/Button'
    export default {
        props:[
            "index",
            "showing",
            "req"
        ],
        data(){
            return {
                
            }
        },
        methods: {
            initShow(){
                if( !this.req ) return
                let hasProp1 = Object.prototype.hasOwnProperty.call(this.$parent.sheetData, "sheet" + this.req.sheet)
                let hasProp2 = Object.prototype.hasOwnProperty.call(this.$parent.sheetData["sheet" + this.req.sheet], this.req.key)
                if( !hasProp1 || !hasProp2 ){
                    this.$parent.showing = false
                    this.$emit('message', 'Sheet ' + (this.index + 1) + ' requires a ' + this.req.key + " from sheet" + (this.req.sheet + 1) + " but didn't get it.")
                }
            }
        },
        name: 'Sheet',
        computed: {
            show(){
                return parseInt(this.showing) === parseInt(this.index)
            },
            left(){
                if( this.show ){
                    return {
                        left: '0', 
                        'z-index':'20',
                        'box-shadow': '0 0 10px -5px rgb(0 0 0 / 20%), 0 0 24px 2px rgb(0 0 0 / 14%), 0 0 30px 5px rgb(0 0 0 / 12%)'
                    }
                }
                return {
                    left: '100%'
                }
            },
            transitionDelay(){
                if( this.showing !== false ){
                    if( this.show ){
                        return {'transition-delay': '0s, .2s'}
                    }else{
                        return {'transition-delay': '.5s, .2s'}
                    }
                }

                return {'transition-delay': '0s, .2s'}
            }
        },
        mounted(){
            
        },
        components:{
            Fragment,
            Button
        }
    }
</script>
<style scoped>
    .sheet{
        background: #f1f3f4;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 10;
        flex-direction: column;
        display: flex;
        flex-wrap: nowrap;
        transition: left .4s;
        /* transition-delay: 0s, .4s; */
    }
    /* .sheet-overlay{
        opacity: .32;
        transition: all .4s;
        background: #000;
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
        visibility: hidden;
        z-index: 10;
    } */
</style>