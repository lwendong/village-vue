<template>
    <div>
        <div ref="local"></div>
        <br />
        <div>
            <EmoItem
                v-for="emo in pageData.emo"
                :key="emo.id"
                :emo="emo"
                @loadEmo="loadEmo"
            />
        </div>
        <div class="message" v-if="pageData.pageInfo.count == 0">
            感受不到你的心情呢 ~ ~
        </div>
        <div
            class="page"
            @click="toLocal()"
            v-if="pageData.pageInfo.count > 10"
        >
            <img
                v-show="lastPageShow"
                @click="lastPage"
                src="@/assets/arrow-up.png"
                alt="上一页"
            />
            <img
                v-show="nextPageShow"
                @click="nextPage"
                src="@/assets/arrow-down.png"
                alt="下一页"
            />
        </div>
    </div>
</template>
<script setup>
import { reactive, onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import mitt from '@/utils/mitt'
import { getAllEmoByPage, getEmotionCount } from '@/api'
import EmoItem from 'coms/EmoItem.vue'

const router = useRouter()
const local = ref(null)
const pageData = reactive({
    pageInfo: {
        pageNo: 1,
        pageSize: 10,
        count: 0
    },
    emo: []
})

const toLocal = () => {
    local.value.scrollIntoView()
}

const lastPageShow = computed(() => {
    return pageData.pageInfo.pageNo != 1
})

const nextPageShow = computed(() => {
    const { pageNo, pageSize, count } = pageData.pageInfo
    return count - pageNo * pageSize > 0
})

const nextPage = () => {
    pageData.pageInfo.pageNo += 1
    loadEmo()
}

const lastPage = () => {
    pageData.pageInfo.pageNo -= 1
    loadEmo()
}

const loadEmo = () => {
    getAllEmoByPage(pageData.pageInfo).then((res) => {
        pageData.emo = res.data
    })
    getEmotionCount().then((res) => {
        pageData.pageInfo.count = res.data
    })
}

mitt.on('loadEmo', () => {
    loadEmo()
})

onMounted(() => {
    mitt.emit('animeSelectMitt', router.currentRoute.value.name)
    loadEmo()
})
</script>
<style lang="less">
.message {
    width: 100%;
    text-align: center;
    font-size: 25px;
}
.page {
    width: 185px;
    height: 61px;
    margin: 0 auto;
    transform: translateY(-100px);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    img {
        margin: 0 60px 0 60px;
        transform: scale(1.4);
    }
}
</style>
