<template>
    <div :class="{'text-center': center, 'mx-1.5': gutters}" class="border border-pallette-grey h-auto p-4 rounded">
        <slot></slot>
    </div>
</template>


<script>
    export default {
        props:{
            center: {
                type: Boolean,
                default: true
            },
            gutters: {
                type: Boolean,
                default: true
            }
        },
        name: 'Card',
        computed: {
        },
        components:{
        }
    }
</script>