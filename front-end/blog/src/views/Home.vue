<template>
  <div class="bg"></div>
  <el-container  v-loading="loading">
    <el-affix :offset="0">
      <el-header height="" :class="isScroll ? 'backdrop' : ''">
        <div class="toolbar">
          <!-- logo -->
          <div class="logo">
            <a href="javascript:void(0)" @click="methods.openDrawer">
              <i class="iconfont icongengduo"></i>
            </a>
            <a href="/">
              {{ blogTitle }}
            </a>
          </div>
          <!-- nav -->
          <div class="search" @click="methods.openSearch()">
            <i class="iconfont iconsearch"></i>
          </div>
        </div>
      </el-header>
    </el-affix>

    <el-main>
      <transition name="slide-fade">
        <router-view></router-view>
      </transition>
    </el-main>

    <el-footer height="">
      <div class="footer-box">
        <div class="copyright">
          <p>
            Copyright © 2021 <a href="/">{{ blogTitle }}</a>
          </p>
        </div>
        <div class="runningTime">
          <p>网站运行时间：{{ runningTime }}</p>
        </div>

        <div class="recordInfo">
          <p v-if="recordMIIT">
            <a href="https://beian.miit.gov.cn/#/Integrated/index">
              {{ recordMIIT }}</a
            >
          </p>
          <p v-if="internetAlert">
            <a
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode="
            >
              {{ internetAlert }}</a
            >
          </p>
        </div>
      </div>
    </el-footer>
  </el-container>

  <el-drawer
    title=""
    v-model="drawer"
    direction="ltr"
    size="240px"
    :with-header="false"
  >
    <div class="sidebar-header">
      <div class="head-portrait"></div>
      <div class="siteInfo">
        <div class="authorName">
          <p>
            {{ authorName }}
          </p>
        </div>
        <div class="description">
          <p>
            {{ description }}
          </p>
        </div>
      </div>
    </div>

    <div class="sidebar-toolbar">
      <ul>
        <a
          href="/"
          :class="isCategoryNone ? 'collapse-item-none' : 'collapse-item-block'"
        >
          <div class="ripple">
            <i class="iconfont iconhome"></i>
            <p>首页</p>
          </div>
        </a>
        <li
          class="collapse-item"
          :class="isCategoryNone ? 'collapse-item-none' : 'collapse-item-block'"
        >
          <div class="ripple" @click="methods.isCategoryShow()">
            <i class="iconfont iconicon"></i>
            <p>分类</p>
            <i
              class="iconfont icongengduo1"
              :class="[isCategoryNone ? 'anti-rotation' : 'rotate']"
            ></i>
          </div>

          <ul
            class="secondary-warp"
            :style="[isCategoryNone ? 'height:0;' : 'height:auto;']"
          >
            <li
              class="secondary-item"
              v-for="(item, index) in categoryList"
              :key="index"
              @click="methods.listenCategory(item.name)"
            >
              <p>
                {{ item.name }}
              </p>
              <p>
                <span>{{ item.value }}</span>
              </p>
            </li>
          </ul>
        </li>
        <li
          class="collapse-item"
          :class="isPageNone ? 'collapse-item-none' : 'collapse-item-block'"
        >
          <div class="ripple" @click="methods.isPageShow()">
            <i class="iconfont iconiconset0335"></i>
            <p>页面</p>
            <i
              class="iconfont icongengduo1"
              :class="[isPageNone ? 'anti-rotation' : 'rotate']"
            ></i>
          </div>
        </li>
        <div class="summary">
          <p><i class="iconfont iconhuizong"></i>数据汇总</p>
        </div>
        <li class="list-item">
          <p>文章总数</p>
          <p>
            <span>{{ articlesTotal }}</span>
          </p>
        </li>
        <li class="list-item">
          <p>评论总数</p>
          <p>
            <span>{{ commentsTotal }}</span>
          </p>
        </li>
        <li class="list-item">
          <p>页面总数</p>
          <p>
            <span>{{ pagesTotal }}</span>
          </p>
        </li>
        <li class="list-item">
          <p>分类总数</p>
          <p>
            <span>{{ categoriesTotal }}</span>
          </p>
        </li>
      </ul>
    </div>
    <div class="sidebar-footer">
      <button @click="methods.login()">
        <i class="iconfont iconren"></i> 登录
      </button>
    </div>
  </el-drawer>

  <el-dialog v-model="searchDialogVisible" width="80%" destroy-on-close center>
    <label for="search">
      <i class="iconfont iconsearch"></i>
      <input
        type="text"
        name="search"
        v-model="condition.articleVague"
        @keydown.enter="methods.listenSearch()"
      />
    </label>
  </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  getCurrentInstance,
  computed,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "home",
  components: {},
  setup: () => {
    const store = useStore();
    const router = useRouter();
    const { proxy }: any = getCurrentInstance();
    const state = reactive({
      // vue2.x的data参数
      blogTitle: computed(() => store.state.blogTitle), // 网站title
      runningTime: "", // 运行时间
      startTime: computed(() => store.state.webConfig.runningTime),
      recordMIIT: computed(() => store.state.webConfig.recordNumber), // 工信部备案
      internetAlert: computed(() => store.state.webConfig.internetAlert), // 粤警备案
      drawer: false,
      authorName: computed(() => store.state.webConfig.authorName), // 作者名称
      description: computed(() => store.state.webConfig.siteDescription), // 站长简介
      articlesTotal: 0, // 文章总数
      commentsTotal: 0, // 评论总数
      pagesTotal: 0, // 页面总数
      categoriesTotal: 0, // 分类总数
      categoryList: [], // 分类
      isCategoryNone: true,
      isPageNone: true,
      isScroll: false,
      searchDialogVisible: false,
      loading:true,
      condition: computed({
        get: () => {
          return store.state.condition;
        },
        set: (val) => {
          store.commit("setCondition", val);
        },
      }),
      search: computed({
        get: () => {
          return store.state.search;
        },
        set: (val) => {
          store.commit("setSearch", val);
        },
      }),
    });

    const methods = {
      tick(oldDate: string) {
        const time = {
          years: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
        const openday = new Date(oldDate);
        const today = new Date(); // 系统当前时间
        let total = (today.getTime() - openday.getTime()) / 1000;
        time.years = Math.floor(total / 31536000);
        total = total - time.years * 31536000;
        time.days = Math.floor(total / 86400);
        total = total - time.days * 86400;
        time.hours = Math.floor(total / 3600);
        total = total - time.hours * 3600;
        time.minutes = Math.floor(total / 60);
        total = total - time.minutes * 60;
        time.seconds = Math.floor(total);
        state.runningTime =
          time.years +
          "年" +
          time.days +
          "天" +
          time.hours +
          "时" +
          time.minutes +
          "分" +
          time.seconds +
          "秒";
        setTimeout(() => {
          methods.tick(oldDate);
        }, 1000);
      },
      getDataSummaryList() {
        proxy.$axios
          .get("/dataSummary/list")
          .then((res: any) => {
            console.log(res);
            state.articlesTotal = res.result.list.filter((item: any) => {
              return item.name === "articlesTotal";
            })[0].value; // 文章总数

            state.commentsTotal = res.result.list.filter((item: any) => {
              return item.name === "commentsTotal";
            })[0].value; // 评论总数

            state.categoriesTotal = res.result.list.filter((item: any) => {
              return item.name === "categoriesTotal";
            })[0].value; // 分类总数

            state.categoryList = res.result.list.filter((item: any) => {
              return item.type === 1;
            });
          })
          .catch((error: any) => {
            console.log(error);
          });
      },
      listenScroll() {
        const scroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        const outerWidth = window.outerWidth;
        const temp = store.getters.getWebConfig.siteName;
        if (outerWidth < 800) {
          const path = router.currentRoute.value.path;
          if (scroll > 80 && /article/.test(path)) {
            state.isScroll = true;
            store.commit("setBlogTitle", store.getters.getArticle.title);
          } else {
            state.isScroll = false;
            store.commit("setBlogTitle", temp);
          }
        }
      },
      isCategoryShow() {
        state.isCategoryNone = state.isCategoryNone ? false : true;
      },
      openDrawer() {
        state.drawer = true;
      },
      isPageShow() {
        state.isPageNone = state.isPageNone ? false : true;
      },
      listenCategory(categoryTitle: string) {
        console.log(categoryTitle);
        state.condition.currPage = 1;
        state.condition.categoryTitle = categoryTitle;
        proxy.getAricleList(state.condition);
        state.search.words = categoryTitle;
        state.search.categoryFlag = true;
        state.search.searchFlag = false;
        state.drawer = false;
      },
      openSearch() {
        state.searchDialogVisible = true;
      },
      listenSearch() {
        proxy.getAricleList(state.condition);
        state.search.words = state.condition.articleVague;
        state.search.categoryFlag = false;
        state.search.searchFlag = true;
        router.push({
          name: "index",
        });
        state.searchDialogVisible = false;
        state.condition.articleVague = "";
      },
      login() {
        router.push({
          name: "login",
        });
      },
    };

    onMounted(() => {
      // 挂载之后
      console.log("startTime", state.startTime);
      methods.tick(localStorage.getItem("runingTime") || state.startTime);
      methods.getDataSummaryList();
      window.addEventListener("scroll", methods.listenScroll);
      state.search.categoryFlag = false;
      state.search.words = "";
      state.search.searchFlag = false;
      state.loading = false;
    });

    return {
      ...toRefs(state),
      methods,
    };
  },
});
</script>
<style lang="scss">
.bg {
  background-image: url("https://cdn.jsdelivr.net/gh/ohmyga233/CDN@b3f5723e3d63f820ce6c5a62cb41b835bd2c4102/images/bg/62824816.jpg");
  background-size: cover;
  background-position-x: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}
