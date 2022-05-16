<template>
    <div class="remind-item-bg">
        <span>{{ remind.startTime }}</span>
        <div
            class="remind-item-all"
            @mouseover="!remind.finish && remindMouseover()"
            @mouseout="!remind.finish && remindMouseout()"
        >
            <div
                class="remind-item-rate"
                :class="'remind-item-rate-' + remind.id"
                :style="{ width: startWidth + 'px' }"
            ></div>
            <div class="content" :title="remind.content">
                {{ remind.content }}
            </div>
            <div
                class="content-finish"
                :class="'content-finish-' + remind.id"
                :title="remind.content"
                @click="del"
            >
                删除
            </div>
            <div
                class="content-delete"
                :class="'content-delete-' + remind.id"
                :title="remind.content"
                @click="finish"
            >
                完成
            </div>

            <div
                v-if="remind.finish"
                class="content-over"
                :title="remind.content"
            >
                已完成
            </div>
        </div>
        <span>{{ remind.endTime }}</span>
    </div>
</template>
<script setup>
import { onMounted } from 'vue'
import anime from 'animejs'
import mitt from '@/utils/mitt'
import { deleteRemind, finishRemind } from '@/api'

const { remind } = defineProps({ remind: Object })

const beginTime = Date.parse(new Date(remind.startTime.replace(/-/g, '/')))
const endTime = Date.parse(new Date(remind.endTime.replace(/-/g, '/')))
const continueTime = endTime - beginTime
const now = new Date().getTime()
const surplusTime = endTime - now
const rate = 900 / continueTime
let startWidth = remind.finish ? 1000 : Math.trunc(rate * (now - beginTime))

const del = () => {
    deleteRemind(remind.id).then(() => {
        mitt.emit('loadRemind')
    })
}

const finish = () => {
    finishRemind(remind.id).then(() => {
        mitt.emit('loadRemind')
        mitt.emit('remindNum', false)
    })
}

const remindMouseover = () => {
    anime
        .timeline({ easing: 'easeOutExpo', duration: 1000 })
        .add({ targets: '.content-finish-' + remind.id, translateX: 0 })
        .add({ targets: '.content-delete-' + remind.id, translateX: 0 }, 0)
}

const remindMouseout = () => {
    anime
        .timeline({ easing: 'easeOutExpo', duration: 1000 })
        .add({ targets: '.content-finish-' + remind.id, translateX: -500 })
        .add({ targets: '.content-delete-' + remind.id, translateX: 500 }, 0)
}

onMounted(() => {
    //时间差的毫秒数
    if (!remind.finish) {
        anime({
            targets: '.remind-item-rate-' + remind.id,
            width: '1000px',
            easing: 'linear',
            duration: surplusTime,
            complete: function () {
                mitt.emit('openAlert', remind.id)
            }
        })
    }
})
</script>
<style lang="less">
@color: v-bind('remind.color');
.remind-item-bg {
    width: 1280px;
    height: 100px;
    margin: 0 auto 140px auto;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    span {
        width: 115px;
        font-family: fantasy;
    }
    .remind-item-all {
        width: 1000px;
        height: 100px;
        border-radius: 50px;
        border: 1px solid white;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        .remind-item-rate {
            height: 100px;
            background-color: @color;
            border-radius: 50px;
            float: left;
        }

        .content {
            float: left;
            position: absolute;
            width: 500px;
            max-width: 500px;
            height: 100px;
            border-radius: 50px;
            margin-left: 250px;
            font-size: 25px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 32px;
        }
        .content-finish {
            width: 500px;
            height: 100px;
            background: gray;
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
            position: absolute;
            left: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateY(-500px);
        }

        .content-delete {
            width: 500px;
            height: 100px;
            background: #d24d57;
            position: absolute;
            right: 0px;
            border-top-right-radius: 50px;
            border-bottom-right-radius: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateY(500px);
        }
        .content-over {
            width: 130px;
            height: 100px;
            background: #d24d57;
            position: absolute;
            right: 0px;
            border-top-right-radius: 50px;
            border-bottom-right-radius: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
