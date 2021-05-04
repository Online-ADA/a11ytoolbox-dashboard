<template>
    <fragment>
        <div v-html="temp"></div>
    </fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'

export default {
    props: ["temp"],
    components: {
        Fragment
    }
}
</script>