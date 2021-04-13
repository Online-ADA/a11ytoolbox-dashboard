<template>
    <div class="text-center mt-32">
        <Loader v-if="loading"></Loader>

        <template v-if="projects.length">
            <Label for="choose_product">Select a project</Label>
            <Select id="choose_product" class="mx-auto mb-3" @input="getProjectDomains" :options="projects" v-model="selectedProject" :valueProp="'id'" :displayProp="'name'"></Select>
        </template>
        <template v-else>
            There are no projects for this account. <A type="router-link" :to="{path: `/projects/create`}">Create one</A>
        </template>

        <template v-if="selectedProject">
            <h2>Domains for {{project.name}}:</h2>
            <ul v-if="domains.length">
                <li v-for="(domain, id) in domains" :key="id">
                    <A class="block" type="router-link" :to="{path: `${domain.id}`}">{{domain.title}} - {{domain.url}}</A>
                </li>
            </ul>
        </template>
        <template v-if="!loading && !domains.length && project">
            <div class="my-3">There are no domains for {{project.name}}. <A type="router-link" :to="{path: `/domains/create`}">Create one</A></div>
        </template>
        <template v-if="!loading && !domains.length && !project">
            <div>Please choose a project</div>
        </template>
    </div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
import Select from '../../components/Select'
import Label from '../../components/Label'

export default {
    data: () => ({
        selectedProject: false
    }),
    computed: {
        loading(){
            return this.$store.state.domains.loading
        },
        projects() {
            return this.$store.state.domains.projects
        },
        project(){
            return this.$store.state.domains.projects.find( p=>p.id == this.selectedProject )
        },
        domains(){
            return this.$store.state.domains.all
        }
    },
    props: [],
    watch: {
        "$store.state.auth.user": function(newVal){
            if( newVal ){
                this.$store.dispatch("domains/getProjects")
            }
        }
    },
    methods: {
        getProjectDomains(){
            this.$store.dispatch("domains/getProjectDomains", {project_id: this.selectedProject})
        }
    },
    created() {
    },
    mounted() {
        if( this.$store.state.auth.user ){
            this.$store.dispatch("domains/getProjects")
        }
    },
    components: {
      Loader,
      A,
      Select,
      Label
    },
}
</script>