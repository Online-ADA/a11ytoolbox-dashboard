<template>
    <div>
        <div class="flex w-full">
            <Card class="mb-5 mr-5 w-1/2 relative min-h-[400px]" :center="false" :gutters="false">
                <h2 class="headline">All Color Reports</h2>
                <ul class="flex flex-col " v-if="allReports.length">
                    <li class="flex items-center my-2" v-for="(report, id) in allReports" :key="'report-'+id">
                        <span class="mr-3">
                            {{report.title}}
                        </span>
                        <router-link class="standard mr-3" :to="{path: `/color-reports/${report.id}/edit`}">
                            Edit
                            <span class="sr-only"> color report {{report.title}}</span>
                        </router-link>
                        
                        <button class="standard alert" @click.prevent="confirmDeleteReport(report, $event)">
                            Delete
                            <span class="sr-only"> color report {{report.title}}</span>
                        </button>
                    </li>
                </ul>
                <template v-else>No Color Reports</template>
            </Card>
        </div>
        <Modal style="z-index:73;" :open="confirmDeleteModalOpen">
			<div class="bg-white px-4 pt-5 pb-4 p-6">
				<button aria-label="Close confirm delete color report modal" @click.prevent="confirmDeleteModalOpen = false" class="absolute top-4 right-4 standard">X</button>
				<h2 class="subheadline">Are you sure you want to delete {{ deleting.title }}?</h2>
			</div>
			<div class="bg-gray-50 px-4 py-3 flex">
				<button @click="confirmDeleteModalOpen = false" class="standard mr-3">
					Cancel
				</button>
				<button @click="deleteSwatch" class="standard alert">
					Delete
				</button>
			</div>
			
		</Modal>

        
    </div>
</template>

<script>
import Modal from "../../components/Modal.vue"
import Card from "../../components/Card.vue"
import { EventBus } from "../../services/eventBus"

export default {
    data: () => ({
        confirmDeleteModalOpen: false,
        deleting: false,
        EventBus: EventBus,
    }),
    computed: {
        allReports(){
            return this.$store.state.swatch.all
        },
    },
    props: [],
    watch: {},
    methods: {
        confirmDeleteSwatch(swatch, $event){
            this.deleting = swatch
        },
        getAllSwatches(){
            this.$store.dispatch( "swatch/getAllSwatches", {license_id: this.license_id})
        },
        deleteSwatch(){
            this.$store.dispatch( "swatch/deleteSwatch", {license_id: this.license_id, id: this.deleting.id})
            this.deleting = false
        }
    },
    created() {
    },
    mounted() {
        document.title = "Color Report Management"
        this.getAllSwatches()
    },
    components: {
      Modal,
      Card
    },
}
</script>