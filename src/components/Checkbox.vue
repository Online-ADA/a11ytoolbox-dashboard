<template>
  <div class="relative flex items-center justify-center mx-2">
    <input v-bind="$attrs" :checked="isChecked || $attrs.checked" :value="value" type="checkbox" class="vs-checkbox--input absolute w-full h-full opacity-0 z-50 cursor-pointer" v-on="listeners">

    <!-- The container around the checkmark. Gets a background color -->
    <span class="ease-in -rotate-90 border-2 mr-2 cursor-pointer relative flex box-border rounded-sm overflow-hidden transform items-center justify-center" :class="container_classes">

        <!-- The actual check mark -->
        <span class="flex place-content-center w-full h-full absolute left-0 z-10 ease-in origin-right " :class="classes_check">
            <i :class="icon_classes" class="opacity-0 text-xs pt-0.5 ease-in text-center z-50 leading-none origin-center whitespace-nowrap fas fa-check"></i>
        </span>

    </span>
  </div>
</template>

<style scoped>
  input[type="checkbox"] ~ span{
    height:20px;
    width:20px;
  }
  span.rotate-0{
      --tw-rotate: 0deg;
  }
  i.opacity-100{
      opacity: 100;
  }
  i, span{
      transition: opacity .2s ease, transform .2s ease
  }
  input[type="checkbox"]:focus + span.border-pallette-blue{
    outline: 2px dashed black;
    outline-offset: 2px;
  }
</style>
<script>
export default {
  name:'VsCheckbox',
  inheritAttrs: false,
  props:{
    color:{
      default:'gold',
      type:String,
    },
    value:{},
    icon:{
      default:'check',
      type:String
    },
    vsValue:{
      type:[Boolean,Array,String,Number,Object],
      default:false
    },
    size:{
      default: 'default',
      type: String
    }
  },
  computed:{
    icon_classes(){
        let classes = []
        if( this.isChecked ){
            classes.push("opacity-100")
            classes.push("items-center")
            classes.push("justify-center")
            classes.push("flex")
        }
        if( this.color == "purple" ){
            classes.push("text-white")
        }
        if( this.color == "blue" ){
            classes.push("text-white")
        }
        if( this.color == "orange" ){
            classes.push("text-white")
        }
        if( this.color == "white" ){
            classes.push("text-pallette-grey")
        }
        if( this.color == "grey" ){
            classes.push("text-white")
        }
        if( this.color == "gold" ){
            classes.push("text-white")
        }

        return classes
    },
    classes_check() {
        let classes = []
        if( this.color == "orange" && this.isChecked ){
            classes.push("bg-pallette-orange")
        }
        if( this.color == "red" && this.isChecked ){
            classes.push("bg-pallette-red")
        }
        if( this.color == "purple" && this.isChecked ){
            classes.push("bg-pallette-purple")
        }
        if( this.color == "blue" && this.isChecked  ){
            classes.push("bg-pallette-blue")
        }
        if( this.color == "white" && this.isChecked ){
            classes.push("bg-white")
        }
        if( this.color == "grey" && this.isChecked ){
            classes.push("bg-pallette-grey")
        }
        if( this.color == "gold" && this.isChecked ){
            classes.push("bg-pallette-gold")
        }

        return classes
    },
    container_classes() {
        let classes = [];
        if( this.isChecked ){
            classes.push("rotate-0")
        }
        if( this.color == "orange" ){
            classes.push("border-pallette-orange")
            if( this.isChecked ){
                classes.push("bg-pallette-orange")
            }else{
                classes.push("bg-white")
            }
        }
        if( this.color == "purple" ){
            classes.push("border-pallette-purple")
            if( this.isChecked ){
                classes.push("bg-pallette-purple")
            }else{
                classes.push("bg-white")
            }
        }
        if( this.color == "blue" ){
            classes.push("border-pallette-blue")
            if( this.isChecked ){
                classes.push("bg-pallette-blue")
            }else{
                classes.push("bg-white")
            }
        }
        if( this.color == "white" ){
            classes.push("border-pallette-grey")
            classes.push("bg-white")
        }
        if( this.color == "grey" ){
            classes.push("border-pallette-grey")
            if( this.isChecked ){
                classes.push("bg-pallette-grey")
            }else{
                classes.push("bg-white")
            }
        }
        if( this.color == "gold" ){
            classes.push("border-pallette-gold")
            if( this.isChecked ){
                classes.push("bg-pallette-gold")
            }else{
                classes.push("bg-white")
            }
        }
        return classes
    },
    listeners() {
      return {
        change: (evt) => {
          this.toggleValue(evt)
        },
      }
    },
    isChecked() {
      return this.isArrayx() ? this.isArrayIncludes() : this.value
    },
  },
  methods:{
    toggleValue(evt) {
      if(this.isArrayx()) {
        this.setArray()
      } else if (typeof(this.vsValue) == 'string') {
        this.setValueString()
      }
      else {
        this.$emit('input', !this.value)
        this.$emit('change', evt)
      }
    },
    setArray() {
      // Copy Array
      const value = this.value.slice(0)
      if(this.isArrayIncludes()) {
        value.splice(value.indexOf(this.vsValue), 1)
        this.$emit('input', value)
        this.$emit('change', value)
      } else {
        value.push(this.vsValue)
        this.$emit('input', value)
        this.$emit('change', value)
      }
    },
    setValueString() {
      if(this.value == this.vsValue) {
        this.$emit('input', null)
        this.$emit('change', null)
      } else {
        this.$emit('input', this.vsValue)
        this.$emit('change', this.vsValue)
      }
    },
    isArrayIncludes() {
      let modelx = this.value
      let value = this.vsValue
      return modelx.includes(value)
    },
    isArrayx() {
      return Array.isArray(this.value)
    }
  }
}
</script>