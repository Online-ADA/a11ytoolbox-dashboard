<template>
    <div :class="{'text-center': center, 'mx-1.5': gutters}" class="bg-white shadow-custom h-auto p-4 rounded-sm">
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