<template>
  <div class="min-w-max">
    <nav aria-label="pagination" class="flex justify-between bg-white border border-gray-200 px-10 py-3 text-gray-700 font-montserrat">
      <div class="flex-1 flex items-center justify-between">
        
        <p aria-atomic="true" aria-live="polite" class="text-sm text-gray-700">
          Showing
          {{ ' ' }}
          <span class="font-medium">{{getLowRange()}}</span>
          {{ ' ' }}
          to
          {{ ' ' }}
          <span class="font-medium">{{getHighRange()}}</span>
          {{ ' ' }}
          of
          {{ ' ' }}
          <span class="font-medium">{{total}}</span>
          {{ ' ' }}
          results
        </p>
        
      </div>
      <ul class="flex items-center">
        <li class="" v-if="hasPrev()">
          <button aria-label="Go to previous page" class="relative inline-flex items-center border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" 
          @click.prevent="changePage(prevPage, 'previous')">
            <div class="flex items-center justify-center hover:bg-gray-200 h-6 w-6">
              &lt;
            </div>
          </button>
        </li>
        <li class="" v-if="hasFirst()">
          <button :ref="`page-button-${1}`" aria-label="Go to first page" class="relative inline-flex items-center border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" 
          @click.prevent="changePage(1, 'page')">
            <div class="flex hover:bg-gray-200 h-6 w-6 items-center justify-center">
              <span class="">
                1
              </span>
            </div>
          </button>
        </li>
        <li class="px-2" v-if="hasFirst()">...</li>
        <li class="" v-for="(page, index) in pages" :key="`page-${index}`">
          <button :ref="`page-button-${page}`" :aria-label="`Go to page ${page}`" class="relative inline-flex items-center border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" 
          @click.prevent="changePage(page, 'page')">
            <div :class="{'bg-pallette-grey text-white': current == page}"
                class="flex hover:bg-gray-200 h-6 w-6 items-center justify-center">
              <span class="">{{ page }}</span>
            </div>
          </button>
        </li>
        <li class="px-2" v-if="hasLast()">...</li>
        <li class="" v-if="hasLast()">
          <button :ref="`page-button-${totalPages}`" aria-label="Go to last page" class="relative inline-flex items-center border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          @click.prevent="changePage(totalPages, 'page')">
            <div class="flex hover:bg-gray-200 h-6 w-6 items-center justify-center">
              <span class="">
                {{ totalPages }}
              </span>
            </div>
          </button>
        </li>
        <li class="" v-if="hasNext()">
          <button aria-label="Go to next page" class="relative inline-flex items-center border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" 
          @click.prevent="changePage(nextPage, 'next')">
            <div class="flex items-center justify-center hover:bg-gray-200 h-6 w-6">
              &gt;
            </div>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default{
  props: {
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    perPage: {
      type: Number,
      default: 10
    },
    pageRange: {
      type: Number,
      default: 2
    },
    textBeforeInput: {
      type: String,
      default: 'Go to page'
    },
    textAfterInput: {
      type: String,
      default: 'Go'
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    hasFirst: function () {
      return this.rangeStart !== 1
    },
    hasLast: function () {
      return this.rangeEnd < this.totalPages
    },
    hasPrev: function () {
      return this.current > 1
    },
    hasNext: function () {
      return this.current < this.totalPages
    },
    changePage: function (page, pressed) {
      if (page > 0 && page <= this.totalPages) {
        this.$emit('page-changed', page)
        console.log(page, pressed);
        if( pressed == 'page' ){
          setTimeout(() => {
            this.$refs['page-button-'+page][0].focus()
          }, 50);
        }
        if( pressed == 'next' && page == this.totalPages ){
          setTimeout(() => {
            this.$refs['page-button-'+this.totalPages][0].focus()
          }, 50);
        }
        if( pressed == 'previous' && page == 1 ){
          setTimeout(() => {
            this.$refs['page-button-1'][0].focus()
          }, 50);
        }
      }
    },
    getLowRange(){
      return this.perPage * (this.current - 1) + 1
    },
    getHighRange(){
      let high = this.perPage * (this.current - 1) + this.perPage
      if( high > this.total ){
        high = this.total
      }
      return high
    }
  },
  computed: {
    pages: function () {
      var pages = []
      for (var i = this.rangeStart; i <= this.rangeEnd; i++) {
        pages.push(i)
      }
      return pages
    },
    rangeStart: function () {
      var start = this.current - this.pageRange
      return (start > 0) ? start : 1
    },
    rangeEnd: function () {
      var end = this.current + this.pageRange
      return (end < this.totalPages) ? end : this.totalPages
    },
    totalPages: function () {
      return Math.ceil(this.total / this.perPage)
    },
    nextPage: function () {
      return this.current + 1
    },
    prevPage: function () {
      return this.current - 1
    }
  }
}
</script>

<style scoped>
</style>