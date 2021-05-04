<template>
    <div class="sheet-holder">
        <Sheet @message="message" :ref="'sheet'+(index)" :index="index" @next="goForward(sheet)" @previous="goBack(sheet)" :req="sheet.requires || false" :showing="showing" v-for="(sheet, index) in sheets" :key="'sheet-' + index">
            <component :ref="'component'+index" :temp="sheet.template || false" @complete="handleComplete" :independent="false" :is="getComponent(sheet.component)">
            </component>
        </Sheet>
    </div>
</template>


<script>
    import Sheet from '../components/Sheet'
    import ProjectCreate from '../components/templates/projects/Create'
    import DomainCreate from '../components/templates/domains/Create'
    import SitemapCreate from '../components/templates/sitemap/Create'
    import AuditCreate from '../components/templates/audits/Create'
    import SheetGeneric from '../components/templates/SheetGeneric'

    export default {
        props:{
            sheets: {
                type: Array,
                default: function(){
                    return []
                }
            },
            sheetData: {
                type: Object,
                default: function(){
                    return {}
                }
            }
        },
        data(){
            return {
                showing: false,
            }
        },
        mounted(){
            
        },
        methods: {
            handleComplete(data){
                if( data ){
                    this.$emit("sheetComplete", data.sheet)
                    this.$set(this.sheetData, data.sheet, {})
                    this.$set(this.sheetData[data.sheet], data.key, data.data)
                    this.goForward(this.sheets[data.sheetIndex])
                }
            },
            goForward(sheet, directTo = false){
                if( directTo ){
                    this.showing = directTo
                }
                else{
                    this.showing = sheet.next
                }
                
                if( this.showing == 1 ){
                    this.$refs["component1"][0].setFirstDomain()
                }
                if( sheet.next ){
                    this.$refs["sheet"+ sheet.next][0].initShow()
                }
            },
            goBack(sheet){
                this.showing = sheet.back
                if( sheet.back ){
                    this.$refs["sheet"+ sheet.back][0].initShow()
                }
            },
            getComponent(component){
                if( component == "generic" ){
                    return 'SheetGeneric'
                }
                return component
            },
            message(message){
                this.$emit('message', message)
            }
        },
        name: 'Sheets',
        computed: {
            
        },
        components: {
            Sheet,
            ProjectCreate,
            DomainCreate,
            SitemapCreate,
            AuditCreate,
            SheetGeneric
        }
    }
</script>