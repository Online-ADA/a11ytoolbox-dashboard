<template>
    <div class="container mx-auto flex justify-center items-center flex-col">
        {{sheetMessage}}
        <template v-if="projects.length">
            
            <!-- there are projects to choose from -->
            <h1 class="mt-32 mb-3">Let's start by either creating a new project</h1>
            <button @click.prevent="showSheet(0)" class="standard">Create a Project</button>
            <h2 class="my-3">or selecting from an existing one</h2>
            
            <select aria-label="Select an existing project" v-model="sheetData['sheet0'].project" class="mb-3" name="project">
                <option :value="project.id" v-for="(project) in projects" :key="'project-' + project.id">{{project.name}}</option>
            </select>
            <button class="standard" @click.prevent="showSheet(1)" >Continue</button>
        </template>
        <template v-else>
            <h1 class="mt-32 mb-3">It looks like you don't have any projects yet. Lets start by making one</h1>
            <button @click.prevent="showSheet(0)" class="standard">Create a Project</button>
        </template>
        
        <Sheets @initialized="setInitialData" @message="displayMessage" @sheetComplete="handleSheetComplete" ref="sheets" :sheets="sheets" :sheetData="sheetData"></Sheets>
    </div>
</template>

<script>
    import Sheets from '../../components/Sheets'
    
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
                    if( !this.sheetData["sheet0"].project && newVal.length){
                        this.sheetData["sheet0"].project = newVal[0].id
                    }
                }
            },
            // isManager(){
            //     this.getProjects()
            // }
        },
        computed:{
            projects(){
                return this.$store.state.projects.all
            },
            isManager(){
                return this.$store.getters["auth/isManager"]
            },
        },
        mounted(){
            this.sheetData["sheet0"].project = this.$store.state.projects.project.id
        },
        created(){
        },
        methods: {
            setInitialData(data){
                if( !this.$store.state.user.all.length ){
                    this.$store.dispatch("user/getUsers", {vm: data.instance})
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
                // if( sheet == "sheet0" ){
                //     this.$store.dispatch("projects/getProjects")
                // }
            }
        },
        components: {
            Sheets,
        }
    }
</script>
<style>
    #sidebar.sidebarOpen ~ #content .sheet-holder .sheet{
        margin-left:200px;
        width:calc(100vw - 200px);
    }
    #sidebar.sidebarOpen.subSidebarExpanded ~ #content .sheet-holder .sheet{
        margin-left:400px;
        width:calc(100vw - 400px);
    }
</style>
