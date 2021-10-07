<template>
    <div class="flex flex-wrap container mx-auto">
        <Loader v-if="loading"></Loader>
        <div class="flex w-full justify-center my-4">
            <Card class="w-2/3 mx-auto relative">
                <h2 class="mb-2">Success Critera</h2>
                <button @click="displayArticlePopup(newItem({item: newArticle, extra: 'article'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && articles.length">
                    <SearchList :dataSendBack="'article'" @click="displayArticlePopup" hover-effect="grow" :displayProps="['title', 'number', 'description']" :items="articles"></SearchList>
                </template>
                <div v-else>There are no success criteria</div>
            </Card>
        </div>
        <div class="flex w-full justify-center my-4">
            <Card class="w-2/3 mx-auto relative">
                <h2>Techniques</h2>
                <button @click="displayArticlePopup(newItem({item: newTechnique, extra: 'technique'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && techniques.length">
                    <SearchList :dataSendBack="'technique'" @click="displayArticlePopup" hover-effect="grow" :displayProps="['title', 'number', 'description']" :items="techniques"></SearchList>
                </template>
                <div v-else>There are no techniques</div>
            </Card>
        </div>
        <div class="flex w-full justify-center my-4">
            <Card class="w-2/3 mx-auto relative">
                <h2>Recommendations</h2>
                <button @click="displayArticlePopup(newItem({item: newRecommendation, extra: 'recommendation'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && recommendations.length">
                    <SearchList :dataSendBack="'recommendation'" @click="displayArticlePopup" hover-effect="grow" :displayProps="['description']" :items="recommendations"></SearchList>
                </template>
                <div v-else>There are no recommendations</div>
            </Card>
        </div>
        <div class="flex w-full justify-center my-4">
            <Card class="w-2/3 mx-auto relative">
                <h2>Audit States</h2>
                <button @click="displayArticlePopup(newItem({item: newState, extra: 'audit_state'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && states.length">
                    <SearchList :displayProps="['content']" :dataSendBack="'audit_state'" @click="displayArticlePopup" hover-effect="grow" :items="states"></SearchList>
                </template>
                <div v-else>There are no audit states</div>
            </Card>
        </div>
        <div class="flex w-full justify-center my-4">
            <Card class="w-2/3 mx-auto relative">
                <h2>Assistive Technologies</h2>
                <button @click="displayArticlePopup(newItem({item: newAsstTech, extra: 'assistive_tech'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && assistiveTechnologies.length">
                    <SearchList :displayProps="['content']" :dataSendBack="'assistive_tech'" @click="displayArticlePopup" hover-effect="grow" :items="assistiveTechnologies"></SearchList>
                </template>
                <div v-else>There are no assistive technologies</div>
            </Card>
        </div>
        <div class="flex w-full justify-center my-4">
            <Card class="w-2/3 mx-auto relative">
                <h2>Software Used</h2>
                <button @click="displayArticlePopup(newItem({item: newSoftwareUsed, extra: 'software_used'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && softwareUsed.length">
                    <SearchList :displayProps="['content']" :dataSendBack="'software_used'" @click="displayArticlePopup" hover-effect="grow" :items="softwareUsed"></SearchList>
                </template>
                <div v-else>There are no software used</div>
            </Card>
        </div>
        <Modal :open="articleModalOpen" :sizeButtons="articleEditItem.identifier == 'recommendation'">
            <div class="bg-white px-4 pt-5 pb-4 p-6">
                <div class="flex items-start">
                    <div class="mt-3 text-left w-full">
                        <template v-if="articleEditItem.identifier == 'article'">
                            <div class="w-full">
                                <Label class="text-lg leading-6 w-full" for="article-title">Title<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                <TextInput required class="w-full" id="article-title" v-model="articleEditItem.title"></TextInput>
                            </div>
                            <div class="flex w-full justify-evenly mt-2">
                                <div class="w-1/3">
                                    <Label class="text-lg leading-6 w-full" for="article-level">Level<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                    <TextInput required class="w-full" id="article-level" v-model="articleEditItem.level"></TextInput>
                                </div>
                                <div class="w-1/3">
                                    <Label class="text-lg leading-6 w-full" for="article-number">Number<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                    <TextInput required class="w-full" id="article-number" v-model="articleEditItem.number"></TextInput>
                                </div>
                            </div>
                            <div class="mt-2 w-full">
                                <Label class="text-lg leading-6 w-full" for="article-desc">Description<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                <TextArea required rows="6" id="article-desc" v-model="articleEditItem.description" class="text-sm text-pallette-grey w-full"></TextArea>
                            </div>
                            <div class="w-full mt-2">
                                <Label class="text-lg leading-6 w-full" for="article-url">Internal URL</Label>
                                <TextInput class="w-full" id="article-url" v-model="articleEditItem.url"></TextInput>
                            </div>
                            <div class="w-full mt-2">
                                <Label class="text-lg leading-6 w-full" for="article-ext_url">External URL</Label>
                                <TextInput class="w-full" id="article-ext_url" v-model="articleEditItem.ext_url"></TextInput>
                            </div>
                        </template>
                        <template v-else-if="articleEditItem.identifier == 'technique'">
                            <div class="w-full">
                                <Label class="text-lg leading-6" for="tech-article">Select success criteria</Label>
                                <button class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-blue hover:text-white text-xs" @click="changeTechArticleDisplay('title')" aria-label="Change the display of the articles within the select to show the articles' title" aria-controls="tech-article">Title</button>
                                <button class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-blue hover:text-white text-xs" @click="changeTechArticleDisplay('number')" aria-label="Change the display of the articles within the select to show the articles' number" aria-controls="tech-article">Number</button>
                                <!-- <Select @input="test" multiple name="tech-article" id="tech-article" class="mx-auto w-full" :options="articles" :displayProp="displayTechArticlesBy" valueProp="id" v-model="articleEditItem.article_ids"></Select> -->
                                <select name="tech-article" id="tech-article" multiple v-model="articleEditItem.article_ids" class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-red p-2 rounded shadow w-full">
                                    <option :value="option.id" v-for="(option, index) in articles" :key="index">{{option[displayTechArticlesBy]}}</option>
                                </select>
                            </div>

                            <div class="w-full mt-2">
                                <Label class="text-lg leading-6 w-full" for="tech-title">Title<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                <TextInput required class="w-full" id="tech-title" v-model="articleEditItem.title"></TextInput>
                            </div>
                            <div class="flex w-full justify-evenly mt-2">
                                <div class="w-1/3">
                                    <Label class="text-lg leading-6 w-full" for="tech-number">Number<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                    <TextInput required class="w-full" id="tech-number" v-model="articleEditItem.number"></TextInput>
                                </div>
                            </div>
                            <div class="mt-2 w-full">
                                <Label class="text-lg leading-6 w-full" for="tech-desc">Description<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                <TextArea required rows="6" id="tech-desc" v-model="articleEditItem.description" class="text-sm text-pallette-grey w-full"></TextArea>
                            </div>
                            <div class="w-full mt-2">
                                <Label class="text-lg leading-6 w-full" for="tech-ext_url">External URL</Label>
                                <TextInput class="w-full" id="tech-ext_url" v-model="articleEditItem.ext_url"></TextInput>
                            </div>
                        </template>
                        <template v-else-if="articleEditItem.identifier == 'audit_state'">
                            <div class="w-full text-center">
                                <h2 class="leading-6 mb-6">Create new audit state</h2>
                            </div>
                            <div class="w-full mt-2">
                                <Label class="text-lg leading-6 w-full" for="state-title">Audit State<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                <TextInput required class="w-full" id="state-title" v-model="articleEditItem.content"></TextInput>
                            </div>
                        </template>
                        <template v-else-if="articleEditItem.identifier == 'software_used'">
                            <div class="w-full text-center">
                                <h2 class="leading-6 mb-6">Create new software used</h2>
                            </div>
                            <div class="w-full mt-2">
                                <Label class="text-lg leading-6 w-full" for="state-title">Software Used<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                <TextInput required class="w-full" id="state-title" v-model="articleEditItem.content"></TextInput>
                            </div>
                        </template>
                        <template v-else-if="articleEditItem.identifier == 'assistive_tech'">
                            <div class="w-full text-center">
                                <h2 class="leading-6 mb-6">Create new assistive technology</h2>
                            </div>
                            <div class="w-full mt-2">
                                <Label class="text-lg leading-6 w-full" for="asst-title">Assistive Technology<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                <TextInput required class="w-full" id="asst-title" v-model="articleEditItem.content"></TextInput>
                            </div>
                        </template>
                        <template v-else-if="articleEditItem.identifier == 'failure'">
                            <div class="w-full">
                                <Label class="text-lg leading-6" for="fail-article">Select success criteria</Label>
                                <button class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-blue hover:text-white text-xs" @click="changeFailArticleDisplay('title')" aria-label="Change the display of the articles within the select to show the articles' title" aria-controls="fail-article">Title</button>
                                <button class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-blue hover:text-white text-xs" @click="changeFailArticleDisplay('number')" aria-label="Change the display of the articles within the select to show the articles' number" aria-controls="fail-article">Number</button>
                                <!-- <Select @input="test" multiple name="fail-article" id="fail-article" class="mx-auto w-full" :options="articles" :displayProp="displayTechArticlesBy" valueProp="id" v-model="articleEditItem.article_ids"></Select> -->
                                <select name="fail-article" id="fail-article" multiple v-model="articleEditItem.article_ids" class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-red p-2 rounded shadow w-full">
                                    <option :value="option.id" v-for="(option, index) in articles" :key="index">{{option[displayFailArticlesBy]}}</option>
                                </select>
                            </div>

                            <div class="w-full mt-2">
                                <Label class="text-lg leading-6 w-full" for="fail-title">Title<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                <TextInput required class="w-full" id="fail-title" v-model="articleEditItem.title"></TextInput>
                            </div>
                            <div class="flex w-full justify-evenly mt-2">
                                <div class="w-1/3">
                                    <Label class="text-lg leading-6 w-full" for="fail-number">Number<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                    <TextInput required class="w-full" id="fail-number" v-model="articleEditItem.number"></TextInput>
                                </div>
                            </div>
                            <div class="mt-2 w-full">
                                <Label class="text-lg leading-6 w-full" for="tech-desc">Description<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                <TextArea required rows="6" id="tech-desc" v-model="articleEditItem.description" class="text-sm text-pallette-grey w-full"></TextArea>
                            </div>
                            <div class="w-full mt-2">
                                <Label class="text-lg leading-6 w-full" for="tech-ext_url">External URL</Label>
                                <TextInput class="w-full" id="tech-ext_url" v-model="articleEditItem.ext_url"></TextInput>
                            </div>
                        </template>
                        <template v-else-if="articleEditItem.identifier == 'recommendation'">
                            <div class="w-full">
                                <Label class="text-lg leading-6" for="recc-article">Select success criteria</Label>
                                <button class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-blue hover:text-white text-xs" @click="changeReccArticleDisplay('title')" aria-label="Change the display of the articles within the select to show the articles' title" aria-controls="recc-article">Title</button>
                                <button class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-blue hover:text-white text-xs" @click="changeReccArticleDisplay('number')" aria-label="Change the display of the articles within the select to show the articles' number" aria-controls="recc-article">Number</button>
                                <!-- <Select multiple name="recc-article" id="recc-article" class="mx-auto w-full" :options="articles" :displayProp="displayReccArticlesBy" valueProp="id" v-model="articleEditItem.article_ids"></Select> -->
                                <select name="recc-article" id="recc-article" multiple v-model="articleEditItem.article_ids" class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-red p-2 rounded shadow w-full">
                                    <option :value="option.id" v-for="(option, index) in articles" :key="index">{{option[displayReccArticlesBy]}}</option>
                                </select>
                            </div>
                            <div class="mt-2 w-full">
                                <Label class="text-lg leading-6 w-full" for="recc-desc">Description<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                                <TextArea required rows="6" id="recc-desc" v-model="articleEditItem.description" class="text-sm text-pallette-grey w-full"></TextArea>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 flex flex-row-reverse">
                <button v-if="articleEditItem.id" @click="confirmDelete" type="button" class="mx-2 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red w-auto text-sm">
                Delete
                </button>
                <button @click="( ()=> {articleModalOpen = false; articleEditItem = false})" type="button" class="hover:bg-pallette-blue mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto text-sm">
                Cancel
                </button>
                <button @click="createOrUpdateItem" type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-blue hover:text-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto text-sm">
                Save
                </button>
            </div>
        </Modal>
        <Modal :open="confirmDeleteModalOpen">
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
                            Confirm Delete {{articleEditItem.title}}
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                Are you sure you want to delete this {{getSingular(articleEditItem.identifier)}}?
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button @click="deleteConfirmed" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                Delete
                </button>
                <button @click="confirmDeleteModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
                </button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Loader from '../../../components/Loader'
