<template>
    <div id="toolbar-container" :class="{'search-bar-open': searchBarOpen}" class="fixed z-50 w-full h-12" v-if="showToolbar">
        <div id="toolbar" class="w-full pl-4 p-2 shadow-custom bg-white">
            <!-- Audit Toolbar -->
            <div class="flex items-center justify-between">
                <div class="flex items-center text-13">
                    <span v-if="audit.domain">
                        {{audit.domain.url}}
                        <template v-if="audit.domain.root">/{{audit.domain.root}}</template>
                    </span>
                    <template v-if="isAuditShowPage">
                        <div class="border border-black mx-3.5 divider"></div>
                        <span class="mr-3.5">Issues Selected: {{auditRowsSelected}}</span>
                        <span>Total Issues: {{totalRows}}</span>
                    </template>
                </div>
                <span class="w-auto mr-2 flex items-center">
                    <!-- <template>
                        Search Audit 
                        <button class="ml-3.5 bg-transparent" @click.prevent="searchBarOpen = !searchBarOpen">
                            <span title="Search Audit" ><i class="far fa-search"></i></span>
                        </button>
                        <div class="border border-black mx-3.5 divider"></div>
                    </template> -->
                    <!-- Audit Tools 
                    <button class="ml-3.5 bg-transparent" @click="$emit('showInfoSidebar')" title="Show Information Sidebar"><i class="far fa-info-circle"></i></button>
                    -->
                    <button class="ml-3.5 bg-transparent" @click="InitAudit">
                        <span title="Initiate an Automated Audit" ><i class="far fa-barcode-scan"></i></span>
                    </button>
                </span>
            </div>
        </div>
        <!--
        <div class="search-bar justify-end items-center flex w-full shadow-lg p-1 bg-white text-13" :class="{open: searchBarOpen}" >
            <label class="flex mx-5 items-center">
                <span class="pr-2">Search Column:</span>
                <select class="p-0 border-black border-l-0 border-r-0 border-t-0 shadow-none rounded-none" v-model="searchData.column" name="search-column">
                    <option v-for="(column, index) in searchColumns" :value="column.value" :key="'search-columns-'+index">{{column.display}}</option>
                </select>
            </label>
            <label for="search-criteria mr-5 items-center">
                <span class="pr-2">Keyword:</span>
                <input class="px-1 border border-black border-l-0 border-r-0 border-t-0" style="max-height:39px;font-size:12px;" v-model="searchData.term" name="search-criteria" />
            </label>
            
            <button class="ml-5 standard" @click.prevent="toolbarEmit('audit-search')" >Submit</button>
            <button title="Close Search Bar" class="ml-3.5 mr-5 standard" @click.prevent="searchBarOpen = false" >X</button>
        </div>
        -->
    </div>
    
</template>


<script>
import Checkbox from "../Checkbox.vue"
// import { EventBus } from '../../services/eventBus'

export default {
    props:{
        tool: '',
    },
    data() {
        return {
            toggled: [],
            issueStatus: false,
            auditRowsSelected: 0,
            auditFilteredRows: 0,
            searchBarOpen: false,
            searchData: {
                term: "",
                column: 'issue_number',
                caseSensitive: false
            },
            searchColumns: [
                {
                    value: "issue_number",
                    display: "Issue Number"
                },
                {
                    value: "pages",
                    display: "Pages"
                },
                {
                    value: "status",
                    display: "Status"
                },
                {
                    value: "target",
                    display: "Target"
                },
                {
                    value: "levels",
                    display: "Levels"
                },
                {
                    value: "articles",
                    display: "Success Criteria"
                },
                {
                    value: "techniques",
                    display: "Techniques"
                },
                {
                    value: "descriptions",
                    display: "Descriptions"
                },
                {
                    value: "recommendations",
                    display: "Recommendations"
                },
                {
                    value: "audit_states",
                    display: "Audit States"
                },
                {
                    value: "auditor_notes",
                    display: "Auditor Notes"
                },
                {
                    value: "essential_functionality",
                    display: "Essential Functionality"
                },
            ],
            issueStatuses: [
                "New",
                "Resolved",
                "Partly Resolved",
                "Remains",
                "Regression",
                "Best Practice",
                "Third party problem",
                "Resolved by removal",
                "Usability Problem",
                "Duplicate",
            ]
        }
    },
    name: 'ada-canvas-toolbar',
    mounted(){
    },
    watch:{
        // searchBarOpen: function(newVal){
        //     if( newVal ){
        //         this.auditFilteredRows = this.audit.issues.length
        //     }
        //     if( !newVal ){
        //         this.auditFilteredRows = 0
        //         this.toolbarEmit('audit-search')
        //     }
        //     this.$emit('updateclasses',{'search-bar-open':newVal})
        // },
        // issueStatus:function(newVal, oldVal){
        //     if( oldVal !== false && newVal !== false && newVal !== oldVal ){
        //         EventBus.$emit('toolbarEmit', {action: 'audit-issue-status-change', data: newVal})
        //     }
        // }
    },
    computed: {
        audit(){
            return this.$store.state.mediaAudits.audit
        },
        totalRows(){
            if( this.showToolbar && this.audit ){
                if( this.searchBarOpen ){
                    return this.auditFilteredRows
                }
                if( this.audit.issues && this.audit.issues.length ){
                    return this.audit.issues.length
                }
                return 0
            }
        },
        isAuditEditPage(){
            return this.$route.name === "AuditEdit"
        },
        isAuditShowPage(){
            return this.$route.name === "AuditShow"
        }
    },
    methods: {
        InitAudit() {
            this.$store.dispatch('mediaAudits/InitAudit',{audit_id: this.audit.id, vm: this})
        },
        showToolbar(){
            return this.tool.type === 'media-audit' && this.audit
        },
        // toolbarEmit(action){
        //     let data = null
        //     if( action=='audit-condense' ){
        //         this.toggle(action)
        //     }
        //     if( action=='audit-search' ){
        //         if( this.searchBarOpen ){
        //             data = this.searchData
        //             action='audit-search-open'
        //         }
        //         if( !this.searchBarOpen ){
        //             action='audit-search-close'
        //         }
        //     }
        //     EventBus.$emit('toolbarEmit', {action: action, data: data})
        // },
        // toggle(data){
        //     if(this.toggled.includes(data)){
        //         let index = this.toggled.indexOf(data)
        //         this.toggled.splice(index, 1)
        //         return
        //     }
        //     if( !this.toggled.includes(data) ){
        //         this.toggled.push(data)
        //         return
        //     }
            
        // }
    },
    components:{
        Checkbox
    },
    created() {
    },
}

</script>

<style scoped>    
    #toolbar .search-bar button{ font-size:14px; }
    #toolbar .divider{
        height: 30px;
        margin-top: auto;
        margin-bottom: auto;
    }
    #toolbar{
        z-index:10;
        position:relative;
    }
    .search-bar{
        height:35px;
        z-index:0;
        position:relative;
        display:none;
        animation-duration: 150ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        animation-direction: forwards;
    }
    .search-bar.open{
        display:flex;
        animation-name: showSearchbar;
    }
    .text-13, .text-13 *{
        font-size:13px;
    }
    @keyframes showSearchbar{
        0%{ top:-35px; }
        100%{ top:0px; }
    }
</style>