<template>
    <div v-show="pageData.isShow" class="chat-area">
        <div class="title">{{ chatingUser.nick }}</div>
        <div class="content" ref="content">
            <div
                v-for="(item, index) in pageData.chat"
                :key="index"
                class="message"
                :class="
                    item.type == 'send' || item.type == 'groupSend'
                        ? 'send'
                        : 'receive'
                "
            >
                <template v-if="item.type == 'send'">
                    <div class="text-div">
                        <span v-if="item.messageType == 'text'">{{
                            item.message
                        }}</span>
                        <video
                            v-if="item.messageType == 'video'"
                            class="chat-video"
                            autoplay="autoplay"
                            controls="controls"
                            loop="loop"
                            muted
                        >
                            <source :src="item.message" />
                        </video>

                        <img
                            v-if="item.messageType == 'img'"
                            :src="item.message"
                            class="chat-img"
                        />
                        <span v-if="item.messageType == 'file'"
                            ><a :href="'/api/downloadFile/' + item.message">
                                发送了一个文件，点击下载</a
                            >
                        </span>
                    </div>
                    <img :src="pageData.avatar" />
                </template>

                <template v-if="item.type == 'receive'">
                    <img :src="item.avatar" />
                    <div class="text-div">
                        <span v-if="item.messageType == 'text'">{{
                            item.message
                        }}</span>
                        <video
                            v-if="item.messageType == 'video'"
                            class="chat-video"
                            autoplay="autoplay"
                            controls="controls"
                            loop="loop"
                            muted
                        >
                            <source :src="item.message" />
                        </video>

                        <img
                            v-if="item.messageType == 'img'"
                            :src="item.message"
                            class="chat-img"
                        />
                        <span v-if="item.messageType == 'file'"
                            ><a :href="'/api/downloadFile/' + item.message">
                                发送了一个文件，点击下载</a
                            >
                        </span>
                    </div>
                </template>

                <template v-if="item.type == 'groupSend'">
                    <div class="text-div">
                        <span v-if="item.messageType == 'text'">{{
                            item.message
                        }}</span>
                        <video
                            v-if="item.messageType == 'video'"
                            class="chat-video"
                            autoplay="autoplay"
                            controls="controls"
                            loop="loop"
                            muted
                        >
                            <source :src="item.message" />
                        </video>

                        <img
                            v-if="item.messageType == 'img'"
                            :src="item.message"
                            class="chat-img"
                        />
                        <span v-if="item.messageType == 'file'"
                            ><a :href="'/api/downloadFile/' + item.message">
                                发送了一个文件，点击下载</a
                            >
                        </span>
                    </div>
                    <img :src="pageData.avatar" />
                </template>

                <template v-if="item.type == 'groupReceive'">
                    <img :src="item.avatar" />
                    <div class="text-div">
                        <span v-if="item.messageType == 'text'">{{
                            item.message
                        }}</span>
                        <video
                            v-if="item.messageType == 'video'"
                            class="chat-video"
                            autoplay="autoplay"
                            controls="controls"
                            loop="loop"
                            muted
                        >
                            <source :src="item.message" />
                        </video>

                        <img
                            v-if="item.messageType == 'img'"
                            :src="item.message"
                            class="chat-img"
                        />
                        <span v-if="item.messageType == 'file'"
                            ><a :href="'/api/downloadFile/' + item.message">
                                发送了一个文件，点击下载</a
                            >
                        </span>
                    </div>
                </template>
            </div>
        </div>
        <div class="text">
            <textarea
                @focus="pageData.emojiShow = false"
                v-model="pageData.message"
                autofocus
            ></textarea>
            <input
                class="input-but"
                @click="sendMessage('text')"
                type="button"
                value="发送"
            />
            <input
                class="input-but"
                @click="addFile"
                type="button"
                value="文件"
            />
            <input
                class="input-but"
                @click="pageData.emojiShow = !pageData.emojiShow"
                type="button"
                value="表情"
            />

            <input
                ref="fileInput"
                type="file"
                @change="uploadPicture($event)"
                hidden
            />
        </div>
        <EmojiPicker
            v-if="pageData.emojiIf"
            v-show="pageData.emojiShow"
            class="input-emoji"
            @select="selectEmoji"
        />
    </div>
</template>
<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'
import { uploadFile } from '@/api'
import { nanoid } from 'nanoid'
import mitt from '@/utils/mitt'

const { chatingUser } = defineProps({ chatingUser: Object })
const emit = defineEmits(['sendMessage'])
const content = ref(null)
const fileInput = ref(null)

