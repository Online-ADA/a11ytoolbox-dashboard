<template>
	<div class="text-center mx-auto">
	</div>
</template>

<script>
export default {
	data: () => ({
	}),
	computed: {
	},
	methods: {
	},
	created() {
        if(this.$store.state.projects.project) {
            this.$router.push({
                path: `/projects/${this.$store.state.projects.project.id}`
            });
        }else if(this.$store.state.clients.client){
            this.$router.push({
                path: `/clients/${this.$store.state.clients.client.id}`
            });
        }else{
            this.$router.push({
                path: `/`
            });
        }
	},
	mounted() {
	},
	components: {
	},
}

</script>
<style scoped>
</style>