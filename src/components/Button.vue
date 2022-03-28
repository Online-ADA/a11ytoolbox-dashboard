<template>
    <button :class="classes" class="px-2 py-1 font-button rounded uppercase transition-colors duration-100" :type="type || 'button'"><slot></slot></button>
</template>


<script>
    export default {
        props:[
            'type',
            'label',
            'size',
            'color',
            'hover'
        ],
        name: 'Button',
        computed:{
            classes(){
                let classes = [];
                if( !this.color || this.color == "white" ){
                    classes.push("bg-white");
                    classes.push("text-pallette-grey");
                    classes.push("border");
                    classes.push("border-pallette-grey");
                    classes.push("border-opacity-40");
                    classes.push("shadow");
                    if( this.hover ){
                        classes.push("hover:bg-pallette-blue");
                        classes.push("hover:text-white");
                    }
                }
                if( this.color=="delete" ){
                    classes.push("hover:bg-red-600");
                    classes.push("hover:text-white");
                    classes.push("bg-white");
                    classes.push("text-red-600");
                }
                if( this.color == "yellow" ){
                    classes.push("bg-pallette-yellow");
                    if( this.hover ){
                        // classes.push("hover:bg-pallette-orange-dark");
                    }
                }
                if( this.color == "red" ){
                    classes.push("bg-pallette-red");
                    classes.push("text-white");
                    if( this.hover ){
                        classes.push("hover:bg-pallette-red-dark");
                    }
                }
                if( this.color == "blue" ){
                    classes.push("bg-pallette-blue");
                    classes.push("text-white");
                    if( this.hover ){
                        classes.push("hover:bg-pallette-blue");
                    }
                }
                if( this.color == "grey" ){
                    classes.push("bg-pallette-grey");
                    classes.push("text-white");
                    if( this.hover ){
                        classes.push("hover:bg-pallette-grey-dark");
                    }
                }
                if( this.size == 'sm' ){
                    classes.push("text-sm");
                }
                if( this.size == 'lg' ){
                    classes.push("text-lg");
                }

                return classes.join(" ")
            }
        },
        components: {}
    }
</script>
<style scoped>
</style>