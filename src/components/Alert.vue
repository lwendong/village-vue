<template>
    <div class="alert">
        <div class="alert-area">
            <div class="alert-title">
                <span
                    >有<span style="color: red">{{ num }}</span
                    >条提醒已到完成时间,去完成吧~~</span
                >
            </div>
            <div class="alert-button">
                <input @click="see" type="button" value="去完成" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import mitt from '@/utils/mitt'
import {} from '@/api'

const emit = defineEmits(['controlAlert'])
const router = useRouter()
let num = ref(0)
const idArray = new Array()

const see = () => {
    emit('controlAlert', false)
    router.push({ name: 'remind' })
    mitt.emit('animeRecoveryMitt', 'remind')
}

onMounted(() => {
    mitt.on('alert', () => {
        if (num.value > 0) {
            emit('controlAlert', true)
        }
    })
    mitt.on('openAlert', (id) => {
        if (!idArray.includes(id)) {
            num.value++
            idArray.push(id)
            emit('controlAlert', true)
        }
    })
    mitt.on('remindNum', (flag) => {
        flag ? num.value++ : num.value--
    })
})
</script>
<style lang="less">
.alert {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 51;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .alert-area {
        width: 100%;
        height: 100px;

        .alert-title {
            width: 100%;
            height: 60%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 30px;
        }
        .alert-button {
            width: 100%;
            height: 40%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            input {
                width: 90px;
                font-size: 20px;
                border: 1px white solid;
                background: none;
                border-radius: 45px;
                color: white;
                outline: none;
                cursor: pointer;
            }
        }
    }
}
</style>
