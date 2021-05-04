<template>
    <div class="text-center mt-32 w-2/3 container mx-auto">
        <Loader v-if="loading"></Loader>

        <template v-if="!domains.length">
            There are no domains for this account. <A type="router-link" :to="{path: `/domains/create`}">Create one</A>
        </template>
        <template v-else>
            <h2>All Domains:</h2>
            <ul class="pb-4">
                <li v-for="(domain, id) in domains" :key="id">
                    <A type="router-link" :to="{path: `/domains/${domain.id}`}">{{domain.title}} - {{domain.url}}</A>
                </li>
            </ul>
            <A hoverText="text-white" class="bg-pallette-orange block border border-gray-300 duration-100 hover:bg-pallette-orange-dark p-2 rounded text-white transition-colors w-2/12" type="router-link" :to="{path: `/domains/create`}">New Domain</A>
        </template>
    </div>
</template>

<script>
import Loader from '../../../components/Loader'
import A from '../../../components/Link'

export default {
    data: () => ({}),
    computed: {
        loading(){
            return this.$store.state.admin.loading.domains
        },
        domains(){
            return this.$store.state.admin.domains
        }
    },
    props: [],
    watch: {},
    methods: {
        getDomains(){
            this.$store.dispatch("admin/getAllDomains")
        },
    },
    created() {
        this.getDomains()
    },
    mounted() {
      
    },
    components: {
      Loader,
      A,
    },
}
</script>