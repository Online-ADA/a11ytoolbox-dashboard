<template>
    <div id="toolbar" class="w-full bg-white p-2 shadow-custom fixed z-50">
        <div class="justify-between flex items-center" v-if="tool== 'audit'">
            <span class="w-auto text-sm">{{$store.state.audits.audit.domain.title}}</span>
            <span class="w-auto pr-2">
                <button class="pr-3.5" title="Edit Audit"><i class="far fa-edit"></i></button>
                <button class="pr-3.5" @click="$emit('exportClick')" title="Open Download Issues Modal"><i class="far fa-file-download"></i></button>
                <router-link class="pr-3.5" :to="{path: `/audits/${$store.state.audits.audit.id}`}" title="Import Issues to this audit"><i class="far fa-file-import"></i></router-link>
                <button title="Show Information Sidebar"><i class="far fa-info-circle"></i></button>
            </span>
        </div>
    </div>
</template>


<script>

export default {
    props:{
        tool: '',
    },
    data() {
        return {
        }
    },
    name: 'ada-canvas-toolbar',
    computed: {
        
    },
    methods: {
    },
    components:{
    },
    created() {
    },
}

</script>

<style scoped>
    #toolbar{
        width: calc(100% - 400px);
    }
</style>