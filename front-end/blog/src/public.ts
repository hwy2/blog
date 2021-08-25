import dateFormat from "/@/assets/js/dateFormat.js";
import { ElLoading } from "element-plus";
import axios from "./axios";
import store from '/@/store'

export default {
    /**
     * 获取文章列表
     * @param data 搜索参数 {}
     * @param format 时间格式化参数 例如 'yyyy年MM月dd日'
     */
    getAricleList(data: any, format: string = 'yyyy年MM月dd日') {
        const loading = ElLoading.service({ fullscreen: true });
        axios.get("/article/list", data)
            .then((res: any) => {
                console.log(res);
                for (const item of res.result.list) {
                    item.createDate = dateFormat(item.createDate, format);
                }

                store.commit("foreground/setArticleList", res.result.list);
                store.commit("foreground/setTotal", res.result.page.totalRow);
                loading.close();
            })
            .catch((error: any) => {
                console.log(error);
                loading.close();
            });
    },
    /**
     * 获取网站配置项，并修改HTML页面属性
     */
    async getWebConfigInfo() {
        await axios.get("/webConfig/info", {})
            .then((res: any) => {
                console.log(res);
                store.commit("foreground/setWebConfig", res.result.webConfig);
                store.commit("foreground/setBlogTitle", res.result.webConfig.siteName);
                localStorage.setItem(
                    "runingTime",
                    res.result.webConfig.runningTime
                );
                // 修改或创建 keywords AND description
                const head: any = document.getElementsByTagName("head");
                const keyword: any =
                    document.querySelector('meta[name="keywords"]') ||
                    document.createElement("meta");
                const description: any =
                    document.querySelector('meta[name="description"]') ||
                    document.createElement("meta");
                keyword.setAttribute("name", "keywords");
                keyword.setAttribute("content", res.result.webConfig.keyWord);
                description.setAttribute("name", "description");
                description.setAttribute(
                    "content",
                    res.result.webConfig.siteDescription
                );
                head[0].appendChild(keyword);
                head[0].appendChild(description);
            })
            .catch((error: any) => {
                console.log(error);
            });
    },
}