const pageData = reactive({
    isShow: false,
    avatar: localStorage.getItem('avatar'),
    message: '',
    messageType: '',
    emojiIf: false,
    emojiShow: false,
    chat: []
})

const fileData = reactive({
    fileUrl: '',
    fileType: ''
})

const addFile = () => {
    fileInput.value.click()
}

const sendMessage = (type) => {
    const wsRequestData = new Object()
    if (type == 'file') {
        wsRequestData.message = fileData.fileUrl
        wsRequestData.messageType = fileData.fileType
    } else {
        wsRequestData.messageType = 'text'
        wsRequestData.message = pageData.message
    }
    if (chatingUser.type && chatingUser.type == 'group') {
        wsRequestData.type = 'groupSend'
        wsRequestData.toUserId = chatingUser.groupUsers
    } else {
        wsRequestData.type = 'send'
        wsRequestData.toUserId = chatingUser.userId
    }
    pageData.chat.push(wsRequestData)
    emit('sendMessage', wsRequestData)
    nextTick(() => {
        content.value.scrollTop = content.value.scrollHeight
        pageData.message = ''
        fileData.fileUrl = ''
        fileData.fileType = ''
    })
}

const uploadPicture = (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    uploadFile(formData).then((res) => {
        const { fileName, fileShowUrl, fileType } = res
        if (fileType == 'file') {
            fileData.fileUrl = fileName
        } else {
            fileData.fileUrl = fileShowUrl
        }
        fileData.fileType = fileType
        sendMessage('file')
    })
}

const selectEmoji = (emoji) => {
    console.log(emoji)
    pageData.message += emoji.i
}

onMounted(() => {
    mitt.on('showChatAreaMitt', (userId) => {
        if (chatingUser.userId == userId) {
            pageData.isShow = true
        } else {
            pageData.isShow = false
        }
    })

    mitt.on('receiveMessage', (chat) => {
        if (chat.type == 'groupReceive' && chatingUser.userId == 'group') {
            pageData.chat.push(chat)
        } else {
            if (
                chat.type != 'groupReceive' &&
                chatingUser.userId == chat.fromUserId
            ) {
                pageData.chat.push(chat)
            }
        }
        nextTick(() => {
            content.value.scrollTop = content.value.scrollHeight
        })
    })
    setTimeout(() => {
        pageData.emojiIf = true
    }, 500)
})
</script>
<style lang="less">
.chat-area {
    widows: 100%;
    height: 100%;

    .title {
        width: 100%;
        height: 5%;
        line-height: 40px;
        padding-left: 15px;
        font-size: 25px;
    }

    .content {
        width: 100%;
        height: 75%;
        overflow: auto;
        padding: 25px 15px 0 15px;

        .send {
            justify-content: flex-end;
        }

        .receive {
            justify-content: flex-start;
        }
        .message {
            height: auto;
            width: 100%;
            display: flex;
            flex-direction: row;

            margin-bottom: 90px;
            float: right;

            img {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                box-shadow: 0px 0px 20px 10px #888888;
                margin-right: 20px;
                margin-left: 20px;
            }
            .text-div {
                width: auto;
                height: auto;
                max-width: 645px;
                line-height: 35px;
                letter-spacing: 3px;
                transform: translateY(2px);
                padding: 15px 20px 0 20px;
                box-shadow: 0px 0px 70px #888888;
                border-radius: 20px;

                .chat-video {
                    max-width: 600px;
                    max-height: 340px;
                }
                .chat-img {
                    width: 570px;
                    height: 300px;
                    border-radius: 0;
                }
                .chat-file {
                    cursor: pointer;
                    color: blue;
                    text-decoration: underline;
                }
            }
        }
    }

    .text {
        width: 100%;
        height: 20%;
        box-shadow: 0px 0px 42px 6px #888888;

        textarea {
            width: 100%;
            height: 75%;
            resize: none;
            padding-left: 15px;
            padding-right: 15px;
            font-size: 25px;
            font-family: serif;
            font-weight: 500;
            border: none;
            outline: none;
            background: none;
        }

        .input-but {
            float: right;
            width: 70px;
            height: 30px;
            border: none;
            border-radius: 10px;
            background: none;
            margin-right: 25px;
            font-size: 22px;
            letter-spacing: 4px;
            text-align: center;
            box-shadow: 0px 0px 20px 10px #888888;
            cursor: pointer;
        }
    }
    .input-emoji {
        transform: translateX(180px) translateY(-320px);
    }
}
</style>
