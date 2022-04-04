<template>
	<div class="">
		<Loader v-if="loading"></Loader>
		
		<h1 class="headline mb-3">
			{{domain.url}}<template v-if="domain.root">/{{domain.root}}</template>
		</h1>
		
		<div class="flex">
			<div class="flex-1 flex flex-col">
				<h2 class="subheadline mb-3 w-full">Pages</h2>
				<Card :gutters="false" style="max-height:400px;" class="mr-3 p-4 flex-1 overflow-y-auto">
					<template v-if="domain && domain.pages.length">
						<ul class="mb-4 w-full">
							<li v-for="page in domain.pages" :key="page.id">
								{{page.url}}
							</li>
						</ul>
					</template>
					<template v-else>
						There are no pages for this domain.
					</template>
				</Card>
			</div>
			<div class="flex-1 flex flex-col">
				<h2 class="subheadline mb-3 w-full">Structured Sample</h2>
				<Card :gutters="false" style="max-height:400px;" class="p-4 flex-1 overflow-y-auto">
					<template v-if="domain && domain.sample.length">
						<ul class="mb-4 w-full">
							<li v-for="item in domain.sample" :key="item.id">
								<span>
									<template v-if="item.title">{{item.title}}</template>
									<template v-if="item.url && item.title"> - </template>
									<template v-if="item.url">{{item.url}}</template>
								</span>
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
			document.title = "Domain Overview"
		},
		components: {
			Loader,
			A,
			Card
		},
}
</script>