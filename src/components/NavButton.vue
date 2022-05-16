<template>
    <div
        class="nav"
        @mouseover="mouseOverAnime"
        @mouseleave="mouseLeaveAnime"
        @click="selectNav"
    >
        <div :class="backgroundClass" class="nav-bg"></div>
        <div class="nav-other">
            <span class="nav-title">{{ title }}</span>
            <img
                src="@/assets/arrowup.png"
                :class="arrowClass"
                class="nav-arrow"
            />
        </div>
    </div>
</template>
<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import anime from 'animejs'
import mitt from '@/utils/mitt'

const router = useRouter()
const { title, color, tag } = defineProps({
    title: String,
    color: String,
    tag: String
})

const arrowClass = computed(() => {
    return 'arrow-' + tag
})

const backgroundClass = computed(() => {
    return 'background-' + tag
})

const animeExecuteFlag = ref(true)
onMounted(() => {
    mitt.on('animeRecoveryMitt', (navTag) => {
        if (navTag != tag) {
            animeExecuteFlag.value = true
            mouseLeaveAnimeFunction()
        }
    })

    mitt.on('animeSelectMitt', (navTag) => {
        if (navTag == tag) {
            animeExecuteFlag.value = false
            mouseOverAnime()
        }
    })
})
const selectNav = () => {
    animeExecuteFlag.value = false
    mitt.emit('animeRecoveryMitt', tag)
    router.push({ name: tag })
}

//控制鼠标移入移出动画
const mouseOverAnime = () => {
    mouseOverAnimeFunction()
}

const mouseLeaveAnime = () => {
    if (animeExecuteFlag.value) mouseLeaveAnimeFunction()
}

const bg = '.' + backgroundClass.value
const arrow = '.' + arrowClass.value
const mouseOverAnimeFunction = () => {
    anime
        .timeline({ easing: 'easeOutExpo' })
        .add({ targets: bg, scale: 1 })
        .add({ targets: arrow, opacity: 1, translateY: 20, rotate: 180 }, 10)
}

const mouseLeaveAnimeFunction = () => {
    anime
        .timeline({ easing: 'easeOutExpo' })
        .add({ targets: bg, scale: 0.1 })
        .add({ targets: arrow, opacity: 0, translateY: 100, rotate: 0 }, 10)
}
</script>
<style lang="less">
@color: v-bind('color');
.nav {
    position: relative;
    z-index: 11;
    height: 150px;
    width: 150px;
    cursor: pointer;
    margin: 100px;
    margin-top: 0;
    margin-bottom: 0;

    .nav-bg {
        position: absolute;
        z-index: 12;
        background: @color;
        height: 150px;
        width: 150px;
        border-radius: 50%;
        transform: scale(0.1);
        transform-origin: bottom;
    }

    .nav-other {
        position: absolute;
        z-index: 13;
        height: 150px;
        width: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        user-select: none;

        .nav-title {
            font-size: 30px;
            letter-spacing: 4px;
            color: white;
        }

        .nav-arrow {
            height: 45px;
            width: 60px;
            opacity: 0;
            transform: rotate(0deg) translateY(100px);
        }
    }
}
</style>
