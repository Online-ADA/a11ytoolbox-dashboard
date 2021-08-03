<template>
	<div :id="`a${id}`" :class="{'fixed':open, 'hidden': !open}" class="inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center p-0">
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

			<!-- This element is to trick the browser into centering the modal contents. -->
			<span class="inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>
			
			<div :class="{'max-w-lg': size == 'compact', 'max-w-4xl': size == 'wide', 'max-w-full': size == 'full'}" class="modal-main relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform align-middle p-4 w-full">
				<div v-if="sizeButtons" class="flex ml-3 mt-2 absolute">
					<button @click="changeSize('compact')" aria-label="Change the size of this modal to be compact" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-blue hover:text-white text-xs">
						Compact
					</button>
					<button @click="changeSize('wide')"  aria-label="Change the size of this modal to be wide" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-blue hover:text-white text-xs">
						Wide
					</button>
					<button @click="changeSize('full')"  aria-label="Change the size of this modal to be full width" class="px-1 font-button rounded uppercase transition-colors duration-100 mx-1 bg-white text-pallette-grey border border-pallette-grey border-opacity-40 shadow hover:bg-pallette-blue hover:text-white text-xs">
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
			id: "",
			firstFocusableElement: false,
			lastFocusableElement: false,
			focusableElements: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			modal: false
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
		},
		generateUniqueID(){
			return Math.random().toString(36).substring(5)
		}
	},
	watch:{
		open(newVal){
			if( newVal ){
				setTimeout(()=>{
					this.firstFocusableElement.focus()
					this.firstFocusableElement.scrollIntoView({behavior:"smooth",block:"center"})
				}, 1)
			}
		}
	},
	mounted(){
		this.id = this.generateUniqueID() + this.generateUniqueID()
		
		this.$nextTick(() => {
			// add all the elements inside modal which you want to make focusable
			this.modal = document.querySelector(`#a${this.id}`); // select the modal by it's id

			this.firstFocusableElement = this.modal.querySelectorAll(this.focusableElements)[0] // get first element to be focused inside modal
			const focusableContent = this.modal.querySelectorAll(this.focusableElements)
			this.lastFocusableElement = focusableContent[focusableContent.length - 1] // get last element to be focused inside modal
			let self = this

			self.modal.addEventListener('keydown', function(e) {
				if (!e.code === 'Tab') {
					return
				}

				if (e.shiftKey && e.code === 'Tab') { // if shift key pressed for shift + tab combination
					if (document.activeElement === self.firstFocusableElement) {
						self.lastFocusableElement.focus() // add focus for the last focusable element
						// self.lastFocusableElement.scrollIntoView({behavior:"smooth",block:"center"})
						e.preventDefault()
					}
				} else { // if tab key is pressed
					if (document.activeElement === self.lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
						self.firstFocusableElement.focus(); // add focus for the first focusable element
						// self.firstFocusableElement.scrollIntoView({behavior:"smooth",block:"center"})
						e.preventDefault()
					}
				}
			});
			
		});
	}
}
</script>