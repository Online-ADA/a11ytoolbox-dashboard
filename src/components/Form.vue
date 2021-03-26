<template>
    <form :action="action" class="py-5 mx-auto" :class="{'w-full': fullWidth, 'w-2/3': !fullWidth}">
        <slot></slot>
    </form>
</template>


<script>
    export default {
        props:{
            'action': {
                type: String,
                default: '#'
            },
            'fullWidth': {
                type: Boolean,
                default: false
            }
        },
        name: 'Form',
        computed: {
        },
        components:{
        }
    }
</script>