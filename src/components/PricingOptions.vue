<template>
    <div class="my-2">
        <div class="flex w-full">
            <div class="flex flex-col w-1/2 justify-center items-center">
                <div class="flex flex-col justify-center items-center" v-if="tiers[selected_tier] && tiers[selected_tier].product.custom_fields">
                    <div v-for="(field,i) in GetFeatures(tiers[selected_tier].product.custom_fields)" :key="i" class="my-2 text-[20px]">
                        <p>
                            <strong>
                                {{field.value}}
                            </strong>
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-1/2">
                <div v-for="(tier_data,i) in tiers" :key="i" tabindex="0" role="button" @click="TierSelected(i)" :class="[{'bg-pallette-blue text-white': i == selected_tier},'flex border my-2 p-4 relative']">
                    <div class="check justify-center items-center flex" v-if="i == selected_tier" >
                        <CheckCircle size="30" />
                    </div>
                    <div v-if="i == 'PAP'" class="product-name ml-6 text-[20px]">
                        Partner Agency Program
                    </div>
                    <div v-else class="product-name ml-6 text-[20px]">
                        {{i}}
                    </div>
                    <div class="ml-6 text-[20px]">
                        <span>$</span>
                        <span>{{GetPrice(tier_data.product.price)}}</span>
                        <span> / Month</span>
                    </div>
                    <div v-if="tier == i" class="px-2 text-[16px] italic absolute right-[-10px] top-[-15px] bg-pallette-blue text-white">
                        Your License
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CheckCircle from './icons/CheckCircle'
export default {
    name: 'PricingOptions',
    props:['tiers','tier'],
    data() {
        return {
            selected_tier: false,
        }
    },
    watch: {
        tier() {
            this.parseTiers()
        }
    },
    methods: {
        GetPrice(price) {
            price = parseInt(price)
            if(price == 0) return price
            return parseInt(price)/12
        },
        GetFeatures(custom_fields) {
            let features =  custom_fields.find((field)=>{return field.name == 'Features'})
            if(features.value && features.value.length) return features.value
            return []
        },
        TierSelected(index) {
            this.selected_tier = index
            this.$emit('option:update',index)
        }, 
        parseTiers() {
            for(let i in this.tiers) {
                if(i == this.tier) this.selected_tier = i
            }
        },
    },
    created() {
        this.parseTiers()
    },
    components: {
        CheckCircle
    },
}
</script>