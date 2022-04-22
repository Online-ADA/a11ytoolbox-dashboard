<template>
    <div id="toolbar-container" :class="{'search-bar-open': searchBarOpen}" class="fixed z-50 w-full" v-if="showToolbar">
        <div id="toolbar" class="w-full pl-4 p-2 shadow-custom bg-white">
            <!-- Audit Toolbar -->
            <div class="flex items-center justify-between">
                <div class="flex items-center text-13">
                    <div class="xs:hidden sm:hidden flex items-center">
                        <span style="font-size:16px;" class="toolbar-headline">{{pageTitle}}</span>
                        <div class="border border-black mx-3.5 divider"></div>
                    </div>

                    <span v-if="audit.domain">
                        <router-link :to="`/domains/${audit.domain.id}/edit`">
                            {{audit.domain.url}}<template v-if="audit.domain.root">/{{audit.domain.root}}</template>
                        </router-link>
                    </span>
                    <template v-if="isMediaAuditShowPage">
                        <div class="border border-black mx-3.5 divider"></div>
                        <!-- <span class="mr-3.5">Issues Selected: {{auditRowsSelected}}</span> -->
                        <span>Total Issues: {{totalRows}}</span>
                    </template>
                </div>
                <span class="w-auto mr-2 flex items-center">
                    <button class="ml-3.5 bg-transparent" @click="InitAudit">
                        <span title="Initiate an Automated Audit" ><i class="far fa-barcode-scan"></i></span>
                    </button>
                </span>
            </div>
        </div>
        
    </div>
    
</template>


<script>
import Checkbox from "../Checkbox.vue"

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
        
    },
    computed: {
        pageTitle(){
            switch( this.$route.name ){
                case "MediaAuditEdit":
                    return "Edit Media Audit"
                    break;
                case "MediaAuditShow":
                    return "Media Audit"
                    break;
            }
        },
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
        isMediaAuditEditPage(){
            return this.$route.name === "MediaAuditEdit"
        },
        isMediaAuditShowPage(){
            return this.$route.name === "MediaAuditShow"
        }
    },
    methods: {
        InitAudit() {
            this.$store.dispatch('mediaAudits/InitAudit',{audit_id: this.audit.id, vm: this})
        },
        showToolbar(){
            return this.tool.type === 'media-audit' && this.audit
        },
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