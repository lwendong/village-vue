const getNumberByDay = () => {
    return 'd' + new Date().getDate()
}

const getGroupByMonth = () => {
    return 'm' + new Date().getMonth() + 1
}

const getDateString = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    let time = hours > 12 ? '下午' : '上午'
    return (
        year +
        '-' +
        month +
        '-' +
        day +
        '     ' +
        time +
        '  ' +
        hours +
        ':' +
        minutes
    )
}

const getRandomColor = () => {
    return (
        '#' +
        ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
    )
}

const decodeJwt = (token) => {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(window.atob(base64))
}

export {
    getNumberByDay,
    getGroupByMonth,
    getDateString,
    getRandomColor,
    decodeJwt
}
