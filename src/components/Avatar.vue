<template>
    <div class="avatar">
        <div class="avatar-img">
            <img :src="userData.avatarUrl" />
        </div>
        <span class="avatar-name">{{ userData.nick }}</span>
        <span class="avatar-local"
            >{{ addressData.address }} {{ addressData.weather }}
            {{ addressData.temp }}℃</span
        >
    </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import { getLocalByIP, getWeatherByCity, getUserData } from '@/api'

const userData = reactive({
    nick: '桃酥的铲屎官',
    avatarUrl: ''
})

const addressData = reactive({
    address: '',
    weather: '',
    temp: 0
})
onMounted(() => {
    getLocalByIP().then((res) => {
        const {
            content: {
                address,
                address_detail: { adcode }
            }
        } = res
        addressData.address = address

        getWeatherByCity(adcode).then((res) => {
            const {
                result: {
                    now: { text, temp }
                }
            } = res
            addressData.weather = text
            addressData.temp = temp
        })
    })

    getUserData().then((res) => {
        const {
            data: { avatarUrl, nick }
        } = res
        if (avatarUrl) {
            userData.avatarUrl = avatarUrl
            localStorage.setItem('avatar', avatarUrl)
        } else {
            userData.avatarUrl = 'src/assets/avatar.jpg'
        }

        if (nick) userData.nick = nick
    })
})
</script>
<style lang="less">
.avatar {
    text-align: center;
    position: relative;
    z-index: 11;

    .avatar-img {
        width: 100px;
        height: 100px;
        max-width: 100px;
        max-height: 100px;
        border-radius: 50px;
        margin: 0 auto;
        user-select: none;
        cursor: pointer;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50px;
        }
    }
    .avatar-public {
        font-family: monospace;
        display: block;
        margin-top: 10px;
    }
    .avatar-name {
        font-size: 25px;
        letter-spacing: 2px;
        .avatar-public;
    }
    .avatar-local {
        .avatar-public;
        font-size: 15px;
    }
}
</style>
