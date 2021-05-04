<template>
	<!-- This example requires Tailwind CSS v2.0+ -->
	<div :class="{'fixed':open, 'hidden': !open}" class="z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		
		<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center p-0">
			<!--
			Background overlay, show/hide based on modal state.

			Entering: "ease-out duration-300"
				From: "opacity-0"
				To: "opacity-100"
			Leaving: "ease-in duration-200"
				From: "opacity-100"
				To: "opacity-0"
			-->
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

			<!-- This element is to trick the browser into centering the modal contents. -->
			<span class="inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>

			<!--
			Modal panel, show/hide based on modal state.

			Entering: "ease-out duration-300"
				From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
				To: "opacity-100 translate-y-0 sm:scale-100"
			Leaving: "ease-in duration-200"
				From: "opacity-100 translate-y-0 sm:scale-100"
				To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
			-->
			<div :class="{'max-w-lg': size == 'compact', 'max-w-4xl': size == 'wide', 'max-w-full': size == 'full'}" class="modal-main relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform align-middle p-4 w-full">
				<div v-if="sizeButtons" class="flex ml-3 mt-2 absolute">
					<button @click="changeSize('compact')" aria-label="Change the size of this modal to be compact" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
						Compact
					</button>
					<button @click="changeSize('wide')"  aria-label="Change the size of this modal to be wide" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
						Wide
					</button>
					<button @click="changeSize('full')"  aria-label="Change the size of this modal to be full width" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-orange hover:text-white text-xs">
						Full
					</button>
				</div>
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.modal-main{
		transition: max-width ease-in-out 150ms;
	}
</style>

<script>
export default {
	data(){
		return {
			
		}
	},
	props: {
		open:{
			type: Boolean,
			default: false
		},
		sizeButtons: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: "compact"
		}
	},
	methods: {
		changeSize(size){
			this.size = size
		}
	}
}
</script>