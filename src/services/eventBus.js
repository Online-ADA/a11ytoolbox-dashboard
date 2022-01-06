import Vue from 'vue';
export const EventBus = new Vue({
	data: ()=>({
		originElements: []
	}),
	methods:{
		openModal( emit, $event, callback = false ){
			if( emit ){
				if( !callback ){
					callback = ()=>{ this.$emit(emit, true) }
				}
			}
			
			this.originElements.push($event.target)
			
			let classList = document.body.classList
			if( !classList.contains("modalOpen") ){
				classList.add("modalOpen")
			}
			callback()
		},
		transitionModal( close, open){
			this.$emit(close, false)
			this.$emit(open, true)
		},
		closeModal( callback ){
			let classList = document.body.classList
			if( classList.contains("modalOpen") ){
				classList.remove("modalOpen")
			}
			if( this.originElements.length ){
				let origin = this.originElements[this.originElements.length - 1]
				this.originElements.splice(this.originElements.length - 1, 1)
				origin.focus()
			}
			
			callback()
		},
	}
});