<template>
    <div id="toolbar-container" :class="{'search-bar-open': searchBarOpen}" class="fixed xs:absolute sm:absolute z-50 w-full xs:h-auto sm:h-auto h-12" v-if="showToolbar">
        <div id="toolbar" class="w-full pl-4 p-2 shadow-custom bg-white">
            <!-- Audit Toolbar -->
            <div class="flex items-center justify-between xs:flex-wrap">
                <div class="flex items-center text-13 xs:basis-full xs:flex-wrap">
                    <span class="xs:basis-full xs:max-w-full xs:break-all " v-if="audit.domain">{{audit.domain.url}}<template v-if="audit.domain.root">/{{audit.domain.root}}</template>
                    </span>
                    <template v-if="isAuditShowPage">
                        <div class="border border-black mx-3.5 divider xs:hidden"></div>
                        <span class="mr-3.5">Issues Selected: {{auditRowsSelected}}</span>
                        <span>Total Issues: {{totalRows}}</span>
                    </template>
                </div>
                <span class="w-auto xs:mr-0 mr-2 flex items-center xs:basis-full xs:justify-evenly">
                    <template v-if="isAuditShowPage">
                        <!-- Issue Tools -->
                        <select title="Change Selected Issue's Status" class="text-13 border-l-0 border-r-0 border-t-0 border-black shadow-none rounded-none" v-model="issueStatus" v-if="auditRowsSelected === 1 && !audit.locked" >
                            <option :value="status" v-for="(status, index) in issueStatuses" :key="'toolbarStatus-'+index">{{status}}</option>
                        </select>
                        
                        <!-- Edit Issue -->
                        <button v-if="auditRowsSelected === 1 && !audit.locked" class="xs:ml-0 ml-3.5 bg-transparent pointer-only" @click.prevent="toolbarEmit('audit-edit-issue', $event)">
                            <span title="Edit Issue" ><i class="far fa-file-edit"></i></span>
                        </button>
                        <!-- Copy Issue -->
                        <button v-if="auditRowsSelected === 1 && !audit.locked" class="xs:ml-0 ml-3.5 bg-transparent pointer-only" @click.prevent="toolbarEmit('audit-copy-issue', $event)">
                            <span title="Copy Issue" ><i class="far fa-copy"></i></span>
                        </button>
                        <!-- Delete Selected Issue -->
                        <button v-if="auditRowsSelected > 1 && !audit.locked" class="xs:ml-0 ml-3.5 bg-transparent pointer-only" @click.prevent="toolbarEmit('audit-delete-many', $event)">
                            <span title="Delete All Selected Issues" ><i class="far fa-minus-hexagon"></i></span>
                        </button>
                        <!-- Add Issue -->
                        <button v-if="auditRowsSelected < 1 && !audit.locked" class="xs:ml-0 ml-3.5 bg-transparent pointer-only" @click.prevent="toolbarEmit('audit-add-issue', $event)">
                            <span title="Add Issue" ><i class="far fa-plus-square"></i></span>
                        </button>
                        <!-- Locked Icon -->
                        <span title="This Audit is Locked and Cannot be Modified" v-if="audit.locked"><i class="fas fa-lock" aria-hidden="true"></i></span>
                        <!-- Condense Table -->
                        <button class="xs:ml-0 ml-3.5 bg-transparent pointer-only" @click.prevent="toolbarEmit('audit-condense', $event)">
                            <span title="Compress Table" v-if="!toggled.includes('audit-condense')"><i class="far fa-compress-alt"></i></span>
                            <span title="Decompress Table" v-else><i class="fas fa-expand-alt"></i></span>
                        </button>
                        <!-- Search Audit -->
                        <button class="xs:ml-0 ml-3.5 bg-transparent pointer-only" @click.prevent="searchBarOpen = !searchBarOpen">
                            <span title="Search Audit" ><i class="far fa-search"></i></span>
                        </button>
                        <div class="border border-black mx-3.5 xs:mx-2 divider"></div>
                    </template>
                    <!-- Table Tools -->
                    <template v-if="isAuditShowPage">
                        <div v-if="!audit.locked">
                            <button title="Select All Rows" class="text-lg leading-none pointer-only" @click.prevent="toolbarEmit('selectAll', $event)" >
                                <i class="fas fa-grip-horizontal"></i>
                            </button>
                        </div>
                        <div v-if="!audit.locked">
                            <button class="text-lg leading-none mx-3.5 xs:mx-2 pointer-only" title="Deselect All Rows" @click.prevent="toolbarEmit('deselectAll', $event)">
                                <i class="fal fa-grip-horizontal"></i>
                            </button>
                        </div>
                        <div>
                            <button class="text-base leading-none pointer-only" title="Open Show or Hide Columns Modal" @click.prevent="toolbarEmit('columnPicker', $event)" >
                                <i class="far fa-thumbtack"></i>
                            </button>
                        </div>
                        <div class="border border-black mx-3.5 xs:mx-2 divider"></div>
                    </template>
                    <!-- Audit Tools --> 
                    <router-link :to="{path: `/audits/${audit.id}/edit`}" title="Audit Settings"><i class="far fa-cog"></i></router-link>
                    <button class="xs:ml-0 ml-3.5 bg-transparent pointer-only" @click="toolbarEmit('audit-issues-download', $event)" title="Open Download Issues Modal"><i class="far fa-file-download"></i></button>
                    <router-link class="xs:ml-0 ml-3.5" :to="{path: `/audits/${audit.id}/import`}" title="Import Issues to This Audit"><i class="far fa-file-import"></i></router-link>
                    <router-link class="xs:ml-0 ml-3.5" :to="{path: `/automations/${$route.params.id}/new`}" title="Initiate an Automated Audit"><i class="far fa-barcode-scan"></i></router-link>

                    <button title="Mark Audit Complete" v-if="!audit.locked" class="xs:ml-0 ml-3.5 pointer-only" @click="toolbarEmit('audit-complete', $event)"><i class="fas fa-lock-open-alt"></i></button>
                    <button title="Create Next Audit" v-if="audit.locked && audit.number > 0 < 3" class="xs:ml-0 ml-3.5 pointer-only" @click="toolbarEmit('audit-next', $event)"><i class="far fa-hand-point-right"></i></button>
                    
                    <button class="xs:ml-0 ml-3.5 bg-transparent pointer-only" @click="EventBus.$emit('showInfoSidebar')" title="Show Information Sidebar"><i class="far fa-info-circle"></i></button>
                </span>
            </div>
        </div>
        <div class="search-bar xs:h-auto justify-end items-center flex w-full shadow-lg p-1 bg-white text-13 xs:flex-wrap sm:flex-wrap" :class="{open: searchBarOpen}" >
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
            
            <button class="ml-5 standard" @click.prevent="toolbarEmit('audit-search', $event)" >Submit</button>
            <button title="Close Search Bar" class="ml-3.5 mr-5 standard" @click.prevent="searchBarOpen = false" >X</button>
        </div>
        <Modal class="adjust-with-sidebars" :open="confirmModalOpen">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <!-- Heroicon name: outline/exclamation -->
                        <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Delete Audit
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                Are you sure you want to delete this audit? This will delete all associated working sample pages and issues as well. This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button @click="deleteAudit" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                Delete
                </button>
                <button @click="confirmModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
                </button>
            </div>
        </Modal>
    </div>
    
</template>


<script>
import Checkbox from "../Checkbox.vue"
import Modal from "../Modal.vue"
import { EventBus } from '../../services/eventBus'

export default {
    props:{
        tool: '',
    },
    data() {
        return {
            EventBus: EventBus,
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
            ],
            confirmModalOpen: false
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
            this.$emit('updateclasses',{'search-bar-open':newVal})
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
                    return this.audit.issue_count
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
        deleteAudit(){
            let project_id = this.$store.state.projects.project.id
            this.$store.dispatch("audits/deleteAudit", {audit_id: this.$route.params.id})
            this.$router.push({path: `/projects/${project_id}`})
        },
        showToolbar(){
            return this.tool.type === 'audit' && this.audit
        },
        toolbarEmit(action, $event){
            
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
            EventBus.$emit('toolbarEmit', {action: action, data: data, $event: $event})
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
        Checkbox,
        Modal
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
    .pointer-only *{
        pointer-events: none;
    }
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