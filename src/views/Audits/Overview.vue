<template>
    <Card class="w-1/2">

      <h1>Audit Overview page for {{audit.title}}</h1>
      
    </Card>
</template>

<script>
import Card from "../../components/Card"

export default {
    data: () => ({
    }),
    computed: {
        audit(){
            return this.$store.state.audits.all.find(a=>a.id == this.$route.params.id)
        }
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
        Card,
    },
}
</script>