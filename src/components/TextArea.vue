<template>
    <textarea :value="value" @input="emitInput" class="shadow appearance-none bg-white border border-gray-300 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-pallette-blue placeholder-gray-400 px-4 py-2 rounded text-base text-gray-700"></textarea>
</template>


<script>
    export default {
        data(){
            return {
                content: this.value
            }
        },
        props:[
            'auto',
            'value'
        ],
        methods:{
            emitInput(e){
                this.$emit('input', e.target.value)
            }
        },
        computed: {
            autocomplete(){
                if( !this.auto ){
                    return 'off'
                }

                return this.auto
            }
        },
        components:{
        }
    }
</script>