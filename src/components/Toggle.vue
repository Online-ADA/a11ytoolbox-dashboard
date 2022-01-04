<template>
    <label class="switch flex items-center">
        <input v-model="checked" @change="$emit('changed', checked)" type="checkbox">
        <span class="font-bold">{{labelLeft}}</span>
        <span :class="{'checked':checked}" class="slider round mx-3"></span>
        <span class="font-bold">{{labelRight}}</span>
    </label>
</template>


<script>
    export default {
        data(){
            return {
                checked: this.value
            }
        },
        props:{
            value: {
                type: Boolean,
                default: false
            },
            labelLeft: {
                type: String,
                default: ''
            },
            labelRight: {
                type: String,
                default: ''
            },
        },
        methods:{
            
        },
        computed: {
            
        },
        components:{
        }
    }
</script>
<style scoped>
    .switch {
        position: relative;
    }

    .switch input { 
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: relative;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgb(0, 68, 88);
        -webkit-transition: .15s;
        transition: .15s;
        width: 50px;
        height: 26px;
        display:block;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .15s;
        transition: .15s;
    }

    .slider.checked:before {
        -webkit-transform: translateX(24px);
        -ms-transform: translateX(24px);
        transform: translateX(24px);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 34px;
    }

    .slider.round:before {
        border-radius: 50%;
    }
</style>