<template>
    <div>
        <div class="flex w-full">
            <Card class="mb-5 mr-5 w-1/2 relative min-h-[400px]" :center="false" :gutters="false">
                <LocalLoader v-if="domainsLoading"></LocalLoader>
                <template v-if="!domainsLoading">
                    <h2 class="headline">All Domains</h2>
                    <ul class="flex flex-col " v-if="all.domains.length">
                        <li class="flex items-center my-2" v-for="(domain, id) in all.domains" :key="'domain-'+id">
                            <span class="mr-3">
                                {{domain.url}}<template v-if="domain.root">/{{domain.root}}</template>
                            </span>
                            <router-link class="standard mr-3" :to="{path: `/domains/${domain.id}/edit`}">
                                Edit
                                <span class="sr-only"> domain {{domain.url}}<template v-if="domain.root">/{{domain.root}}</template></span>
                            </router-link>
                            <!-- <A class="block mr-3 standard" type="router-link" :to="{path: `/domains/${domain.id}/edit`}">
                                Edit
                                <span class="sr-only"> domain {{domain.url}}<template v-if="domain.root">/{{domain.root}}</template></span>
                            </A> -->
                            <button class="standard alert" @click.prevent="checkDeleteDomain(domain, $event)">
                                <!-- <i class="fas fa-trash-alt"></i> -->
                                Delete
                                <span class="sr-only"> domain {{domain.url}}<template v-if="domain.root">/{{domain.root}}</template></span>
                            </button>
                        </li>
                    </ul>
                    <template v-else>No Domains</template>
                </template>
            </Card>
            <Card class="mb-5 w-1/2 relative min-h-[400px]" :center="false" :gutters="false">
                <LocalLoader v-if="softwareLoading"></LocalLoader>
                <template v-if="!softwareLoading">
                    <h2 class="headline">All Software</h2>
                    <ul class="flex flex-col " v-if="all.software.length">
                        <li class="flex items-center my-2" v-for="(software, id) in all.software" :key="'software-'+id">
                            <span class="mr-3">
                                {{software.title}}
                            </span>
                            <router-link class="standard mr-3" :to="{path: `/software/${software.id}/edit`}">
                                Edit
                                <span class="sr-only"> software {{software.title}}</span>
                            </router-link>
                            <button class="standard alert" @click.prevent="checkDeleteSoftware(software, $event)">
                                Delete
                                <span class="sr-only"> software {{software.title}}</span>
                            </button>
                        </li>
                    </ul>
                    <template v-else>No Software</template>
                </template>
            </Card>
        </div>
        

        <Modal class="adjust-with-sidebars" :open="cannotDeleteModalOpen">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="flex items-start">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <!-- Heroicon name: outline/exclamation -->
                        <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class="headline-2" id="modal-title">
                            Cannot Delete {{attemptingToDelete.url}}
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-gray-500">
                                This domain is currently attached to {{attachedAudits.length}} audit<template v-if="attachedAudits.length !== 1">s</template> and cannot be deleted
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3">
                <button @click="EventBus.closeModal(()=>{ cannotDeleteModalOpen = false; attemptingToDelete = false; attachedAudits = [] })" type="button" class="standard">
                Cancel
                </button>
            </div>
        </Modal>
    </div>
</template>

<script>
import LocalLoader from '../../components/LocalLoader'
import A from '../../components/Link'
import Modal from "../../components/Modal.vue"
import Card from "../../components/Card.vue"
import { EventBus } from "../../services/eventBus"

export default {
    data: () => ({
        attachedAudits: [],
        attemptingToDelete: false,
        cannotDeleteModalOpen: false,
        EventBus: EventBus,
        all: {
            software: [],
            domains: [],
            media_audits: [],
            wcag_audits: []
        },
        domainsLoading: true,
        softwareLoading: true,
        getAllPropsFired: false
    }),
    computed: {
    },
    props: [],
    watch: {
        "$store.state.auth.license":function(newVal){
            if( this.getAllPropsFired ){
                return
            }

            this.getAllProperties()
        }
    },
    methods: {
        checkDeleteSoftware(software, $event){

        },
        checkDeleteDomain(domain, $event){
            //Needs to check ALL audits across the entire license, not just those loaded in this project

            if( !this.attachedAudits.length ){
                this.$store.dispatch("domains/deleteDomain", {domain_id: domain.id})
            }
        },
        successCallback(data){
            this.all.domains = data.domains
            this.all.software = data.software

            this.domainsLoading = false
            this.softwareLoading = false
        },
        failCallback(){
            this.domainsLoading= false
            this.softwareLoading= false
        },
        getAllProperties(){
            this.$store.dispatch( "properties/getAllPropertiesForLicense", {license_id: this.license_id, callbacks: {success: this.successCallback, fail: this.failCallback} })
        }
    },
    created() {
    },
    mounted() {
        document.title = "Property Management"
        if( this.$store.state.auth.license.id ){
            this.getAllPropsFired = true
            this.getAllProperties()
        }
    },
    components: {
      LocalLoader,
      A,
      Modal,
      Card
    },
}
</script>