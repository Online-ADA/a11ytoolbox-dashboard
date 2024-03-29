<template>
    <div>
        <div class="flex w-full">
            <Card class="mb-5 mr-5 w-1/2 relative min-h-[400px]" :center="false" :gutters="false">
                <h2 class="headline">All Domains</h2>
                <ul class="flex flex-col " v-if="allDomains.length">
                    <li class="flex items-center my-2" v-for="(domain, id) in allDomains" :key="'domain-'+id">
                        <span class="mr-3">
                            {{domain.url}}<template v-if="domain.root">/{{domain.root}}</template>
                        </span>
                        <router-link class="standard mr-3" :to="{path: `/domains/${domain.id}/edit`}">
                            Edit
                            <span class="sr-only"> domain {{domain.url}}<template v-if="domain.root">/{{domain.root}}</template></span>
                        </router-link>
                        
                        <button class="standard alert" @click.prevent="checkDeleteDomain(domain, $event)">
                            <!-- <i class="fas fa-trash-alt"></i> -->
                            Delete
                            <span class="sr-only"> domain {{domain.url}}<template v-if="domain.root">/{{domain.root}}</template></span>
                        </button>
                    </li>
                </ul>
                <template v-else>No Domains</template>
            </Card>
            <Card class="mb-5 w-1/2 relative min-h-[400px]" :center="false" :gutters="false">
                <h2 class="headline">All Software</h2>
                <ul class="flex flex-col " v-if="allSoftware.length">
                    <li class="flex items-center my-2" v-for="(software, id) in allSoftware" :key="'software-'+id">
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
            </Card>
        </div>
        

        <Modal class="adjust-with-sidebars" :open="cannotDeleteModalOpen">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="flex items-start">
                    <delete-confirm-icon></delete-confirm-icon>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class="subheadline" id="modal-title">
                            <template v-if="attemptingType === 'software'">
                                Cannot delete software "{{attemptingToDelete.title}}"
                            </template>
                            <template v-if="attemptingType === 'domain'">
                                Cannot delete domain "{{attemptingToDelete.url}}"
                            </template>
                        </h3>
                        <div class="mt-2">
                            <p v-if="attemptingType === 'software'" class="text-sm text-gray-500">
                                This software is currently attached to {{attemptingToDelete.attachments}} audit<template v-if="attemptingToDelete.attachments !== 1">s</template> and cannot be deleted
                            </p>
                            <p v-if="attemptingType === 'domain'" class="text-sm text-gray-500">
                                This domain is currently attached to {{attemptingToDelete.attachments}} audit<template v-if="attemptingToDelete.attachments !== 1">s</template> and cannot be deleted
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3">
                <button @click="EventBus.closeModal(()=>{ cannotDeleteModalOpen = false; attemptingToDelete = false; attachedAudits = []; attemptingType = '' })" type="button" class="standard">
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
import DeleteConfirmIcon from "../../components/DeleteConfirmIcon.vue"
import { EventBus } from "../../services/eventBus"

export default {
    data: () => ({
        attachedAudits: [],
        attemptingToDelete: false,
        attemptingType: "",
        cannotDeleteModalOpen: false,
        EventBus: EventBus,
    }),
    computed: {
        allSoftware(){
            return this.$store.state.properties.all.software
        },
        allDomains(){
            return this.$store.state.properties.all.domains
        },
        projectSoftware(){
            return this.$store.state.projects.project.software || []
        }
    },
    props: [],
    watch: {
        "projectSoftware":function(newVal){
            //If this page is loaded while creating a new audit, and a new software is created, add it to the ALL SOFTWARE list
            if( newVal.length ){
                for (let x = 0; x < newVal.length; x++) {
                    const software = newVal[x];
                    if( !this.$store.state.properties.all.software.some( s=>s.id == software.id) ){
                        this.$store.state.properties.all.software.push(software)
                    }
                }
            }
        },
        "$store.state.auth.license":function(newVal){
            this.getAllProperties()
        }
    },
    methods: {
        checkDeleteSoftware(software, $event){
            if( software.attachments === 0 ){
                this.$store.dispatch("properties/destroySoftware", {id: software.id})
            }else{
                this.attemptingToDelete = software
                this.cannotDeleteModalOpen = true
                this.attemptingType = "software"
            }
        },
        checkDeleteDomain(domain, $event){
            //Needs to check ALL audits across the entire license, not just those loaded in this project

            if( domain.attachments === 0 ){
                this.$store.dispatch("domains/deleteDomain", {id: domain.id, client_id: this.$route.params.id})
            }else{
                this.attemptingToDelete = domain
                this.cannotDeleteModalOpen = true
                this.attemptingType = "domain"
            }
        },
        getAllProperties(){
            this.$store.dispatch( "properties/getAllPropertiesForClient", { client_id: this.$route.params.id })
        }
    },
    created() {
    },
    mounted() {
        document.title = "Property Management"
        this.getAllProperties()
    },
    components: {
      LocalLoader,
      A,
      Modal,
      Card,
      DeleteConfirmIcon
    },
}
</script>