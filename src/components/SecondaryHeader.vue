<template>
  <div class="flex w-full bg-white p-2 shadow-custom overflow-visible overflow-hidden shadow-custom">
      <h1>{{label}}</h1>
  </div>
</template>


<script>
import Dropdown from './Dropdown'

export default {
    props:{
        label: '',
    },
    data() {
        return {
        }
    },
    name: 'ada-secondary-header',
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

</style>