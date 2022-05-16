<template>
    <div class="note-area">
        <img
            @click="lastMonth"
            class="last-month"
            src="../assets/arrow-up.png"
            alt="上一个月"
        />
        <span class="curr-month">{{ currMonth }}</span>
        <img
            @click="nextMonth"
            class="next-month"
            src="../assets/arrow-up.png"
            alt="下一个月"
        />
        <span class="message" v-if="note.arr.length == 0">此月份没有便笺~</span>
        <NoteItem v-for="value in note.arr" :key="nanoid()" :data="value" />
    </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { nanoid } from 'nanoid'
import mitt from '@/utils/mitt'
import { getAllNoteByMonth } from '@/api'
import NoteItem from 'coms/NoteItem.vue'

const router = useRouter()

const note = reactive({
    year: '',
    month: '',
    arr: []
})

onMounted(() => {
    const date = new Date()
    note.year = date.getFullYear()
    note.month = date.getMonth() + 1

    mitt.emit('animeSelectMitt', router.currentRoute.value.name)
    loadNote()

    mitt.on('reloadNote', () => {
        loadNote()
    })
})

const currMonth = computed(() => {
    return note.year + '年' + note.month + '月'
})

const lastMonth = () => {
    if (note.month == 1) {
        note.year -= 1
        note.month = 12
    } else {
        note.month -= 1
    }

    loadNote()
}

const nextMonth = () => {
    if (note.month == 12) {
        note.year += 1
        note.month = 1
    } else {
        note.month += 1
    }

    loadNote()
}

const loadNote = () => {
    const requestData = new Object()
    requestData.noteGroup = note.year + '-' + note.month
    getAllNoteByMonth(requestData).then((res) => {
        note.arr = res.data
    })
}
</script>

<style lang="less" scoped>
.note-area {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 5% repeat(7, 1fr) 5%;
    grid-template-rows: 10% repeat(5, 1fr) 5%;
    grid-gap: 20px;
    grid-template-areas:
        '. lastMonth . . currMonth . . nextMonth .'
        '. d1 d2 d3 d4 d5 d6 d7 .'
        '. d8 d9 d10 d11 d12 d13 d14 .'
        '. d15 d16 d17 d18 d19 d20 d21 .'
        '. d22 d23 d24 d25 d26 d27 d28 .'
        '. d29 d30 d31 . . . . .';

    justify-items: center;
    align-items: center;

    .last-month {
        grid-area: lastMonth;
        transform: rotate(-90deg);
        cursor: pointer;
    }

    .curr-month {
        grid-area: currMonth;
        font-size: 35px;
    }

    .next-month {
        grid-area: nextMonth;
        transform: rotate(90deg);
        cursor: pointer;
    }

    .message {
        grid-area: d18;
    }
}
</style>
