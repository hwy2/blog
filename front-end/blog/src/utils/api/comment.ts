import { request } from '@/axios/index';
/**
 * 获取用户评论列表
 * @param data GET
 * @returns 
 */
export const getuserCommentListApi = (data = {}) => {

    return request({
        url: `/comment/userCommentList`,
        method: 'get',
        data: data
    })
}

/**
 * 删除评论
 * @param data GET
 * @returns 
 */
export const deleteCommentApi = (data = {}) => {

    return request({
        url: `/comment/del`,
        method: 'get',
        data: data
    })
}

/**
 * 更新评论状态
 * @param data POST
 * @returns 
 */
export const updateCommentStatusApi = (data = {}) => {

    return request({
        url: `/comment/updateCommentStatus`,
        method: 'post',
        data: data
    })
}

/**
 * 更新评论信息
 * @param data PUT
 * @returns 
 */
export const updateCommentApi = (data = {}) => {

    return request({
        url: `/comment/update`,
        method: 'put',
        data: data
    })
}

/**
 * 回复评论
 * @param data POST
 * @returns 
 */
export const recoverCommentApi = (data = {}) => {

    return request({
        url: `/comment/recover`,
        method: 'post',
        data: data
    })
}

/**
 * 创建评论
 * @param data POST
 * @returns 
 */
export const createCommentApi = (data = {}) => {

    return request({
        url: `/comment/create`,
        method: 'post',
        data: data
    })
}