<template>
    <div class="container">
        <Loader v-if="loading"></Loader>
        
        <template v-if="project">
            <h2 class="headline">All Domains for {{project.name}}</h2>
            <ul class="flex flex-col " v-if="domains.length">
                <li class="flex items-center my-2" v-for="(domain, id) in domains" :key="id">
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
        </template>

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
import Loader from '../../components/Loader'
import A from '../../components/Link'
import Modal from "../../components/Modal.vue"
import { EventBus } from "../../services/eventBus"

export default {
    data: () => ({
        attachedAudits: [],
        attemptingToDelete: false,
        cannotDeleteModalOpen: false,
        EventBus: EventBus
    }),
    computed: {
        loading(){
            return this.$store.state.domains.loading
        },
        domains(){
            return this.$store.state.projects.project ? this.$store.state.projects.project.domains : false
        },
        project(){
            return this.$store.state.projects.project
        }
    },
    props: [],
    watch: {},
    methods: {
        checkDeleteDomain(domain, $event){
            this.attachedAudits = []
            for (let x = 0; x < this.project.audits.length; x++) {
                let audit = this.project.audits[x];
                if( audit.domain_id === domain.id ){
                    this.attachedAudits.push(audit)
                }
            }

            if( this.attachedAudits.length ){
                EventBus.openModal(false, $event.target, ()=>{
                    this.attemptingToDelete = domain
                    this.cannotDeleteModalOpen = true
                })
                return
            }

            if( !this.attachedAudits.length ){
                this.$store.dispatch("domains/deleteDomain", {domain_id: domain.id})
            }
        }
    },
    created() {
    },
    mounted() {
        document.title = "Domain Management"
    },
    components: {
      Loader,
      A,
      Modal
    },
}
</script>