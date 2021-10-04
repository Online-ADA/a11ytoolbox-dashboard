<template>
	<div class="text-center mt-32 container mx-auto">
		<Loader v-if="loading"></Loader>
		
		<A class="pr-3" type='router-link' :to="{path: `/domains/${$route.params.id}/edit`}">Edit Domain</A>
		<A class="pr-3" type='router-link' :to="{path: `/projects/${domain.project_id}`}">View Project</A>
		<A type='router-link' :to="{name: `NewScan`, params: {type:'domain', id: $route.params.id} }">Initiate Scan</A>
		<h2 class="mb-1">{{domain.title}}</h2>
		<h3 class="mb-3">{{domain.url}}</h3>
		
		<div class="flex">
			<div class="flex-1 flex flex-col">
				<h3 class="mb-3 w-full">Pages</h3>
				<Card style="max-height:400px;" class="p-4 flex-1 overflow-y-auto">
					<template v-if="domain && domain.pages.length">
						<ul class="mb-4 w-full">
							<li v-for="page in domain.pages" :key="page.id">
								{{page.url}}
								<!-- <A type='router-link' :to="{path: `/pages/${page.id}`}">{{page.url || page.description}}</A> -->
							</li>
						</ul>
					</template>
					<template v-else>
						There are no pages for this domain.
					</template>
				</Card>
			</div>
			<div class="flex-1 flex flex-col">
				<h3 class="mb-3 w-full">Structured Sample</h3>
				<Card style="max-height:400px;" class="p-4 flex-1 overflow-y-auto">
					<template v-if="domain && domain.sample.length">
						<ul class="mb-4 w-full">
							<li v-for="item in domain.sample" :key="item.id">
								{{item.title}}<span v-if="item.url"> - <A :href="item.url" :newTab="true" >{{item.url}}</A></span>
								<!-- <A type='router-link' :to="{path: `/pages/${page.id}`}">{{page.url || page.description}}</A> -->
							</li>
						</ul>
					</template>
					<template v-else>
						There is no structured sample for this domain
					</template>
				</Card>
			</div>
		</div>
	</div>
</template>

<script>
import Loader from '../../components/Loader'
import A from '../../components/Link'
import Card from '../../components/Card'
export default {
		data: () => ({
			file: false
		}),
		computed: {
			domain() {
				if( this.$store.state.domains ){
					return this.$store.state.domains.domain
				}
				return false
			},
			loading(){
				if( this.$store.state.domains ){
					return this.$store.state.domains.loading
				}
				return false
			},
		},
		props: [],
		watch: {},
		methods: {
			handleFile(e){
				this.file = e
			},
			getDomain(){
				this.$store.dispatch("domains/getDomain", {id: this.$route.params.id})
			},
			uploadSitemap(){
				if( this.file ){
					this.$store.dispatch("domains/saveSitemap", {id: this.$route.params.id, file: this.file, domain: this.domain.url})
				}
			}
		},
		created() {
			this.getDomain()
		},
		mounted() {
		},
		components: {
			Loader,
			A,
			Card
		},
}
</script>