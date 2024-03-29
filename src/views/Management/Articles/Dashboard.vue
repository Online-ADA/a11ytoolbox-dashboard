<template>
    <div class="flex flex-wrap container">
        <Loader v-if="loading"></Loader>
        <div class="flex w-full my-4">
            <Card :center="false" class="xs:w-full w-2/3 relative">
                <h2 class="mb-2 headline">Success Criteria</h2>
                <button aria-label="Add new success criterion" @click="displayArticlePopup(newItem({item: newArticle, extra: 'article'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && articles.length">
                    <SearchList :dataSendBack="'article'" @click="displayArticlePopup" hover-effect="grow" :displayProps="['title', 'number', 'description']" :items="articles"></SearchList>
                </template>
                <div v-else>There are no success criteria</div>
            </Card>
        </div>
        <div class="flex w-full my-4">
            <Card :center="false" class="xs:w-full w-2/3 relative">
                <h2 class="headline">Techniques</h2>
                <button aria-label="Add new technique" @click="displayArticlePopup(newItem({item: newTechnique, extra: 'technique'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && techniques.length">
                    <SearchList :dataSendBack="'technique'" @click="displayArticlePopup" hover-effect="grow" :displayProps="['title', 'number', 'description']" :items="techniques"></SearchList>
                </template>
                <div v-else>There are no techniques</div>
            </Card>
        </div>
        <div class="flex w-full my-4">
            <Card :center="false" class="xs:w-full w-2/3 relative">
                <h2 class="headline xs:text-[26px] sm:text-3xl">Recommendations</h2>
                <button aria-label="Add new recommendation" @click="displayArticlePopup(newItem({item: newRecommendation, extra: 'recommendation'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && recommendations.length">
                    <SearchList :dataSendBack="'recommendation'" @click="displayArticlePopup" hover-effect="grow" :displayProps="['description']" :items="recommendations"></SearchList>
                </template>
                <div v-else>There are no recommendations</div>
            </Card>
        </div>
        <div class="flex w-full my-4">
            <Card :center="false" class="xs:w-full w-2/3 relative">
                <h2 class="headline">Audit States</h2>
                <button aria-label="Add a new audit state" @click="displayArticlePopup(newItem({item: newState, extra: 'audit_state'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && states.length">
                    <SearchList :displayProps="['content']" :dataSendBack="'audit_state'" @click="displayArticlePopup" hover-effect="grow" :items="states"></SearchList>
                </template>
                <div v-else>There are no audit states</div>
            </Card>
        </div>
        <div class="flex w-full my-4">
            <Card :center="false" class="xs:w-full w-2/3 relative">
                <h2 class="headline">Assistive Technologies</h2>
                <button aria-label="Add a new assistive technology" @click="displayArticlePopup(newItem({item: newAsstTech, extra: 'assistive_tech'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && assistiveTechnologies.length">
                    <SearchList :displayProps="['content']" :dataSendBack="'assistive_tech'" @click="displayArticlePopup" hover-effect="grow" :items="assistiveTechnologies"></SearchList>
                </template>
                <div v-else>There are no assistive technologies</div>
            </Card>
        </div>
        <div class="flex w-full my-4">
            <Card :center="false" class="xs:w-full w-2/3 relative">
                <h2 class="headline">Software Used</h2>
                <button aria-label="Add new software used" @click="displayArticlePopup(newItem({item: newSoftwareUsed, extra: 'software_used'}))" type="button" class="absolute bg-pallette-green mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && softwareUsed.length">
                    <SearchList :displayProps="['content']" :dataSendBack="'software_used'" @click="displayArticlePopup" hover-effect="grow" :items="softwareUsed"></SearchList>
                </template>
                <div v-else>There are no software used</div>
            </Card>
        </div>
        <Modal class="mt-10" :open="articleModalOpen" :sizeButtons="articleEditItem.identifier == 'recommendation'">
            <button aria-label="Close modal" class="standard absolute top-4 right-4 " @click.prevent="( ()=> {articleModalOpen = false; articleEditItem = false})">X</button>
            <div class="flex flex-col items-start">
                <template v-if="articleEditItem.identifier == 'article'">
                    <div class="w-full">
                        <Label :stacked="false" for="article-title">Title<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                        <TextInput required class="w-full" id="article-title" v-model="articleEditItem.title"></TextInput>
                    </div>
                    <div class="flex w-full mr-3.5 mt-2">
                        <div class="mr-3.5 w-1/3">
                            <Label :stacked="false" class="" for="article-level">Level<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                            <TextInput required class="w-full" id="article-level" v-model="articleEditItem.level"></TextInput>
                        </div>
                        <div class="w-1/3">
                            <Label :stacked="false" class="" for="article-number">Number<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                            <TextInput required class="w-full" id="article-number" v-model="articleEditItem.number"></TextInput>
                        </div>
                    </div>
                    <div class="mt-2 w-full">
                        <Label :stacked="false" class="" for="article-desc">Description<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                        <TextArea required rows="6" id="article-desc" v-model="articleEditItem.description" class="text-sm text-pallette-grey w-full"></TextArea>
                    </div>
                    <div class="w-full mt-2">
                        <Label :stacked="false" class="" for="article-url">Internal URL</Label>
                        <TextInput class="w-full" id="article-url" v-model="articleEditItem.url"></TextInput>
                    </div>
                    <div class="w-full mt-2">
                        <Label :stacked="false" class="" for="article-ext_url">External URL</Label>
                        <TextInput class="w-full" id="article-ext_url" v-model="articleEditItem.ext_url"></TextInput>
                    </div>
                </template>
                <template v-else-if="articleEditItem.identifier == 'technique'">
                    <div class="w-full">
                        <Label :stacked="false" class="" for="tech-article">Select success criteria</Label>
                        <button :class="{inverted: displayTechArticlesBy != 'title'}" class="standard mr-2 mb-2" @click="changeTechArticleDisplay('title')" aria-label="Change the display of the articles within the select to show the articles' title" aria-controls="tech-article">Title</button>
                        <button :class="{inverted: displayTechArticlesBy != 'number'}" class="standard mb-2" @click="changeTechArticleDisplay('number')" aria-label="Change the display of the articles within the select to show the articles' number" aria-controls="tech-article">Number</button>
                        <!-- <Select @input="test" multiple name="tech-article" id="tech-article" class="mx-auto w-full" :options="articles" :displayProp="displayTechArticlesBy" valueProp="id" v-model="articleEditItem.article_ids"></Select> -->
                        <select name="tech-article" id="tech-article" multiple v-model="articleEditItem.article_ids" class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-red p-2 rounded shadow w-full">
                            <option :value="option.id" v-for="(option, index) in articles" :key="index">{{option[displayTechArticlesBy]}}</option>
                        </select>
                    </div>

                    <div class="w-full mt-2">
                        <Label :stacked="false" class="" for="tech-title">Title<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                        <TextInput required class="w-full" id="tech-title" v-model="articleEditItem.title"></TextInput>
                    </div>
                    <div class="flex w-full mt-2">
                        <div class="w-1/3">
                            <Label :stacked="false" class="" for="tech-number">Number<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                            <TextInput required class="w-full" id="tech-number" v-model="articleEditItem.number"></TextInput>
                        </div>
                    </div>
                    <div class="mt-2 w-full">
                        <Label :stacked="false" class="" for="tech-desc">Description<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                        <TextArea required rows="6" id="tech-desc" v-model="articleEditItem.description" class="text-sm text-pallette-grey w-full"></TextArea>
                    </div>
                    <div class="w-full mt-2">
                        <Label :stacked="false" class="" for="tech-ext_url">External URL</Label>
                        <TextInput class="w-full" id="tech-ext_url" v-model="articleEditItem.ext_url"></TextInput>
                    </div>
                </template>
                <template v-else-if="articleEditItem.identifier == 'audit_state'">
                    <!-- <div class="w-full ">
                        <h2 class="mb-6 headline">Create new audit state</h2>
                    </div> -->
                    <div class="w-full mt-2">
                        <Label :stacked="false" class="" for="state-title">Audit State<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                        <TextInput required class="w-full" id="state-title" v-model="articleEditItem.content"></TextInput>
                    </div>
                </template>
                <template v-else-if="articleEditItem.identifier == 'software_used'">
                    <!-- <div class="w-full ">
                        <h2 class="mb-6 headline">Create new software used</h2>
                    </div> -->
                    <div class="w-full mt-2">
                        <Label :stacked="false" class="" for="state-title">Software Used<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                        <TextInput required class="w-full" id="state-title" v-model="articleEditItem.content"></TextInput>
                    </div>
                </template>
                <template v-else-if="articleEditItem.identifier == 'assistive_tech'">
                    <!-- <div class="w-full ">
                        <h2 class="mb-6 headline">Create new assistive technology</h2>
                    </div> -->
                    <div class="w-full mt-2">
                        <Label :stacked="false" class="" for="asst-title">Assistive Technology<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                        <TextInput required class="w-full" id="asst-title" v-model="articleEditItem.content"></TextInput>
                    </div>
                </template>
                <template v-else-if="articleEditItem.identifier == 'failure'">
                    <div class="w-full">
                        <Label :stacked="false" class="" for="fail-article">Select success criteria</Label>
                        <button class="standard inverted mx-2 mb-2" @click="changeFailArticleDisplay('title')" aria-label="Change the display of the articles within the select to show the articles' title" aria-controls="fail-article">Title</button>
                        <button class="standard inverted mb-2" @click="changeFailArticleDisplay('number')" aria-label="Change the display of the articles within the select to show the articles' number" aria-controls="fail-article">Number</button>
                        <!-- <Select @input="test" multiple name="fail-article" id="fail-article" class="mx-auto w-full" :options="articles" :displayProp="displayTechArticlesBy" valueProp="id" v-model="articleEditItem.article_ids"></Select> -->
                        <select name="fail-article" id="fail-article" multiple v-model="articleEditItem.article_ids" class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-red p-2 rounded shadow w-full">
                            <option :value="option.id" v-for="(option, index) in articles" :key="index">{{option[displayFailArticlesBy]}}</option>
                        </select>
                    </div>

                    <div class="w-full mt-2">
                        <Label :stacked="false" class="" for="fail-title">Title<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                        <TextInput required class="w-full" id="fail-title" v-model="articleEditItem.title"></TextInput>
                    </div>
                    <div class="flex w-full mt-2">
                        <div class="w-1/3">
                            <Label :stacked="false" class="" for="fail-number">Number<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                            <TextInput required class="w-full" id="fail-number" v-model="articleEditItem.number"></TextInput>
                        </div>
                    </div>
                    <div class="mt-2 w-full">
                        <Label :stacked="false" class="" for="tech-desc">Description<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                        <TextArea required rows="6" id="tech-desc" v-model="articleEditItem.description" class="text-sm text-pallette-grey w-full"></TextArea>
                    </div>
                    <div class="w-full mt-2">
                        <Label :stacked="false" class="" for="tech-ext_url">External URL</Label>
                        <TextInput class="w-full" id="tech-ext_url" v-model="articleEditItem.ext_url"></TextInput>
                    </div>
                </template>
                <template v-else-if="articleEditItem.identifier == 'recommendation'">
                    <div class="w-full">
                        <Label :stacked="false" class="" for="recc-article">Select success criteria</Label>
                        <button :class="{inverted: displayReccArticlesBy != 'title'}" class="standard mx-2 mb-2" @click="changeReccArticleDisplay('title')" aria-label="Change the display of the articles within the select to show the articles' title" aria-controls="recc-article">Title</button>
                        <button :class="{inverted: displayReccArticlesBy != 'number'}" class="standard mb-2" @click="changeReccArticleDisplay('number')" aria-label="Change the display of the articles within the select to show the articles' number" aria-controls="recc-article">Number</button>
                        <!-- <Select multiple name="recc-article" id="recc-article" class="mx-auto w-full" :options="articles" :displayProp="displayReccArticlesBy" valueProp="id" v-model="articleEditItem.article_ids"></Select> -->
                        <select name="recc-article" id="recc-article" multiple v-model="articleEditItem.article_ids" class="block border cursor-pointer focus:ring-1 outline-none ring-pallette-red p-2 rounded shadow w-full">
                            <option :value="option.id" v-for="(option, index) in articles" :key="index">{{option[displayReccArticlesBy]}}</option>
                        </select>
                    </div>
                    <div class="mt-2 w-full">
                        <Label :stacked="false" class="" for="recc-desc">Description<small class="pl-1 text-pallette-red" aria-hidden="true">*</small></Label>
                        <TextArea required rows="6" id="recc-desc" v-model="articleEditItem.description" class="text-sm text-pallette-grey w-full"></TextArea>
                    </div>
                </template>
            </div>
            
            <div class="flex mt-3">
                <button @click="createOrUpdateItem" type="button" class="standard mr-2">
                Save
                </button>
                <button v-if="articleEditItem.id" @click="confirmDelete" type="button" class="standard alert">
                Delete
                </button>
            </div>
        </Modal>
        <Modal class="adjust-with-sidebars" :open="confirmDeleteModalOpen">
			<button @click="confirmDeleteModalOpen = false" type="button" class="standard absolute top-4 right-4">X</button>
			<div class="bg-white">
				<delete-confirm-icon></delete-confirm-icon>
						
				<h3 class="subheadline" id="modal-title">Delete {{getSingular(articleEditItem.identifier)}}</h3>
				<div class="mt-2">
					<p>
						Are you sure you want to delete this {{getSingular(articleEditItem.identifier)}}? This will delete all associated working sample pages and issues as well. This action cannot be undone.
					</p>
				</div>
			</div>
			
			<button @click="deleteConfirmed" type="button" class="standard alert mt-2">Delete</button>
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
import Label from '../../../components/Label.vue'
import DeleteConfirmIcon from '../../../components/DeleteConfirmIcon.vue'

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
            return this.$store.state.admin.loading.articles
        },
        articles() {
            return this.$store.state.admin.articles
        },
        failures() {
            return this.$store.state.admin.failures
        },
        states() {
            return this.$store.state.audits.audit_states
        },
        assistiveTechnologies(){
            return this.$store.state.admin.assistive_techs
        },
        softwareUsed(){
            return this.$store.state.admin.software_used
        },
        techniques() {
            return this.$store.state.admin.techniques
        },
        recommendations() {
            return this.$store.state.admin.recommendations
        },
    },
    props: [],
    watch: {
        "$store.state.auth.user": function(newVal){
            if( newVal ){
                this.$store.dispatch("admin/getArticles")
                this.$store.dispatch("audits/getAuditStates")
                this.$store.dispatch("admin/getAsstTechnologies")
                this.$store.dispatch("admin/getSoftwareUsed")
            }
        }
    },
    methods: {
        // Import() {
        //     this.$store.dispatch('admin/importSuccessCriteria',{Success:this.ReloadSuccessCriteria})
        // },
        // ReloadSuccessCriteria() {
        //     this.$store.dispatch("admin/getArticles")
        //     this.$store.dispatch("audits/getAuditStates")
        //     this.$store.dispatch("admin/getAsstTechnologies")
        //     this.$store.dispatch("admin/getSoftwareUsed")
        // },
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
            this.$store.dispatch("audits/getAuditStates")
            this.$store.dispatch("admin/getAsstTechnologies")
            this.$store.dispatch("admin/getSoftwareUsed")
        }
    },
    mounted() {
        document.title = "Audit Extras Management Dashboard"
    },
    components: {
        Loader,
        Modal,
        SearchList,
        Card,
        TextInput,
        TextArea,
        Label,
        DeleteConfirmIcon,
    },
}
</script>