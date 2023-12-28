import { request } from '@/axios/index';


/**
 * 更新用户信息
 * @param data PUT
 * @returns 
 */
export const setUserInfoApi = (data = {}) => {

    return request({
        url: `/userInfo/upinfo`,
        method: 'put',
        data: data
    })
}