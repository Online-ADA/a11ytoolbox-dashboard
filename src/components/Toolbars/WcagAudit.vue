<template>
    <div id="toolbar-container" :class="{'search-bar-open': searchBarOpen}" class="fixed z-50 w-full h-12" v-if="showToolbar">
        <div id="toolbar" class="w-full pl-4 p-2 shadow-custom bg-white">
            <!-- Audit Toolbar -->
            <div class="flex items-center justify-between">
                <div class="flex items-center text-13">
                    <span v-if="audit.domain">{{audit.domain.url}}</span>
                    <template v-if="isAuditShowPage">
                        <div class="border border-black mx-3.5 divider"></div>
                        <span class="mr-3.5">Issues Selected: {{auditRowsSelected}}</span>
                        <span>Total Issues: {{totalRows}}</span>
                    </template>
                </div>
                <span class="w-auto mr-2 flex items-center">
                    <template v-if="isAuditShowPage">
                        <!-- Issue Tools -->
                        <select title="Change Selected Issue's Status" class="text-13 border-l-0 border-r-0 border-t-0 border-black shadow-none rounded-none" v-model="issueStatus" v-if="auditRowsSelected === 1 && !audit.locked" >
                            <option :value="status" v-for="(status, index) in issueStatuses" :key="'toolbarStatus-'+index">{{status}}</option>
                        </select>
                        
                        <!-- Edit Issue -->
                        <button v-if="auditRowsSelected === 1 && !audit.locked" class="ml-3.5 bg-transparent" @click.prevent="toolbarEmit('audit-edit-issue')">
                            <span title="Edit Issue" ><i class="far fa-file-edit"></i></span>
                        </button>
                        <!-- Copy Issue -->
                        <button v-if="auditRowsSelected === 1 && !audit.locked" class="ml-3.5 bg-transparent" @click.prevent="toolbarEmit('audit-copy-issue')">
                            <span title="Copy Issue" ><i class="far fa-copy"></i></span>
                        </button>
                        <!-- Delete Selected Issue -->
                        <button v-if="auditRowsSelected > 1 && !audit.locked" class="ml-3.5 bg-transparent" @click.prevent="toolbarEmit('audit-delete-many')">
                            <span title="Delete All Selected Issues" ><i class="far fa-minus-hexagon"></i></span>
                        </button>
                        <!-- Add Issue -->
                        <button v-if="auditRowsSelected < 1 && !audit.locked" class="ml-3.5 bg-transparent" @click.prevent="toolbarEmit('audit-add-issue')">
                            <span title="Add Issue" ><i class="far fa-plus-square"></i></span>
                        </button>
                        <!-- Locked Icon -->
                        <span title="This Audit is Locked and Cannot be Modified" v-if="audit.locked"><i class="fas fa-lock" aria-hidden="true"></i></span>
                        <!-- Condense Table -->
                        <button class="ml-3.5 bg-transparent" @click.prevent="toolbarEmit('audit-condense')">
                            <span title="Compress Table" v-if="!toggled.includes('audit-condense')"><i class="far fa-compress-alt"></i></span>
                            <span title="Decompress Table" v-else><i class="fas fa-expand-alt"></i></span>
                        </button>
                        <!-- Search Audit -->
                        <button class="ml-3.5 bg-transparent" @click.prevent="searchBarOpen = !searchBarOpen">
                            <span title="Search Audit" ><i class="far fa-search"></i></span>
                        </button>
                        <div class="border border-black mx-3.5 divider"></div>
                    </template>
                    <!-- Audit Tools -->
                    <router-link :to="{path: `/audits/${audit.id}/edit`}" title="Audit Settings"><i class="far fa-cog"></i></router-link>
                    <button class="ml-3.5 bg-transparent" @click="toolbarEmit('audit-issues-download')" title="Open Download Issues Modal"><i class="far fa-file-download"></i></button>
                    <router-link class="ml-3.5" :to="{path: `/audits/${audit.id}/import`}" title="Import Issues to This Audit"><i class="far fa-file-import"></i></router-link>
                    <router-link class="ml-3.5" :to="{path: `/scan/${$route.params.id}/new`}" title="Initiate an Automated Audit"><i class="far fa-barcode-scan"></i></router-link>

                    <button title="Mark Audit Complete" v-if="!audit.locked" class="ml-3.5" @click="toolbarEmit('audit-complete')"><i class="fas fa-lock-open-alt"></i></button>
                    <button title="Create Next Audit" v-if="audit.locked && audit.number > 0 < 3" class="ml-3.5" @click="toolbarEmit('audit-next')"><i class="far fa-hand-point-right"></i></button>
                    <button class="ml-3.5 bg-transparent" @click="$emit('showInfoSidebar')" title="Show Information Sidebar"><i class="far fa-info-circle"></i></button>
                </span>
            </div>
        </div>
        <div class="search-bar justify-end items-center flex w-full shadow-lg p-1 bg-white text-13" :class="{open: searchBarOpen}" >
            <!-- <label class="flex items-center">
                <span class="pr-1">Case Sensitive:</span>
                <Checkbox v-model="searchData.caseSensitive"></Checkbox>
            </label> -->
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
    </div>
    
</template>


<script>
import Checkbox from "./Checkbox.vue"
import { EventBus } from '../services/eventBus'

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
        if( this.audit.number > 1 ){
            this.searchColumns.push({
                value: "second_audit_comments",
                display: "Second Audit Comments"
            })
        }
        if( this.audit.number > 2 ){
            this.searchColumns.push({
                value: "third_audit_comments",
                display: "Third Audit Comments"
            })
        }
    },
    watch:{
        searchBarOpen: function(newVal){
            if( newVal ){
                this.auditFilteredRows = this.audit.issues.length
            }
            if( !newVal ){
                this.auditFilteredRows = 0
                this.toolbarEmit('audit-search')
            }
        },
        issueStatus:function(newVal, oldVal){
            if( oldVal !== false && newVal !== false && newVal !== oldVal ){
                EventBus.$emit('toolbarEmit', {action: 'audit-issue-status-change', data: newVal})
            }
        }
    },
    computed: {
        audit(){
            return this.$store.state.audits.audit
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
        
        showToolbar(){
            return this.tool.type === 'audit' && this.audit
        },
        toolbarEmit(action){
            let data = null
            if( action=='audit-condense' ){
                this.toggle(action)
            }
            if( action=='audit-search' ){
                if( this.searchBarOpen ){
                    data = this.searchData
                    action='audit-search-open'
                }
                if( !this.searchBarOpen ){
                    action='audit-search-close'
                }
            }
            EventBus.$emit('toolbarEmit', {action: action, data: data})
        },
        toggle(data){
            if(this.toggled.includes(data)){
                let index = this.toggled.indexOf(data)
                this.toggled.splice(index, 1)
                return
            }
            if( !this.toggled.includes(data) ){
                this.toggled.push(data)
                return
            }
            
        }
    },
    components:{
        Checkbox
    },
    created() {
        let that = this
        EventBus.$on('auditRowSelected', (data)=>{
            that.issueStatus = data
        })
        EventBus.$on('auditSelectedRowsUpdated', (data)=>{
            that.auditRowsSelected = data
            if( data !== 1 ){
                this.issueStatus = false
            }
        })
        EventBus.$on('auditFilteredRows', (data)=>{
            that.auditFilteredRows = data
        })
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