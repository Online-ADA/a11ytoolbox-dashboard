<template>
    <div class="absolute bg-black bg-opacity-60 bottom-0 flex items-center justify-center left-0 right-0 text-6xl top-0">
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
        color:white;
    }
    .loader-container{
        background-color: rgba(0, 0, 0, .6);
        z-index:10;
    }
</style>