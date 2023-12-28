import axios from "axios";
import { ElNotification, ElLoading } from 'element-plus';
import cookies from 'js-cookie';
import { declassificationAES, encryptedAES } from "../utils/index"

// 基础URL
axios.defaults.baseURL = 'https://www.3dcw.cn'
// axios.defaults.baseURL = 'http://localhost:3060'
// post请求头
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
// 设置超时
axios.defaults.timeout = 10000;
let loading: any  = ElLoading.service({
    lock: true,
    text: "Loading",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
});
axios.interceptors.request.use(
    config => {
        const accessToken = cookies.get('accessToken');
        if (accessToken) {
            config.headers.accessToken = accessToken;
        }
        // 加密提交
        if (config.url != "/common/enclosure" && config.url != "/common/face" && (config.method === 'post' || config.method === 'put') && config.data)
            config.data = {
                data: encryptedAES(config.data)
            }
        loading.close() 
        return config;
    },
    error => {
        loading.close()
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response: any) => {
        if (response.status === 200) {
            if (response.data.result)
                response.data.result = declassificationAES(response.data.result)
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
        loading.close()
    },
    error => {
        loading.close()
        ElNotification({
            title: '错误',
            message: `异常请求：${JSON.stringify(error.message)}`,
            type: "error"
        });
    }
);



export const request = (options = { method: "get", url: '/', data: {} }) => {
    return new Promise((resolve, rejects) => {
        let option: any = {
            method: options.method,
            url: options.url,
        }
        if (options.method == 'get')
            option['params'] = options.data
        else
            option['data'] = options.data
        axios(option).then(res => {
            resolve(res.data)
        })
            .catch(err => {
                rejects(err)
            })
    })
}