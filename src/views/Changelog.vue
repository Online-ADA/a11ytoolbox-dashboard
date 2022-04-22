<template>
  <div>
	  <div class="headline pb-3">Changelog</div>

	  <Change>
		  	<div class="subheadline pb-1.5">1.0.2</div>
		  	<ul class="list-disc list-inside">
			  <li>Created the changelog!</li>
			  <li>Changed the canvas stylings on the Color Swatch Analysis page to make if full screen and more compact</li>
			  <li>Removed the no longer used "Accounts" entry on the user profile page</li>
			</ul>
	  </Change>
	  <Change>
		  	<div class="subheadline pb-1.5">1.0.1</div>
		  	<ul class="list-disc list-inside">
			  <li>Added a simplified view to the Add/Edit issues modal</li>
			  <li>Moved the automation history link out of the Global Settings dropdown and put it on the client toolbar</li>
			  <li>Fixed various incorrect styling on Success Criteria page modals</li>
			  <li>Fixed the viewport for the canvas to be a fixed size and sticky the horizontal and vertical scrollbars to the edges of the screen</li>
			  <li>Fixed a bug on the audit edit page where after refreshing the page, the project was not set</li>
			  <li>Changed the name of the add/edit issue modal field "Potential User Impact" to "Priority" to make it consistent with related table column name</li>
			  <li>Changed the name of the "Automated Audit Logs" page to "Automation History"</li>
			</ul>
	  </Change>
	</div>

</template>

<script>
import Change from '../components/Change.vue'

export default {

	name: 'Changelog',
	created(){
	},
	components:{
		Change
	}
}
</script>
