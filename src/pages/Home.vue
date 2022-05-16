<template>
    <FunctionMoon local="home" />
    <Edit @controlEdit="controlEdit" v-show="editFlag" />
    <Alert @controlAlert="controlAlert" v-show="alertFlag" />
    <div class="bg">
        <div class="avatar-area">
            <Avatar />
        </div>
        <!-- 导航栏 -->
        <div class="nav-area">
            <NavButton title="心情" color="#AF37D9" tag="emo" />
            <NavButton title="便笺" color="#DE477E" tag="note" />
            <NavButton title="提醒" color="#EB7347" tag="remind" />
            <NavButton title="聊天" color="#84AF9B" tag="chat" />
        </div>
        <div class="nav-area-shadow"></div>
        <!-- 功能区 -->
        <div class="show-area">
            <router-view name="home"></router-view>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import FunctionMoon from 'coms/FunctionMoon.vue'
import Avatar from 'coms/Avatar.vue'
import NavButton from 'coms/NavButton.vue'
import Edit from 'coms/Edit.vue'
import Alert from 'coms/Alert.vue'

const editFlag = ref(false)
const alertFlag = ref(false)

const controlEdit = () => {
    editFlag.value = !editFlag.value
}
const controlAlert = (flag) => {
    alertFlag.value = flag
}
</script>
<style lang="less" scoped>
.bg {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 80px;
    .avatar-area {
        width: auto;
        height: 200px;
    }
    // 导航区
    .nav-area {
        width: auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 100px;
    }
    .nav-area-shadow {
        width: 1371px;
        height: 1px;
        margin-top: 100px;
        box-shadow: 0px -140px 193px 43px #888888;
    }
    // 功能展示区
    .show-area {
        width: 100%;
        height: 100%;
        margin-top: 130px;
    }
}
</style>