.backdrop {
  background-color: rgb(255, 64, 129);
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  padding: 1rem 0;
  .logo {
    display: flex;
    align-items: center;
    justify-content: space-between;

    a {
      color: #fff;
      font-size: 1.5rem;

      &:hover {
        color: var(--hover);
      }

      i {
        font-size: 1.4rem;
        vertical-align: baseline;
        margin-right: 1.5rem;
      }
    }
  }

  .search {
    i {
      font-size: 1.8rem;
      &:hover {
        color: var(--hover);
      }
    }
  }
  @media (max-width: 800px) {
    .logo {
      a {
        font-size: 1.4em;
        color: rgb(255, 255, 255);
        i {
          font-size: 1em;
          margin-right: 0.8em;
        }
      }
    }
    .search {
      i {
        font-size: 1.5em;
      }
    }
  }
}
.el-main {
  padding: 20px 0;
  min-height: 74.8vh;
}

.el-footer {
  background-color: #424242;
  min-height: 168px;
  .footer-box {
    width: 800px;
    margin: 0 auto;

    .copyright {
      padding: 20px 0 10px;
      color: #fff;
      border-bottom: 1px solid var(--hover);
      p {
        padding-left: 20px;
        font-size: 15px;
        a {
          color: #fff;
          &:hover {
            color: var(--hover);
          }
        }
      }
    }

    .runningTime {
      padding: 10px 0 20px 20px;
      p {
        font-size: 15px;
        color: #fff;
      }
    }

    .recordInfo {
      padding-bottom: 20px;
      p {
        font-size: 15px;
        text-align: center;
        color: #fff;
        a {
          color: #fff;
        }
      }
      p:nth-child(2) {
        a {
          &::before {
            content: "";
            background: url("../assets/images/jinghui.png") no-repeat center
              center;
            background-size: 100% 100%;
            height: 20px;
            width: 20px;
            vertical-align: sub;
            display: inline-block;
            margin-right: 5px;
          }
        }
      }
    }
  }

  @media (max-width: 800px) {
    .footer-box {
      width: 94%;
      .copyright {
        p {
          font-size: 14px;
        }
      }

      .runningTime {
        p {
          font-size: 14px;
        }
      }

      .recordInfo {
        p {
          font-size: 14px;
        }
      }
    }
  }
}
.el-drawer {
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
  background-color: rgb(248, 247, 247);

  .sidebar-header {
    height: 190px;
    background: url("/@/assets/images/sidebar.jpg") no-repeat center center;
    background-size: cover;
    width: 100%;
    box-sizing: border-box;

    .head-portrait {
      background: url("/@/assets/images/sidebar.jpg") no-repeat 50% 50%;
      background-size: cover;
      width: 60px;
      height: 60px;
      border-radius: 60px;
      box-shadow: 0 0 8px 0 rgb(0 0 0 / 55%);
      transition: all 0.3s;
      transform: translate(20px, 35px);
      position: relative;
      z-index: 999;
      &:hover {
        box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.55);
        transform: translate(20px, 20px) rotate(20deg) scale(1.1);
      }
    }

    .siteInfo {
      background-color: rgba(0, 0, 0, 0.4);
      padding: 30px 15px 10px;
      box-sizing: border-box;
      transform: translateY(15px);

      .authorName,
      .description {
        overflow: hidden;
        white-space: normal;
        text-overflow: ellipsis;
        color: #fff;
        min-height: 38px;
        p {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-size: 14px;
        }
      }

      .authorName {
        p {
          font-size: 22px;
          font-weight: bold;
          text-shadow: 1px 1px 5px rgb(41, 40, 40);
        }
      }
    }
  }

  .sidebar-toolbar {
    height: 80vh;
    overflow: hidden;
    overflow-y: auto;
    ul {
      padding: 10px 0;
      a {
        display: block;
        height: auto;
        min-height: 48px;
        padding: 0 16px;
        color: #666;
        &:hover {
          background-color: rgb(216, 216, 216);
        }
        p {
          display: inline-block;
          padding: 16px 0 16px 32px;
          font-size: 16px;
          line-height: 1;
        }

        i:nth-of-type(1) {
          font-size: 22px;
          vertical-align: middle;
        }
      }
      .collapse-item {
        .ripple {
          display: flex;
          justify-content: center;
          align-items: center;
          height: auto;
          min-height: 48px;
          padding: 5px 16px;
          color: #666;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          &:hover {
            background-color: rgb(216, 216, 216);
          }
          &:active {
            animation: colorGradient 0.1s;
            background-color: rgb(204, 204, 204);
          }
          p {
            display: inline-block;
            padding: 16px 0 16px 32px;
            font-size: 16px;
            line-height: 1;
            width: 144px;
          }

          i:nth-of-type(1) {
            font-size: 22px;
            vertical-align: middle;
          }
          i:nth-of-type(2) {
            font-size: 16px;
            transform: rotateZ(90deg);
            font-weight: bold;
          }
          .rotate {
            animation: gyrate 0.2s;
            transform: rotateZ(270deg) !important;
          }

          .anti-rotation {
            animation: antiRotation 0.2s;
            transform: rotateZ(90deg) !important;
          }
        }
        .secondary-warp {
          transition: all 30s cubic-bezier(0.4, 0, 0.2, 1);
          height: 0;
          .secondary-item {
            padding: 0 16px 0 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: auto;
            min-height: 40px;
            color: #666;
            &:hover {
              background-color: rgb(216, 216, 216);
            }

            p:nth-child(1) {
              display: inline-block;
              padding: 16px 0;
              font-size: 16px;
              line-height: 1;
              text-align: left;
              flex-grow: 1;
            }

            p:nth-child(2) {
              span {
                background-color: rgb(58, 58, 58);
                color: #fff;
                text-align: center;
                display: block;
                padding: 0 8px;
                border-radius: 5px;
              }
            }
          }
        }
      }

      .summary {
        margin: 10px 0;
        padding: 16px 0;
        border-top: 1px solid rgb(214, 214, 214);
        border-bottom: 1px solid rgb(214, 214, 214);
        p {
          text-align: center;
          font-size: 16px;
          letter-spacing: 5px;
          color: #666;
        }
        i {
          vertical-align: middle;
          font-size: 22px;
          color: #666;
        }
      }

      .list-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: auto;
        min-height: 48px;
        padding: 0 16px;
        color: #666;
        &:hover {
          background-color: rgb(216, 216, 216);
        }

        p:nth-child(1) {
          display: inline-block;
          padding: 16px 0;
          font-size: 16px;
          line-height: 1;
          text-align: left;
          flex-grow: 1;
        }

        p:nth-child(2) {
          span {
            background-color: rgb(58, 58, 58);
            color: #fff;
            text-align: center;
            display: block;
            padding: 0 8px;
            border-radius: 5px;
          }
        }
      }

      .collapse-item-none {
        .secondary-warp {
          display: none;
        }
      }

      .collapse-item-block {
        .secondary-warp {
          display: block;
        }
      }
    }

    /*修改滚动条样式*/
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      /**/
    }
    /*  滚动条的轨道 */
    &::-webkit-scrollbar-track {
      background: rgb(239, 239, 239);
      border-radius: 2px;
    }
    /* 滚动条里面的小方块，能向上向下移动 */
    &::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #333;
    }
    /* 边角，即两个滚动条的交汇处 */
    &::-webkit-scrollbar-corner {
      background: #179a16;
    }
  }
  .sidebar-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    box-shadow: 1px 1px 10px #999;
    display: flex;

    button {
      border: unset;
      flex-grow: 1;
      font-size: 18px;
      i {
        font-size: 18px;
      }
    }
  }
}

