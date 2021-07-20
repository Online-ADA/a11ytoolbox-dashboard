<template>
    <div class="container mx-auto flex justify-center items-center flex-col">
        {{sheetMessage}}
        <template v-if="projects.length">
            <template v-if="canCreateProjects">
                <!-- there are projects to choose from -->
                <h1 class="mt-32 mb-3">Let's start by either creating a new project</h1>
                <Button @click.native.prevent="showSheet(0)" color="red" hover="true">Create a Project</Button>
                <h2 class="my-3">or selecting from an existing one</h2>
            </template>
            <template v-else>
                <h1 class="mt-32 mb-3">Choose a project to get started</h1>
            </template>
            <select aria-label="Select an existing project" v-model="sheetData['sheet0'].project" class="mb-3" name="project">
                <option :value="project.id" v-for="(project) in projects" :key="'project-' + project.id">{{project.name}}</option>
            </select>
            <Button @click.native.prevent="showSheet(1)" color="red" hover="true">Continue</Button>
        </template>
        <template v-else>
            <!-- there are no projects -->
            <template v-if="canCreateProjects">
                <!-- you can create projects -->
                <h1 class="mt-32 mb-3">It looks like you don't have any projects yet. Lets start by making one</h1>
                <Button @click.native.prevent="showSheet(0)" color="red" hover="true">Create a Project</Button>
            </template>
            <template v-else>
                <!-- you cannot create projects -->
                You have not been assigned to any projects, and you are not currently permitted to create them. Please see an account manager
            </template>
        </template>
        
        <Sheets @initialized="setInitialData" @message="displayMessage" @sheetComplete="handleSheetComplete" ref="sheets" :sheets="sheets" :sheetData="sheetData"></Sheets>
    </div>
</template>

<script>
    import Sheets from '../../components/Sheets'
    import Button from '../../components/Button'
    import admin from '../../store/modules/admin'
    import projects from '../../store/modules/project'
    import audits from '../../store/modules/audits'
    import domains from '../../store/modules/domains'
    
    export default {
        name: "AuditCreate",
        data(){
            return {
                sheetMessage: "",
                sheets: [
                    {
                        component: 'ProjectCreate',
                        back: false, //false closes the sheets
                        next: 1,
                    },
                    {
                        component: 'DomainCreate',
                        requires: {
                            sheet: 0,
                            key: "project"
                        },
                        back: 0,
                        next: 2,
                    },
                    {
                        component: 'SitemapCreate',
                        requires: {
                            sheet: 1,
                            key: "domain"
                        },
                        back: 1,
                        next: 3,
                    },
                    {
                        component: 'AuditCreate',
                        back: 2,
                        next: false,
                        requires: {
                            key: "sample",
                            sheet: 2
                        }
                    },
                ],
                sheetData: {
                    "sheet0": {
                        project: false
                    },
                    "sheet1":{
                        domain: false
                    },
                    "sheet2":{
                        sample: false
                    }
                },
            }
        },
        watch: {
            "$store.state.admin.projects": function(newVal){
                if( newVal ){
                    if( !this.sheetData["sheet0"].project && newVal.length ){
                        this.sheetData["sheet0"].project = newVal[0].id
                    }
                }
            },
            "$store.state.projects.all": function(newVal){
                if( newVal ){
                    if( !this.sheetData["sheet0"].project  && newVal.length){
                        this.sheetData["sheet0"].project = newVal[0].id
                    }
                }
            },
            isManager(){
                this.getProjects()
            }
        },
        computed:{
            projects(){
                if( this.isManager && this.$store.state.admin ){
                    return this.$store.state.admin.projects
                }
                if( this.$store.state.projects ){
                    return this.$store.state.projects.all
                }
                return []
            },
            isManager(){
                return this.$store.getters["auth/isManager"]
            },
            canCreateProjects(){
                if( Object.values(this.$store.state.auth.accountsPermissions).length ){
                    return this.$store.state.auth.accountsPermissions[this.$store.state.auth.account].projects.write || this.isManager
                }
                return false
            },
        },
        mounted(){
            this.getProjects()
        },
        created(){
            if( this.$store.state.admin === undefined ){
                this.$store.registerModule('admin', admin)
            }
            if(this.$store.state.projects === undefined){
                this.$store.registerModule('projects', projects)
            }
            if(this.$store.state.audits === undefined){
                this.$store.registerModule('audits', audits)
            }
            if(this.$store.state.domains === undefined){
                this.$store.registerModule('domains', domains)
            }
        },
        methods: {
            setInitialData(data){
                this.$store.dispatch("projects/getAssignable", {vm: data.instance})
            },
            getProjects(){
                if( this.$store.getters["auth/isManager"] && this.$store.state.admin ){
                    this.$store.dispatch("admin/getProjects")
                }else{
                    this.$store.dispatch("projects/getProjects")
                }
                if( this.$route.params.id ){
                    this.sheetData["sheet0"].project = this.$route.params.id
                    this.showSheet(1)
                }
            },
            displayMessage(message){
                this.sheetMessage = message
            },
            showSheet(sheet){
                this.sheets[sheet].back = false
                this.$refs.sheets.goForward(this.sheets[sheet], sheet)
            },
            handleSheetComplete(sheet){
                if( sheet == "sheet0" ){
                    this.$store.dispatch("admin/getProjects")
                    this.$store.dispatch("projects/getProjects")
                }
            }
        },
        components: {
            Sheets,
            Button
        }
    }
</script>

