<template>
    <div class="w-full">
        <div 
        class="flex w-full items-stretch" 
        :class="[align=='center' ? 'justify-center' : align == 'left' ? 'justify-start' : align=='right' ? 'justify-flex-end' : '']" >
            <div :class="[ {'mr-2': index != Object.entries(items).length -1} ]" class="radio relative" v-for="(item, index) in items" :key="`${groupName} - ${index}`">
                <input 
                :aria-labelledby="groupName + '-' + index + '-label'" 
                class="absolute top-0 left-0 z-0" 
                v-model="selected" 
                :name="groupName" 
                type="radio" 
                :id="groupName + '-' + index" 
                :value="item.value" 
                />
                <button @click="select(index)" tabindex="-1" class="standard z-[1] relative h-full">
                    <span :id="groupName + '-' + index + '-label'">{{item.display}}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            default: function(){
                return [{
                    display: "no items",
                    value: "0"
                }]
            }
        },
        align: {
            default : 'left'
        }
    },
    data(){
        return {
            groupName: "x" + Math.random().toString(36).substring(5),
            selected: this.$attrs.value ? this.$attrs.value : this.items.length ? this.items[0].value : false
        }
    },
    watch:{
        selected(newVal){
            this.$emit("input", newVal)
        },
        "$attrs.value": function(newVal){
            this.selected = newVal
        }
    },
    methods:{
        select(index){
            this.selected = this.items[index].value
        }
    },
}
</script>
<style scoped>
    .radio input ~ button {
        background-color: #fff;
        color: #000;
    }
    .radio input:checked ~ button {
        background-color: rgb(0 68 88);
        color: #fff;
    }
    input[type="radio"]:focus{
        outline:0;
        border:0;
        top:5px;
        left:5px;
    }
    input[type="radio"]:focus ~ button{
      outline: 2px dashed black;
      outline-offset: 2px;
    }
</style>