<template>
    <div class="my-info">
        <div>
            <label for="avatar">头像：</label>
            <input @change="uploadAvatar($event)" type="file" id="avatar" />
        </div>
        <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label for="nick">昵称：</label>
            <input v-model="data.nick" type="text" id="nick" />
        </div>
        <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label for="password">密码：</label>
            <input v-model="data.password" type="text" id="password" />
        </div>
        <div>
            <label for="realname">真实姓名：</label>
            <input v-model="data.realname" type="text" id="realname" />
        </div>
        <div>
            性别：
            <input v-model="data.sex" type="radio" name="sex" value="男" />男
            <input v-model="data.sex" type="radio" name="sex" value="女" />女
        </div>
        <div>
            <input @click="save" class="but" type="button" value="保存" />
        </div>
        <div>
            {{ data.message }}
        </div>
    </div>
</template>
<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { uploadFile, savaUserData } from '@/api'

const router = useRouter()
const emit = defineEmits(['reloadMyInfo'])

const data = reactive({
    avatarUrl: '',
    nick: '',
    password: '',
    realname: '',
    sex: '',
    message: ''
})

const uploadAvatar = (e) => {
    let file = e.target.files[0]
    var formData = new FormData()
    formData.append('file', file)
    uploadFile(formData).then((res) => {
        data.avatarUrl = res.fileShowUrl
    })
}

const pattern = /^[a-z0-9]{5,12}$/
const save = () => {
    debugger
    if (data.avatarUrl == '') data.avatarUrl = null
    if (data.nick == '') data.nick = null
    if (data.password == '') data.password = null
    if (data.realname == '') data.realname = null
    if (!data.avatarUrl && !data.nick && !data.password && !data.realname) {
        return false
    }
    if (data.password) {
        if (!pattern.test(data.password)) {
            data.message = '密码格式为5-12位小写字母数字'
            return false
        }
    }
    savaUserData(data).then(() => {
        if (data.password) {
            router.replace('login')
            localStorage.removeItem('token')
        } else {
            emit('reloadMyInfo')
        }
    })
}
</script>
<style lang="less">
.my-info {
    transform: translateX(-110px);
    text-align: center;
    input {
        margin-bottom: 50px;
    }
    input[type='text'] {
        font-size: 30px;
        outline: none;
        background: none;
        border: none;
        border-bottom: 1px solid #dddddd;
    }
    div:nth-child(1) {
        transform: translateX(-35px);
    }
    div:nth-child(5) {
        transform: translateX(-130px);
    }
    .but {
        width: 100px;
        height: 35px;
        font-size: 20px;
        border-radius: 50px;
        letter-spacing: 5px;
        text-align: center;
        cursor: pointer;
    }
}
</style>
