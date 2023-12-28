import { request } from '@/axios/index';
/**
 * 获取统计数据
 * @param data GET
 * @returns 
 */
export const getDataSummaryListApi = (data = {}) => {

    return request({
        url: `/dataSummary/list`,
        method: 'get',
        data: data
    })
}