<template>
    <div class="container">
		<div v-show="loading" >
			<Loader v-if="loading"></Loader>
		</div>

        <div class="flex w-full flex-wrap my-4">
            <template v-if="showSuccess">
                <p class="text-base w-full">Your audit has been queued. An email will be sent to the address on your account when it has finished.</p>
            </template>
            <div class="flex flex-col" v-if="!showSuccess">
                <h1 class="mb-3 headline">Automated Audit Options</h1>
                
                <template v-if="isManager">
                    <Radio class="mb-3" :value="false"  v-model="custom" :items="[{display:'Default', value:false}, {display: 'Custom', value:true}]" ></Radio>
                    <Radio class="mb-3" :value="true" v-show="custom" v-model="simple" :items="[{display:'Simple', value:true}, {display: 'Advanced', value:false}]"></Radio>
                </template>

                <template v-if="!isManager">
                    <button class="standard" @click.prevent="custom = !custom">Advanced</button>
                </template>
                <template v-if="custom && simple">
                    <!--
                        - Just individual wcag SC, like just 1.1.1 and 1.4.11
                        - Just W3C approved Accessibility Conformance Testing rules (ACT)
                        - Just best practices
                        - Just A or AA
                        - Just errors
                        - Just items that need manual review
                        - Just color contrast
                    -->
                    
                    <h2 class="subheadline mb-3">Choose an option below to run only that automation</h2>
                    <div class="flex flex-wrap">
                        <Radio class="w-full mb-3" v-model="options.simpleRules.type" 
                        :items="[
                            {display:'WCAG 2.0 and 2.1 Level A', value:'wcagA'}, 
                            {display:'WCAG 2.0 and 2.1 Level AA', value:'wcagAA'}, 
                            {display:'Common accessibility best practices', value:'best-practices'}, 
                            {display:'W3C approved Accessibility Conformance Testing rules', value:'ACT'},
                            {display:'errors', value:'errors'},
                            {display:'items needing manual review', value:'review'},
                            {display:'Color Contrast', value:'contrast'},
                            {display:'Specific WCAG rules', value:'specific'},
                        ]"></Radio>
                        <div v-show="options.simpleRules.type == 'specific'" class="w-full text-center">
                            <Label>
                                Input WCAG Level A and/or Level AA criteria as the number only and comma-separated, i.e. 1.1.1, 1.2.3.
                                <input placeholder="1.1.1, 1.4.11" v-model="options.simpleRules.specifically" class="border border-black rounded p-3" type="text" autocomplete="new-password" />
                            </Label>
                        </div>
                    </div>
                </template>
                <template v-if="custom && !simple">
                    <h3 class="subheadline">Choose Tags (leave blank to run all tags)</h3>
                    <div class="flex flex-wrap items-center">
                        <Label class="pt-0 flex w-1/4 text-left" :stacked="false" v-for="tag in src.tags" :key="'tag-'+tag.value">
                            <Checkbox :vsValue="tag.value" v-model="options.advancedRules.tags"></Checkbox>
                            {{tag.display}}
                        </Label>
                    </div>
                    
                    <div class="flex flex-wrap w-full">
                        <h3 class="subheadline mb-3">Configure Rules</h3>
                        <Radio class="mb-3" v-model="options.advancedRules.customizeRules" :value="options.advancedRules.customizeRules" :items="[{display:'Run all rules', value:false}, {display:'Customize', value:true}]"></Radio>
                        
                        <div v-show="options.advancedRules.customizeRules">
                            <div class="flex">
                                <button class="mr-2 standard" @click.prevent="enableAllRules">Enable all</button>
                                <button class="standard" @click.prevent="disableAllRules">Disable all</button>
                            </div>
                            <div class="flex flex-wrap mb-3">
                                <Label class="justify-end w-1/6 capitalize" v-for="rule in src.rules" :key="'rule-'+rule.value">
                                    {{rule.display}}
                                    <Radio :value="options.advancedRules.rules[rule.value].enabled" v-model="options.advancedRules.rules[rule.value].enabled" :items="[
                                        {display:'On', value:true}, 
                                        {display:'Off', value:false}, 
                                    ]"></Radio>
                                </Label>
                            </div>
                        </div>
                    </div>

                    <h3 class="subheadline">Choose Categories (leave blank to run all categories)</h3>
                    <div class="flex flex-wrap mb-3">
                        <Label class="flex w-1/4 text-left" :stacked="false" v-for="cat in src.categories" :key="'cat-'+cat.value">
                            <Checkbox :vsValue="cat.value" v-model="options.advancedRules.categories"></Checkbox>
                            {{cat.display}}
                        </Label>
                    </div>
                </template>

                <div class="flex flex-wrap">
                    <Radio :value="'full'" class="w-full mb-3" v-model="section" :items="[{display:'Full Page Audit', value:'full'}, {display: 'Section Specific Audit', value:'specific'}]"></Radio>

                    <template v-if="section == 'specific'">
                        <h3 class="subheadline">Section Specific Audit</h3>
                        <p class="text-base w-full">If you would like to audit only a section of the page, enter the CSS selector here. *NOTE: This context will be applied to every page</p>
                        <Label class="mb-3" for="context">
                            Enter a CSS selector or leave blank to scan the whole page
                            <input class="border border-black rounded p-3" placeholder="#main" v-model="options.context" autocomplete="new-password" />
                        </Label>
                    </template>
                    
                </div>
                <div class="flex w-full items-center hidden">
                    <Radio :value="true" class="w-full mb-3" v-model="append" :items="[{display:'Append to Current Audit', value:true}, {display: 'Generate as New Audit', value:false}]"></Radio>
                </div>
                <div class="flex w-full items-center">
                    <Radio :value="true" class="w-full mb-3" v-model="sitemap" :items="[{display:'Audit Entire Sitemap', value:'sitemap'}, {display: 'Audit Homepage Only', value:'homepage'}, {display: 'Audit Specific Pages', value:'pages'}]"></Radio>
                </div>
                <div v-show="sitemap == 'pages'" class="flex flex-col w-full mb-3">
                    <div v-if="!audit.domain || !audit.domain.pages || !audit.domain.pages.length" class="w-full" >
                        There are no pages in this sitemap.
                    </div>
                    <div v-else class="w-full" >
                        <label class="label" for="pages">Select Pages To Audit</label>
                        <select id="pages" class="w-1/2" multiple v-model="pages">
                            <option v-for="(page,i) in audit.domain.pages" :value="page.url" :key="i">{{page.url}}</option>
                        </select>
                    </div>
                </div>

                <div>
                    <button class="standard w-auto" @click.prevent="startScan" >Start Automated Audit</button>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>

