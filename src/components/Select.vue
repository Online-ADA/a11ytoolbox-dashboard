<template>
    <select :value="value" @input="$emit('input', $event.target.value)" class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-orange p-2 rounded shadow">
        <option :name="option[displayProp] || option" :value="option[valueProp] || option" v-for="(option, index) in options" :key="index">{{option[displayProp] || option}}</option>
    </select>
    <!-- <div v-else 
        class="custom-select rounded relative w-full text-left h-10 leading-10 outline-none focus:ring-1 ring-pallette-orange my-3" 
        :tabindex="tabindex" 
        @blur="open = false"
    >
        <div class="selected bg-pallette-grey-dark text-white rounded pl-4 cursor-pointer select-none border-pallette-orange" 
        :class="{ open: open, 'rounded-b-none border-b': open }" 
        @click="open = !open">
        {{ selected[displayProp] || selected }}
        </div>
        <ul class="items text-white rounded-b overflow-hidden border border-t-0 absolute bg-pallette-grey-dark left-0 right-0 z-10 border-pallette-orange" :class="{ 'hidden': !open }">
            <li
                class="text-white pl-4 cursor-pointer select-none hover:bg-pallette-orange"
                v-for="(option, i) of options"
                :key="i"
                @click="
                    selected = option[displayProp] || option;
                    open = false;
                    $emit('input', option[valueProp] || option);
                "
            >
                {{ option[displayProp] != undefined ? option[displayProp] : option }}
            </li>
        </ul>
    </div> -->
</template>
<style scoped>
    .selected:after{
        position: absolute;
        content: "";
        top: 20px;
        right: 1em;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-color: #fff transparent transparent transparent;
    }
</style>

<script>
    export default {
        props: {
            // custom: {
            //     type: Boolean,
            //     default: false
            // },
            options: {
                type: Array,
                required: true,
            },
            default: {
                type: String,
                required: false,
                default: null,
            },
            tabindex: {
                type: Number,
                required: false,
                default: 0,
            },
            displayProp: {
                type: String,
                default: "name"
            },
            valueProp: {
                type: String,
                default: "value"
            },
            value:{},
        },
        data() {
            return {
                selected: this.default
                    ? this.default
                    : this.options.length > 0
                    ? this.options[0]
                    : null,
                open: false,
                defaultVal : ""
            };
        },
        name: 'Select',
        mounted() {
            // if( this.custom ){
            //     this.$emit("input", this.selected[this.valueProp] || this.selected);
            // }
            if( !this.custom && !this.value ){
                if( this.options.length > 0 && this.options[0][this.valueProp] ){
                    this.defaultVal = this.options[0][this.valueProp]
                }else{
                    this.defaultVal = this.options[0]
                }
                this.$emit("input", this.defaultVal);
            }
        },
        computed: {},
        watch: {
            // "options": function(){
            //     if( !this.custom ){
            //         let emitMe = "";
            //         if( this.options.length > 0 && this.options[0][this.valueProp] ){
            //             emitMe = this.options[0][this.valueProp]
            //         }else{
            //             emitMe = this.options[0]
            //         }
            //         this.$emit("input", emitMe);
            //     }
            // }
        }
    }
</script>