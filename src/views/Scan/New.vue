<template>
    <div class="container mx-auto flex justify-center items-center flex-col">
        
        <h1 class="mt-32 mb-3">Initiate a new automated scan</h1>

        <template v-if="!$route.params.type">
            <h2>The scan needs to be initiated from either a domain or an audit.</h2>
            <div class="flex w-full justify-center">
                <Button class="mx-2" color="white" :hover="true" @click.native.prevent="$router.push({path: '/audits/list'})">Go to audits</Button>
                <Button class="mx-2" color="white" :hover="true" @click.native.prevent="$router.push({path: '/domains/list'})">Go to domains</Button>
            </div>
        </template>    
        <template v-else>
            <h2 class="text-base my-2 text-center">DISCLAIMER: This scan does not test hidden regions, such as inactive menus or modal windows. Additionally, our scan tool is not currently set up to look for AAA issues.</h2>
            <h2 class="text-xl text-center">The default scan option will run through the entire page and all of the rules except for the experimental rules, like scanning a shadow DOM. By choosing "Custom" below, you can configure the scan to run only what you need.</h2>

            <div class="flex w-full flex-wrap my-4">
                <div class="w-full text-center">
                    <h3 class="text-base">Scan Options</h3>
                </div>
                
                <template v-if="isManager">
                    <Radio :value="false" class="mx-auto w-full" v-model="custom" :items="[{display:'Default', value:false}, {display: 'Custom', value:true}]" align="center"></Radio>
                    <Radio :value="true" v-show="custom" class="mx-auto w-full" v-model="simple" :items="[{display:'Simple', value:true}, {display: 'Advanced', value:false}]" align="center"></Radio>
                </template>

                <template v-if="!isManager">
                    <Button class="mx-auto" :color="[custom ? 'red' : 'white']" :hover="true" @click.native.prevent="custom = !custom">Advanced</Button>
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
                    <div class="w-full text-center">
                        <h3 class="text-base w-full">Choose an option below to run only that scan</h3>
                        <div class="w-full flex flex-wrap items-center">
                            <Radio class="mx-auto w-full" v-model="options.simpleRules.type" 
                            :items="[
                                {display:'WCAG 2.0 and 2.1 Level A', value:'wcagA'}, 
                                {display:'WCAG 2.0 and 2.1 Level AA', value:'wcagAA'}, 
                                {display:'Common accessibility best practices', value:'best-practices'}, 
                                {display:'W3C approved Accessibility Conformance Testing rules', value:'ACT'},
                                {display:'errors', value:'errors'},
                                {display:'items needing manual review', value:'review'},
                                {display:'Color Contrast', value:'contrast'},
                                {display:'Specific WCAG rules', value:'specific'},
                            ]" align="center"></Radio>
                            <div v-show="options.simpleRules.type == 'specific'" class="w-full text-center">
                                <Label>
                                    Input WCAG Level A and/or Level AA criteria as the number only and comma-separated, i.e. 1.1.1, 1.2.3.
                                    <input placeholder="1.1.1, 1.4.11" v-model="options.simpleRules.specifically" class="border border-black rounded p-3" type="text" autocomplete="new-password" />
                                </Label>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="custom && !simple">
                    <div class="w-full text-center">
                        <h3 class="text-large w-full bold">Choose Tags (leave blank to run all tags)</h3>
                        <div class="w-full flex flex-wrap items-center">
                            <Label class="flex w-1/4 text-left" :stacked="false" v-for="tag in src.tags" :key="'tag-'+tag.value">
                                <Checkbox :vsValue="tag.value" v-model="options.advancedRules.tags"></Checkbox>
                                {{tag.display}}
                            </Label>
                        </div>
                    </div>

                    <div class="w-full flex flex-wrap justify-center items-center">
                        <h3 class="text-large w-full bold">Configure Rules</h3>
                        <Radio class="mx-2" align="center" v-model="options.advancedRules.customizeRules" :value="options.advancedRules.customizeRules" :items="[{display:'Run all rules', value:false}, {display:'Customize', value:true}]"></Radio>
                        
                        <div v-show="options.advancedRules.customizeRules">
                            <div class="w-full flex justify-center">
                                <Button class="mx-1" @click.native.prevent="enableAllRules" size="sm" :hover="true">Enable all</Button>
                                <Button class="mx-1" @click.native.prevent="disableAllRules" size="sm" :hover="true">Disable all</Button>
                            </div>
                            <div class="w-full flex flex-wrap items-center">
                                <Label class="text-center w-1/6 capitalize" v-for="rule in src.rules" :key="'rule-'+rule.value">
                                    {{rule.display}}
                                    <Radio :value="options.advancedRules.rules[rule.value].enabled" align="center" v-model="options.advancedRules.rules[rule.value].enabled" :items="[
                                        {display:'On', value:true}, 
                                        {display:'Off', value:false}, 
                                    ]"></Radio>
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div class="w-full text-center" >
                        <h3 class="text-large w-full bold">Choose Categories (leave blank to run all categories)</h3>
                        <div class="w-full flex flex-wrap items-center">
                            <Label class="flex w-1/4 text-left" :stacked="false" v-for="cat in src.categories" :key="'cat-'+cat.value">
                                <Checkbox :vsValue="cat.value" v-model="options.advancedRules.categories"></Checkbox>
                                {{cat.display}}
                            </Label>
                        </div>
                    </div>
                </template>

                <div class="w-full my-2 flex flex-wrap justify-center">
                    <h3 class="w-full text-center">Context</h3>
                    <p class="text-base w-full text-center">If you would like to scan only a section of the page, enter the CSS selector here. *NOTE: This context will be applied to every page</p>
                    <Label for="context">
                        Enter a CSS selector or leave blank to scan the whole page
                        <input class="border border-black rounded p-3" placeholder="#main" v-model="options.context" autocomplete="new-password" />
                    </Label>
                    
                </div>
                <div class="w-full my-2 flex justify-center">
                    <Button @click.native.prevent="startScan" color="white">Start Scan</Button>
                </div>
            </div>
        </template>
    </div>
