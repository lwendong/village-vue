<template>
    <div class="chat" v-if="chatData.list.length > 0">
        <div class="list">
            <div class="search-div">
                <img class="search" src="@/assets/search.png" />
                <input
                    v-model="chatData.searchKey"
                    type="text"
                    placeholder="搜索名称....."
                />
                <img
                    @click="controlAddGroup"
                    class="group"
                    src="@/assets/group.png"
                />
            </div>
            <div class="list-div" ref="list">
                <ChatListItem
                    @startChat="startChat"
                    @clearBG="clearBG"
                    v-for="item in searchList"
                    :key="item.userId"
                    :data="item"
                />
            </div>
        </div>
        <div class="center">
            <ChatArea
                v-for="item in chatData.chatUsers"
                :key="item.userId"
                :chatingUser="item"
                @sendMessage="sendMessage"
            />
        </div>
    </div>

    <div class="null-list" v-if="chatData.list.length == 0">
        找不到其他的人！！！
    </div>

    <div v-show="chatData.addGroupFlag" class="add-group-div">
        <div class="add-group-area">
            <div class="add-group-title">
                <span>创建群组</span>
                <img @click="controlAddGroup" src="@/assets/cha.png" />
            </div>
            <div class="add-group-input">
                群组名称：<input v-model="chatData.groupName" type="text " />
            </div>

            <div class="add-group-user-list">
                <ul>
                    <li v-for="item in chatData.list" :key="nanoid()">
                        <input
                            type="checkbox"
                            v-model="chatData.groupUserIdList"
                            :value="item.userId"
                        />{{ item.nick }}
                    </li>
                </ul>
            </div>

            <div class="save">
                <input @click="saveGroup" type="button" value="保存" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, reactive, computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import ChatListItem from 'coms/ChatListItem.vue'
import ChatArea from 'coms/ChatArea.vue'
import { nanoid } from 'nanoid'
import mitt from '@/utils/mitt'
import { decodeJwt } from '@/utils'
import { getLocalByIP } from '@/api'

const router = useRouter()

const list = ref(null)

const chatData = reactive({
    ws: null,
    list: [],
    group: null,
    searchKey: '',
    userId: '',
    chatingUserId: '',
    chatUserIds: [],
    chatUsers: [],
    addGroupFlag: false,
    groupName: '',
    groupUserIdList: []
})

const saveGroup = () => {
    if (chatData.groupName) {
        if (chatData.groupUserIdList.length > 0) {
            chatData.groupUserIdList.push(chatData.userId)
            const groupData = new Object()
            groupData.nick = chatData.groupName
            groupData.address = '临时群聊'
            groupData.avatar = ''
            groupData.type = 'group'
            groupData.groupList = chatData.groupUserIdList
            chatData.addGroupFlag = false
            chatData.ws.send(JSON.stringify(groupData))
        }
    }
}
const clearBG = () => {
    const childNodArray = list.value.childNodes
    for (let i = 1; i < childNodArray.length - 1; i++) {
        childNodArray[i].style.background = ''
    }
}
const controlAddGroup = () => {
    chatData.addGroupFlag = !chatData.addGroupFlag
}

const receiveMessage = (receiveUser) => {
    if (chatData.chatingUserId != receiveUser.userId) {
        if (chatData.chatUserIds.indexOf(receiveUser.userId) == -1) {
            chatData.chatUserIds.push(receiveUser.userId)
            chatData.chatUsers.push(receiveUser)
        }

        nextTick(() => {
            mitt.emit('receiveMessageAnime', receiveUser.userId)
        })
    }
}

const sendMessage = (sendMessage) => {
    const { ws, userId } = chatData
    sendMessage.fromUserId = userId
    ws.send(JSON.stringify(sendMessage))
}

const startChat = (userData) => {
    chatData.chatingUserId = userData.userId
    if (chatData.chatUserIds.indexOf(userData.userId) == -1) {
        chatData.chatUserIds.push(userData.userId)
        chatData.chatUsers.push(userData)
    }
    nextTick(() => {
        mitt.emit('showChatAreaMitt', userData.userId)
    })
}

