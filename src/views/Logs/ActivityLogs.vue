<template>
  <div class="flex flex-col">
    <Loader v-if="loading"></Loader>
    <div v-else class="">
        Logs
    </div>
  </div>
</template>

<script>
import Loader from '../../components/Loader'

export default {
    data: ()=>({
    }),
    computed: {
        loading() {
          return false
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
      document.title = "License Activity Logs"
    },
    components: {
      Loader,
    },
}
</script>