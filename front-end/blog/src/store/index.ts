import {
    createStore
} from 'vuex'

export default createStore({
    state: {
        token: "",
        webConfig: {},
        blogTitle: '',
        article: {}
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
    },
    actions: {},
    modules: {}
})
