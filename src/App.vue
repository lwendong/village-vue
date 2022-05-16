<script setup>
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import BgAnime from 'coms/BgAnime.vue'
import ClickAnime from 'coms/ClickAnime.vue'
NProgress.configure({
    easing: 'ease',
    speed: 500, // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
})
</script>
<template>
    <BgAnime />
    <ClickAnime />
    <router-view name="main"></router-view>
</template>

<style>
#nprogress .bar {
    height: 6px !important;
}
</style>
