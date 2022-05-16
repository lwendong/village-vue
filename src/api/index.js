import axios from './axios/request'

//文件上传
export const uploadFile = (data) => {
    return axios({
        url: '/api/uploadFile',
        method: 'post',
        data
    })
}
export const fileDownload = (data) => {
    return axios({
        url: '/api/downloadFile/'+data,
        method: 'get'
    })
}
//根据ip获取当前定位
export const getLocalByIP = () => {
    return axios({
        url: '/baidu/location/ip',
        method: 'get',
        data: {
            ak: 'Ubl2HG7I1tSxjzw7THDKlYijWXigFcjz',
            coor: 'bd09ll'
        }
    })
}
//获取天气
export const getWeatherByCity = (districtId) => {
    return axios({
        url: '/baidu/weather/v1/',
        method: 'get',
        data: {
            ak: 'Ubl2HG7I1tSxjzw7THDKlYijWXigFcjz',
            data_type: 'all',
            district_id: districtId
        }
    })
}
//用户
export const login = (data) => {
    return axios({
        url: '/api/user/login',
        method: 'post',
        data
    })
}

export const register = (data) => {
    return axios({
        url: '/api/user/register',
        method: 'post',
        data
    })
}
export const savaUserData = (data) => {
    return axios({
        url: '/api/user/updateUserInfo',
        method: 'post',
        data
    })
}
export const getUserData = (data) => {
    return axios({
        url: '/api/user/getUserInfo',
        method: 'get',
        data
    })
}
//note
export const getAllNoteByMonth = (data) => {
    return axios({
        url: '/api/note/all',
        method: 'get',
        data
    })
}
export const addNote = (data) => {
    return axios({
        url: '/api/note/add',
        method: 'post',
        data
    })
}
export const addRemind = (data) => {
    return axios({
        url: '/api/remind/add',
        method: 'post',
        data
    })
}
export const deleteRemind = (data) => {
    return axios({
        url: '/api/remind/delete',
        method: 'get',
        data: {
            id: data
        }
    })
}
export const finishRemind = (data) => {
    return axios({
        url: '/api/remind/finish',
        method: 'get',
        data: {
            id: data
        }
    })
}
export const updateNote = (data) => {
    return axios({
        url: '/api/note/update',
        method: 'post',
        data
    })
}

//emotion
export const addEmo = (data) => {
    return axios({
        url: '/api/emo/add',
        method: 'post',
        data
    })
}
export const getAllEmoByPage = (data) => {
    return axios({
        url: '/api/emo/allByPage',
        method: 'get',
        data
    })
}
export const delEmotionById = (data) => {
    return axios({
        url: '/api/emo/delEmotionById',
        method: 'get',
        data
    })
}

export const getEmotionCount = () => {
    return axios({
        url: '/api/emo/getEmotionCount',
        method: 'get'
    })
}

export const getAllRemind = (data) => {
    return axios({
        url: '/api/remind/all',
        method: 'get',
        data
    })
}
