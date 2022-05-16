<template>
    <FunctionMoon local="account" />
    <div class="account">
        <Avatar v-if="data.avatarFlag" />
        <div class="center">
            <div class="list">
                <ul>
                    <li>个人中心</li>
                    <li>我的信息</li>
                    <!-- <li>已发布心情</li> -->
                </ul>
            </div>
            <div class="show">
                <MyInfo v-if="data.myInfoFlag" @reloadMyInfo="reloadMyInfo" />
            </div>
        </div>
    </div>

    <div></div>
</template>
<script setup>
import { reactive, nextTick } from 'vue'
import FunctionMoon from 'coms/FunctionMoon.vue'
import Avatar from 'coms/Avatar.vue'
import MyInfo from 'coms/MyInfo.vue'

const data = reactive({
    myInfoFlag: true,
    avatarFlag: true
})
const reloadMyInfo = () => {
    data.myInfoFlag = !data.myInfoFlag
    nextTick(() => {
        data.myInfoFlag = !data.myInfoFlag
        reloadAvatar()
    })
}

const reloadAvatar = () => {
    data.avatarFlag = !data.avatarFlag
    nextTick(() => {
        data.avatarFlag = !data.avatarFlag
    })
}
</script>
<style lang="less">
.account {
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 11;
    padding-top: 40px;
    .center {
        width: 85%;
        height: 80%;
        margin: 0px auto;
        padding-top: 30px;
        padding-bottom: 30px;
        .list {
            height: 100%;
            width: 15%;
            float: left;
            border-right: 1px solid #dddddd;
            text-align: center;

            ul {
                list-style: none;

                padding: 0 45px 0 45px;
                li:nth-child(1) {
                    font-size: 30px;
                    user-select: none;
                    border: none;
                }

                li {
                    margin-bottom: 35px;
                    font-size: 20px;
                    padding-bottom: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #dddddd;
                }
            }
        }

        .show {
            height: 100%;
            width: 85%;
            float: right;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
