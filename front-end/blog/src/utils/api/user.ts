import { request } from '@/axios/index';

/**
 * 更新用户token
 * @param data PUT
 * @returns 
 */
export const setAminTokenApi = (data = {}) => {

    return request({
        url: `/user/adminToken`,
        method: 'put',
        data: data
    })
}

/**
 * 退出登录
 * @param data GET
 * @returns 
 */
export const logoutApi = (data = {}) => {

    return request({
        url: `/user/logout`,
        method: 'get',
        data: data
    })
}

/**
 * 获取用户信息
 * @param data GET
 * @returns 
 */
export const getUserInfoAPI = (data = {}) => {

    return request({
        url: `/user/info`,
        method: 'get',
        data: data
    })
}

/**
 * 修改用户密码
 * @param data PUT
 * @returns 
 */
export const setUserPWDAPI = (data = {}) => {

    return request({
        url: `/user/pwd`,
        method: 'put',
        data: data
    })
}

/**
 * 发送邮箱验证码
 * @param data POST
 * @returns 
 */
export const setEmailPostAPI = (data = {}) => {

    return request({
        url: `/user/emailPost`,
        method: 'post',
        data: data
    })
}

/**
 * 验证邮箱验证码
 * @param data POST
 * @returns 
 */
export const setEmailCaptchaEmailAPI = (data = {}) => {

    return request({
        url: `/user/captchaEmail`,
        method: 'post',
        data: data
    })
}

/**
 * 获取用户数据列表
 * @param data GET
 * @returns 
 */
export const getUsetListAPI = (data = {}) => {

    return request({
        url: `/user/list`,
        method: 'get',
        data: data
    })
}

/**
 * 删除用户
 * @param data GET
 * @returns 
 */
export const delUsetAPI = (data = {}) => {

    return request({
        url: `/user/del`,
        method: 'get',
        data: data
    })
}

/**
 * 注册用户
 * @param data POST
 * @returns 
 */
export const regUsetAPI = (data = {}) => {

    return request({
        url: `/user/reg`,
        method: 'post',
        data: data
    })
}

/**
 * 更新用户信息
 * @param data PUT
 * @returns 
 */
export const updateUsetAPI = (data = {}) => {

    return request({
        url: `/user/upInfo`,
        method: 'put',
        data: data
    })
}

/**
 * 重置密码
 * @param data PUT
 * @returns 
 */
export const resetUsetPwdAPI = (data = {}) => {

    return request({
        url: `/user/resetPwd`,
        method: 'put',
        data: data
    })
}

/**
 * 登录
 * @param data POST
 * @returns 
 */
export const loginAPI = (data = {}) => {

    return request({
        url: `/user/login`,
        method: 'post',
        data: data
    })
}