import Radio from "../../components/Radio.vue";
import Checkbox from "../../components/Checkbox.vue";
import Button from "../../components/Button.vue";
import Label from '../../components/Label.vue';
import Card from '../../components/Card.vue';
import Loader from '../../components/Loader.vue';
import Utility from '../../services/utility.js'

export default {
    data: () => ({
        loading:false,
        src: {
            tags: [
                {
                    display: "WCAG 2.0 Level A",
                    value: "wcag2a"
                },
                {
                    display: "WCAG 2.0 Level AA",
                    value: "wcag2aa"
                },
                {
                    display: "WCAG 2.1 Level A (does not include 2.0 A criteria)",
                    value: "wcag21a"
                },
                {
                    display: "WCAG 2.1 Level AA (does not include 2.0 AA criteria)",
                    value: "wcag21aa"
                },
                {
                    display: "Common accessibility best practices",
                    value: "best-practice"
                },
                {
                    display: "W3C approved Accessibility Conformance Testing rules",
                    value: "ACT"
                },
                {
                    display: "Cutting-edge rules",
                    value: "experimental"
                },
            ],
            rules: [],
            categories: [
                {
                    display: "Aria",
                    value: "cat.aria"
                },
                {
                    display: "Color",
                    value: "cat.color"
                },
                {
                    display: "Forms",
                    value: "cat.forms"
                },
                {
                    display: "Keyboard",
                    value: "cat.keyboard"
                },
                {
                    display: "Language",
                    value: "cat.language"
                },
                {
                    display: "Name Role Value",
                    value: "cat.name-role-value"
                },
                {
                    display: "Parsing",
                    value: "cat.parsing"
                },
                {
                    display: "Semantics",
                    value: "cat.semantics"
                },
                {
                    display: "Sensory and Visual Cues",
                    value: "cat.sensory-and-visual-cues"
                },
                {
                    display: "Structure",
                    value: "cat.structure"
                },
                {
                    display: "Tables",
                    value: "cat.tables"
                },
                {
                    display: "Text Alternatives",
                    value: "cat.text-alternatives"
                },
                {
                    display: "Time and Media",
                    value: "cat.time-and-media"
                },
            ]
        },
        options: {
            context: "",
            simpleRules: {
                type: "wcagA",
                specifically: ""
            },
            advancedRules: {
                customizeRules: false,
                tags: [],
                rules: {},
                categories: []
            },
            append: true
        },
        simple:true,
        custom:false,
        append: true,
        section: "full",
        showSuccess: false,
        sitemap: 'sitemap',
        pages: [],
    }),
    computed:{
        audit(){
            return this.$store.state.audits.audit
        },
        isManager(){
            return this.$store.getters["auth/isManager"]
        },
    },
    watch:{
        "$store.state.audits.all":function(newVal){
            if( newVal && newVal.length ){
                let that = this
                this.$store.state.audits.audit = newVal.find(a=>a.id === parseInt(that.$route.params.id))
            }
        }
    },
    created(){},
    mounted(){
        document.title = "Create New Automated Audit"
        if( this.$store.state.audits.all.length ){
            let that = this
            this.$store.state.audits.audit = this.$store.state.audits.all.find(a=>a.id === parseInt(that.$route.params.id))
        }
        
        this.src.rules = Utility.getScanRules()
        
        for( let index in this.src.rules ){
            let rule = this.src.rules[index]
            rule.display = rule.value.replaceAll("-", " ")
            this.$set(this.options.advancedRules.rules, rule.value, {})
            this.$set(this.options.advancedRules.rules[rule.value], "enabled", true)
        }
    },
    methods: {
        enableAllRules(){
            for( let rule in this.options.advancedRules.rules ){
                this.options.advancedRules.rules[rule].enabled = true
            }
        },
        disableAllRules(){
            for( let rule in this.options.advancedRules.rules ){
                this.options.advancedRules.rules[rule].enabled = false
            }
        },
        startScan(){
            this.loading = true
            this.$store.dispatch("scan/initiateScan", {config: this.parseOptionsObject(), id: this.$route.params.id, appends: this.append, sitemap: this.sitemap, pages: this.pages, callback: (status) => {
                if(status == 'success') {
                    this.showSuccess = true
                }
                this.loading = false
            }})
        },
        parseOptionsObject(){
            //if manager, you have custom true/false and simple true/false
            //if not manager, you have custom true/false, and simple is always true
            
            if( !this.custom ){
                return {}
            }
            //The format for the object is as follows:
            // - if any tags are present but no rules are present, then only those tags will be run
            // - if any rules are present but no tags are present, then only those rules will be run
            // - categories are treated as tags
            // - if any tags are present and rules are present as well, then only those tags will be run with special addition of the rules present being set to true, example:
            // setting tags to Level A only would normally not run the contrast rule, but if contrast rule is present, then ONLY level A rules will run and contrast rule will be added as well.

            let ob = {}
            if( this.custom ){
                if( this.simple ){
                    switch(this.options.simpleRules.type){
                        case "wcagA":
                            ob = {
                                tags: ['wcag2a', 'wcag21a']
                            }
                            break
                        case "wcagAA":
                            ob = {
                                tags: ['wcag2aa', 'wcag21aa']
                            }
                            break
                        case "best-practices":
                            ob = {
                                tags: ['best-practice']
                            }
                            break
                        case "ACT":
                            ob = {
                                tags: ['ACT']
                            }
                            break
                        case "errors":
                            ob = {
                                resultTypes: ['violations']
                            }
                            break
                        case "review":
                            ob = {
                                resultTypes: ['incomplete']
                            }
                            break
                        case "contrast":
                            ob = {
                                rules: ['color-contrast']
                            }
                            break
                        case "specific":
                            let regex = /\d\.\d\.\d{1,2}/g
                            let split = this.options.simpleRules.specifically.match(regex)
                            let tags = split.map( a=>{
                                return 'wcag'+a.replace(/\./g, '', a)
                            })
                            ob = {
                                tags: tags
                            }
                            break
                    }
                }
                if( !this.simple ){
                    if( this.options.advancedRules.tags.length ){
                        ob.tags = this.options.advancedRules.tags
                    }

                    if( this.options.advancedRules.customizeRules ){
                        ob.rules = this.options.advancedRules.rules
                    }
                    if( this.options.advancedRules.categories.length ){
                        ob.tags = [...this.options.advancedRules.tags, ...this.options.advancedRules.categories]
                    }
                }

                if( this.options.context ){
                    ob.context = this.options.context
                }

                return ob
            }
        }
    },
    components: {
        Radio,
        Button,
        Checkbox,
        Label,
        Card,
        Loader
    }, 
}
</script>