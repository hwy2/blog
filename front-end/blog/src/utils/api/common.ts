import { request } from '@/axios/index';


/**
 * 上传文章图片
 * @param data POST FormData
 * @returns 
 */
export const commonEnclosureApi = (data = {}) => {
   
    return request({
        url: `/common/enclosure`,
        method: 'post',
        data: data
    })
}


/**
 * 上传用户头像图片
 * @param data POST FormData
 * @returns 
 */
export const commonFaceApi = (data = {}) => {
   
    return request({
        url: `/common/face`,
        method: 'post',
        data: data
    })
}

/**
 * 删除文件
 * @param data GET
 * @returns 
 */
export const delCommonFileApi = (data = {}) => {
   
    return request({
        url: `/common/del`,
        method: 'get',
        data: data
    })
}

/**
 * 获取用户文件
 * @param data  GET
 * @returns 
 */
export const getCommonFileListApi = (data = {}) => {
   
    return request({
        url: `/common/userList`,
        method: 'get',
        data: data
    })
}
