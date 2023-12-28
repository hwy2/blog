import { request } from '@/axios/index';


/**
 * 获取类别列表
 * @param data GET
 * @returns 
 */
export const getCategoryListApi = (data = {}) => {

    return request({
        url: `/category/list`,
        method: 'get',
        data: data
    })
}

/**
 * 获取用户类别列表
 * @param data GET
 * @returns 
 */
export const getUserCategoryListApi = (data = {}) => {

    return request({
        url: `/category/userCategoryList`,
        method: 'get',
        data: data
    })
}

/**
 * 删除类别
 * @param data GET
 * @data参数
 * uuid:string
 * @returns 
 */
export const deleteCategoryApi = (data = {}) => {

    return request({
        url: `/category/del`,
        method: 'get',
        data: data
    })
}

/**
 * 创建类别
 * @param data POST
 * @data参数 
 * title: string,
 * userUuid: string,
 * descriptions: string 
 * @returns 
 */
export const createCategoryApi = (data = {}) => {

    return request({
        url: `/category/create`,
        method: 'post',
        data: data
    })
}

/**
 * 修改类别
 * @param data PUT
 * @data参数
 * title: string,
 * categoryUuid: string,
 * descriptions: string 
 * @returns 
 */
export const updateCategoryApi = (data = {}) => {

    return request({
        url: `/category/update`,
        method: 'put',
        data: data
    })
}