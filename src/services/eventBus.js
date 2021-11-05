import Vue from 'vue';
export const EventBus = new Vue({
	methods:{
		openModal( callback ){
			let classList = document.body.classList
			if( !classList.contains("modalOpen") ){
				classList.add("modalOpen")
			}
			callback()
		},
		closeModal( callback ){
			let classList = document.body.classList
			if( classList.contains("modalOpen") ){
				classList.remove("modalOpen")
			}
			callback()
		},
	}
});