import Modal from '../../../components/Modal'
import SearchList from '../../../components/SearchList'
import Card from '../../../components/Card'
import TextInput from '../../../components/TextInput'
import TextArea from '../../../components/TextArea'
// import Select from '../../../components/Select'

export default {
    data: () => ({
        newArticle: {title: '', description: '', ext_url: '', url: '', level: '', number: ''},
        newTechnique: {article_ids: [], description: '', number: '', title: '', ext_url: ''},
        newFailure: {article_ids: [], description: '', number: '', title: '', ext_url: ''},
        newState: {content: ''},
        newAsstTech: {content: ''},
        newSoftwareUsed: {content: ''},
        newRecommendation: {article_ids: [], description: ''},
        articleModalOpen: false,
        articleEditItem: false,
        confirmDeleteModalOpen: false,
        confirmDeleteItem: false,
        confirmDeleteType: false,
        displayTechArticlesBy: 'title',
        displayReccArticlesBy: 'title',
        displayFailArticlesBy: 'title',
    }),
    computed: {
        loading(){
            if( this.$store.state.admin ){
                return this.$store.state.admin.loading.articles
            }
            return false
        },
        articles() {
            if( this.$store.state.admin ){
                return this.$store.state.admin.articles
            }
            return []
        },
        failures() {
            if( this.$store.state.admin ){
                return this.$store.state.admin.failures
            }
            return []
        },
        states() {
            if( this.$store.state.admin ){
                return this.$store.state.admin.audit_states
            }
            return []
        },
        assistiveTechnologies(){
            if( this.$store.state.admin ){
                return this.$store.state.admin.assistive_techs
            }
            return []
        },
        softwareUsed(){
            if( this.$store.state.admin ){
                return this.$store.state.admin.software_used
            }
            return []
        },
        techniques() {
            if( this.$store.state.admin ){
                return this.$store.state.admin.techniques
            }
            return []
        },
        recommendations() {
            if( this.$store.state.admin ){
                return this.$store.state.admin.recommendations
            }
            return []
        },
    },
    props: [],
    watch: {
        "$store.state.auth.user": function(newVal){
            if( newVal ){
                this.$store.dispatch("admin/getArticles")
                this.$store.dispatch("admin/getAuditStates")
                this.$store.dispatch("admin/getAsstTechnologies")
                this.$store.dispatch("admin/getSoftwareUsed")
            }
        }
    },
    methods: {
        getSingular( identifier ){
            if( identifier == "audit_state" ){
                return "audit state"
            }
            if( identifier == "assistive_tech" ){
                return "assistive technology"
            }
            if( identifier == "software_used" ){
                return "software used"
            }

            return identifier
        },
        newItem(item){
            return JSON.parse( JSON.stringify(item) )
        },
        changeTechArticleDisplay(display){
            this.displayTechArticlesBy = display
        },
        changeFailArticleDisplay(display){
            this.displayFailArticlesBy = display
        },
        changeReccArticleDisplay(display){
            this.displayReccArticlesBy = display
        },
        createOrUpdateItem(){
            this.articleModalOpen = false
            if( this.articleEditItem.id ){
                this.$store.dispatch("admin/updateArticleObject", {object: this.articleEditItem})
            }else{
                this.$store.dispatch("admin/createArticleObject", {object: this.articleEditItem})
            }
            this.articleEditItem = false
        },
        deleteConfirmed(){
            this.confirmDeleteModalOpen = false
            let action = ""
            switch( this.articleEditItem.identifier ){
                case "article":
                    action = "admin/deleteArticle"
                    break;
                case "technique":
                    action = "admin/deleteTechnique"
                    break;
                case "failure":
                    action = "admin/deleteFailure"
                    break;
                case "recommendation":
                    action = "admin/deleteRecommendation"
                    break;
                case "audit_state":
                    action = "admin/deleteAuditState"
                    break;
                case "assistive_tech":
                    action = "admin/deleteTechnology"
                    break;
                case "software_used":
                    action = "admin/deleteSoftwareUsed"
                    break;
            }
            this.$store.dispatch(action, {id: this.articleEditItem.id})
            this.articleEditItem = false
        },
        confirmDelete(){
            this.articleModalOpen = false
            this.confirmDeleteModalOpen = true
        },
        displayArticlePopup(data){
            this.articleEditItem = data.item
            this.articleEditItem.identifier = data.extra
            this.articleModalOpen = true
        },
    },
    created() {
        if( this.$store.state.auth.user ){
            this.$store.dispatch("admin/getArticles")
            this.$store.dispatch("admin/getAuditStates")
            this.$store.dispatch("admin/getAsstTechnologies")
            this.$store.dispatch("admin/getSoftwareUsed")
        }
    },
    mounted() {
    },
    components: {
        Loader,
        Modal,
        SearchList,
        Card,
        TextInput,
        TextArea,
    },
}
</script>