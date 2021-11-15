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
        EventBus.$on('MediaAudit/Complete', (data)=>{
          let pull_issues = (that.$route.name == 'MediaAuditShow' && that.$route.params.id == data.data) ? true : false;
          that.$store.dispatch("mediaAudits/getAudit", {id: this.$route.params.id, withIssues: pull_issues})
        })
    },
    beforeDestroy(){
      for(let i in this.$store.state.mediaAudits.intervals) {
        if(this.$store.state.mediaAudits.intervals[i]) clearInterval(this.$store.state.mediaAudits.intervals[i])
      }
      this.$store.dispatch("mediaAudits/resetState")
    },
    mounted() {
      
    },
    components: {
    },
}
</script>