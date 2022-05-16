<template>
    <div class="remind-bg">
        <RemindItem
            v-for="remind in remindData.reminds"
            :key="nanoid()"
            :remind="remind"
            @loadRemind="loadRemind"
        />
        <div class="message" v-if="remindData.reminds.length == 0">
            没有要提醒的呢 ~ ~
        </div>
    </div>
</template>
<script setup>
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { nanoid } from 'nanoid'
import mitt from '@/utils/mitt'
import { getAllRemind } from '@/api'
import RemindItem from 'coms/RemindItem.vue'

const router = useRouter()

const remindData = reactive({
    reminds: []
})

const loadRemind = () => {
    getAllRemind().then((res) => {
        remindData.reminds = res.data
    })
}

mitt.on('loadRemind', () => {
    loadRemind()
})

onMounted(() => {
    mitt.emit('animeSelectMitt', router.currentRoute.value.name)
    loadRemind()
})

onBeforeUnmount(() => {
    mitt.emit('alert')
})
</script>
<style lang="less">
.remind-bg {
    width: 100vw;
    text-align: center;
}
</style>