.el-dialog {
  background: unset;
  box-shadow: unset;
  .el-dialog__headerbtn {
    font-size: 35px;

    .el-dialog__close {
      color: #999;
    }
  }

  label {
    width: 50%;
    height: 50px;
    border-radius: 50px;
    display: flex;
    margin: 150px auto 0;
    background-color: #fff;
    padding: 0 0 0 10px;
    box-sizing: border-box;
    i {
      font-size: 30px;
      line-height: 50px;
    }

    input {
      flex-grow: 1;
      border: 0;
      border-radius: 0 50px 50px 0;
      padding-left: 10px;
      height: inherit;
      font-size: 1.2em;
    }
  }
}
.el-overlay {
  background-color: rgba(51, 50, 50, 0.89);
}

// 向上旋转
@keyframes gyrate {
  0% {
    transform: rotateZ(90deg);
  }
  25% {
    transform: rotateZ(135deg);
  }
  50% {
    transform: rotateZ(180deg);
  }
  75% {
    transform: rotateZ(225deg);
  }
  100% {
    transform: rotateZ(270deg);
  }
}

// 向下旋转
@keyframes antiRotation {
  0% {
    transform: rotateZ(270deg);
  }
  25% {
    transform: rotateZ(315deg);
  }
  50% {
    transform: rotateZ(360deg);
  }
  75% {
    transform: rotateZ(405deg);
  }
  100% {
    transform: rotateZ(450deg);
  }
}
// 颜色渐变
@keyframes colorGradient {
  0% {
    background: linear-gradient(
      to right,
      rgb(216, 216, 216),
      rgb(216, 216, 216) 10%,
      rgb(204, 204, 204) 10%,
      rgb(204, 204, 204) 90%,
      rgb(216, 216, 216) 90%,
      rgb(216, 216, 216)
    );
  }
  25% {
    background: linear-gradient(
      to right,
      rgb(216, 216, 216),
      rgb(216, 216, 216) 7.5%,
      rgb(204, 204, 204) 7.5%,
      rgb(204, 204, 204) 92.5%,
      rgb(216, 216, 216) 92.5%,
      rgb(216, 216, 216)
    );
  }
  50% {
    background: linear-gradient(
      to right,
      rgb(216, 216, 216),
      rgb(216, 216, 216) 5%,
      rgb(204, 204, 204) 5%,
      rgb(204, 204, 204) 95%,
      rgb(216, 216, 216) 95%,
      rgb(216, 216, 216)
    );
  }
  75% {
    background: linear-gradient(
      to right,
      rgb(216, 216, 216),
      rgb(216, 216, 216) 2.5%,
      rgb(204, 204, 204) 2.5%,
      rgb(204, 204, 204) 97.5%,
      rgb(216, 216, 216) 97.5%,
      rgb(216, 216, 216)
    );
  }
  100% {
    background: linear-gradient(
      to right,
      rgb(204, 204, 204),
      rgb(204, 204, 204)
    );
  }
}

@media (max-width: 800px) {
  .el-dialog {
    label {
      width: 100%;
      height: 50px;
      border-radius: 50px;
      display: flex;
      margin: 15vh auto 0px;
      background-color: rgb(255, 255, 255);
      padding: 0px 0px 0px 10px;
    }
  }
}
</style>