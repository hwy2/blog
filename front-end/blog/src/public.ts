import dateFormat from "@/assets/js/dateFormat.js";
import { ElLoading } from "element-plus";
import axios from "./axios";
import store from '@/store'
import Cookies from 'js-cookie'

/**
 * 获取文章列表
 * @param data 搜索参数 {}
 * @param format 时间格式化参数 例如 'yyyy年MM月dd日'
 */
export const getAricleList = (data: any = {}, format: string = 'yyyy年MM月dd日') => {
    const loading = ElLoading.service({ fullscreen: true });
    axios.get("/article/list", data)
        .then((res: any) => {
            console.log('获取文章列表', res);
            if (res.code == "200") {
                for (const item of res?.result?.list) {
                    item.createDate = dateFormat(item.createDate, format);
                    item.updateDate = dateFormat(item.updateDate, format);
                    const category = [];
                    for (const iterator of item.categories) {
                        category.push(iterator.title);
                    }
                    item.category = category.join(',')
                }
                if (data.state === 4) {
                    // 有序号的页面
                    const orderly = res.result.list.filter((item: any) => {
                        switch (item.template) {
                            case 0:
                                item.to = "/home/normalPage/" + item.uuid
                                break;
                            case 1:
                                item.to = "/home/archiveArticles"
                                break;
                            case 2:
                                item.to = "/home/friendlyLink"
                                break;
                            default:
                                break;
                        }
                        return item.pageOrder > 0;
                    });
                    // 冒泡排序
                    for (let i = 0; i < orderly.length - 1; i++) {
                        for (let j = 0; j < orderly.length - i - 1; j++) {
                            if (orderly[j].pageOrder > orderly[j + 1].pageOrder) {
                                const swap = orderly[j];
                                orderly[j] = orderly[j + 1];
                                orderly[j + 1] = swap;
                            }
                        }
                    }

                    // 无序号的页面
                    const disorder = res.result.list.filter((item: any) => {
                        return item.pageOrder === 0;
                    });

                    if (orderly.length > 0) {
                        for (const item of orderly) {
                            disorder.splice(item.pageOrder - 1, 0, item);
                        }
                    }
                    store.commit("foreground/setPageList", disorder);
                    store.commit("foreground/setPageTtotals", res.result.page.totalRow);
                    loading.close();
                    return;
                } else {

                    store.commit("foreground/setArticleList", res.result.list);
                    store.commit('foreground/setArticleStickyList', res.result.articleSticky)
                    store.commit("foreground/setTotal", res.result.page.totalRow);
                    loading.close();
                }
            }
        })
        .catch((error: any) => {
            store.commit("foreground/setPageList", []);
            store.commit("foreground/setPageTtotals", 0);
            store.commit("foreground/setArticleList", []);
            store.commit("foreground/setTotal", 0);
            console.log(error);
            loading.close();
        });
}
/**
 * 获取网站配置项，并修改HTML页面属性
 */
export const getWebConfigInfo = async () => {
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
}
/**
 * 更新登录过期时间
 */
export const updateAccessToken = () => {
    const user: any = JSON.parse(Cookies.get("user") || '{}');
    const accessToken: any = Cookies.get("accessToken") || "";
    if (user === '{}' || !accessToken) {
        return;
    }
    axios.put("/user/adminToken", {
        userUuid: user.uuid,
        token: accessToken
    })
        .then((res: any) => {
            // console.log(res);
            Cookies.set("accessToken", res.result.accessToken.token, {
                expires: new Date(res.result.accessToken.expiresIn),
            });
            Cookies.set('user', JSON.stringify(user), {
                expires: new Date(res.result.accessToken.expiresIn),
            })
            console.log(dateFormat(new Date(res.result.accessToken.expiresIn), "yyyy-MM-dd hh:mm:ss"))
        })
        .catch((error: any) => {
            console.log(error);

        });
}
/**
 * 获取推荐阅读榜
 */
export const getTestimonialsAricleList = (data: any = {}, format: string = 'yyyy年MM月dd日') => {
    const loading = ElLoading.service({ fullscreen: true });

    return new Promise((resolve, reject) => {
        axios.get("/article/testimonialsArticle", data)
            .then((res: any) => {
                console.log(res);
                if (res.code == "200") {
                    resolve(res.result.list)
                    loading.close();
                } else {
                    reject(res)
                }
            })
            .catch((error: any) => {
                reject(error)
                loading.close();
            });
    })

}

/**
 * 获取热门文章
 */
export const getHotArticle = (data: any = {}, format: string = 'yyyy年MM月dd日') => {
    const loading = ElLoading.service({ fullscreen: true });

    return new Promise((resolve, reject) => {
        axios.get("/article/hotArticle", data)
            .then((res: any) => {
                console.log(res);
                if (res.code == "200") {
                    resolve(res.result.list)
                    loading.close();
                } else {
                    reject(res)
                }
            })
            .catch((error: any) => {
                reject(error)
                loading.close();
            });
    })

}

/**
 * 获取类别列表
 */
export const getCategoryList = () => {
    const user: any = JSON.parse(Cookies.get("user") || '{}');
   axios
        .get("/category/list", {
            userUuid: user.uuid,
            pageSize:100
        })
        .then((res: any) => {
            console.log("获取类别列表", res);
            for (const item of res.result.list) {
                item.createDate = dateFormat(item.createDate, "MM-dd");
            }
            store.commit("backstage/setCategoryList", res.result.list);
            store.commit(
                "backstage/setClassificationsTotal",
                res.result.page.totalRow
            );
        })
        .catch((err: any) => {
            console.log(err);
        });
};