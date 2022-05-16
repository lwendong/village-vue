<template>
    <div class="emo" :style="{ backgroundImage: 'url(' + emo.fileUrl + ')' }">
        <video
            v-if="emo.fileType == 'video'"
            class="video"
            autoplay="autoplay"
            controls="controls"
            loop="loop"
            muted
        >
            <source :src="emo.fileUrl" />
        </video>
        <img
            @click="controlTextArea"
            v-show="!pageData.textAreaShowFlag"
            :class="
                emo.fileType == 'video'
                    ? 'arrow-up-translateY-video '
                    : 'arrow-up-translateY-img '
            "
            class="arrow-up"
            src="@/assets/arrow-up.png"
        />
        <div
            :class="emo.fileType == 'video' ? 'text-area-translateY-video' : ''"
            class="text-area"
            v-show="pageData.textAreaShowFlag"
        >
            <img
                @click="controlTextArea"
                class="arrow-down"
                src="@/assets/arrow-down.png"
            />
            <img
                v-if="emo.canDel"
                @click="delEmo"
                class="del"
                src="@/assets/del.png"
            />
            <div class="center">
                <div class="avatar">
                    <img :src="emo.userAvatarUrl" />
                    <span>{{ emo.userNick }}</span>
                </div>
                <div class="text">
                    {{ emo.content }}
                </div>
                <div v-if="pageData.commentShowFlag" class="comment"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, nextTick } from 'vue'
import { delEmotionById } from '@/api'

const emit = defineEmits(['loadEmo'])
const { emo } = defineProps(['emo'])
const pageData = reactive({
    textAreaShowFlag: true,
    commentShowFlag: false
})

const controlTextArea = () => {
    pageData.textAreaShowFlag = !pageData.textAreaShowFlag
}

const delEmo = () => {
    delEmotionById({ emoId: emo.id }).then(() => {})
    nextTick(() => {
        emit('loadEmo')
    })
}
</script>
<style lang="less">
.emo {
    width: 1280px;
    height: 640px;
    margin: 0 auto 280px auto;
    box-shadow: 0px 0px 70px 10px #888888;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    text-align: center;

    .video {
        position: relative;
        z-index: 25 !important;
        width: 100%;
        height: 100%;
        object-fit: fill;
        position: relative;
        z-index: 30;
    }

    .arrow-up {
        position: relative;
        z-index: 26;
        cursor: pointer;
        transform: scale(1.5) translateY(-50px);
    }
    .del {
        cursor: pointer;
        transform: scale(1.25) translateX(470px) translateY(10px);
    }
    .arrow-up-translateY-video {
        transform: scale(1.5) translateY(-50px);
    }
    .arrow-up-translateY-img {
        transform: scale(1.5) translateY(380px);
    }
    .text-area-translateY-video {
        transform: translateY(-645px);
    }

    .text-area {
        position: relative;
        z-index: 26;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.8;
        text-align: center;

        .arrow-down {
            cursor: pointer;
            transform: scale(1.5) translateY(10px);
        }

        .center {
            width: 100%;
            max-width: 100%;
            height: 505px;
            max-height: 505px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 30px;

            .avatar {
                height: 100%;
                width: 10%;
                transform: translateX(-50px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50px;
                    opacity: 1 !important;
                }

                span {
                    color: #dddddd;
                    margin-top: 20px;
                    font-size: 20px;
                    font-family: monospace;
                }
            }

            .text {
                width: auto;
                height: 505px;
                max-height: 505px;
                max-width: 700px;
                color: #dddddd;
                overflow: auto;
                font-size: 35px;
                line-height: 50px;
                letter-spacing: 1px;
                font-family: fangsong;
                text-align: left;
                display: -webkit-box;
                -webkit-box-orient: horizontal;
                -webkit-box-pack: center;
                -webkit-box-align: center;

                display: -moz-box;
                -moz-box-orient: horizontal;
                -moz-box-pack: center;
                -moz-box-align: center;

                display: -o-box;
                -o-box-orient: horizontal;
                -o-box-pack: center;
                -o-box-align: center;

                display: -ms-box;
                -ms-box-orient: horizontal;
                -ms-box-pack: center;
                -ms-box-align: center;
            }

            .comment {
                height: 100%;
                width: 25%;
                transform: translateX(10px);
            }
        }
    }
}
</style>
