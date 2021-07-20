<template>
    <select :value="value" @input="$emit('input', $event.target.value)" class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-blue p-2 rounded shadow">
        <option :value="option[valueProp] || option" v-for="(option, index) in options" :key="index">{{option[displayProp] || option}}</option>
    </select>
</template>

<script>
    export default {
        props: {
            options: {
                type: Array,
                required: true,
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
                defaultVal : ""
            };
        },
        methods: {
            
        },
        name: 'Select',
        mounted() {
            if( !this.value && this.options.length ){
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
            "options": function(newVal){
                if( newVal.length ){
                    let emitMe = "";
                    if( this.options.length > 0 && this.options[0][this.valueProp] ){
                        emitMe = this.options[0][this.valueProp]
                    }else{
                        emitMe = this.options[0]
                    }
                    this.$emit("input", emitMe);
                }
            }
        }
    }
</script>