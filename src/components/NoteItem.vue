<template>
    <div @click="editNote" class="text-area">
        <span class="date">{{ date }}</span>
        <div class="icon">
            <img src="@/assets/ding.png" />
        </div>
        <span class="title" :title="data.title" :alt="data.title">{{
            data.title
        }}</span>
    </div>
</template>
<script setup>
import { toRaw, computed } from 'vue'
import mitt from '@/utils/mitt'

const { data } = defineProps({ data: Object })

const date = computed(() => {
    return data.noteNumber.substr(1)
})

const editNote = () => {
    const request = data
    request.type = 'note'
    mitt.emit('openEdit', request)
}
</script>
<style lang="less" scoped>
@backgroundColor: v-bind('data.color');
@gridArea: v-bind('data.noteNumber');
@color: #fdf5e6;
@fontFamily: fantasy;
@border: 1px solid @color;
.shared {
    color: @color;
    font-family: @fontFamily;
}
.text-area {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 60% 40%;
    grid-template-rows: 70% 30%;
    cursor: pointer;
    user-select: none;
    border-radius: 30px;
    grid-area: @gridArea;
    background-color: @backgroundColor;

    .date {
        font-size: 95px;
        text-align: center;
        letter-spacing: 5px;
        .shared;
    }

    .title {
        max-height: 100%;
        grid-column: 1 / 3;
        grid-row: 2;
        font-size: 20px;
        border-top: @border;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-top: 7px;
        padding-left: 11px;
        .shared;
    }
    .icon {
        border-left: @border;

        img {
            display: inline;
            float: right;
            position: relative;
            z-index: 3;
            right: -10px;
            top: -10px;
        }
    }
}
</style>
