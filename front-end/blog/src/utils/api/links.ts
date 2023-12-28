import { request } from '@/axios/index';

/**
 * 获取全部链接
 * @param data GET
 * @returns 
 */
export const getLinksListApi = (data = {}) => {
   
    return request({
        url: `/links/list`,
        method: 'get',
        data: data
    })
}

/**
 * 删除链接
 * @param data GET
 * @returns 
 */
export const delLinksApi = (data = {}) => {
   
    return request({
        url: `/links/del`,
        method: 'get',
        data: data
    })
}

/**
 * 获取单个链接详情
 * @param data GET
 * @returns 
 */
export const getLinksInfoApi = (data = {}) => {
   
    return request({
        url: `/links/info`,
        method: 'get',
        data: data
    })
}

/**
 * 创建链接
 * @param data POST
 * @returns 
 */
export const createLinksApi = (data = {}) => {
   
    return request({
        url: `/links/create`,
        method: 'post',
        data: data
    })
}

/**
 * 更新链接
 * @param data PUT
 * @returns 
 */
export const upinfoLinksApi = (data = {}) => {
   
    return request({
        url: `/links/upinfo`,
        method: 'put',
        data: data
    })
}

/**
 * 新增链接
 * @param data POST
 * @returns 
 */
export const applyLinksApi = (data = {}) => {
   
    return request({
        url: `/links/apply`,
        method: 'post',
        data: data
    })
}