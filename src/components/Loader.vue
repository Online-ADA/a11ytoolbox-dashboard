<template>
    <div class="loader-container position-absolute top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center">
        <i class="fas fa-circle-notch fa-spin fs-1"></i>
    </div>
</template>

<script>
    export default {
        name: 'Loader',
    }
</script>
<style scoped>
    .fa-circle-notch{
        /* font-size:50px; */
        color:white;
    }
    .loader-container{
        background-color: rgba(0, 0, 0, .6);
        z-index:10;
    }
</style>