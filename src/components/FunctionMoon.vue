<template>
    <div class="ball">
        <div>
            <span>功能</span>
        </div>

        <div
            class="moon-bg"
            @mouseover="functionBallMouseOver"
            @mouseleave="functionBallMouseLeave"
            @click="data.flag = !data.flag"
        >
            <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
        <!-- 功能列表 -->
        <ul class="ball-list" v-if="data.flag">
            <li v-if="!onAccountFlag" @click="toAccount">个人中心</li>
            <li v-if="onAccountFlag" @click="toHome">首页</li>
            <li @click="switchColor">换个颜色</li>
            <li @click="openEdit('emo')">发表心情</li>
            <li @click="openEdit('note')">添加便笺</li>
            <li @click="openEdit('remind')">添加提醒</li>
            <li @click="quitLogin">退出登录</li>
        </ul>
    </div>
    <!-- 功能操作区 -->
</template>
<script setup>
import { reactive, toRaw, computed } from 'vue'
import { useRouter } from 'vue-router'
import anime from 'animejs'
import mitt from '@/utils/mitt'

const router = useRouter()

const { local } = defineProps({ local: String })

const data = reactive({
    flag: false,
    title: '',
    content: '',
    switchColorFlag: false
})

const onAccountFlag = computed(() => {
    return local == 'account'
})

const switchColor = () => {
    data.switchColorFlag = !data.switchColorFlag
    if (data.switchColorFlag) {
        document
            .querySelector('body')
            .setAttribute(
                'style',
                'background:black !important; color:white !important;'
            )
    } else {
        document.querySelector('body').setAttribute('style', '')
    }
}

const openEdit = (type) => {
    mitt.emit('openEdit', { type })
}

const toAccount = () => {
    router.push({ name: 'account' })
}

const toHome = () => {
    router.push({ name: 'home' })
}

const quitLogin = () => {
    localStorage.removeItem('token')
    router.push({ name: 'login' })
}

//功能小球动画相关
const functionBallMouseOver = () => {
    anime({ targets: '.ball-bg', easing: 'easeOutExpo', scale: 0.85 })
}
const functionBallMouseLeave = () => {
    anime({ targets: '.ball-bg', easing: 'easeOutExpo', scale: 1 })
}
</script>
<style lang="less" scoped>
.ball {
    position: fixed;
    z-index: 50;
    right: 100px;
    top: 100px;
    cursor: pointer;
    .moon-bg {
        height: 7em;
        width: 7em;
        background-color: #eee;
        border-radius: 5em;
        position: fixed;
        z-index: 50;
        top: 1em;
        right: 1em;
        animation: moonlight 5s alternate infinite;

        li {
            position: absolute;
            list-style: none;
            background: #aaa;
            border-radius: 50%;
            box-shadow: inset 0.4em -0.05em 0.1em #777;
        }
        li:nth-child(1) {
            top: 1.15em;
            left: 1.25em;
            height: 0.75em;
            width: 0.75em;
        }
        li:nth-child(2) {
            top: 1.05em;
            left: 3.5em;
            height: 1.25em;
            width: 1.25em;
        }
        li:nth-child(3) {
            top: 2.95em;
            left: 1.1em;
            height: 1.75em;
            width: 1.75em;
        }
        li:nth-child(4) {
            top: 3em;
            left: 3.25em;
            height: 0.5em;
            width: 0.5em;
        }
        li:nth-child(5) {
            top: 4em;
            left: 5.25em;
            height: 0.65em;
            width: 0.65em;
        }
        li:nth-child(5) {
            top: 3.5em;
            left: 4.15em;
            height: 2.25em;
            width: 2.25em;
        }
        li:nth-child(6) {
            top: 5.25em;
            left: 2.5em;
            height: 1.25em;
            width: 1.25em;
        }

        @-webkit-keyframes moonlight {
            0% {
                box-shadow: inset -5px -4px 0px 0px rgba(50, 50, 50, 0.75),
                    0px 0px 20px rgba(255, 255, 255, 0.5);
            }
            100% {
                box-shadow: inset -5px -4px 0px 0px rgba(50, 50, 50, 0.75),
                    0px 0px 40px rgba(255, 255, 255, 0.75);
            }
        }

        @keyframes moonlight {
            0% {
                box-shadow: inset -5px -4px 0px 0px rgba(50, 50, 50, 0.75),
                    0px 0px 20px rgba(255, 255, 255, 0.5);
            }
            100% {
                box-shadow: inset -5px -4px 0px 0px rgba(50, 50, 50, 0.75),
                    0px 0px 40px rgba(255, 255, 255, 0.75);
            }
        }
    }

    .ball-list {
        position: fixed;
        z-index: 999;
        right: 170px;
        top: 70px;

        font-size: 20px;
        letter-spacing: 2px;
        user-select: none;
        list-style: none;

        li {
            margin-bottom: 25px;
            cursor: pointer;
        }
    }
}
</style>
