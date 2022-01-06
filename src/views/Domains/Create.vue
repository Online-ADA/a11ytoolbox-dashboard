<template>
	<DomainCreate :independent="true"></DomainCreate>
</template>

<script>
import DomainCreate from '../../components/templates/domains/Create'

export default {
	data: () => ({
		
	}),
	computed: {
			
	},
	props: [],
	methods: {
		
	},
	created() {
		
	},
	mounted() {
		document.title = "Create New Domain"
	},
	components: {
		DomainCreate
	},
}
</script>