const searchList = computed(() => {
    const chatList = Array()
    if (chatData.group) {
        chatList.push(chatData.group)
    }

    chatData.list.map(function (n) {
        chatList.push(n)
    })
    if (!chatData.searchKey) {
        return chatList
    } else {
        return chatList.filter((item) => {
            let temp = item.nick
            return (
                temp.includes(chatData.searchKey) ||
                temp.includes(chatData.searchKey)
            )
        })
    }
})

onMounted(() => {
    mitt.emit('animeSelectMitt', router.currentRoute.value.name)
    const token = localStorage.getItem('token')
    const userId = decodeJwt(token).userId
    chatData.userId = userId
    const url = 'ws://192.168.31.159:7777//webSocket/' + userId
    chatData.ws = new WebSocket(url)
    const wsRequestData = new Object()
    wsRequestData.type = 'list'
    getLocalByIP().then((res) => {
        wsRequestData.address = res.content.address
        setTimeout(() => {
            chatData.ws.send(JSON.stringify(wsRequestData))
        }, 1000)
    })

    chatData.ws.onmessage = function (e) {
        const chat = JSON.parse(e.data)
        if (chat.type == 'list') {
            const result = chat.message.filter((item) => {
                return item.userId != userId
            })
            chatData.list = result
        } else if (chat.type == 'receive') {
            const toUser = chatData.list.filter((item) => {
                return item.userId == chat.fromUserId
            })
            receiveMessage(toUser[0])
            nextTick(() => {
                mitt.emit('receiveMessage', chat)
            })
        } else if (chat.type == 'group') {
            chat.message.userId = 'group'
            chatData.group = chat.message
        } else if (chat.type == 'groupReceive') {
            chat.userId = 'groupReceive'
            receiveMessage(chatData.group)
            nextTick(() => {
                mitt.emit('receiveMessage', chat)
            })
        }
    }
})
</script>
<style lang="less">
.add-group-div {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 20;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .add-group-area {
        width: 40vw;
        height: 50vh;
        box-shadow: 0px 0px 50px 40px #888888;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;

        .add-group-title {
            span {
                float: left;
            }

            img {
                float: right;
                cursor: pointer;
            }
        }

        .add-group-input {
            margin-top: 60px;
            font-size: 30px;

            input {
                outline: none;
                background: none;
                border: none;
                border-bottom: 1px solid #888888;
                font-size: 30px;
                width: 200px;
                letter-spacing: 2px;
            }
        }

        .add-group-user-list {
            width: 100%;
            height: 215px;
            margin-top: 70px;

            ul {
                list-style: none;
                li {
                    float: left;
                    margin-right: 10px;
                    font-size: 25px;
                    input {
                        margin-right: 10px;
                    }
                }
            }
        }
        .save {
            width: 100%;
            text-align: center;
            input {
                width: 100px;
                height: 30px;
                border: none;
                background: none;
                font-size: 22px;
                letter-spacing: 4px;
                text-align: center;
                color: #dddddd;
                box-shadow: 0px 0px 20px 10px #888888;
            }
        }
    }
}
.null-list {
    width: 100%;
    text-align: center;
    font-size: 25px;
}
.chat {
    width: 80vw;
    height: 85vh;
    margin: 0 auto 80px auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    box-shadow: 0px 0px 70px 10px #888888;

    .list {
        width: 20%;
        height: 100%;

        padding-top: 20px;
        border-right: 1px solid white;

        .search-div {
            height: 50px;
            width: 100%;
            padding-left: 20px;
            .search {
                width: 25px;
                height: 25px;
                margin-left: 5px;
                transform: translateY(4px);
            }
            input {
                outline: none;
                background: none;
                border: none;
                border-bottom: 1px solid #888888;
                font-size: 25px;
                width: 185px;
                transform: translateX(-25px);
                padding-left: 30px;
                padding-bottom: 10px;
                letter-spacing: 2px;
            }
            input::-webkit-input-placeholder {
                font-size: 20px;
                opacity: 0.7;
            }

            .group {
                transform: translateY(15px);
                cursor: pointer;
            }
        }

        .list-div {
            height: calc(100% - 50px);
            width: 100%;
            overflow: auto;
            margin-top: 20px;
        }
    }

    .center {
        width: 80%;
        height: 100%;
    }
}
</style>
