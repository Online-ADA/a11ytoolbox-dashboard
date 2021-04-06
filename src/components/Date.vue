<template>
    <input type="date" min="2018-01-01" @input="emitInput" class="shadow appearance-none bg-white border border-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-pallette-orange placeholder-gray-400 px-4 py-2 rounded text-base text-gray-700" >
</template>


<script>
    export default {
        methods:{
            emitInput(e){
                this.$emit('input', e.target.value)
            }
        },
        computed: {
        },
        components:{
        }
    }
</script>