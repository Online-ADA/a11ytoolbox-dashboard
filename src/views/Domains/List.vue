<template>
    <div class="text-center mt-32 container mx-auto">
        <Loader v-if="loading"></Loader>
        
        <template v-if="project">
            <h2>All Domains for {{project.name}}</h2>
            <ul class="flex flex-col items-center" v-if="domains.length">
                <li class="flex items-center" v-for="(domain, id) in domains" :key="id">
                    <span class="mr-3">{{domain.url}}</span>
                    <A class="block" type="router-link" :to="{path: `/domains/${domain.id}/edit`}">
                        <span class="sr-only">Edit Domain {{domain.url}}</span>
                        <i class="far fa-pencil"></i>
                    </A>
                </li>
            </ul>
        </template>
    </div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'

export default {
    data: () => ({}),
    computed: {
        loading(){
            return this.$store.state.domains.loading
        },
        domains(){
            return this.$store.state.projects.project ? this.$store.state.projects.project.domains : false
        },
        project(){
            return this.$store.state.projects.project
        }
    },
    props: [],
    watch: {},
    methods: {
        
    },
    created() {
    },
    mounted() {},
    components: {
      Loader,
      A,
    },
}
</script>