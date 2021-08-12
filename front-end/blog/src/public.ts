import dateFormat from "/@/assets/js/dateFormat.js";
import { ElLoading } from "element-plus";
import axios from "./axios";
import store from '/@/store'

export default {
    getAricleList(data: any) {
        const loading = ElLoading.service({ fullscreen: true });
        axios.get("/article/list", data)
            .then((res: any) => {
                console.log(res);
                for (const item of res.result.list) {
                    item.createDate = dateFormat(item.createDate, "yyyy年MM月dd日");
                }

                store.commit("setArticleList", res.result.list);
                store.commit("setTotal", res.result.page.totalRow);
                loading.close();
            })
            .catch((error: any) => {
                console.log(error);
                loading.close();
            });
    }
}