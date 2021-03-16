<template>
  <div class="users container">
    <Loader></Loader>
    <h1>This is the Project Edit page</h1>
    <h2>Project: </h2>
  </div>
</template>

<script>
// import axios from 'axios'
import Loader from '../../../components/Loader'
export default {
    name: 'ManageProjectEdit',
    data(){
        return {
            userData: {
                role: false
            }
        }
    },
    computed: {
        loading() {
            return this.$store.state.admin.loading
        },
    },
    props: [],
    watch: {
    },
    methods: {
        
    },
    created() {
        
    },
    mounted() {
    },
    components: {
        Loader
    },
}
</script>
<style scoped>
    .list-group-item.active a,
    .list-group-item.active:hover a,
    .list-group-item.active:active a{
        color:white;
    }
</style>