import { request } from '@/axios/index';


/**
 * 获取网站配置
 * @param data 
 * @returns 
 */
export const getWebConfigInfoApi = (data = {}) => {

    return request({
        url: `/webConfig/info`,
        method: 'get',
        data: data
    })
}

/**
 * 修改网站配置
 * @param data 
 * @data需要的参数
 * webConfig：object
 * @returns 
 */
export const setWebConfigUpdateApi = (data = {}) => {

    return request({
        url: `/webConfig/update`,
        method: 'put',
        data: data
    })
}
