import axios from "axios";
import { ElNotification } from 'element-plus';

// 基础URL
axios.defaults.baseURL = 'http://localhost:3000'
// post请求头
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
// 设置超时
axios.defaults.timeout = 10000;

axios.interceptors.request.use(
    config => {
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
            type:"error"
        });
    }
);

export default {
    post(url:string, data:any) {
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
    }
};