<template>
    <div id="toolbar-container" class="fixed z-50 w-full h-12" v-if="tool.type == 'audit' && audit">
        <div id="toolbar" class="w-full p-2 shadow-custom bg-white">
            <!-- Audit Toolbar -->
            <div class="justify-between flex items-center">
                <div class="flex items-center text-13">
                    <span>{{audit.domain.title}}</span>
                    <div class="border border-black mx-3.5 divider"></div>
                    <span class="mr-3.5">Issues Selected: {{auditRowsSelected}}</span>
                    <span>Total Issues: {{audit.issues.length}}</span>
                </div>
                <span class="w-auto mr-2 flex items-center">
                    <!-- Issue Tools -->
                    <button v-if="auditRowsSelected === 1 && !audit.locked" class="ml-3.5 bg-transparent" @click.prevent="toolbarEmit('audit-edit-issue')">
                        <span title="Edit Issue" ><i class="far fa-file-edit"></i></span>
                    </button>
                    <button v-if="auditRowsSelected === 1 && !audit.locked" class="ml-3.5 bg-transparent" @click.prevent="toolbarEmit('audit-copy-issue')">
                        <span title="Copy Issue" ><i class="far fa-copy"></i></span>
                    </button>
                    <button v-if="auditRowsSelected > 1 && !audit.locked" class="ml-3.5 bg-transparent" @click.prevent="toolbarEmit('audit-delete-many')">
                        <span title="Delete All Selected Issues" ><i class="far fa-minus-hexagon"></i></span>
                    </button>
                    <button v-if="auditRowsSelected < 1 && !audit.locked" class="ml-3.5 bg-transparent" @click.prevent="toolbarEmit('audit-add-issue')">
                        <span title="Add Issue" ><i class="far fa-plus-square"></i></span>
                    </button>
                    <span title="This Audit is Locked and Cannot be Modified" v-if="audit.locked"><i class="fas fa-lock" aria-hidden="true"></i></span>
                    <button class="ml-3.5 bg-transparent" @click.prevent="toolbarEmit('audit-condense')">
                        <span title="Compress Table" v-if="!toggled.includes('audit-condense')"><i class="far fa-compress-alt"></i></span>
                        <span title="Decompress Table" v-else><i class="fas fa-expand-alt"></i></span>
                    </button>
                    <button class="ml-3.5 bg-transparent" @click.prevent="searchBarOpen = !searchBarOpen">
                        <span title="Search Audit" ><i class="far fa-search"></i></span>
                    </button>
                    
                    <div class="border border-black mx-3.5 divider"></div>
                    <!-- Audit Tools -->
                    <router-link :to="{path: `/audits/${audit.id}/edit`}" title="Edit Audit"><i class="far fa-edit"></i></router-link>
                    <button class="ml-3.5 bg-transparent" @click="toolbarEmit('audit-issues-download')" title="Open Download Issues Modal"><i class="far fa-file-download"></i></button>
                    <router-link class="ml-3.5" :to="{path: `/audits/${audit.id}`}" title="Import Issues to This Audit"><i class="far fa-file-import"></i></router-link>
                    <router-link class="ml-3.5" :to="{name: `NewScan`, params: {type:'audit', id: audit.id} }" title="Initiate an Automated Audit"><i class="far fa-barcode-scan"></i></router-link>

                    <button title="Mark Audit Complete" v-if="!audit.locked" class="ml-3.5" @click="toolbarEmit('audit-complete')"><i class="fas fa-lock-open-alt"></i></button>
                    <button title="Create Next Audit" v-if="audit.locked && audit.number > 0 < 3" class="ml-3.5" @click="toolbarEmit('audit-next')"><i class="far fa-hand-point-right"></i></button>
                    <button class="ml-3.5 bg-transparent" @click="$emit('showInfoSidebar')" title="Show Information Sidebar"><i class="far fa-info-circle"></i></button>
                </span>
            </div>
        </div>
        <div class="search-bar items-center flex w-full shadow-lg p-1 bg-white text-13" :class="{open: searchBarOpen}" >
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
            
            <button class="ml-5 standard px-2" @click.prevent="toolbarEmit('audit-search')" >Submit</button>
        </div>
    </div>
    
</template>


<script>
import Button from "./Button.vue"
import Checkbox from "./Checkbox.vue"
import { EventBus } from '../services/eventBus'

export default {
    props:{
        tool: '',
    },
    data() {
        return {
            toggled: [],
            auditRowsSelected: 0,
            auditTotalRows: 0,
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
    computed: {
        audit(){
            return this.$store.state.audits.audit
        }
    },
    methods: {
        toolbarEmit(action){
            let data = null
            if( action=='audit-condense' ){
                this.toggle(action)
            }
            if( action=='audit-search' ){
                data = this.searchData
                this.searchBarOpen = false
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
        Button,
        Checkbox
    },
    created() {
        let that = this
        EventBus.$on('auditSelectedRowsUpdated', (data)=>{
            that.auditRowsSelected = data
        })
        EventBus.$on('auditTotalRowsUpdated', (data)=>{
            that.auditTotalRows = data
        })
    },
}

</script>

<style scoped>
    #sidebar.sidebarOpen.subSidebarExpanded ~ #content #toolbar-container{
        width: calc(100% - 400px);
    }
    #sidebar.sidebarOpen ~ #content #toolbar-container{
        width: calc(100% - 200px);
    }
    #toolbar-container{
        width: calc(100%);
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
        top:-35px;
    }
    .search-bar.open{
        top:0px;
    }
    .text-13, .text-13 *{
        font-size:13px;
    }
</style>