</template>

<script>

import Radio from "../../components/Radio.vue";
import Checkbox from "../../components/Checkbox.vue";
import Button from "../../components/Button.vue";
import Label from '../../components/Label.vue';
import Card from '../../components/Card.vue';
import Utility from '../../services/utility.js'
import audits from '../../store/modules/audits'
import domains from '../../store/modules/domains'


export default {
    data: () => ({
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
            }
        },
        simple:true,
        custom:false
    }),
    computed:{
        isManager(){
            return this.$store.getters["auth/isManager"]
        },
        scanType(){
            return Object.values(this.$route.params).length && this.$route.params.type ? this.$route.params.type : 'independent'
        },
        pages(){
            if( this.scanType == "audit" ){
                if( this.$store.state.audits && this.$store.state.audits.audit ){
                    return this.$store.state.audits.audit.pages.filter( p=> p.url).map( p=>p.url)
                }
                return  []
            }

            if( this.scanType == "domain" ){
                return this.$store.state.domains && this.$store.state.domains.domain ? this.$store.state.domains.domain.pages.map( p=>p.url) : []
            }
        },
        url(){
            if( this.scanType == "audit" ){
                return this.$store.state.audits && this.$store.state.audits.audit ? this.$store.state.audits.audit.domain.url : ""
            }

            if( this.scanType == "domain" ){
                return this.$store.state.domains && this.$store.state.domains.domain ? this.$store.state.domains.domain.url : ""
            }
        }
    },
    created(){
        if(this.$store.state.audits === undefined){
			this.$store.registerModule('audits', audits)
		}
        if(this.$store.state.domains === undefined){
			this.$store.registerModule('domains', domains)
		}
    },
    mounted(){
        if( Object.values(this.$route.params).length ){
            if( this.$route.params.type == "audit" ){
                this.$store.dispatch("audits/getAudit", {id: this.$route.params.id})
            }
            if( this.$route.params.type == "domain" ){
                this.$store.dispatch("domains/getDomain", {id: this.$route.params.id})
            }
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
            this.$store.dispatch("scan/initiateScan", {config: this.parseOptionsObject(), domain: this.url, pages: this.pages, relationship: this.scanType, id: this.$route.params.id})
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
        Card
    }, 
}
</script>