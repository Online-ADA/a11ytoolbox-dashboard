<template>
    <div class="flex flex-wrap">
        <div class="flex w-full justify-center my-4">
            <Card class="w-2/3 mx-auto relative">
                <h2 class="mb-2">Articles</h2>
                <button @click="displayArticlePopup(newArticle)" type="button" class="absolute bg-green-500 mr-4 mt-4 px-2.5 py-1 right-0 rounded text-small text-white top-0">+</button>
                <template v-if="!loading && articles.length">
                    <SearchList @click="displayArticlePopup" hover-effect="grow" :displayProps="['title', 'number', 'description']" :items="articles"></SearchList>
                </template>
                <div v-else>There are no articles</div>
            </Card>
        </div>
        <div class="flex w-full justify-center my-4">
            <Card class="w-2/3 mx-auto relative">
                <h2>Techniques</h2>
                <template v-if="!loading && techniques.length">
                    <SearchList :items="techniques"></SearchList>
                </template>
                <div v-else>There are no techniques</div>
            </Card>
        </div>
        <div class="flex w-full justify-center my-4">
            <Card class="w-2/3 mx-auto relative">
                <h2>Recommendations</h2>
                <template v-if="!loading && recommendations.length">
                    <SearchList :items="recommendations"></SearchList>
                </template>
                <div v-else>There are no recommendations</div>
            </Card>
        </div>
        <Modal :open="articleModalOpen">
            <div class="bg-white px-4 pt-5 pb-4 p-6 pb-4">
                <div class="flex items-start">
                    <div class="mt-3 text-left w-full">
                        <div class="w-full">
                            <Label class="text-lg leading-6 w-full" for="article-title">Title<small class="pl-1 text-pallette-orange-dark" aria-hidden="true">*</small></Label>
                            <TextInput required class="w-full" id="article-title" v-model="articleEditItem.title"></TextInput>
                        </div>
                        <div class="flex w-full justify-evenly mt-2">
                            <div class="w-1/3">
                                <Label class="text-lg leading-6 w-full" for="article-level">Level<small class="pl-1 text-pallette-orange-dark" aria-hidden="true">*</small></Label>
                                <TextInput required class="w-full" id="article-level" v-model="articleEditItem.level"></TextInput>
                            </div>
                            <div class="w-1/3">
                                <Label class="text-lg leading-6 w-full" for="article-number">Number<small class="pl-1 text-pallette-orange-dark" aria-hidden="true">*</small></Label>
                                <TextInput required class="w-full" id="article-number" v-model="articleEditItem.number"></TextInput>
                            </div>
                        </div>
                        <div class="mt-2 w-full">
                            <Label class="text-lg leading-6 w-full" for="article-desc">Description<small class="pl-1 text-pallette-orange-dark" aria-hidden="true">*</small><small class="pl-2">(This can be html or plain text)</small></Label>
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
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 flex flex-row-reverse">
                <button v-if="articleEditItem.id" @click="confirmDelete(articleEditItem, 'article')" type="button" class="mx-2 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-auto text-sm">
                Delete
                </button>
                <button @click="articleModalOpen = false" type="button" class="hover:bg-pallette-orange-light mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto text-sm">
                Cancel
                </button>
                <button @click="saveArticle" type="button" class="mx-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-pallette-orange hover:text-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-auto text-sm">
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
                            Confirm Delete {{confirmDeleteItem.title}}
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                Are you sure you want to delete this {{confirmDeleteType}}?
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
import A from '../../../components/Link'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import SearchList from '../../../components/SearchList'
import Card from '../../../components/Card'
import TextInput from '../../../components/TextInput'
import TextArea from '../../../components/TextArea'

export default {
    data: () => ({
        newArticle: {title: '', description: '', ext_url: '', url: '', level: '', number: ''},
        newTechnique: {article_id: '', description: '', number: '', title: ''},
        newRecommendation: {article_id: '', description: ''},
        articleModalOpen: false,
        articleEditItem: false,
        confirmDeleteModalOpen: false,
        confirmDeleteItem: false,
        confirmDeleteType: false,
        recommendationEditItem: false,
        recommendationModalOpen: false,
        techniqueEditItem: false,
        techinqueModalOpen: false
    }),
    computed: {
        loading(){
            if( this.$store.state.admin ){
                return this.$store.state.admin.loading.projects
            }
            return false
        },
        articles() {
            if( this.$store.state.admin ){
                return this.$store.state.admin.articles
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
            }
        }
    },
    methods: {
        deleteConfirmed(){
            this.confirmDeleteModalOpen = false
            let action = ""
            switch( this.confirmDeleteType ){
                case "article":
                    action = "admin/deleteArticle"
                    break;
                case "technique":
                    action = "admin/deleteTechnique"
                    break;
                case "recommendation":
                    action = "admin/deleteRecommendation"
                    break;
            }
            this.$store.dispatch(action, {id: this.confirmDeleteItem.id})
        },
        confirmDelete(item, type){
            this.closeModals()
            this.confirmDeleteModalOpen = true
            this.confirmDeleteItem = item
            this.confirmDeleteType = type
        },
        displayArticlePopup(item){
            this.articleEditItem = item
            this.articleModalOpen = true
        },
        saveArticle(){
            this.articleModalOpen = false
            this.$store.dispatch("admin/saveArticle", {article: this.articleEditItem})
        },
        closeModals(){
            this.articleModalOpen = false
            this.recommendationModalOpen = false
            this.techinqueModalOpen = false

            this.articleEditItem = false
            this.recommendationEditItem = false
            this.techniqueEditItem = false
        },
        deleteArticle(){
            this.modalOpen = false
            this.$store.dispatch("admin/deleteArticle", {id: this.deleteID})
        },
        deleteTechnique(){
            this.modalOpen = false
            this.$store.dispatch("admin/deleteTechnique", {id: this.deleteID})
        },
        deleteRecommendation(){
            this.modalOpen = false
            this.$store.dispatch("admin/deleteRecommendation", {id: this.deleteID})
        },
    },
    created() {
        if( this.$store.state.auth.user ){
            this.$store.dispatch("admin/getArticles")
        }
    },
    mounted() {
    },
    components: {
        Loader,
        A,
        Button,
        Modal,
        SearchList,
        Card,
        TextInput,
        TextArea
    },
}
</script>