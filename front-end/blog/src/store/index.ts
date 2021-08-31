import {
    createStore
} from 'vuex'

export default createStore({
    actions: {},
    modules: {
        backstage: {// 后台页面module
            namespaced: true,
            state: {
                dataSummary: {
                    articlesTotal: 0,
                    commentsTotal: 0,
                    categoriesTotal: 0
                },
                activeIndex: "/backstage/outline",
                categoryList:[]
            },
            getters: {
                getDataSummary(state) {
                    return state.dataSummary
                },
                getActiveIndex(state) {
                    return state.activeIndex
                },
                getCategoryList(state) {
                    return state.categoryList
                }
            },
            mutations: {
                setDataSummary(state, status) {
                    state.dataSummary = status
                },
                setActiveIndex(state, status) {
                    state.activeIndex = status
                },
                setCategoryList(state, status) {
                    state.categoryList = status
                }
            }
        },
        foreground: {// 前台页面module
            namespaced: true,
            state: {
                token: "",
                webConfig: {},
                blogTitle: '',
                article: {},
                articleLists: {},
                totals: 0,
                condition: {
                    pageSize: 7,
                    currPage: 1,
                    categoryTitle: "",
                    articleVague: ''
                },
                search: {
                    categoryFlag: false,
                    searchFlag: false,
                    words: "",
                },
                dataSummary: {},
            },
            getters: {
                getToken(state) {
                    return state.token;
                },
                getWebConfig(state) {
                    return state.webConfig
                },
                getBlogTitle(state) {
                    return state.blogTitle
                },
                getArticle(state) {
                    return state.article
                },
                getArticleList(state) {
                    return state.articleLists
                },
                getTotal(state) {
                    return state.totals
                },
                getCondition(state) {
                    return state.condition
                },
                getSearch(state) {
                    return state.search
                },
                getDataSummary(state) {
                    return state.dataSummary
                }
            },
            mutations: {
                setToken(state, status) {
                    state.token = status;
                },
                setWebConfig(state, status) {
                    state.webConfig = status;
                },
                setBlogTitle(state, status) {
                    state.blogTitle = status;
                },
                setArticle(state, status) {
                    state.article = status;
                },
                setArticleList(state, status) {
                    state.articleLists = status
                },
                setTotal(state, status) {
                    state.totals = status
                },
                setCondition(state, status) {
                    state.condition = status
                },
                setSearch(state, status) {
                    state.search = status
                },
                setDataSummary(state, status) {
                    state.dataSummary = status
                }
            },
        }
    }
})
