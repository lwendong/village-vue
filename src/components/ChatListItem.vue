<template>
    <div
        @click="startChat($event)"
        class="chat-list"
        :class="receiveMessageFlag ? 'list-alert' : ''"
    >
        <img
            v-if="data.userId == 'group'"
            class="chat-list-avatar"
            src="@/assets/users.png"
        />
        <img
            v-if="data.userId != 'group'"
            class="chat-list-avatar"
            :src="data.avatar"
        />
        <div class="chat-list-div">
            <span> {{ data.nick }} </span>
            <span> {{ data.address }}</span>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import mitt from '@/utils/mitt'

const { data } = defineProps(['data'])
const emit = defineEmits(['startChat', 'clearBG'])
console.log(data)
const receiveMessageFlag = ref(false)

const startChat = (e) => {
    receiveMessageFlag.value = false
    emit('clearBG')
    e.currentTarget.style.background = 'gray'
    emit('startChat', data)
}

onMounted(() => {
    mitt.on('receiveMessageAnime', (userId) => {
        if (userId == data.userId) {
            receiveMessageFlag.value = true
        }
    })
})
</script>
<style lang="less">
.list-alert {
    background-color: rgba(255, 56, 0, 0.4);
}
.start-char {
    background-color: rgba(96, 96, 96, 0.4);
}
.chat-list {
    width: 100%;
    height: 80px;
    margin-bottom: 30px;
    cursor: pointer;
    padding-left: 20px;

    .chat-list-avatar {
        width: 70px;
        height: 70px;
        border-radius: 40px;
        transform: translateY(6px);
    }

    .chat-list-div {
        width: calc(100% - 80px);
        height: 80px;
        float: right;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: flex-start;
        padding-left: 10px;
        font-family: monospace;
        font-size: 21px;
        letter-spacing: 1px;
        overflow: hidden;
        overflow: hidden;
    }
}
</style>
