<template>
    <router-view></router-view>
</template>

<script>
import {EventBus} from '../../services/eventBus'
export default {
    data: () => ({
    }),
    computed: {
    },
    props: [],
    watch: {
    },
    methods: {
    },
    created() {
        let that = this
        EventBus.$on('Audit/Automation/Complete', (data)=>{
          let pull_issues = (that.$route.name == 'AuditShow' && that.$route.params.id == data.data) ? true : false;
          that.$store.dispatch("audits/getAudit", {id: this.$route.params.id, withIssues: pull_issues})
        })
    },
    beforeDestroy(){
      for(let i in this.$store.state.audits.intervals) {
        if(this.$store.state.audits.intervals[i]) clearInterval(this.$store.state.audits.intervals[i])
      }
      this.$store.dispatch("audits/resetState")
    },
    mounted() {
      
    },
    components: {
    },
}
</script>