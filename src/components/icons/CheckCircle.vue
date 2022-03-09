<template>
<svg xmlns="http://www.w3.org/2000/svg" :style="`width:${size}px; height:${size}px;`" fill="none" :viewBox="`0 0 ${size} ${size}`" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
</template>

<script>
export default {
    name: 'CheckCircle',
    props:{
      'size': {
        type: String,
        default: '6',
      },
    }
}
</script>