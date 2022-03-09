<template>
    <div :class="[{'adjust-with-sidebars':!local},'loader-container fixed bg-black bg-opacity-60 bottom-0 flex items-center justify-center left-0 right-0 text-6xl top-0 z-50']">
        <i class="fas fa-circle-notch fa-spin fs-1"></i>
    </div>
</template>

<script>
    export default {
        name: 'Loader',
        props:{
            'local': {
                type: Boolean,
                default: false,
            },
        },
    }
</script>
<style scoped>
    .fa-circle-notch{
        color:white;
    }
    .sidebarOpen.subSidebarOpen ~ #content .loader-container{
        left:200px;
    }
</style>