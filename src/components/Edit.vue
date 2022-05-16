<template>
    <div class="edit">
        <div class="edit-area">
            <div class="control-div">
                <img @click="closeEdit" class="back" src="@/assets/back.png" />
                <img @click="publish" class="save" src="@/assets/save.png" />
            </div>

            <div class="title-div" v-if="pageData.type == 'note'">
                <input
                    v-model="data.title"
                    class="title"
                    type="text"
                    placeholder="标题"
                />
            </div>

            <div class="fileupdate-div" v-if="pageData.type == 'emo'">
                <input type="file" @change="uploadPicture($event)" />
            </div>
            <div class="remind-div" v-if="pageData.type == 'remind'">
                <input type="datetime-local" v-model="data.endTimeString" />
            </div>
            <div class="date-div">
                <span>{{ pageData.dateString }}</span>
            </div>
            <div class="content-div">
                <textarea
                    v-model="data.content"
                    autofocus
                    placeholder="说些什么吧...."
                ></textarea>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, onMounted, toRaw } from 'vue'
import mitt from '@/utils/mitt'
import { uploadFile, addNote, addEmo, addRemind, updateNote } from '@/api'
import { getDateString, getRandomColor } from '@/utils'

const emit = defineEmits(['controlEdit'])

const pageData = reactive({
    type: '',
    dateString: getDateString()
})

const data = reactive({
    id: '',
    title: '',
    content: '',
    fileUrl: '',
    fileType: '',
    color: '',
    endTimeString: ''
})

//上传图片
const uploadPicture = (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    uploadFile(formData).then((res) => {
        const { fileShowUrl, fileType } = res
        data.fileUrl = fileShowUrl
        data.fileType = fileType
    })
}

//发布
const publish = () => {
    if (pageData.type == 'note') {
        if (!data.title) {
            alert('便笺标题不能为空')
            return
        }
        const noteData = toRaw(data)
        noteData.color = getRandomColor()
        addNote(noteData).then(() => {
            mitt.emit('reloadNote')
            closeEdit()
        })
    } else if (pageData.type == 'emo') {
        if (!data.content) {
            alert('心情内容不能为空')
            return
        }
        addEmo(data).then((res) => {
            mitt.emit('loadEmo')
            closeEdit()
        })
    } else if (pageData.type == 'remind') {
        if (!data.content || !data.endTimeString) {
            alert('提醒时间或内容不能为空')
            return
        }
        const remindData = toRaw(data)
        remindData.color = getRandomColor()
        addRemind(remindData).then((res) => {
            mitt.emit('loadRemind')
            closeEdit()
        })
    }
}

const closeEdit = () => {
    emit('controlEdit')
    Object.keys(data).forEach((key) => {
        data[key] = ''
    })
    pageData.type = 'close'
}

onMounted(() => {
    mitt.on('openEdit', (param) => {
        const { type, id, title, content } = param
        pageData.type = type
        data.id = id
        data.title = title
        data.content = content
        emit('controlEdit')
    })
})
</script>
<style lang="less" scoped>
@fontColor: #dddddd;

.edit {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 51;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .edit-area {
        background: #2d2d2d;
        width: 40%;
        height: 90%;

        .control-div {
            width: 100%;
            height: 5%;

            .back {
                float: left;
                cursor: pointer;
            }
            .save {
                float: right;
                cursor: pointer;
            }
        }

        .title-div {
            width: 100%;
            height: 10%;

            .title {
                width: 95%;
                background: none;
                border: none;
                outline-style: none;
                font-family: fantasy;
                letter-spacing: 2px;
                font-size: 60px;
                color: @fontColor !important;

                &::-webkit-input-placeholder {
                    color: @fontColor !important;
                    opacity: 0.3;
                }
            }
        }

        .fileupdate-div {
            width: 100%;
            height: 10%;

            input {
                font-size: 20px;
                line-height: 110px;
                transform: translateX(-45px);
                color: white;
            }
        }
        .remind-div {
            color: white;
            width: 100%;
            transform: translateX(-46px);
            color: white;

            input {
                height: 27px;
                font-size: 20px;
                border: none;
                border-bottom: 1px solid;
                outline: none;
            }
        }

        .date-div {
            width: 100%;
            height: 8%;
            user-select: none;

            span {
                width: 95%;
                color: @fontColor;
                font-size: 21px;
                line-height: 65px;
                letter-spacing: 1px;
            }
        }

        .content-div {
            width: 100%;
            height: 77%;

            textarea {
                width: 95%;
                height: 100%;
                font-size: 35px;
                resize: none;
                color: @fontColor;
                background: none;
                border: none;
                outline-style: none;
            }
        }
    }
}
</style>
