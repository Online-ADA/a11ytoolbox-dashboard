<template>
    <input type="file" @change="handleFileChange" >
</template>

<script>
export default {
    data(){
        return {}
    },
    props: [],
    computed: {

    },
    methods: {
        handleFileChange(e){
            this.$emit('input', e.target.files[0])
        }
    },
    watch:{}
}
</script>