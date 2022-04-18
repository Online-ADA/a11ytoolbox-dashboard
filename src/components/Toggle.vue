<template>
    <label class="label pt-0 switch flex items-center">
        <input v-model="checked" @change="$emit('changed', checked)" type="checkbox">
        <span :class="{ 'text-normal': fontSize == 'normal', 'text-[12px]' : fontSize == 'small' }" class="subheadline">{{labelLeft}}</span>
        <span :class="{'checked':checked}" class="slider round mx-3"></span>
        <span :class="{ 'text-normal': fontSize == 'normal', 'text-[12px]' : fontSize == 'small' }" class="subheadline">{{labelRight}}</span>
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
            fontSize:{
                type: String,
                default: "normal"
            },
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
        mounted(){
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
        width: 35px;
        height: 20px;
        display:block;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 12px;
        width: 12px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .15s;
        transition: .15s;
    }

    .slider.checked:before {
        -webkit-transform: translateX(15px);
        -ms-transform: translateX(15px);
        transform: translateX(15px);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 34px;
    }

    .slider.round:before {
        border-radius: 50%;
    }
</style>