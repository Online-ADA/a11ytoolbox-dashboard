<template>
    <label :class="display" class="label"><slot></slot></label>
</template>


<script>
    export default {
        props:{
            stacked: {
                type: Boolean,
                default: true
            },
        },
        name: 'Label',
        computed: {
            display(){
                if( this.stacked ){
                    return 'flex flex-col'
                }

                return 'block'
            },
        },
    }
</script>