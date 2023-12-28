import { request } from '@/axios/index';
/**
 * 获取文章列表
 * @param data GET
 * @returns 
 */
export const getArticleListApi = (data = {}) => {

    return request({
        url: `/article/list`,
        method: 'get',
        data: data
    })
}

/**
 * 获取推荐文章
 * @param data GET
 * @returns 
 */
export const getTestimonialsArticleApi = (data = {}) => {

    return request({
        url: `/article/testimonialsArticle`,
        method: 'get',
        data: data
    })
}

/**
 * 获取用户文章
 * @param data GET
 * @condition
 * @returns 
 */
export const getUserArticleListApi = (data = {}) => {

    return request({
        url: `/article/userArticleList`,
        method: 'get',
        data: data
    })
}

/**
 * 获取热门文章
 * @param data GET
 * @returns 
 */
export const getHotArticleApi = (data = {}) => {

    return request({
        url: `/article/hotArticle`,
        method: 'get',
        data: data
    })
}

/**
 * 更新文章
 * @param data PUT
 * @data的需要参数 
 * article: object
 * @returns 
 */
export const updateArticleApi = (data = {}) => {

    return request({
        url: `/article/update`,
        method: 'put',
        data: data
    })
}

/**
 * 删除文章
 * @param data GET
 * @data的需要参数 
 * articleUuid: string
 * @returns 
 */
export const deleteArticleApi = (data = {}) => {

    return request({
        url: `/article/del`,
        method: 'get',
        data: data
    })
}

/**
 * 置顶文章
 * @param data POST
 * @data的需要参数 
 * articleUuid: string,
 * sticky: boolean
 * @returns 
 */
export const setStickyApi = (data = {}) => {

    return request({
        url: `/article/setSticky`,
        method: 'post',
        data: data
    })
}

/**
 * 修改文章状态
 * @param data POST
 * @data的需要参数 
 * articleUuid: string,
 * state: number
 * @returns 
 */
export const setArticleStateApi = (data = {}) => {

    return request({
        url: `/article/setArticleState`,
        method: 'post',
        data: data
    })
}

/**
 * 修改文章推荐状态
 * @param data POST
 * @data的需要参数 
 * articleUuid: string,
 * ishot: Boolean
 * @returns 
 */
export const setIshotArticleApi = (data = {}) => {

    return request({
        url: `/article/setIshotArticle`,
        method: 'post',
        data: data
    })
}

/**
 * 创建文章
 * @param data POST
 * @returns 
 */
export const createArticleApi = (data = {}) => {

    return request({
        url: `/article/create`,
        method: 'post',
        data: data
    })
}

/**
 * 获取单个文章
 * @param data GET
 * @returns 
 */
export const getArticleInfoApi = (data = {}) => {

    return request({
        url: `/article/info`,
        method: 'get',
        data: data
    })
}

/**
 * 添加文章浏览量
 * @param data GET
 * @returns 
 */
export const addPageViewsApi = (data = {}) => {

    return request({
        url: `/article/addPageViews`,
        method: 'get',
        data: data
    })
}