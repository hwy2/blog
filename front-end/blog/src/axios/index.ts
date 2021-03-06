import axios from "axios";
import { ElNotification } from 'element-plus';
import cookies from 'js-cookie';

// 基础URL
axios.defaults.baseURL = 'http://localhost:3000'
// post请求头
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
// 设置超时
axios.defaults.timeout = 10000;

axios.interceptors.request.use(
    config => {
        const accessToken = cookies.get('accessToken');
        if (accessToken) {
            config.headers.accessToken = accessToken;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        ElNotification({
            title: '错误',
            message: `异常请求：${JSON.stringify(error.message)}`,
            type: "error"
        });
    }
);

export default {
    /**
     * axios Post提交
     * @param url 连接
     * @param data 参数
     * @returns Promise对象
     */
    post(url: string, data: any) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url,
                data
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                });
        })
    },
    /**
     * axios get提交
     * @param url 连接
     * @param data 参数
     * @returns Promise对象
     */
    get(url: string, data: any) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url,
                params: data,
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    /**
     * axios Put提交
     * @param url 连接
     * @param data 参数
     * @returns Promise对象
     */
    put(url: string, data: any) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'put',
                url,
                data,
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
};