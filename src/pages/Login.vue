<template>
    <div class="login_bg">
        <div class="left">
            <img src="@/assets/boji.png" />
        </div>
        <div class="right">
            <div class="right_top">
                <span>Village</span>
            </div>
            <div class="right_center">
                <div
                    @click="switchPage(1)"
                    class="welcome"
                    :class="{ 'boder-bottom': pageData.isLogin }"
                >
                    登录
                </div>
                <div
                    @click="switchPage(2)"
                    class="welcome"
                    :class="{ 'boder-bottom': !pageData.isLogin }"
                >
                    注册
                </div>
                <div class="input_div">
                    <label for="username">账号:</label><br />
                    <input
                        v-model="pageData.userInfo.username"
                        type="text"
                        id="username"
                        placeholder="5-12位小写字母和数字组成"
                    />
                    <br />
                    <label for="password">密码:</label><br />
                    <input
                        v-model="pageData.userInfo.password"
                        type="password"
                        id="password"
                        placeholder="5-12位小写字母和数字组成"
                    />

                    <div v-show="!pageData.isLogin">
                        <label for="confirmPassword">确认密码:</label><br />
                        <input
                            v-model="pageData.confirmPassword"
                            type="password"
                            id="confirmPassword"
                            placeholder="请再次输入密码!"
                        />
                    </div>
                    <br />
                    <div class="button_div">
                        <span>{{ pageData.errorMessage }}</span>
                        <input
                            type="button"
                            id="login"
                            :value="pageData.isLogin ? '登录' : '注册'"
                            @click="loginOrRegister"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '@/api'
const router = useRouter()

const pageData = reactive({
    isLogin: true,
    errorMessage: '',
    confirmPassword: '',
    userInfo: {
        username: '',
        password: ''
    }
})
const switchPage = (type) => {
    if (type == 1) {
        pageData.isLogin = true
    } else {
        pageData.isLogin = false
    }

    pageData.errorMessage = ''
}

const loginOrRegister = () => {
    if (!checkData()) return false
    if (pageData.isLogin) {
        login(pageData.userInfo).then((res) => {
            console.log(res)
            const {
                data: { flag, token, message }
            } = res
            if (flag) {
                localStorage.setItem('token', token)
                router.push({ name: 'remind' })
            }
            pageData.errorMessage = message
        })
    } else {
        register(pageData.userInfo).then((res) => {
            const {
                data: { flag, token, message }
            } = res
            if (flag) {
                localStorage.setItem('token', token)
                router.push({ name: 'remind' })
            }
            pageData.errorMessage = message
        })
    }
}

const pattern = /^[a-z0-9]{5,12}$/
const checkData = () => {
    if (pageData.userInfo.username == '' || pageData.userInfo.password == '') {
        pageData.errorMessage = '请输入内容！'
        return false
    }
    if (
        !(
            pattern.test(pageData.userInfo.username) &&
            pattern.test(pageData.userInfo.password)
        )
    ) {
        pageData.errorMessage = '账号或密码输入不正确'
        return false
    }
    if (!pageData.isLogin) {
        if (pageData.userInfo.password != pageData.confirmPassword) {
            pageData.errorMessage = '两次密码不一致'
            return false
        }
    }
    return true
}
</script>
<style lang="less" scoped>
.login_bg {
    width: 1480px;
    height: 800px;
    border-radius: 75px;
    box-shadow: 28px 34px 14px #888888;
    margin-left: 160px;
    margin-top: 25px;
    position: absolute;
    z-index: 11;

    .left {
        float: left;
        width: 65%;
        height: 800px;
        text-align: left;
        position: absolute;
        z-index: 11;
        img {
            user-select: none;
            transform: translateY(129px) translateX(-200px);
        }
    }

    .right {
        float: right;
        width: 35%;
        height: 800px;
        position: relative;
        z-index: 12;
        .right_top {
            width: 100%;
            height: 200px;
            span {
                font-size: 60px;
                font-family: fantasy;
                letter-spacing: 12px;
                line-height: 185px;
            }
        }

        .right_center {
            width: 100%;
            height: 535px;
            .boder-bottom {
                border-bottom: 1px solid red !important;
            }
            .welcome {
                font-size: 30px;
                font-weight: 600;
                display: inline-block;
                margin-bottom: 60px;
                margin-right: 100px;
                cursor: pointer;
                letter-spacing: 10px;
                text-align: center;
                padding-left: 12px;
                padding-bottom: 10px;
                border-bottom: 1px solid white;
            }

            .input_div {
                text-align: left;
                label {
                    margin-top: 35px;
                }
                input {
                    width: 345px;
                    height: 40px;
                    background-color: #040825;
                    border-radius: 20px;
                    border: 1px solid #feffff;
                    outline: none;
                    padding-left: 10px;
                    margin-bottom: 35px;
                    margin-top: 15px;
                    color: white;
                    font-size: 20px;
                }
            }

            .button_div {
                float: left;
                width: 70%;
                span {
                    color: red;
                    line-height: 70px;
                    font-size: 25px;
                }

                input {
                    background-color: #fab243;
                    width: 103px;
                    height: 35px;
                    border-radius: 20px;
                    border: none;
                    font-size: 20px;
                    font-weight: 600;
                    cursor: pointer;
                    float: right;
                    letter-spacing: 5px;
                    color: black;
                }
            }
        }
    }
}
</style>
